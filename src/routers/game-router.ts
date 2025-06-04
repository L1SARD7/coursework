import { Router, Response, NextFunction } from "express"
import { GetGameWithQuerry, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuerry } from "../models/RequestTypes"
import { CreateGameInputModel } from "../models/CreateGameInputModel"
import { GameViewModel } from "../models/GameViewModel"
import { UpdateGameInputModel } from "../models/UpdateGameInputModel"
import { URIParamsId } from "../models/URIParamsId"
import { HTTP_CODES } from "../utility"
import { createGameDataInputValidatorMiddleware, paramsIdValidatorMiddleware, queryGenreValidatorMiddleware, queryTitleValidatorMiddleware } from "../validator/GamesInputDataValidator"
import { validationResult } from "express-validator"
import { BasicAuthentificator } from "../auth/authentificator"
import { gamesService } from "../business/games-business-layer"
import { ReviewRouter } from "./review-router"
import { reviewService } from "../business/review-business-layer"




export const GamesRouter =  Router({})



GamesRouter.get('/', 
    queryTitleValidatorMiddleware,
    queryGenreValidatorMiddleware,
    async (req: RequestWithQuerry<GetGameWithQuerry>,
    res: Response) => {

    const validation = validationResult(req)
    if (((req.query.title) && (req.query.genre)) && (!validation.isEmpty())) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
    let SortedGames = await gamesService.GetGames(req.query.title, req.query.genre)
    res.json(SortedGames).status(HTTP_CODES.OK_200)
})
GamesRouter.get('/:id',
    paramsIdValidatorMiddleware,
    async (req: RequestWithParams<URIParamsId>,
    res: Response) => {
    const validation = validationResult(req)
    if (!validation.isEmpty()) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
    const FoundGame = await gamesService.GetGameByID(+req.params.id)
    const Reviews = await reviewService.GetReviews(+req.params.id, null)
    if (FoundGame) {
        res.status(HTTP_CODES.OK_200).render('game-page', { game: FoundGame, reviews: Reviews})
    }
    else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})

GamesRouter.get('/add', 
    async (req: any, res: any) => {
        if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(HTTP_CODES.Unauthorized_401).send("Доступ лише для адміністратора");
    }
    res.render('create-new-game');
    }
)

GamesRouter.post('/add',
    createGameDataInputValidatorMiddleware,
    async (req: RequestWithBody<CreateGameInputModel>, res: Response) => {
    const validation = validationResult(req)
    if (!validation.isEmpty()) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    } else {
        const CreatedGame = await gamesService.CreateNewGame(req.body.title, 
            req.body.genre,
            req.body.release_year, 
            req.body.developer, 
            req.body.description, 
            req.body.imageURL, 
            req.body.trailerURL)

        if (CreatedGame) {
            res.status(HTTP_CODES.Created_201).redirect(`/games/${CreatedGame.id}`)
        } else {
            res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
        }

    }
})

GamesRouter.delete('/:id',
    BasicAuthentificator, 
    paramsIdValidatorMiddleware,
    async (req: RequestWithParams<URIParamsId>, res) => {
    const validation = validationResult(req)
    if (!validation.isEmpty()) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
    let isDeleted = await gamesService.DeleteGame(+req.params.id)
    if (isDeleted) {
        res.sendStatus(HTTP_CODES.Deleted_204)
    }
    else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
// GamesRouter.put('/:id',
//     BasicAuthentificator, 
//     paramsIdValidatorMiddleware,
//     bodyTitleValidatorMiddleware,
//     bodyGenreValidatorMiddleware,
//     async (req: RequestWithParamsAndBody<URIParamsId, UpdateGameInputModel>,
//     res: Response) => {
//     const validation = validationResult(req)
//     if (((req.query.title) && (req.query.genre)) && (!validation.isEmpty())) {
//         res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
//     }
//     let UpdatedGame = await gamesService.UpdateGame(+req.params.id, req.body.title, req.body.genre)
//     if (UpdatedGame) {
//         res.send(UpdatedGame).status(HTTP_CODES.OK_200)
//     } else
//     res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
// })