import { client} from "../db/db"

export async function AuthentificateGameAdmin (codedInfo: string) {
    let base64 = codedInfo.trim().replace('Basic', '')
    let encodedData = new Buffer(base64, 'base64')
    let [ login, password] = encodedData.toString().split(':')
    let account = await client.db("GamePedia").collection("admins").findOne({login: login})
    if (account && password === account.password)
    return true
    else false
}