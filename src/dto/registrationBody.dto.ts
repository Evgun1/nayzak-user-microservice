import { PickType } from "@nestjs/mapped-types";
import { $Enums } from "@prisma/client";
import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength,
} from "class-validator";
import { ValidationUploadCustomerBodyDTO } from "src/feature/customers/validation/validationUploadCustomer.dto";

export class RegistrationBodyDTO extends PickType(
	ValidationUploadCustomerBodyDTO,
	["firstName", "lastName"] as const,
) {
	@IsNotEmpty({ message: "The field must not be empty" })
	@IsEmail({}, { message: "Invalid email format" })
	email: string;

	@IsNotEmpty({ message: "The field must not be empty" })
	@MinLength(3, { message: "Password less than three words" })
	@Matches(/^\S+$/, { message: "Password should not include blank space" })
	@Matches(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, {
		message:
			"Password should include one of next symbols: !@#$%^&*()_+-=[]{};'\":\\|,.<>/?~",
	})
	@Matches(/[A-Z]/, {
		message: "Password must contain one capital letter",
	})
	@Matches(/[0-9]/, {
		message: "Password should include one of next numbers: 0-9",
	})
	password: string;
}
