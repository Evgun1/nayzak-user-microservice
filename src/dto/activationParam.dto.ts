import { IsNotEmpty, IsString } from "class-validator";

export class ActivationParamDTO {
	@IsNotEmpty()
	link: string;
}
