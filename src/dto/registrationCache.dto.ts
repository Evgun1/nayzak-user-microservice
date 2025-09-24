export class RegistrationCacheDTO {
	email: string;
	password: string;
	createAt: Date;
	information: {
		firstName: string;
		lastName: string;
	};
	constructor({
		email,
		firstName,
		lastName,
		password,
	}: RegistrationCacheItem) {
		this.email = email;
		this.password = password;
		this.createAt = new Date();
		this.information = { firstName, lastName };
	}
}
