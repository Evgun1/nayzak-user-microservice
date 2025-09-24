import { ClientApiService } from "./../../client-api/clientApi.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { QueryDTO } from "src/query/dto/query.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UploadCartDTO } from "./dto/uploadCart.dto";
import { CartDTO } from "./dto/cart.dto";
import { UpdateCartDTO } from "./dto/updateCart.dto";
import { QueryService } from "src/query/query.service";
import { JwtService } from "@nestjs/jwt";
import { UserJwtDTO } from "src/dto/userJwt.dto";
import { Prisma } from "@prisma/client";
import e from "express";
import { IUserJwt } from "src/interface/credentialsJwt.interface";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { ValidationCartKafkaPayloadDTO } from "./validation/validationCartKafka.dto";
import { CartKafkaDTO } from "./dto/CartKafka.dto";

@Injectable()
export class CartService {
	private readonly clearCacheToClient: Promise<any>;
	constructor(
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
		private readonly queryService: QueryService,
		private readonly clientApiService: ClientApiService,
	) {
		this.clearCacheToClient = this.clientApiService.clearCache("cart");
	}
	async getAll(query: QueryDTO & Partial<ValidationCartKafkaPayloadDTO>) {
		const getQuery = this.queryService.getQuery("Cart", query);
		const options: Prisma.CartFindManyArgs = { ...getQuery };

		if (query.cartId) options.where = { id: { in: query.cartId } };
		if (query.customersId) options.where = { customersId: query.customersId };

		const cart = await this.prisma.cart.findMany(options);
		const totalCount = await this.prisma.cart.count({});
		return { cart, totalCount };
	}
	async uploadCart(body: UploadCartDTO, credential: IUserJwt) {
		const { amount, productsId } = body;

		try {
			const cart = await this.prisma.cart.create({
				select: { id: true, amount: true, productsId: true },
				data: {
					productsId: productsId,
					amount: amount,
					Customers: {
						connect: { credentialsId: credential.id },
					},
				},
			});

			await this.clearCacheToClient;
			return cart;
		} catch (error) {
			throw new UnauthorizedException(error);
		}
	}
	async updateCart(body: UpdateCartDTO, credential: IUserJwt) {
		const { amount, id } = body;

		try {
			const cart = await this.prisma.cart.update({
				select: { id: true, productsId: true, amount: true },
				where: {
					id: id,
					Customers: { credentialsId: credential.id },
				},
				data: { amount: amount },
			});

			await this.clearCacheToClient;
			return cart;
		} catch (error) {
			throw new UnauthorizedException(error);
		}
	}
	async removeCart(id: number[]) {
		try {
			const sqlQuery = await this.prisma.sqlQuery("Cart");
			const sqlSelect = sqlQuery.select;
			const sqlDelete = sqlQuery.delete;

			sqlSelect.fields();
			sqlSelect.where({ id: { in: id } });
			const selectQuery = await sqlSelect.query();

			sqlDelete.where({ id: { in: id } });
			await sqlDelete.query();

			await this.clearCacheToClient;
			return selectQuery;
		} catch (error) {
			throw new UnauthorizedException(error);
		}
	}
	async init(credential: UserJwtDTO) {
		const cart = await this.prisma.cart.findMany({
			select: { id: true, amount: true, productsId: true },
			where: {
				Customers: {
					credentialsId: credential.id,
				},
			},
		});

		return cart;
	}

	async getCartKafka(inputData: ValidationCartKafkaPayloadDTO) {
		const { cart } = await this.getAll(inputData);

		const cartKafkaDTO: CartKafkaDTO[] = cart.map(
			(item) => new CartKafkaDTO({ ...item }),
		);

		return cartKafkaDTO;
	}
}
