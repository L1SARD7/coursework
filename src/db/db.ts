import { MongoClient } from "mongodb"
import { GameViewModel } from "../models/GameViewModel"
import { UserViewModule } from "../models/UserViewModule"


export type DB_Type = {
    games: GameViewModel[]
    admins: UserViewModule
}

const MongoURI = process.env.MongoURI || "mongodb://0.0.0.0:27017"

export const client = new MongoClient(MongoURI)

export async function runDB() {
    try {
        await client.connect();
        await client.db('GamePedia').command({ping: 1})
        console.log('Conecting to Mongo DataBase completed')
    }
    catch {
        await client.close()
    }
}