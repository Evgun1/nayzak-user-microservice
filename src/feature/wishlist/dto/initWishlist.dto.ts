import { Type } from "class-transformer";
import { IsInt, IsNumberString } from "class-validator";

export class initWishlistDTO {
	@IsInt()
	@Type(() => Number)
	customerId: string;
}
