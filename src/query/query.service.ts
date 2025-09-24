import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { QueryDTO } from "./dto/query.dto";
import { ModelArgsMap } from "./interface/modelArgsMap.type";
import { QueryBuilder } from "./query.builder";

// interface T {
// 	address: keyof typeof Prisma.AddressesScalarFieldEnum;
// }

@Injectable()
export class QueryService {
	getQuery<T extends keyof typeof Prisma.ModelName>(
		model: T,
		query: QueryDTO,
	): ModelArgsMap[T] {
		const builder = QueryBuilder.create(model);
		builder.setQuery(query);
		const getBuilder = builder.getQuery();
		return getBuilder;
	}
}
