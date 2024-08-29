
import { Request, Response } from "express";
import Config from "../utils/config";
import "dotenv/config";
import { QuerySnapshot, DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { DealsReview } from "../Interface/dealsInterface";

const config = new Config();
const db = config.initConfig().db;

const docPath = process.env.PRODUCT_REVIEWS_COMMENTS as string;
const userDocPath = process.env.USER_DETAILS as string;

let lastVisibleData: QueryDocumentSnapshot<DocumentData, DocumentData> | undefined;

class DealsReviewsService {

    async getReviewComments(req: Request, res: Response): Promise<Response> {
        try {
            const payload = req.body;
            const pageNo: number = parseInt(payload.page);
            let query: QuerySnapshot<DocumentData, DocumentData> | undefined = undefined;

            if (payload.state == 'start') {
                query = await db.collection(docPath)
                    .where("dealsId", "==", payload.dealsId)
                    .where("uId", "==", payload.userId)
                    .orderBy("comId", "desc")
                    .limit(pageNo).get();
            } else if (payload.state === 'next') {
                query = await db.collection(docPath)
                    .where("dealsId", "==", payload.dealsid)
                    .where("uId", "==", payload.userid)
                    .orderBy("comId", "desc")
                    .startAfter(lastVisibleData)
                    .limit(pageNo).get();
            }
            const result: Array<DealsReview> = [];

            for (const doc of query?.docs ? query.docs : []) {
                lastVisibleData = query?.docs[query.docs.length - 1];
                const documentData = doc.data();

                const snapshot = await db.collection(userDocPath)
                    .where("uid", "==", documentData['uId']).get();
                snapshot.forEach(async (rec) => {
                    const userDetails = rec.data();
                    documentData['photoUrl'] = userDetails['photoURL'];
                    const userJoiningDate = Object.prototype.hasOwnProperty.call(userDetails, 'joinedOn') ? new Timestamp(userDetails['joinedOn']._seconds, userDetails['joinedOn']._nanoseconds).toDate() : null;
                    documentData['joinedOn'] = userJoiningDate;
                });
                documentData['documentId'] = doc.id;
                result.push(documentData as DealsReview);
            }
            return res.json(result);

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).send({ msg: `Error getting documents: ${error.message}` })
            } else {
                return res.status(500).send({ msg: 'An unknow error occured' });
            }
        }
    }

    async addReviewComments(payload: DealsReview, res: Response) {
        try {
            const preRecord = await db.collection(docPath).where("dealsId", "==", payload.dealsId).where("uId", "==", payload.uId).get();
            let recordFound: FirebaseFirestore.DocumentData | string = ''
            preRecord.forEach(async (doc) => {
                recordFound = doc.id;
            });

            if (recordFound !== '') {
                const docRef = await db.collection(docPath).doc(recordFound);
                await docRef.update(payload);
                if (docRef.id) {
                    console.log("record updated");
                    return res.status(200).send({ msg: "success" });
                } else {
                    return res.status(400).send({ msg: "failed" });
                }
            } else {
                const snapshot = await db.collection(docPath).add(payload);
                if (snapshot.id) {
                    return res.status(200).send({ msg: snapshot.id });
                } else {
                    return res.status(400).json({ msg: "Error while adding users details" });
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).send({ msg: `Error getting documents: ${error.message}` })
            } else {
                return res.status(500).send({ msg: 'An unknow error occured' });
            }
        }
    }

    async updateHelpfulCount(payload: DealsReview, res: Response) {
        try {
            const preRecord = await db.collection(docPath).where("dealsId", "==", payload.dealsId).where("uId", "==", payload.uId).get();
            let recordFound: FirebaseFirestore.DocumentData | string = ''
            const result: Array<DealsReview> = [];
            preRecord.forEach(async (doc) => {
                recordFound = doc.id;
                result.push(doc.data() as DealsReview);
            });

            if (recordFound !== '') {
                const docRef = await db.collection(docPath).doc(recordFound);
                await docRef.update(payload);
                if (docRef.id) {
                    return res.status(200).send(result);
                } else {
                    return res.status(400).send({ msg: "failed" });
                }
            } else {
                const snapshot = await db.collection(docPath).add(payload);
                if (snapshot.id) {
                    return res.status(200).send(result);
                } else {
                    return res.status(400).json({ msg: "Error while updating helpful count." });
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).send({ msg: `Error getting documents: ${error.message}` })
            } else {
                return res.status(500).send({ msg: 'An unknow error occured' });
            }
        }
    }

}

export default DealsReviewsService;