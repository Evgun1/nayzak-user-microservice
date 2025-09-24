import { object } from "zod";
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	Length,
	Max,
	MaxLength,
	Min,
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import { PickType } from "@nestjs/mapped-types";
import { ValidationUploadCustomerBodyDTO } from "./validationUploadCustomer.dto";

function IsPhoneMin(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: "IsPhoneValidate",
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: number, args) {
					return value.toString().length >= 9;
				},
				defaultMessage(validationArguments) {
					return "The phone number must contain at least 9 digits";
				},
			},
		});
	};
}
function IsPhoneMax(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: "IsPhoneValidate",
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: number, args) {
					return value.toString().length <= 20;
				},
				defaultMessage(validationArguments) {
					return "The phone number must be more than 20 digits long.";
				},
			},
		});
	};
}

export class ValidationChangeCustomerBodyDTO extends PickType(
	ValidationUploadCustomerBodyDTO,
	["firstName", "lastName"] as const,
) {
	@IsOptional()
	@IsInt()
	@IsPhoneMin()
	@IsPhoneMax()
	phone?: number;
}
