import { Module } from "@nestjs/common";
import { ReviewController } from "./review.controller";
import { KafkaModule } from "src/kafka/kafka.module";
import { ClientKafka } from "@nestjs/microservices";

@Module({
	imports: [KafkaModule],
	controllers: [ReviewController],
	providers: [],
})
export class ReviewModule {}
