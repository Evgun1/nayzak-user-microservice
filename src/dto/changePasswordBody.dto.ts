import { object } from "zod";
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength,
	Validate,
	ValidateIf,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "PasswordMatch", async: false })
class PasswordsMatch implements ValidatorConstraintInterface {
	constructor(t: string) {}
	validate(
		confirmPassword: string,
		validationArguments?: ValidationArguments,
	) {
		const object = validationArguments?.object as ChangePasswordBodyDTO;
		return object.newPassword === confirmPassword;
	}
	defaultMessage(): string {
		return "Passwords do not match";
	}
}

export class ChangePasswordBodyDTO {
	@IsNotEmpty()
	email: string;

	@IsNotEmpty({ message: "The field must not be empty" })
	password: string;

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
	newPassword: string;

	@IsString()
	@Validate(PasswordsMatch)
	confirmPassword: string;
}
