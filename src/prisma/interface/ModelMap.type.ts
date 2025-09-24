import {
	Customers,
	Addresses,
	Cart,
	Credentials,
	Wishlist,
} from "@prisma/client";

export type ModelMap = {
	Customers: Customers;
	Addresses: Addresses;
	Cart: Cart;
	Wishlist: Wishlist;
	Credentials: Credentials;
};
