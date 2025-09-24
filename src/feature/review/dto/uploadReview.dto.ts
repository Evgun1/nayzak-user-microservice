import { IsInt, IsNotEmpty, IsNumber, Matches, Max } from "class-validator";

export class UploadReviewsDTO {
	@IsInt()
	@Max(5, { message: "You need to specify a rating" })
	rating: number;

	@IsInt()
	productsId: number;

	@IsNotEmpty()
	@Matches(/^[^@#$%^&*()_+\=\[\]{}|<>\/~]*$/, {
		message:
			"The review must not contain the following characters: @#$%^&*()_+=[]{}|<>/~",
	})
	text: string;
}
