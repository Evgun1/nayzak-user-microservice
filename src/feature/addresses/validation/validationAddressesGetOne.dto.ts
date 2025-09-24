import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class ValidationAddressesGetOneParamDTO {
	@IsNotEmpty()
	@Type(() => Number)
	@IsInt()
	id: number;
}
