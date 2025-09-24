export class CartDTO {
	productsId: number;
	id: number;
	amount: number;
	constructor({ amount, productsId, id }: CartDtoItem) {
		this.id = id;
		this.productsId = productsId;
		this.amount = amount;
	}
}
