import { Router } from "express"
import { RequestWithBody, RequestWithParamsAndBody } from "../models/RequestTypes"
import { LoginInputModel } from "../models/LoginInputModel"
import { bodyemailValidatorMiddleware, bodyLoginValidatorMiddleware, bodyPasswordValidatorMiddleware } from "../validator/LoginAndRegInputDataValidator"
import { validationResult } from "express-validator"
import { HTTP_CODES } from "../utility"
import { UserRepository } from "../repositories/user-db-repository"
import { RegistrationInputModel } from "../models/RegistrationInputModel"
import { UserService } from "../business/user-business-layer"
import { bodyRatingReviewValidatorMiddleware, bodyTextReviewValidatorMiddleware } from "../validator/ReviewInputDataValidator"
import { ReviewInputModel } from "../models/ReviewInputModel"
import { reviewService } from "../business/review-business-layer"
import { URIParamsId } from "../models/URIParamsId"

export const ReviewRouter =  Router({})



ReviewRouter.get('/',
)

ReviewRouter.get('/:id', () => {

})

ReviewRouter.post('/:id',
    bodyRatingReviewValidatorMiddleware,
    bodyTextReviewValidatorMiddleware,
    async (req: RequestWithParamsAndBody<URIParamsId, ReviewInputModel>, res) => {
    const validation = validationResult(req)
    if (validation.isEmpty()) {
        // @ts-ignore
        if (req.session.user) {
            const CreatedReview = await reviewService.CreateNewReview(req.body.rating, req.body.text, +req.params.id, req.session.user)
            res.status(HTTP_CODES.Created_201).redirect(`/games/${+req.params.id}`)
        }
        else {
            res.send('Для того, щоб залишити відгук, необхідно бути авторизованим.')
        }
    }
    else {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
    })