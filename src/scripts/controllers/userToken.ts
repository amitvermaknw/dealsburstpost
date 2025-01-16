
import { NextFunction, Request, Response } from "express";
import UserTokenServices from "../services/userTokenService";

const userToken = new UserTokenServices();

class UserToken {

    async validateUserTokenCtr(req: Request, res: Response, next: NextFunction) {
        console.log("inside user validate token")
        return await userToken.validateUserToken(req, res, next);
    }
}

export default UserToken;