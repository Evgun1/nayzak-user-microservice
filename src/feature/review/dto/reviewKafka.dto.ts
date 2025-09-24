import { object } from "zod";
import { IsObject, IsString } from "class-validator";

export class ReviewKafkaDTO {
	@IsString()
	status: string;

	@IsObject()
	value: object;
}
