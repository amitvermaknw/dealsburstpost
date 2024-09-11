
import { Request, Response } from "express";
import Config from "../utils/config";
import "dotenv/config";
import { QuerySnapshot, DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { DealsReview, ProductListProps } from "../Interface/dealsInterface";

const config = new Config();
const db = config.initConfig().db;

const docPath = process.env.PRODUCT_REVIEWS_COMMENTS as string;
const productDocPath = process.env.PRODUCT_DETAILS as string;

let lastVisibleData: QueryDocumentSnapshot<DocumentData, DocumentData> | undefined;

class WishListService {

    async getWishList(req: Request, res: Response): Promise<Response> {
        try {
            const pageNo: number = parseInt(req.params.pageNo);
            const callType: string = req.params.callType;
            const uId: string = req.params.uId;
            let query: QuerySnapshot<DocumentData, DocumentData> | undefined = undefined;

            if (callType == 'start') {
                query = await db.collection(docPath)
                    //.where("dealsId", "==", payload.dealsId)
                    .where("uId", "==", uId)
                    .orderBy("comId", "desc")
                    .limit(pageNo).get();
            } else if (callType === 'next') {
                query = await db.collection(docPath)
                    //.where("dealsId", "==", payload.dealsid)
                    .where("uId", "==", uId)
                    .orderBy("comId", "desc")
                    .startAfter(lastVisibleData)
                    .limit(pageNo).get();
            }
            const result: Array<ProductListProps> = [];

            for (const doc of query?.docs ? query.docs : []) {
                lastVisibleData = query?.docs[query.docs.length - 1];
                const documentData = doc.data();
                const snapshot = await db.collection(productDocPath)
                    .where("pid", "==", documentData['dealsId']).get();


                snapshot.forEach(async (rec) => {
                    const dealsDetails = rec.data();
                    dealsDetails['documentId'] = doc.id;
                    dealsDetails['dealsReview'] = documentData
                    result.push(dealsDetails as ProductListProps);
                });
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

    async updateWishList(payload: DealsReview, res: Response) {
        try {
            const preRecord = await db.collection(docPath).where("dealsId", "==", payload.dealsId).where("uId", "==", payload.uId).get();
            let recordFound: FirebaseFirestore.DocumentData | string = ''
            preRecord.forEach(async (doc) => {
                recordFound = doc.id;
            });

            if (recordFound !== '') {
                const docRef = await db.collection(docPath).doc(recordFound);
                await docRef.update({
                    wishListDealId: payload.wishListDealId
                });
                if (docRef.id) {
                    console.log("Wishlist updated");
                    return res.status(200).send({ msg: "success" });
                } else {
                    return res.status(400).send({ msg: "failed" });
                }
            } else {
                const snapshot = await db.collection(docPath).add(payload);
                if (snapshot.id) {
                    return res.status(200).send({ msg: snapshot.id });
                } else {
                    return res.status(400).json({ msg: "Error while adding wish list" });
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

    // async deleteReviewComments(req: Request, res: Response) {
    //     try {
    //         const preRecord = await db.collection(docPath).where("dealsId", "==", req.params.dealsId).where("uId", "==", req.params.uId).get();
    //         const batch = db.batch();
    //         preRecord.forEach((doc) => {
    //             batch.delete(doc.ref);
    //         });
    //         await batch.commit();
    //         res.status(200).send({ msg: "Comment deleted successfully" })
    //         return
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             return res.status(500).send({ msg: `Error getting documents: ${error.message}` })
    //         } else {
    //             return res.status(500).send({ msg: 'An unknow error occured' });
    //         }
    //     }
    // }

}

export default WishListService;