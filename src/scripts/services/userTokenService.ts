
import { NextFunction, Request, Response } from "express";
import Config from "../utils/config";
import { QuerySnapshot, DocumentData } from "firebase-admin/firestore";
import "dotenv/config";

const config = new Config();
const db = config.initConfig().db;
const docPath = process.env.USER_DETAILS as string;

class UserTokenServices {
    async validateUserToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        try {
            let query: QuerySnapshot<DocumentData, DocumentData> | undefined = await db.collection(docPath).where("accessToken", "==", token).get();

            if (!query.empty) {
                console.log("User auth is valid")
                return next();
            } else {
                return res.status(401).send({ authStatus: false, msg: 'Auth fail' });
            }
        } catch (error) {
            if (error instanceof Error) {
                return res.status(401).send({ authStatus: false, msg: error.message })
            } else {
                return res.status(500).send('An unknow error occured while token verification');
            }
        }
    }
}

export default UserTokenServices;