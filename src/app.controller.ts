import {
	Body,
	Controller,
	Get,
	Inject,
	OnModuleDestroy,
	Param,
	Post,
	Put,
	Query,
	Req,
	Res,
	UnauthorizedException,
	UseGuards,
	ValidationPipe,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { Request, Response } from "express";
import { GetOneParamDTO } from "./dto/getOneParam.dto";
import { RegistrationBodyDTO } from "./dto/registrationBody.dto";
import { ActivationParamDTO } from "./dto/activationParam.dto";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { ChangePasswordBodyDTO } from "./dto/changePasswordBody.dto";
import { QueryDTO } from "./query/dto/query.dto";
import { LocalAuthGuard } from "./guard/localAuth.guard";
import { UserJwtDTO } from "./dto/userJwt.dto";
import { JwtAuthGuard } from "./guard/jwtAuth.guard";
import { ValidationCartAndAddressesPayloadDTO } from "./validation/validationCartAndAddressesKafka.dto";
import { validationExceptionFactory } from "./utils/validationExceptionFactory";

@Controller("/")
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	async getAll(
		@Query() query: QueryDTO,
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	) {
		const { credentials, totalCount } = await this.appService.getAll(query);
		res.setHeader("X-Total-Count", totalCount);
		return credentials;
	}

	@Get("init")
	@UseGuards(JwtAuthGuard)
	async init(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const user = req.user as UserJwtDTO;
		if (!user) throw new UnauthorizedException();
		const token = await this.appService.init(user);

		return { access_token: token };
	}

	@Get("activation/:link")
	async activation(@Param() param: ActivationParamDTO, @Res() res: Response) {
		const credential = await this.appService.activation(param);
		if (!credential) return;

		return res
			.status(302)
			.cookie("user-token", credential, {
				maxAge: 60 * 60 * 1000,
				path: "/",
			})
			.redirect(`${process.env.API_CLIENT_URL}`);
	}

	@Get("/:params")
	async getOne(@Param() params: GetOneParamDTO) {
		return await this.appService.getOne(params);
	}

	@Post("registration")
	async registration(@Body() body: RegistrationBodyDTO) {
		return await this.appService.registration(body);
	}

	@UseGuards(LocalAuthGuard)
	@Post("login")
	async login(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const body = req.user as UserJwtDTO;
		const userToken = await this.appService.login(body);
		res.setHeader("Authorization", userToken);

		return JSON.stringify(userToken);
	}

	@Put("change-password")
	async changePassword(@Body() body: ChangePasswordBodyDTO) {
		return await this.appService.changePassword(body);
	}

	@MessagePattern("get.cart.and.addresses.user")
	async getCartAndAddressesUser(
		@Payload(
			new ValidationPipe({
				exceptionFactory: validationExceptionFactory,
			}),
		)
		payload: ValidationCartAndAddressesPayloadDTO,
	) {
		const result = await this.appService.getCartAndAddressesKafka(payload);
		return result;
	}
	// @MessagePattern("get.customers.data")
	// kafkaGetCustomerData(
	// 	@Payload()
	// 	payload: any,
	// ) {
	// 	console.log(payload);

	// 	return { message: "hello kafka" };
	// }
}
