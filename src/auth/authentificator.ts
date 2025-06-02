import { client} from "../db/db"
import { NextFunction } from "express"

export async function AuthentificateGameAdmin (codedInfo: string) {
    let base64 = codedInfo.trim().replace('Basic', '')
    let encodedData = new Buffer(base64, 'base64')
    let [ login, password] = encodedData.toString().split(':')
    let account = await client.db("GamePedia").collection("admins").findOne({login: login})
    if (account && password === account.password)
    return true
    else false
}

export const BasicAuthentificator = async (req: any, res: any, next: NextFunction) => {
    
    if (!req.headers.authorization) {
    res.set('WWW-Authenticate', 'Basic');
    return res.status(401).send('Unauthorized');
    } else { 
        let isAuthenticated = await AuthentificateGameAdmin(req.headers.authorization)
        if (isAuthenticated) {
        next()} 
        else {
            res.set('WWW-Authenticate', 'Basic');
            return res.status(401).send('Wrong login or password');
        }      
    }
}