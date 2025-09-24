export class KafkaCustomerDataDTO {
	id: number;
	firstName: string;
	lastName: string;

	constructor(param: KafkaCustomerDataDTO) {
		for (const key in param) {
			if (!Object.keys(this).includes(key)) continue;
			this[key] = param[key];
		}
	}
}
