import { client} from "../db/db"
import { GameViewModel } from "../models/GameViewModel"

export const GamesRepository = {
    async GetGames (filter: any) {
        return await client.db("GamePedia").collection("games").find(filter).toArray()
    },

    async GetGameByID (id: number) {
        return await client.db("GamePedia").collection("games").find({id: id}).toArray()
    },

    async DeleteGame (id: number): Promise<Boolean> {
        let result = await client.db("GamePedia").collection("games").deleteOne({id: id})
        return result.deletedCount === 1    
    },

    async CreateNewGame (CreatedGame: any) : Promise<GameViewModel> {
        await client.db("GamePedia").collection("games").insertOne(CreatedGame)
        return CreatedGame
    },

    async UpdateGame (id: number, data: any) {
        let result = await client.db("GamePedia").collection("games").updateOne({id: id}, {$set : data})
        return result.modifiedCount === 1
    }
}