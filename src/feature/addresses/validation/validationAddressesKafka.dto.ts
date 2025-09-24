import { IsInt, IsNotEmpty } from "class-validator";

export class ValidationAddressesKafkaPayloadDTO {
	@IsNotEmpty()
	@IsInt()
	customersId: number;
	@IsNotEmpty()
	@IsInt()
	addressesId: number;
}
