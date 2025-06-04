import { body } from "express-validator";

export const bodyRatingReviewValidatorMiddleware = body('rating').trim().isNumeric().withMessage('Rating should be a number from 0 to 10.')
export const bodyTextReviewValidatorMiddleware = body('text').trim().isLength({min: 3, max: 2000}).withMessage('Text should be from 3 to 64 letters.')
