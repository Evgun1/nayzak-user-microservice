import { Prisma } from "@prisma/client";
import {
	AllModelsToStringIndex,
	DynamicModelExtensionThis,
	ObjectEnumValue,
} from "@prisma/client/runtime/library";
import { json } from "stream/consumers";
import { PrismaService } from "./prisma.service";

// interface WhereParams<T> {
//     [key: keyof T]: string;
// }

interface WhereObjectItem {
	in?: number[];
	between?: [number, number];
}

type WhereParams<T = Record<string, any>> = {
	[key in keyof T]?: WhereObjectItem | string | number | number[];
};

const where = (conditions: WhereParams) => {
	let clause: string | undefined = "";
	const args: Array<WhereObjectItem | string | number> = [];
	let i = 1;
	for (const key in conditions) {
		let value = conditions[key] as WhereObjectItem | string | number;

		let condition;

		if (typeof value === "number") {
			condition = `${key} = ${value}`;
		} else if (typeof value === "object") {
			if (Array.isArray(value)) {
				if (value.every((el) => !Number.isNaN(el))) {
					condition = `${key} IN (${value.join(", ")})`;
				}
			}
			if (value.in) {
				condition = `${key} IN (${value.in.join(", ")})`;
			}
			if (value.between) {
				const [first, last] = value.between;
				condition = `"${key}" BETWEEN ${first} AND ${last} `;
			}
		} else if (typeof value === "string") {
			if (value.startsWith("IN")) {
				value = value.substring(2);
				condition = `${key} IN (${value}::int[])`;
			}
			if (value.startsWith(">=")) {
				condition = `${key} ${value}`;
				value = value.substring(2);
			} else if (value.startsWith("<=")) {
				condition = `${key} ${value}`;
				value = value.substring(2);
			} else if (value.startsWith("<>")) {
				condition = `${key} ${value}`;
				value = value.substring(2);
			} else if (value.startsWith(">")) {
				condition = `${key} ${value}`;
				value = value.substring(1);
			} else if (value.startsWith("<")) {
				condition = `${key} ${value}`;
				value = value.substring(1);
			} else if (value.includes("*") || value.includes("?")) {
				value = value.replace(/\*/g, "%").replace(/\?/g, "_");
				condition = `"${key}" ILIKE '${value}'`;
			} else {
				condition = `"${key}" = '${value}'`;
			}
		}
		i++;

		args.push(value);
		clause = clause ? `${clause} AND ${condition}` : condition;
	}
	return { clause, args };
};

const typeJoinMap = new Map([
	["LEFT", " LEFT JOIN "],
	["INNER", " INNER JOIN "],
	[undefined, " JOIN "],
]);

class Join<J, M> {
	protected tableConfig: string;
	protected fieldsConfig: string[];
	protected groupByConfig?: string;
	protected whereConfig?: string;
	protected args: Array<string>;
	protected typeJoinConfig?: string;
	protected onConfig?: string[];
	protected mainTable?: string;

	constructor(
		table: Prisma.ModelName | string,
		mainTable: string,
		joinType?: string,
	) {
		this.typeJoinConfig = joinType;
		this.args = [];
		this.tableConfig = table;
		this.fieldsConfig = ["*"];
		this.groupByConfig = undefined;
		this.whereConfig = undefined;
		this.onConfig = undefined;
		this.mainTable = mainTable;
	}

	where(conditions: WhereParams<J>) {
		const { clause, args } = where(conditions);
		this.whereConfig = clause;

		// this.args = args;
		return this;
	}

	fields(fields: Array<keyof J> | Array<string>) {
		const currFields = fields.map((value) => {
			if ((value as string).includes("ROUND")) return value as string;
			if ((value as string).includes("*")) return value as string;
			if ((value as string).includes('"')) return value as string;

			return `"${value as string}"`;
		});

		this.fieldsConfig = currFields as string[];
		return this;
	}
	groupBy(name: keyof J) {
		this.groupByConfig = `"${name as string}"` as string;
		return this.groupBy;
	}
	on(conditions: Partial<Record<keyof J, keyof M>>) {
		for (const key in conditions) {
			this.onConfig = [
				`"${this.tableConfig}"."${key as string}"`,
				`"${this.mainTable}"."${conditions[key] as string}"`,
			];
		}
		return this;
	}

	query() {
		const {
			tableConfig,
			fieldsConfig,
			groupByConfig,
			whereConfig,
			typeJoinConfig,
			onConfig,
		} = this;

		let joinSQL: string = "";
		for (const [type, join] of typeJoinMap.entries()) {
			if (type === typeJoinConfig) {
				joinSQL += join;
			}
		}

		joinSQL += `( SELECT ${fieldsConfig?.join(", ")} FROM "${tableConfig}"`;
		if (whereConfig) joinSQL += ` WHERE ${whereConfig}`;
		if (groupByConfig) joinSQL += ` GROUP BY ${groupByConfig}`;

		if (onConfig)
			joinSQL += ` ) AS "${tableConfig}" ON ${onConfig.join(" = ")}`;
		return joinSQL;
	}
}

export class SqlSelect<M> {
	protected tableConfig: string;
	protected whereConfig?: string;
	protected orderByConfig?: string[];
	protected limitConfig?: number;
	protected offsetConfig?: number;
	protected fieldsConfig: string[];
	protected joinInstance?: Join<any, M>;
	protected joinConfig: string[];

	constructor(
		table: Prisma.ModelName,
		private readonly prisma: PrismaService,
	) {
		this.tableConfig = table;
		this.whereConfig = undefined;
		this.orderByConfig = undefined;
		this.limitConfig = undefined;
		this.offsetConfig = undefined;
		this.joinInstance = undefined;
		this.fieldsConfig = [`"${table}".*`];
		this.joinConfig = [];
	}

	where(conditions: WhereParams<M>) {
		const { clause } = where(conditions);
		this.whereConfig = clause;
		return this;
	}
	orderBy(name: keyof M, operator?: "DESC" | "ASC") {
		this.orderByConfig = [`"${name as any}"`, operator ? operator : "DESC"];

		return this;
	}
	limit(limit: number) {
		this.limitConfig = limit;

		return this;
	}
	offset(offset: number) {
		this.offsetConfig = offset;

		return this;
	}

	fields(fields: Array<keyof M> | Array<string> = []) {
		const currFields = fields.map((value) => {
			if ((value as string).includes("ROUND")) return value as string;
			if ((value as string).includes("*"))
				return `"${this.tableConfig}".${value as string}`;
			if ((value as string).includes('"')) return value as string;

			return `"${value as string}"`;
		});

		this.fieldsConfig = currFields as Array<string>;
		return this;
	}
	joinQuery() {
		const query = this.joinInstance?.query();
		if (!query) return;
		this.joinConfig.push(query);
		return this;
	}

	join<J>(
		table: Prisma.ModelName,
		joinType: "INNER" | "LEFT" | "RIGHT",
	): Join<J, M> {
		const join = new Join<J, M>(table, this.tableConfig, joinType);
		return (this.joinInstance = join);
	}

	async query() {
		const {
			joinConfig,
			tableConfig,
			fieldsConfig,
			limitConfig,
			offsetConfig,
			orderByConfig,
			whereConfig,
		} = this;

		let sql = "";
		if (joinConfig.length > 0) sql += `SELECT * FROM ( `;
		sql += `SELECT  ${fieldsConfig.join(", ")} FROM "${tableConfig}"`;
		if (joinConfig.length > 0) sql += joinConfig.join(" ");
		if (joinConfig.length > 0)
			sql += ` LIMIT(SELECT COUNT(*) FROM "${tableConfig}") )`;
		if (whereConfig) sql += ` WHERE ${whereConfig}`;
		if (orderByConfig)
			sql += ` ORDER BY ${orderByConfig.join(" ")} NULLS LAST`;

		if (typeof limitConfig === "number") sql += ` LIMIT ${limitConfig}`;
		if (offsetConfig) sql += ` OFFSET ${offsetConfig}`;

		return await this.prisma.$queryRawUnsafe<M>(sql);
	}
}

export class SqlDelete<T> {
	private supportedMapTypes: Map<
		string,
		(key: any, id: any) => Promise<any>
	> = new Map();

	private whereConfig: string;
	private table: Prisma.ModelName;

	constructor(
		table: Prisma.ModelName,
		private readonly prisma: PrismaService,
	) {
		this.whereConfig = "";
		this.table = table;
	}

	where(conditions: WhereParams<T>) {
		const { clause } = where(conditions);
		if (!clause) return;
		this.whereConfig = clause;
		return this;
	}

	async query() {
		let sql = `DELETE FROM "${this.table}"`;
		sql += ` WHERE ${this.whereConfig}`;
		return (await this.prisma.$queryRawUnsafe(sql)) as T;
	}
}
