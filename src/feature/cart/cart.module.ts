import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { PrismaService } from "src/prisma/prisma.service";
import { QueryService } from "src/query/query.service";
import { ClientApiService } from "src/client-api/clientApi.service";
import { JwtAuthGuard } from "src/guard/jwtAuth.guard";
import { PrismaModule } from "src/prisma/prisma.module";
import { QueryModule } from "src/query/query.module";
import { ClientApiModule } from "src/client-api/clientApi.module";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { KafkaModule } from "src/kafka/kafka.module";

@Module({
	imports: [
		PrismaModule,
		QueryModule,
		ClientApiModule,
		JwtModule,
		KafkaModule,
	],
	controllers: [CartController],
	providers: [CartService],
	exports: [CartService],
})
export class CartModule {}
