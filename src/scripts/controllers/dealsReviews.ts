
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

    async deleteReviewCommentsCtr(req: Request, res: Response) {
        return await dealsReviwe.deleteReviewComments(req, res);
    }
}

export default DealsReviews;