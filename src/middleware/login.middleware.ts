import * as bcrypt from "bcrypt";

import { Body, HttpException, NestMiddleware, Req, Res } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { LoginBodyDTO } from "src/dto/loginBody.dto";
import { PrismaService } from "src/prisma/prisma.service";

export class LoginMiddleware implements NestMiddleware {
	constructor(private readonly prisma: PrismaService) {}

	async use(
		@Req() { body }: Request<any, any, LoginBodyDTO>,
		@Res() res: Response,
		next: NextFunction,
	) {
		// const { email, password } = body;

		// const credentials = await this.prisma.credentials.findFirst({
		// 	where: { email },
		// 	select: { email: true, password: true },
		// });

		// if (!credentials) {
		// 	throw new HttpException("Incorrect email or password", 401);
		// }

		// const isPasswordEquals = await bcrypt.compare(
		// 	password,
		// 	credentials.password,
		// );

		// if (!isPasswordEquals) {
		// 	throw new HttpException("Incorrect email or password", 401);
		// }

		next();
	}
}
