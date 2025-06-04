import { client} from "../db/db"
import { ReviewViewModel } from "../models/ReviewViewModel"

export const ReviewRepository = {
    async FindReviews (filter: Object) {
        return await client.db("GamePedia").collection("reviews").find(filter).toArray()
    },

    async CreateNewReview (newReview: ReviewViewModel) {
       return await client.db("GamePedia").collection("reviews").insertOne(newReview)
    }
}