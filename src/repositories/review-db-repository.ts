import { client} from "../db/db"
import { ReviewViewModel } from "../models/ReviewViewModel"

export const ReviewRepository = {
    async FindReviews (filter: Object) {
        return await client.db("GamePedia").collection("reviews").find(filter).toArray()
    },

    async FindReviewByUserId (id: Object) {
        return await client.db("GamePedia").collection("reviews").find({authorId: id})
    },

    async FindReviewByReviewId (id: Object) {
        return await client.db("GamePedia").collection("reviews").findOne({id: id})
    },

    async CreateNewReview (newReview: ReviewViewModel) {
       return await client.db("GamePedia").collection("reviews").insertOne(newReview)
    },

    async DeleteReview (id: number): Promise<Boolean> {
        let result = await client.db("GamePedia").collection("reviews").deleteOne({id: id})
        return result.deletedCount === 1    
    },

    async DeleteAllReviewsOfDeletedGame (id: number) {
        return await client.db("GamePedia").collection("reviews").deleteMany({gameId: id})
    },

    async ChangeReview (id: number, data: any) {
        const result = await client.db("GamePedia").collection("reviews").updateOne({id: id}, {$set : data})
        return result.modifiedCount === 1
    }
}