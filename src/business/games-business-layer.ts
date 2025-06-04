import { GamesRepository } from "../repositories/games-db-repository"

export const gamesService = {
    async GetGames (title: string | null, genre: string | null) {
        let filter: any = {}    
        if (title) {
            filter.title = title
        }
        if (genre) {
            filter.genre = genre
        }
        return await GamesRepository.GetGames(filter)
    },

    async GetGameByID (id: number) {
        return await GamesRepository.GetGameByID(id)
    },

    async DeleteGame (id: number) {
        return await GamesRepository.DeleteGame(id)  
    },

    async CreateNewGame (title: string, genre: string, release_year: number, developer: string, description: string, imageURL: string, trailerYoutubeId: string) : Promise<any> {
        const newGame = {
            id: +(new Date()),
            title: title,
            genre: genre,
            release_year: release_year,
            developer: developer,
            description: description,
            imageURL: imageURL,
            trailerYoutubeId: trailerYoutubeId
        }
        await GamesRepository.CreateNewGame(newGame)
        const CreatedGame = await GamesRepository.GetGameByID(newGame.id)
        return CreatedGame
    },

    async UpdateGame (id: number, title: string, genre: string, release_year: number, developer: string, description: string, imageURL: string, trailerYoutubeId: string) {        
        const newData = {
            title: title,
            genre: genre,
            release_year: release_year,
            developer: developer,
            description: description,
            imageURL: imageURL,
            trailerYoutubeId: trailerYoutubeId
        }
        let result = await GamesRepository.UpdateGame(id, newData)
        if (result) {
            return await GamesRepository.GetGameByID(id)
        }
        return null
    }
}