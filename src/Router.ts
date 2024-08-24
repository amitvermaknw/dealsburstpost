
import express, { Router } from "express";
import GuestToken from "./scripts/controllers/guestToken";
import UserToken from "./scripts/controllers/userToken";
import DealsReviews from "./scripts/controllers/dealsReviews";

const router: Router = express.Router();
const guestToken = new GuestToken;
const userToken = new UserToken;
const dealsReview = new DealsReviews;

router.get("/guesttoken", guestToken.generateTokenCtr);
router.get("/guesttoken/validate", guestToken.validateTokenCtr);

router.post("/deals/comments", userToken.validateUserTokenCtr, dealsReview.getReviewCommentsCtr);
router.post("/deals/review", userToken.validateUserTokenCtr, dealsReview.addReviewCommentsCtr);


export default router;