import { IsNotEmpty, IsNumber } from "class-validator";

export class UploadCartDTO {
	@IsNotEmpty()
	@IsNumber()
	productsId: number;
	@IsNotEmpty()
	@IsNumber()
	customersId: number;
	@IsNotEmpty()
	@IsNumber()
	amount: number;
}
