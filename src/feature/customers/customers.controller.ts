import { CustomersService } from "./customers.service";
import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	Param,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
	ValidationPipe,
} from "@nestjs/common";
import { QueryDTO } from "src/query/dto/query.dto";
import { ValidationGetCustomerParamDTO } from "./validation/validationGetCustomer.dto";
import { ValidationUploadCustomerBodyDTO } from "./validation/validationUploadCustomer.dto";
import { ValidationChangeCustomerBodyDTO } from "./validation/validationChangeCustomer.dto";
import { ValidationDeleteCustomersBodyDTO } from "./validation/validationDeleteCustomers.dto";
import { Request } from "express";
import { IUserJwt } from "src/interface/credentialsJwt.interface";
import { JwtAuthGuard } from "src/guard/jwtAuth.guard";
import { validationExceptionFactory } from "src/utils/validationExceptionFactory";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { ValidationKafkaGetCustomerDataPayloadDTO } from "./validation/validationKafkaGetCustomerData.dto";

@Controller("customers")
export class CustomersController {
	constructor(private readonly customersService: CustomersService) {}

	@Get()
	async getCustomers(@Query() query: QueryDTO) {
		return await this.customersService.getAll(query);
	}
	@Get("init")
	@UseGuards(JwtAuthGuard)
	async initCustomer(@Req() req: Request) {
		const credential = req.user as IUserJwt;

		const customer = await this.customersService.init(credential);
		if (!customer) return;

		return customer;
	}
	@Get("/:params")
	async getCustomer(@Param() param: ValidationGetCustomerParamDTO) {
		return this.customersService.getOne(param);
	}

	@Post()
	async uploadCustomer(@Body() body: ValidationUploadCustomerBodyDTO) {
		return this.customersService.uploadCustomer(body);
	}

	@Put("/update")
	@UseGuards(JwtAuthGuard)
	async changeCustomer(
		@Req() req: Request,
		@Body() body: ValidationChangeCustomerBodyDTO,
	) {
		const credential = req.user as IUserJwt;
		return this.customersService.change(body, credential);
	}

	@Delete()
	@UseGuards(JwtAuthGuard)
	async deleteCustomers(@Body() body: ValidationDeleteCustomersBodyDTO) {
		return await this.customersService.delete(body);
	}

	@MessagePattern("get.customers.data")
	async kafkaGetCustomerData(
		@Payload()
		payload: ValidationKafkaGetCustomerDataPayloadDTO,
	) {
		const customers =
			await this.customersService.kafkaGetCustomerData(payload);
		return customers;
	}
}
