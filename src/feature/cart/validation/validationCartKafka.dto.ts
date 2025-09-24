import { Transform } from "class-transformer";
import { IsArray, IsInt, IsNumber } from "class-validator";

export class ValidationCartKafkaPayloadDTO {
	@IsArray()
	@IsNumber({}, { each: true })
	cartId: number[];

	@IsInt()
	customersId: number;
}
