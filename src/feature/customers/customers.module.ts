import { Module } from "@nestjs/common";
import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";
import { KafkaModule } from "../../kafka/kafka.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { QueryModule } from "src/query/query.module";
import { ClientApiModule } from "src/client-api/clientApi.module";

@Module({
	imports: [
		PrismaModule,
		QueryModule,
		JwtModule,
		ClientApiModule,
		KafkaModule,
	],
	controllers: [CustomersController],
	providers: [CustomersService],
	exports: [CustomersService],
})
export class CustomersModule {}
