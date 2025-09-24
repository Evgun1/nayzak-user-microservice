import { $Enums } from "@prisma/client";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import * as bodyParser from "body-parser";
import { retry } from "rxjs";
import { PartitionAssigners } from "kafkajs";
import connectKafkaConsumer from "./kafka/connectKafkaConsumer";

const PORT = process.env.PORT ?? 3002;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(bodyParser.urlencoded({ extended: true }));
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	connectKafkaConsumer(app);
	await app.startAllMicroservices();
	app.enableCors({
		origin: ["http://localhost:2999", "http://localhost:2998"],
		credentials: true,
		exposedHeaders: ["Authorization"],
	});

	await app.listen(PORT, () =>
		console.log(`Server running on port: ${PORT}`),
	);
}
bootstrap();
