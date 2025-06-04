import { ReviewViewModel } from "../models/ReviewViewModel"
import { ReviewRepository } from "../repositories/review-db-repository"


export const reviewService = {
    async GetReviews (title: string | null, genre: string | null) {
        let filter: any = {}    
        if (title) {
            filter.title = title
        }
        if (genre) {
            filter.genre = genre
        }
        return await ReviewRepository.GetGames(filter)
    },

    async GetGameByID (id: number) {
        return await ReviewRepository.GetGameByID(id)
    },

    async DeleteGame (id: number) {
        return await ReviewRepository.DeleteGame(id)  
    },

    async CreateNewReview (rating: number, text: string, gameId: number, user: any) : Promise<any> {
        let newReview : ReviewViewModel = {
            id: +(new Date()),
            gameId: gameId,
            authorId: user.id,
            rating: rating,
            text: text
        }
        await ReviewRepository.CreateNewReview(newReview)
        let CreatedGame = await ReviewRepository.FindReviews(newReview.id)
        return CreatedGame
    },

    async UpdateGame (id: number, title: string | null, genre: string | null) {
        
        let new_data: any = {}
        if (title) {
            new_data.title = title
        } if (genre) {
            new_data.genre = genre
        }
        let result = await GamesRepository.UpdateGame(id, new_data)
        if (result) {
            return await GamesRepository.GetGameByID(id)
        }
        return null
    }
}