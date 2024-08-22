
import { NextFunction, Request, Response } from "express";
import GuestTokenServices from "../services/guestTokenService";

const guestToken = new GuestTokenServices();

class DealsReviews {
    async getReviewComments(req: Request, res: Response) {
        return await guestToken.generateToke(req, res);
    }

    async addReviewComments(req: Request, res: Response, next: NextFunction) {
        return await guestToken.validateToken(req, res, next);
    }

    // async addAdminLogToken(req: Request, res: Response) {
    //     return await userLogin.addAdminLogToken(req, res);
    // }

    // async updateAdminTokenLog(req: Request, res: Response) {
    //     return await userLogin.updateAdminTokenLog(req, res);
    // }

    // async tokenValidation(req: Request, res: Response) {
    //     return await userLogin.tokenValidation(req, res);
    // }

    // async userSignup(req: Request, res: Response) {
    //     return await userLogin.userSignup(req, res);
    // }
}

export default DealsReviews;