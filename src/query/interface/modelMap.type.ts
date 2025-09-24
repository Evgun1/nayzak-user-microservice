import { Prisma } from "@prisma/client";
export type ModelMap = {
	[Prisma.ModelName.Addresses]: {
		enum: keyof typeof Prisma.AddressesScalarFieldEnum;
	};
	[Prisma.ModelName.Cart]: {
		enum: keyof typeof Prisma.CartScalarFieldEnum;
	};
	[Prisma.ModelName.Wishlist]: {
		enum: keyof typeof Prisma.WishlistScalarFieldEnum;
	};
	[Prisma.ModelName.Customers]: {
		enum: keyof typeof Prisma.CustomersScalarFieldEnum;
	};
	[Prisma.ModelName.Credentials]: {
		enum: keyof typeof Prisma.CredentialsScalarFieldEnum;
	};
};
