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

    async CreateNewGame (title: string, genre: string) : Promise<any> {
        let newGame = {
            id: +(new Date()),
            title: title,
            genre: genre
        }
        await GamesRepository.CreateNewGame(newGame)
        let CreatedGame = await GamesRepository.GetGameByID(newGame.id)
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