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

    // async UpdateGame (id: number, title: string | null, genre: string | null) {
        
    //    let new_data: any = {}
    //    if (title) {
    //         new_data.title = title
    //     } if (genre) {
    //         new_data.genre = genre
    //     }
    //     let result = await GamesRepository.UpdateGame(id, new_data)
    //     if (result) {
    //         return await GamesRepository.GetGameByID(id)
    //     }
    //     return null
    // }
}