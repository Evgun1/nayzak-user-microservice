import { $Enums } from "@prisma/client";

export interface IUserJwt {
	id: number;
	customerId: number;
	email: string;
	role: $Enums.Role;
}
