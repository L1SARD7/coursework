import { ReviewViewModel } from "../models/ReviewViewModel"
import { ReviewRepository } from "../repositories/review-db-repository"


export const reviewService = {
    async GetReviews (gameId: number | null, authorId: number | null) {
        if (gameId || authorId) {
            let filter: any = {}    
            if (gameId) {
                filter.gameId = gameId
            }
            if (authorId) {
                filter.authorId = authorId
            }
            return await ReviewRepository.FindReviews(filter)

        } else {
            return false
        }
    },

    async GetReviewById (id: number) {
        return await ReviewRepository.FindReviewByReviewId(id)
    },

    async CreateNewReview (rating: number, text: string, gameId: number, authorId: number, authorName: string) : Promise<any> {
        let newReview : ReviewViewModel = {
            id: +(new Date()),
            gameId: gameId,
            authorId: authorId,
            authorName: authorName,
            rating: rating,
            text: text
        }
        await ReviewRepository.CreateNewReview(newReview)
        let CreatedReview = await ReviewRepository.FindReviews(newReview)
        return CreatedReview
    },

    async DeleteReview (id: number) {
            return await ReviewRepository.DeleteReview(id)  
        },

    async ChangeReview (reviewId: number, rating: number, text: string) : Promise<any> {
        let newData = {
            rating: rating,
            text: text
        }
        const result = await ReviewRepository.ChangeReview(reviewId, newData)
        if (result) {
            return await ReviewRepository.FindReviewByReviewId(reviewId)
        } else {
            return null
        }
    }
}