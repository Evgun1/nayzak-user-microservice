import { IsInt, IsNotEmpty, IsNumber } from "class-validator";

export class DeleteWishlistDTO {
	@IsNotEmpty()
	@IsInt()
	id: number;
}
