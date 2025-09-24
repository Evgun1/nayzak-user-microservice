import { Transform, Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export class QueryDTO {
	@IsOptional()
	@IsString()
	search?: string;
	@IsOptional()
	@IsString()
	searchBy?: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number;

	@IsOptional()
	@IsString()
	filter?: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	limit?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	offset?: number;

	@IsOptional()
	@Transform(({ value }) => value?.toUpperCase())
	@IsEnum(["ASC", "DESC"], {
		message: "sort must be either asc or desc",
	})
	@IsString()
	sort?: "ASC" | "DESC";

	@IsOptional()
	@IsString()
	sortBy?: string;
}
