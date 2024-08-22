
import express, { Router } from "express";
import GuestToken from "./scripts/controllers/guestToken";

const router: Router = express.Router();
const guestToken = new GuestToken;

router.get("/guesttoken", guestToken.generateTokenCtr);
router.get("/guesttoken/validate", guestToken.validateTokenCtr);
router.post("/deals/review", guestToken.validateTokenCtr);

export default router;