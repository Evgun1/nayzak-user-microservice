import { ClientApiService } from "../../client-api/clientApi.service";
import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { QueryDTO } from "../../query/dto/query.dto";
import { QueryService } from "../../query/query.service";
import { JwtService } from "@nestjs/jwt";
import { UserJwtDTO } from "src/dto/userJwt.dto";
import { WishlistDTO } from "./dto/wishlist.dto";
import { UploadWishlistDTO } from "./dto/uploadWishlist.dto";
import { IUserJwt } from "src/interface/credentialsJwt.interface";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";

@Injectable()
export class WishlistService {
	private clearCacheToClient: Promise<any>;

	constructor(
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
		private readonly queryService: QueryService,
		private readonly clientApiService: ClientApiService,
	) {
		this.clearCacheToClient = this.clientApiService.clearCache("wishlists");
	}

	async getAll(query: QueryDTO) {
		const getQuery = this.queryService.getQuery("Wishlist", query);

		const wishlist = await this.prisma.wishlist.findMany(getQuery);
		const totalCount = await this.prisma.wishlist.count({
			where: getQuery.where,
		});
		return { wishlist, totalCount };
	}

	async initWishlists(credential: IUserJwt) {
		const wishlist = await this.prisma.wishlist.findMany({
			select: { id: true, productsId: true },
			where: { Customers: { credentialsId: credential.id } },
		});

		return wishlist;
	}

	async uploadWishlist(body: UploadWishlistDTO, credential: IUserJwt) {
		const { customerId } = credential;
		const { productsId } = body;

		const getWishlist = await this.prisma.wishlist.findFirst({
			where: { customersId: customerId, productsId },
		});

		if (getWishlist) {
			throw new HttpException(
				"The user already has such a product in the wishlist",
				400,
			);
		}

		const wishlist = await this.prisma.wishlist.create({
			data: { productsId, customersId: customerId },
		});

		await this.clearCacheToClient;
		return wishlist;
	}

	async removeWishlist(id: number | number[]) {
		const sqlQuery = await this.prisma.sqlQuery("Wishlist");
		const sqlSelect = sqlQuery.select;
		sqlSelect.fields(["*"]);
		sqlSelect.where({ id: id });
		const selectQuery = await sqlSelect.query();

		const sqlDelete = sqlQuery.delete;
		sqlDelete.where({ id: id });
		await sqlDelete.query();

		await this.clearCacheToClient;
		return selectQuery;
	}
}
