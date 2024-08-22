
import { NextFunction, Request, Response } from "express";
import Config from "../utils/config";
import { firebaseConfigKeys } from "../../../firebaseConfig";
import axios from "axios";
import "dotenv/config";

const config = new Config();
const db = config.initConfig().db;
const admin = config.initConfig().admin;
const firebaseAPIKey = firebaseConfigKeys.apiKey;

class GuestTokenServices {

    async generateToke(req: Request, res: Response): Promise<Response> {
        try {
            const uid = process.env.GUEST_TOKEN_UID as string;
            const additionalClaims = {
                role: 'guest'
            };
            const customToken = await admin.auth().createCustomToken(uid, additionalClaims);
            const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${firebaseAPIKey}`, {
                token: customToken,
                returnSecureToken: true,
            });

            const idToken = response.data.idToken
            if (idToken) {
                return res.status(200).send({ guestToken: idToken });
            } else {
                return res.status(400).send({ msg: "Token not generated", token: false });
            }
        } catch (error) {
            return res.status(500).send({ msg: 'Error generating guest token' });
        }
    }

    async validateToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send('Unauthorized');
        }
        try {
            await admin.auth().verifyIdToken(token);
            return next();
        } catch (error) {
            if (error instanceof Error) {
                return res.status(401).send({ authStatus: false, msg: error.message })
            } else {
                return res.status(500).send('An unknow error occured while token verification');
            }
        }
    }

    // async login(req: Request, res: Response) {
    //     const { email, password } = req.body;
    //     try {
    //         const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseAPIKey}`, {
    //             email,
    //             password,
    //             returnSecureToken: true
    //         });

    //         const { localId } = response.data;
    //         if (localId) {
    //             const customToken = await admin.auth().createCustomToken(localId);
    //             const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${firebaseAPIKey}`, {
    //                 token: customToken,
    //                 returnSecureToken: true,
    //             });

    //             const idToken = response.data.idToken
    //             if (idToken) {
    //                 res.status(200).send({ token: idToken });
    //             } else {
    //                 res.status(400).send({ msg: "Token not generated", token: false });
    //             }
    //         } else {
    //             res.status(400).send({ msg: "Invalid email or password" });
    //         }
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             res.status(500).send({ authStatus: false, msg: error.message })
    //         } else {
    //             res.status(500).send('An unknow error occured');
    //         }
    //     }
    // }

    // async addAdminLogToken(req: Request, res: Response) {
    //     try {
    //         const payload = req.body;
    //         const snapshot = await db.collection(docPath).add(payload);
    //         if (snapshot.id) {
    //             res.status(200).send({ msg: snapshot.id });
    //         } else {
    //             res.status(400).json({ msg: "Error while add transaction" });
    //         }
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             res.status(500).send({ qStatus: false, msg: error.message })
    //         } else {
    //             res.status(500).send('An unknow error occured');
    //         }
    //     }
    // }

    // async updateAdminTokenLog(req: Request, res: Response) {
    //     try {
    //         const payload = req.body;
    //         const snapshot = await db.collection(docPath)
    //             .where("status", "==", true).get();

    //         snapshot.forEach(async (rec) => {
    //             const docRef = await db.collection(docPath).doc(rec.id);
    //             await docRef.update(payload);
    //         });
    //         res.status(200).send("success");
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             res.status(500).send({ qStatus: false, msg: error.message })
    //         } else {
    //             res.status(500).send('An unknow error occured');
    //         }
    //     }
    // }

    // async tokenValidation(req: Request, res: Response) {
    //     const token = req.headers.authorization;
    //     if (!token) {
    //         return res.status(401).send('Unauthorized');
    //     }
    //     try {
    //         const decodedToken = await admin.auth().verifyIdToken(token);
    //         return res.status(200).send(decodedToken.uid);
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             return res.status(401).send({ authStatus: false, msg: error.message })
    //         } else {
    //             return res.status(500).send('An unknow error occured while token verification');
    //         }
    //     }
    // }

    // async userSignup(req: Request, res: Response) {
    //     const payload = req.body;
    //     if (!payload) {
    //         return res.status(500).send({ msg: 'Payload is missing' });
    //     }
    //     try {
    //         const payload = req.body;
    //         const preRecord = await db.collection(docPath).where("email", "==", payload.email).get();
    //         let recordFound: FirebaseFirestore.DocumentData | string = ''
    //         preRecord.forEach(async (doc) => {
    //             recordFound = doc.id;
    //         });

    //         if (recordFound !== '') {
    //             const docRef = await db.collection(docPath).doc(recordFound);
    //             await docRef.update(payload);
    //             if (docRef.id) {
    //                 console.log("record updated");
    //                 return res.status(200).send({ msg: "success" });
    //             } else {
    //                 return res.status(400).send({ msg: "failed" });
    //             }
    //         } else {
    //             const snapshot = await db.collection(docPath).add(payload);
    //             if (snapshot.id) {
    //                 return res.status(200).send({ msg: snapshot.id });
    //             } else {
    //                 return res.status(400).json({ msg: "Error while adding users details" });
    //             }
    //         }

    //     } catch (error) {
    //         if (error instanceof Error) {
    //             return res.status(500).send({ qStatus: false, msg: error.message })
    //         } else {
    //             return res.status(500).send('An unknow error occured');
    //         }
    //     }
    // }



}

export default GuestTokenServices;