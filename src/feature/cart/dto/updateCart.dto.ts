import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateCartDTO {
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsNotEmpty()
	@IsNumber()
	amount: number;
}
