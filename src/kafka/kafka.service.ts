import { Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

export class KafkaService {
	constructor(
		// @Inject("CATALOG_SERVICE") private readonly kafkaCatalog: ClientKafka,
		@Inject("REVIEW_SERVICE") private readonly kafkaReview: ClientKafka,
	) {}

	// catalogKafka = () => this.kafkaCatalog;
	reviewKafka = () => this.kafkaReview;


}
