import {
	MiddlewareConsumer,
	NestModule,
	RequestMethod,
	Type,
} from "@nestjs/common";
import { RegistrationMiddleware } from "./registration.middleware";
import { LoginMiddleware } from "./login.middleware";
import { ActivationMiddleware } from "./activation.middleware";
import { ChangePasswordMiddleware } from "./changePassword.middleware";
import { MiddlewareConfigProxy } from "@nestjs/common/interfaces";

export class AppMiddlewareConfigure {
	static configure(consumer: MiddlewareConsumer) {
		consumer.apply(RegistrationMiddleware).forRoutes({
			path: "registration",
			method: RequestMethod.POST,
		});
		// consumer.apply(LoginMiddleware).forRoutes({
		// 	path: "login",
		// 	method: RequestMethod.POST,
		// });
		consumer.apply(ActivationMiddleware).forRoutes({
			path: "activation/:link",
			method: RequestMethod.GET,
		});
		consumer.apply(ChangePasswordMiddleware).forRoutes({
			path: "change-password",
			method: RequestMethod.PUT,
		});
	}
}
