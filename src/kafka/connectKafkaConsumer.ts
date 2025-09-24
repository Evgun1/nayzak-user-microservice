import { INestApplication } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

export default async function connectKafkaConsumer(app: INestApplication) {
	const connectMicroservice = app.connectMicroservice<MicroserviceOptions>;

	connectMicroservice({
		transport: Transport.KAFKA,
		options: {
			client: {
				clientId: "user-order-service",
				brokers: ["localhost:29092", "localhost:39092"],
			},
			consumer: {
				groupId: "user-order-consumer",
			},
		},
	});
	connectMicroservice({
		transport: Transport.KAFKA,
		options: {
			client: {
				clientId: "user-review-service",
				brokers: ["localhost:29092", "localhost:39092"],
			},
			consumer: {
				groupId: "user-review-consumer",
			},
		},
	});
}
