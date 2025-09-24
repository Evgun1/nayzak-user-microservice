import { Module } from "@nestjs/common";
import { ClientApiModule } from "src/client-api/clientApi.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { QueryModule } from "src/query/query.module";
import { AddressesController } from "./addresses.controller";
import { AddressesService } from "./addresses.service";

@Module({
	imports: [PrismaModule, QueryModule, ClientApiModule],
	controllers: [AddressesController],
	providers: [AddressesService],
	exports: [AddressesService],
})
export class AddressesModel {}
