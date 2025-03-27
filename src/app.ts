import express, { NextFunction, Response, Request } from 'express';
import { GamesRouter } from './routers/game-router';
export const app = express()

let BodyJsonMiddleware = express.json()
app.use(BodyJsonMiddleware)

app.use('/games', GamesRouter)





