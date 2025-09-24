import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class DeleteCartDTO {
	@IsNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	id: number[];
}
