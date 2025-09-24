import { MiddlewareConsumer, NestModule, RequestMethod } from "@nestjs/common";

export class WishlistMiddlewareConfigure {
	static configure(consumer: MiddlewareConsumer) {
		consumer.apply().forRoutes({ path: "", method: RequestMethod.GET });
	}
}
