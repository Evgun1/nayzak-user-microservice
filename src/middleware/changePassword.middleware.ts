import * as bcrypt from "bcrypt";

import { HttpException, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { ChangePasswordBodyDTO } from "src/dto/changePasswordBody.dto";
import { PrismaService } from "src/prisma/prisma.service";

export class ChangePasswordMiddleware implements NestMiddleware {
	constructor(private readonly prisma: PrismaService) {}

	async use(
		req: Request<any, any, ChangePasswordBodyDTO>,
		res: Response,
		next: (error?: any) => void,
	) {
		const body = req.body;

		const credentials = await this.prisma.credentials.findFirst({
			where: { email: body.email },
		});

		const checkPassword = await bcrypt.compare(
			body.password,
			credentials?.password as string,
		);

		const checkNewPassword = await bcrypt.compare(
			body.newPassword,
			credentials?.password as string,
		);

		if (!checkPassword) {
			throw new HttpException("Incorrect password", 401);
		}

		if (checkNewPassword) {
			throw new HttpException(
				"The password should not be similar to the old one",
				401,
			);
		}

		next();
	}
}
