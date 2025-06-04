import { Router } from "express"
import { RequestWithParamsAndBody } from "../models/RequestTypes"
import { validationResult } from "express-validator"
import { HTTP_CODES } from "../utility"
import { bodyRatingReviewValidatorMiddleware, bodyTextReviewValidatorMiddleware } from "../validator/ReviewInputDataValidator"
import { ReviewInputModel } from "../models/ReviewInputModel"
import { reviewService } from "../business/review-business-layer"
import { URIParamsId } from "../models/URIParamsId"

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