import { IntersectionType } from "@nestjs/mapped-types";
import { ValidationAddressesKafkaPayloadDTO } from "../feature/addresses/validation/validationAddressesKafka.dto";
import { ValidationCartKafkaPayloadDTO } from "../feature/cart/validation/validationCartKafka.dto";

export class ValidationCartAndAddressesPayloadDTO extends IntersectionType(
	ValidationAddressesKafkaPayloadDTO,
	ValidationCartKafkaPayloadDTO,
) {}
