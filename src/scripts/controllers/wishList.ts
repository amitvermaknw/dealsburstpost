
import { NextFunction, Request, Response } from "express";
import WishListService from "../services/wishListService";
import { DealsReview } from "../Interface/dealsInterface";

const wishList = new WishListService;

class WishList {

    async getWishListCtr(req: Request, res: Response, next: NextFunction) {
        res.send(await wishList.getWishList(req, res));
    }

    async updateWishListCtr(req: Request, res: Response, next: NextFunction) {
        const payload: DealsReview = req.body
        res.send(await wishList.updateWishList(payload, res));
    }
}

export default WishList;