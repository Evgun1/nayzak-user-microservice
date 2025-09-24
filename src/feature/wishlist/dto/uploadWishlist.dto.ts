import { Type } from "class-transformer";
import { IsInt, IsNumberString } from "class-validator";

export class UploadWishlistDTO {
	@IsInt()
	@Type(() => Number)
	productsId: number;
}
