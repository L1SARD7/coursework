import express, { NextFunction, Response, Request } from 'express';
import { GamesRouter } from './routers/game-router';
export const app = express()

let BodyJsonMiddleware = express.json()
app.use(BodyJsonMiddleware)

app.set('view engine', 'ejs')
app.use(express.static('front'))
//app.use(express.static('js'))

app.use('/games', GamesRouter)

app.use('/', (req, res) => {
    res.locals.user = null;
    res.render('main')
})



