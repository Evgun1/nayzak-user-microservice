import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumberString } from "class-validator";

export class ValidationGetCustomerParamDTO {
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	id: number;
}
