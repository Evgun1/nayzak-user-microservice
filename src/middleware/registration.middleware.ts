import { object } from "zod";
import { log } from "console";
import {
	BadRequestException,
	Body,
	HttpException,
	Injectable,
	NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request } from "express";
import { RegistrationBodyDTO } from "src/dto/registrationBody.dto";
import { RedisService } from "src/redis/redis.service";
import { RegistrationCacheDTO } from "src/dto/registrationCache.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RegistrationMiddleware implements NestMiddleware {
	constructor(
		private readonly prisma: PrismaService,
		private readonly redis: RedisService,
	) {}

	async use(
		req: Request<any, any, RegistrationBodyDTO>,
		res: Response,
		next: NextFunction,
	) {
		const body = req.body;

		const redisEmail =
			await this.redis.hGetAll<RegistrationCacheDTO>(
				"registration-cache",
			);

		const validEmailRedis = redisEmail.find((data) => {
			for (const key in data) {
				return data[key].email === body.email;
			}
		});

		const validEmailPrisma = await this.prisma.credentials
			.findFirst({
				where: { email: body?.email },
				select: { email: true },
			})
			.then((data) => data?.email);

		if (validEmailPrisma || validEmailRedis) {
			throw new HttpException("Email already exists", 401);
		}
		next();
	}
}
