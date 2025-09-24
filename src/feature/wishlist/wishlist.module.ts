import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { WishlistController } from "./wishlist.controller";
import { WishlistService } from "./wishlist.service";
import { WishlistMiddlewareConfigure } from "./middleware/wishlistMiddleware.configure";
import { PrismaModule } from "src/prisma/prisma.module";
import { QueryModule } from "../../query/query.module";
import { JwtModule } from "@nestjs/jwt";
import { ClientApiService } from "src/client-api/clientApi.service";
import { ClientApiModule } from "src/client-api/clientApi.module";

@Module({
	imports: [PrismaModule, QueryModule, JwtModule, ClientApiModule],
	controllers: [WishlistController],
	providers: [WishlistService],
})
export class WishlistModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		WishlistMiddlewareConfigure.configure(consumer);
	}
}
