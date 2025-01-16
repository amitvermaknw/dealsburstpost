
import express, { Router } from "express";
import GuestToken from "./scripts/controllers/guestToken";
import UserToken from "./scripts/controllers/userToken";
import DealsReviews from "./scripts/controllers/dealsReviews";
import WishList from "./scripts/controllers/wishList";

const router: Router = express.Router();
const guestToken = new GuestToken;
const userToken = new UserToken;
const dealsReview = new DealsReviews;
const wishList = new WishList;

router.get("/guesttoken", guestToken.generateTokenCtr);
router.get("/guesttoken/validate", guestToken.validateTokenCtr);

router.post("/deals/comments", userToken.validateUserTokenCtr, dealsReview.getReviewCommentsCtr);
router.post("/deals/review", userToken.validateUserTokenCtr, dealsReview.addReviewCommentsCtr);
router.delete("/deals/review/:dealsId/:uId", userToken.validateUserTokenCtr, dealsReview.deleteReviewCommentsCtr);
router.put("/users/wishlist", userToken.validateUserTokenCtr, wishList.updateWishListCtr);
router.get("/users/wishlist/:callType/:pageNo/:uId", userToken.validateUserTokenCtr, wishList.getWishListCtr);





export default router;