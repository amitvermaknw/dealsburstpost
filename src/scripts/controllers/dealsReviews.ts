
import { NextFunction, Request, Response } from "express";
import DealsReviewsService from "../services/dealsReviewsService";

const dealsReviwe = new DealsReviewsService;

class DealsReviews {
    async getReviewCommentsCtr(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.send(await dealsReviwe.getReviewComments(req, res));
    }

    async addReviewCommentsCtr(req: Request, res: Response, next: NextFunction) {
        res.send(dealsReviwe.addReviewComments(req.body, res));
    }

    async deleteReviewCommentsCtr(req: Request, res: Response, next: NextFunction) {
        res.send(await dealsReviwe.deleteReviewComments(req, res));
    }
}

export default DealsReviews;