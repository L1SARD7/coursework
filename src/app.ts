import express, { NextFunction, Response, Request } from 'express';
import { GamesRouter } from './routers/game-router';
import { LoginRouter } from './routers/login-router';
import session from 'express-session';
import { RegistrationRouter } from './routers/registration-router';

export const app = express()

let BodyJsonMiddleware = express.json()
app.use(BodyJsonMiddleware)

app.set('view engine', 'ejs')
app.use(express.static('front'))

app.use(session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
}));

app.use((req, res, next) => {
    // @ts-ignore
    res.locals.user = req.session.user || null;
    next();
});
app.use(express.urlencoded({ extended: true }));


app.use('/games', GamesRouter)

app.use('/login', LoginRouter)

app.use('/registration', RegistrationRouter)

app.use('/', (req, res) => {
    res.render('main')
})



