import { client} from "../db/db"
import { UserViewModel } from "../models/UserViewModel"

export const UserRepository = {
    async FindUserByLogin (login: string) {
        return await client.db("GamePedia").collection("users").findOne({login: login})
    },

    async CreateNewUser (newUser: UserViewModel) {
       return await client.db("GamePedia").collection("users").insertOne(newUser)
    }
}