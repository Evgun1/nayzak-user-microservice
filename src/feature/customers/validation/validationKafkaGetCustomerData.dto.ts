import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsNumber } from "class-validator";

export class ValidationKafkaGetCustomerDataPayloadDTO {
	@IsNotEmpty()
	@IsArray({ each: true })
	@IsNumber({}, { each: true })
	customersId: number[];
}
