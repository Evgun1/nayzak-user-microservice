export class AddressesKafkaDTO {
	city: string;
	street: string;
	postalCode: number;
	constructor(params: AddressesKafkaDTO) {
		for (const key in params) {
			if (!Object.keys(this).includes(key)) continue;
			this[key] = params[key];
		}
	}
}
