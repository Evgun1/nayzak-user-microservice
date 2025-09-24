import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Query,
	Req,
	UseGuards,
} from "@nestjs/common";
import { WishlistService } from "./wishlist.service";
import { QueryDTO } from "../../query/dto/query.dto";
import { UploadWishlistDTO } from "./dto/uploadWishlist.dto";
import { DeleteWishlistDTO } from "./dto/deleteWishlist.dto";
import { JwtAuthGuard } from "src/guard/jwtAuth.guard";
import { Request } from "express";
import { IUserJwt } from "src/interface/credentialsJwt.interface";

@Controller("wishlist")
export class WishlistController {
	constructor(private readonly wishlistService: WishlistService) {}
	@Get()
	async getWishlists(@Query() query: QueryDTO) {
		this.wishlistService.getAll(query);
	}
	@Get("init")
	@UseGuards(JwtAuthGuard)
	async wishlistInit(@Req() req: Request) {
		const credential = req.user as IUserJwt;
		const wishlist = await this.wishlistService.initWishlists(credential);
		return JSON.stringify(wishlist);
	}
	@Post()
	@UseGuards(JwtAuthGuard)
	async uploadWishlist(@Req() req: Request, @Body() body: UploadWishlistDTO) {
		const credential = req.user as IUserJwt;

		const wishlist = await this.wishlistService.uploadWishlist(
			body,
			credential,
		);

		return wishlist;
	}
	@Delete()
	@UseGuards(JwtAuthGuard)
	async deleteWishlist(@Req() req: Request, @Body() body: DeleteWishlistDTO) {
		return this.wishlistService.removeWishlist(body.id);
	}
}
