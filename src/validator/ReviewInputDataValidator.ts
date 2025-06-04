import { body } from "express-validator";

export const bodyRatingReviewValidatorMiddleware = body('rating').trim().isLength({min: 3, max: 15}).withMessage('Login should be from 3 to 15 letters.')
export const bodyTextReviewValidatorMiddleware = body('text').trim().isLength({min: 3, max: 15}).withMessage('Password should be from 3 to 15 letters.')
