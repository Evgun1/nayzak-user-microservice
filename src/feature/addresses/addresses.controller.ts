import { AddressesService } from "./addresses.service";
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Req,
	Res,
	UnauthorizedException,
	UseGuards,
	ValidationPipe,
} from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/guard/jwtAuth.guard";
import { LocalAuthGuard } from "src/guard/localAuth.guard";
import { IUserJwt } from "src/interface/credentialsJwt.interface";
import { ValidationAddressesGetOneParamDTO } from "./validation/validationAddressesGetOne.dto";
import { ValidationAddressesUploadBodyDTO } from "./validation/validationAddressesUpload.dto";
import { ValidationAddressesUpdateBodyDTO } from "./validation/validationAddressesUpdate.dto";
import { ValidationAddressesDeleteBodyDTO } from "./validation/validationAddressesDelete.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { validationExceptionFactory } from "src/utils/validationExceptionFactory";
import { ValidationAddressesKafkaPayloadDTO } from "./validation/validationAddressesKafka.dto";

@Controller("addresses")
export class AddressesController {
	constructor(private readonly addressesService: AddressesService) {}

	@Get("init")
	@UseGuards(JwtAuthGuard)
	async initAddresses(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const user = req.user as IUserJwt;

		if (!user) throw new UnauthorizedException();
		const { addresses, addressesCount } =
			await this.addressesService.init(user);

		res.setHeader("X-Total-Count", addressesCount);

		return addresses;
	}

	@Get("/:id")
	async getAddressesOne(@Param() param: ValidationAddressesGetOneParamDTO) {
		const address = await this.addressesService.getOne(param.id);

		return address;
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	async uploadAddresses(
		@Req() req: Request,
		@Body() body: ValidationAddressesUploadBodyDTO,
	) {
		const user = req.user as IUserJwt;

		try {
			const addresses = await this.addressesService.upload(body, user);
			return addresses;
		} catch (error) {
			console.log(error);
		}
	}

	@Put()
	@UseGuards(JwtAuthGuard)
	async updateAddresses(
		@Req() req: Request<any, any, ValidationAddressesUpdateBodyDTO>,
	) {
		const body = req.body;
		const user = req.user as IUserJwt;
		const addresses = await this.addressesService.update(body, user);
		return addresses;
	}

	@Delete()
	@UseGuards(JwtAuthGuard)
	async deleteAddresses(
		@Req() req: Request,
		@Body() body: ValidationAddressesDeleteBodyDTO,
	) {
		const user = req.user as IUserJwt;
		const address = await this.addressesService.delete(body, user);
		return address;
	}

	@MessagePattern("get.addresses.user")
	async getAddressesKafka(
		@Payload(
			new ValidationPipe({
				exceptionFactory: validationExceptionFactory,
			}),
		)
		payload: ValidationAddressesKafkaPayloadDTO,
	) {
		return "addresses  true";
	}
}
