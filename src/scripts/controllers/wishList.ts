
import { Request, Response } from "express";
import WishListService from "../services/wishListService";
import { DealsReview } from "../Interface/dealsInterface";

const wishList = new WishListService;

class WishList {

    async getWishListCtr(req: Request, res: Response) {
        return await wishList.getWishList(req, res);
    }

    async updateWishListCtr(req: Request, res: Response) {
        const payload: DealsReview = req.body
        return await wishList.updateWishList(payload, res);
    }
}

export default WishList;