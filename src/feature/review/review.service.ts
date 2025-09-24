import { Injectable } from "@nestjs/common";
import { ValidationAddressesUploadBodyDTO } from "../addresses/validation/validationAddressesUpload.dto";

@Injectable()
export class ReviewService {
	async uploadReview(body: ValidationAddressesUploadBodyDTO) {}
}
