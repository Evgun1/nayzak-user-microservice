import { WishlistDtoItem } from "../interface/wishlistIDtoItem.interface";

export class WishlistDTO {
	id: number;
	productsId: number;
	constructor(data: WishlistDtoItem) {
		const { id, productsId } = data;
		this.id = id;
		this.productsId = productsId;
	}
}
