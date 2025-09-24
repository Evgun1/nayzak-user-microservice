import { IsString } from "class-validator";

export class InitHeadersDTO {
	@IsString({ message: "Authorization header must be a string" })
	authorization: string;
}
