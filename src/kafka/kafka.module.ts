import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { KafkaService } from "./kafka.service";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: "MAIL_NOTIFICATION_SERVICE",
				transport: Transport.KAFKA,
				options: {
					client: {
						clientId: "mail",
						brokers: ["localhost:29092", "localhost:39092"],
					},
					consumer: {
						groupId: "mail-consumer",
						// rebalanceTimeout: 60000,
						// heartbeatInterval: 3000,
						// sessionTimeout: 45000,
						// allowAutoTopicCreation: false,

						// retry: {
						// 	initialRetryTime: 300,
						// 	retries: 5,
						// },
					},
					// subscribe: { fromBeginning: true },
				},
			},
			{
				name: "REVIEW_SERVICE",
				transport: Transport.KAFKA,
				options: {
					client: {
						clientId: "review-service",
						brokers: ["localhost:29092", "localhost:39092"],
					},
					consumer: {
						groupId: "review-consumer",
						// rebalanceTimeout: 60000,
						// heartbeatInterval: 3000,
						// sessionTimeout: 45000,
						// allowAutoTopicCreation: false,

						// retry: {
						// 	initialRetryTime: 300,
						// 	retries: 5,
						// },
					},
					// subscribe: { fromBeginning: true },
				},
			},
		]),
	],
	providers: [KafkaService],
	exports: [ClientsModule, KafkaService],
})
export class KafkaModule {}
