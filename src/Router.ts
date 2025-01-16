
import express, { Router, RequestHandler } from "express";
import GuestToken from "./scripts/controllers/guestToken";
import UserToken from "./scripts/controllers/userToken";
import DealsReviews from "./scripts/controllers/dealsReviews";
import WishList from "./scripts/controllers/wishList";

const router: Router = express.Router();
const guestToken = new GuestToken;
const userToken = new UserToken;
const dealsReview = new DealsReviews;
const wishList = new WishList;

router.get("/guesttoken", guestToken.generateTokenCtr as RequestHandler);
router.get("/guesttoken/validate", guestToken.validateTokenCtr as RequestHandler);

router.post("/deals/comments", userToken.validateUserTokenCtr as RequestHandler, dealsReview.getReviewCommentsCtr as RequestHandler);
router.post("/deals/review", userToken.validateUserTokenCtr as RequestHandler, dealsReview.addReviewCommentsCtr as RequestHandler);
router.delete("/deals/review/:dealsId/:uId", userToken.validateUserTokenCtr as RequestHandler, dealsReview.deleteReviewCommentsCtr as RequestHandler);
router.put("/users/wishlist", userToken.validateUserTokenCtr as RequestHandler, wishList.updateWishListCtr as RequestHandler);
router.get("/users/wishlist/:callType/:pageNo/:uId", userToken.validateUserTokenCtr as RequestHandler, wishList.getWishListCtr as RequestHandler);


export default router;