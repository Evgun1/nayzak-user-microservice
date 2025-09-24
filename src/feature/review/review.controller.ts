import {
	Body,
	Controller,
	Inject,
	OnModuleDestroy,
	OnModuleInit,
	Post,
} from "@nestjs/common";
import { Injector } from "@nestjs/core/injector/injector";
import { ClientKafka } from "@nestjs/microservices";
import { Message } from "kafkajs";
import { emitWarning } from "process";
import { firstValueFrom } from "rxjs";
import { ReviewKafkaDTO } from "./dto/reviewKafka.dto";
import { UploadReviewsDTO } from "./dto/uploadReview.dto";

@Controller("review")
export class ReviewController implements OnModuleInit, OnModuleDestroy {
	constructor(
		@Inject("REVIEW_SERVICE") private readonly reviewKafka: ClientKafka,
	) {}

	async onModuleInit() {
		this.reviewKafka.subscribeToResponseOf("upload.review.send");
		await this.reviewKafka.connect();
	}

	async onModuleDestroy() {
		await this.reviewKafka.close();
	}

	@Post()
	async uploadReview(@Body() body: UploadReviewsDTO) {
		const data: Message = { value: JSON.stringify({ value: "1q223" }) };

		const send = this.reviewKafka.send("upload.review.send", data);
		const value = send.subscribe((data) => {
			return data;
		});

		return;
	}
}
