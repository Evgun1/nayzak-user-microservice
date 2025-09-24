import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class GetOneParamDTO {
	@IsInt()
	@Type(() => Number)
	params: number;
}
