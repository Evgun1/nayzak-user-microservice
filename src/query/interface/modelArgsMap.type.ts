import { Prisma } from "@prisma/client";

export type ModelArgsMap = {
	[Prisma.ModelName.Addresses]: {
		where: Prisma.AddressesWhereInput;
		orderBy: Prisma.AddressesOrderByWithRelationInput;
		skip: number | undefined;
		take: number | undefined;
	};
	[Prisma.ModelName.Cart]: {
		where: Prisma.CartWhereInput;
		orderBy: Prisma.CartOrderByWithRelationInput;
		skip: number | undefined;
		take: number | undefined;
	};
	[Prisma.ModelName.Wishlist]: {
		where: Prisma.WishlistWhereInput;
		orderBy: Prisma.WishlistOrderByWithRelationInput;
		skip: number | undefined;
		take: number | undefined;
	};
	[Prisma.ModelName.Customers]: {
		where: Prisma.CustomersWhereInput;
		orderBy: Prisma.CustomersOrderByWithRelationInput;
		skip: number | undefined;
		take: number | undefined;
	};
	[Prisma.ModelName.Credentials]: {
		where: Prisma.CredentialsWhereInput;
		orderBy: Prisma.CredentialsOrderByWithRelationInput;
		skip: number | undefined;
		take: number | undefined;
	};
};
