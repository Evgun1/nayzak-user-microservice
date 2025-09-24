import { Transform, Type } from "class-transformer";
import {
	IsArray,
	IsInt,
	Validate,
	ValidateIf,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "IsNumberOrArray", async: false })
export class IsNumberOrArray implements ValidatorConstraintInterface {
	validate(value: any, _args: ValidationArguments): boolean {
		if (typeof value === "number") return Number.isInteger(value);
		if (Array.isArray(value))
			return value.every(
				(v) => typeof v === "number" && Number.isInteger(v),
			);
		return false;
	}

	defaultMessage(args: ValidationArguments): string {
		return `${args.property} must be a number or an array of numbers`;
	}
}
export class ValidationDeleteCustomersBodyDTO {
	@Transform(({ value }) => {
		if (Array.isArray(value)) return value.map(Number);
		return Number(value);
	})
	@Validate(IsNumberOrArray)
	customersId!: number | number[];
}
