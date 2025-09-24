import { ClientApiService } from "../../client-api/clientApi.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { QueryService } from "src/query/query.service";
import { QueryDTO } from "src/query/dto/query.dto";
import { Prisma } from "@prisma/client";
import { ValidationUploadCustomerBodyDTO } from "./validation/validationUploadCustomer.dto";
import { ValidationChangeCustomerBodyDTO } from "./validation/validationChangeCustomer.dto";
import { ValidationGetCustomerParamDTO } from "./validation/validationGetCustomer.dto";
import { ValidationDeleteCustomersBodyDTO } from "./validation/validationDeleteCustomers.dto";
import { IUserJwt } from "src/interface/credentialsJwt.interface";
import { ValidationKafkaGetCustomerDataPayloadDTO } from "./validation/validationKafkaGetCustomerData.dto";
import { KafkaCustomerResult } from "./type/kafkaCustomer.dto";
import { KafkaService } from "src/kafka/kafka.service";

@Injectable()
export class CustomersService {
	private readonly clearCacheToClient: Promise<any>;
	constructor(
		private readonly prisma: PrismaService,
		private readonly queryService: QueryService,
		private readonly clientApiService: ClientApiService,
	) {
		this.clearCacheToClient = this.clientApiService.clearCache("customers");
	}

	async getAll(
		query: QueryDTO & Partial<ValidationKafkaGetCustomerDataPayloadDTO>,
	) {
		const { orderBy, skip, take, where } = this.queryService.getQuery(
			"Customers",
			query,
		);

		if (query.customersId && query.customersId.length > 0)
			where.id = { in: query.customersId };

		const queryOptions: Prisma.CustomersFindManyArgs = {
			where,
			take,
			orderBy,
			skip,
		};

		const customers = await this.prisma.customers.findMany(queryOptions);
		const totalCount = await this.prisma.customers.count();
		return { customers, totalCount };
	}

	async getOne(param: ValidationGetCustomerParamDTO) {
		const customer = await this.prisma.customers.findFirst({
			where: { id: param.id },
		});
		return customer;
	}

	async uploadCustomer({
		firstName,
		lastName,
		credentialsId,
	}: ValidationUploadCustomerBodyDTO) {
		const customers = this.prisma.customers.create({
			data: {
				firstName: firstName,
				lastName: lastName,
				credentialsId: credentialsId,
			},
		});

		await this.clearCacheToClient;
		return customers;
	}

	async change(body: ValidationChangeCustomerBodyDTO, credential: IUserJwt) {
		const { firstName, lastName, phone } = body;

		try {
			const customer = await this.prisma.customers.update({
				where: {
					id: credential.customerId,
					credentialsId: credential.id,
				},
				data: {
					firstName,
					lastName,
					phone,
				},
			});

			await this.clearCacheToClient;
			return customer;
		} catch (error) {
			throw new UnauthorizedException(error);
		}
	}

	async init(credential: IUserJwt) {
		const { id } = credential;
		const customer = await this.prisma.customers.findFirst({
			where: { credentialsId: id },
		});
		return customer;
	}

	async delete(body: ValidationDeleteCustomersBodyDTO) {
		try {
			const sqlQuery = await this.prisma.sqlQuery("Customers");
			const sqlSelect = sqlQuery.select;
			sqlSelect.fields();
			sqlSelect.where({ id: body.customersId });
			const selectQuery = await sqlSelect.query();

			const sqlDelete = sqlQuery.delete;
			sqlDelete.where({ id: body.customersId });
			await sqlDelete.query();

			await this.clearCacheToClient;
			return selectQuery;
		} catch (error) {}
	}

	async kafkaGetCustomerData(
		payload: ValidationKafkaGetCustomerDataPayloadDTO,
	): Promise<KafkaCustomerResult[]> {
		const customer = await this.getAll({
			customersId: payload.customersId,
		});

		const curCustomer: KafkaCustomerResult[] = customer.customers.map(
			(customer) => {
				return {
					id: customer.id,
					firstName: customer.firstName,
					lastName: customer.lastName,
				};
			},
		);

		return curCustomer;
	}
}
