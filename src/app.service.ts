import * as bcrypt from "bcrypt";

import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RegistrationBodyDTO } from "./dto/registrationBody.dto";
import { ClientKafka } from "@nestjs/microservices";
import { randomUUID } from "crypto";
import { RedisService } from "./redis/redis.service";
import { RegistrationCacheDTO } from "./dto/registrationCache.dto";
import { GetOneParamDTO } from "./dto/getOneParam.dto";
import { ActivationParamDTO } from "./dto/activationParam.dto";
import { CustomersService } from "./feature/customers/customers.service";
import { Interval } from "@nestjs/schedule";
import { JwtService } from "@nestjs/jwt";
import { LoginBodyDTO } from "./dto/loginBody.dto";
import { IUserJwt } from "./interface/credentialsJwt.interface";
import { UserJwtDTO } from "./dto/userJwt.dto";
import { ChangePasswordBodyDTO } from "./dto/changePasswordBody.dto";
import { QueryDTO } from "./query/dto/query.dto";
import { PrismaService } from "./prisma/prisma.service";
import { QueryService } from "./query/query.service";
import { CartService } from "./feature/cart/cart.service";
import { AddressesService } from "./feature/addresses/addresses.service";
import { ValidationCartAndAddressesPayloadDTO } from "./validation/validationCartAndAddressesKafka.dto";

@Injectable()
export class AppService {
	constructor(
		private readonly cartService: CartService,
		private readonly addressesService: AddressesService,
		private readonly queryService: QueryService,
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly customersService: CustomersService,
		private readonly redisClient: RedisService,
		@Inject("MAIL_NOTIFICATION_SERVICE")
		private readonly mailKafkaClient: ClientKafka,
	) {}

	async validateCredential(body: LoginBodyDTO) {
		const { email, password } = body;

		const credential = await this.prisma.credentials
			.findFirst({
				where: { email },
				select: {
					id: true,
					email: true,
					password: true,
					role: true,
					Customers: {
						select: { id: true },
					},
				},
			})
			.then((data) =>
				!data
					? null
					: {
							id: data.id,
							email: data.email,
							role: data.role,
							password: data.password,
							customerId: data.Customers[0].id,
						},
			);

		const hashPassword = await bcrypt.compare(
			password,
			credential ? credential.password : "",
		);

		if (!credential || !hashPassword) {
			throw new UnauthorizedException("Incorrect email or password");
		}

		return new UserJwtDTO({
			customerId: credential.customerId,
			id: credential.id,
			email: credential.email,
			role: credential.role,
		});
	}

	async getAll(query: QueryDTO) {
		const { orderBy, skip, take, where } = this.queryService.getQuery(
			"Credentials",
			query,
		);

		const credentials = await this.prisma.credentials.findMany({
			orderBy,
			skip,
			take,
			where,
		});
		const totalCount = await this.prisma.credentials.count({
			where,
		});

		return { credentials, totalCount };
	}

	async getOne({ params }: GetOneParamDTO) {
		return await this.prisma.credentials.findFirst({
			where: { id: params },
		});
	}

	async registration(body: RegistrationBodyDTO) {
		const { email, password, firstName, lastName } = body;

		const actionLink = randomUUID();
		const saltRounds = Math.floor(Math.random() * (10 - 1) + 1);
		const hashPassword = await bcrypt.hash(password, saltRounds);

		const value = new RegistrationCacheDTO({
			email,
			firstName,
			lastName,
			password: hashPassword,
		});

		await this.redisClient.hSet("registration-cache", actionLink, value);

		this.mailKafkaClient.emit("send-mail-action-link", {
			email,
			activeLink: actionLink,
		});
	}

	async login(body: UserJwtDTO): Promise<string> {
		const jwtCredentials = await this.jwtService.signAsync({ ...body });
		return jwtCredentials;
	}

	async init(user: UserJwtDTO) {
		const jwtCredentials = await this.jwtService.signAsync({ ...user });
		return jwtCredentials;
	}

	async activation(param: ActivationParamDTO): Promise<string> {
		const redisCacheKey = "registration-cache";

		const registrationCache =
			await this.redisClient.hGet<RegistrationCacheDTO>(
				redisCacheKey,
				param.link,
			);

		if (!registrationCache) throw new UnauthorizedException();
		const credentials = await this.prisma.credentials.create({
			data: {
				email: registrationCache.email,
				password: registrationCache.password,
			},
		});

		const customer = await this.customersService.uploadCustomer({
			...registrationCache.information,
			credentialsId: credentials.id,
		});
		await this.redisClient.hDel(redisCacheKey, param.link);

		const credentialJwtDto = new UserJwtDTO({
			id: credentials.id,
			email: credentials.email,
			role: credentials.role,
			customerId: customer.id,
		});

		const jwtCredentials =
			await this.jwtService.signAsync(credentialJwtDto);

		return jwtCredentials;
	}

	async changePassword(body: ChangePasswordBodyDTO) {
		const { email, newPassword } = body;

		const saltRounds = Math.floor(Math.random() * (10 - 1) + 1);
		const hashPassword = await bcrypt.hash(newPassword, saltRounds);

		await this.prisma.credentials.update({
			where: { email: email },
			data: { password: hashPassword },
		});

		return "Password successfully changed";
	}

	async getCartAndAddressesKafka(
		inputData: ValidationCartAndAddressesPayloadDTO,
	) {
		const cart = await this.cartService.getCartKafka(inputData);
		const addresses =
			await this.addressesService.getAddressesKafka(inputData);
		return { cart, addresses };
	}

	@Interval(6e5)
	async intervalRegistrationCache() {
		const nowDate = new Date();
		const nowMinutes = nowDate.getMinutes();

		const registrationCache =
			await this.redisClient.hGetAll<RegistrationCacheDTO>(
				"registration-cache",
			);

		const registrationFields: string[] = [];
		for (const element of registrationCache) {
			Object.values(element).forEach((data) => {
				const registrationDate = new Date(data.createAt);
				const registrationMinutes = registrationDate.getMinutes();
				if (nowMinutes - registrationMinutes >= 10) {
					Object.keys(element).map((field) =>
						registrationFields.push(field),
					);
				}
			});
		}

		if (registrationFields.length <= 0) return;
		return await this.redisClient.hDel(
			"registration-cache",
			registrationFields,
		);
	}
}
