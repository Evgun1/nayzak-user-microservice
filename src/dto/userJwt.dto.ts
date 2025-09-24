import { $Enums } from "@prisma/client";
import { IUserJwt } from "src/interface/credentialsJwt.interface";

export class UserJwtDTO {
	id: number;
	customerId: number;
	email: string;
	role: $Enums.Role;

	constructor({ email, id, role, customerId }: IUserJwt) {
		this.id = id;
		this.customerId = customerId;
		this.email = email;
		this.role = role;
	}
}
