import { Router } from "express"
import { RequestWithParams, RequestWithParamsAndBody } from "../models/RequestTypes"
import { validationResult } from "express-validator"
import { HTTP_CODES } from "../utility"
import { bodyRatingReviewValidatorMiddleware, bodyTextReviewValidatorMiddleware } from "../validator/ReviewInputDataValidator"
import { ReviewInputModel } from "../models/ReviewInputModel"
import { reviewService } from "../business/review-business-layer"
import { URIParamsId } from "../models/URIParamsId"
import { ReviewRepository } from "../repositories/review-db-repository"
import { paramsIdValidatorMiddleware } from "../validator/GamesInputDataValidator"

export const ReviewRouter =  Router({})



ReviewRouter.get('/',
    async (req, res) => {
        if (((!req.query.gameId) && (!req.query.authorId))) {
                res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
        } else {
            let SortedReviews = await reviewService.GetReviews(Number(req.query.gameId), Number(req.query.authorId))
            res.json(SortedReviews).status(HTTP_CODES.OK_200)
        }
    }
)

ReviewRouter.post('/:id',
    bodyRatingReviewValidatorMiddleware,
    bodyTextReviewValidatorMiddleware,
    async (req: RequestWithParamsAndBody<URIParamsId, ReviewInputModel>, res) => {
    const validation = validationResult(req)
    if (validation.isEmpty()) {
        // @ts-ignore
        const isAlreadyCreated = await ReviewRepository.FindReviewByUserId(Number(req.session.user.id))
        if (isAlreadyCreated) {
            res.send('В вас вже є залишений відгук цій грі.')
        }
        // @ts-ignore
        if (req.session.user) {
            // @ts-ignore
            const CreatedReview = await reviewService.CreateNewReview(req.body.rating, req.body.text, +req.params.id, req.session.user.id, req.session.user.username)
            if (CreatedReview) {
                res.status(HTTP_CODES.Created_201).redirect(`/games/${req.params.id}`)
            } else {
                res.status(HTTP_CODES.BAD_REQUEST_400).redirect(`/`)
            }
        }
        else {
            res.send('Для того, щоб залишити відгук, необхідно бути авторизованим.')
        }
    }
    else {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
})

ReviewRouter.delete('/:id',
    paramsIdValidatorMiddleware,
    async (req: RequestWithParams<URIParamsId>, res) => {
    const validation = validationResult(req)
    if (!validation.isEmpty()) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
    let isDeleted = await reviewService.DeleteReview(+req.params.id)
    if (isDeleted) {
        res.status(HTTP_CODES.Deleted_204)
    }
    else {
        res.status(HTTP_CODES.BAD_REQUEST_400)
    }
})

ReviewRouter.put('/:id',
    bodyRatingReviewValidatorMiddleware,
    bodyTextReviewValidatorMiddleware,
    async (req: RequestWithParamsAndBody<URIParamsId, ReviewInputModel>, res) => {
    const validation = validationResult(req)
    if (validation.isEmpty()) {
        // @ts-ignore
        if (req.session.user) {
            // @ts-ignore
            const changedReview = await reviewService.ChangeReview(+req.params.id, req.body.rating, req.body.text, +req.params.id, req.session.user.id, req.session.user.username)
            if (changedReview) {
                res.status(HTTP_CODES.Created_201)
            } else {
                res.status(HTTP_CODES.BAD_REQUEST_400)
            }
        }
        else {
            res.send('Для того, щоб залишити відгук, необхідно бути авторизованим.')
        }
    }
    else {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
})