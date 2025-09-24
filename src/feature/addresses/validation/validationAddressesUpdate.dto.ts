import { PickType } from "@nestjs/mapped-types";
import { IsInt, IsNotEmpty } from "class-validator";
import { ValidationAddressesUploadBodyDTO } from "./validationAddressesUpload.dto";

export class ValidationAddressesUpdateBodyDTO extends PickType(
	ValidationAddressesUploadBodyDTO,
	["city", "postalCode", "street"] as const,
) {
	@IsNotEmpty()
	@IsInt()
	id: number;
}
