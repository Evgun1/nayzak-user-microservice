export class CartKafkaDTO {
	productsId: number;
	amount: number;
	constructor(params: CartKafkaDTO) {
		for (const key in params) {
			if (!Object.keys(this).includes(key)) continue;
			this[key] = params[key];
		}
	}
}
