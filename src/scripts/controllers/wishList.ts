
import { NextFunction, Request, Response } from "express";
import WishListService from "../services/wishListService";
import { DealsReview } from "../Interface/dealsInterface";

const wishList = new WishListService;

class WishList {

    async getWishListCtr(req: Request, res: Response, next: NextFunction) {
        await wishList.getWishList(req, res);
        next();
    }

    async updateWishListCtr(req: Request, res: Response, next: NextFunction) {
        const payload: DealsReview = req.body
        await wishList.updateWishList(payload, res);
        next();
    }
}

export default WishList;