
import { Request, Response } from "express";
import DealsReviewsService from "../services/dealsReviewsService";

const dealsReviwe = new DealsReviewsService;

class DealsReviews {
    async getReviewCommentsCtr(req: Request, res: Response) {
        return await dealsReviwe.getReviewComments(req, res);
    }

    async addReviewCommentsCtr(req: Request, res: Response) {
        return await dealsReviwe.addReviewComments(req.body, res);
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