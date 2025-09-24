import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ActivationParamDTO } from "src/dto/activationParam.dto";
import { RegistrationCacheDTO } from "src/dto/registrationCache.dto";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class ActivationMiddleware implements NestMiddleware {
	constructor(private readonly redis: RedisService) {}

	async use(
		req: Request<ActivationParamDTO>,
		res: Response,
		next: NextFunction,
	) {
		const params = req.params;

		const activeLink = await this.redis.hGet<RegistrationCacheDTO>(
			"registration-cache",
			params.link,
		);

		if (!activeLink) {
			throw new HttpException(
				"Activation time has passed or the link is no longer active",
				410,
			);
		}

		next();
	}
}
