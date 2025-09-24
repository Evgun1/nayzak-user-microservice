import { Inject, Injectable } from "@nestjs/common";
import RedisClient from "@redis/client/dist/lib/client";
import { HashTypes } from "@redis/client/dist/lib/commands/HSET";
import { RedisClientType } from "redis";

@Injectable()
export class RedisService {
	constructor(
		@Inject("REDIS_CLIENT") private readonly client: RedisClientType,
	) {}

	async set(key: string, value: Record<string, any>) {
		await this.client.set(key, JSON.stringify(value));
	}

	async get<T>(key: string) {
		const result = await this.client.get(key);
		return result ? (JSON.parse(result) as T) : null;
	}

	async hGet<T>(key: string, field: string) {
		const result = await this.client.hGet(key, field);
		return result ? (JSON.parse(result) as T) : null;
	}
	async hGetAll<T>(key: string) {
		const result: Array<{ [actionLink: string]: T }> = await this.client
			.hGetAll(key)
			.then((data: object) => {
				return Object.entries(data).map(([key, val]) => {
					return { [key]: JSON.parse(val) };
				});
			});
		return result;
	}
	async hSet(key: string, field: string, value: Record<string, any>) {
		await this.client.hSet(key, field, JSON.stringify(value));
	}

	async hDel(key: string, field: string | string[]) {
		this.client.hDel(key, field);
	}
}
