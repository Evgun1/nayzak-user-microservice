import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { SqlDelete, SqlSelect } from "./prisma-sql-builder";
import { ModelMap } from "./interface/ModelMap.type";

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	async onModuleInit() {
		await this.$connect();
	}
	async onModuleDestroy() {
		await this.$disconnect();
	}

	async sqlQuery<T extends keyof ModelMap>(table: T) {
		return {
			select: new SqlSelect<ModelMap[T]>(table, this),
			delete: new SqlDelete<ModelMap[T]>(table, this),
		};
	}
}
