import { param, query, body, validationResult } from "express-validator";


export const queryTitleValidatorMiddleware = query('title').trim().isLength({min: 3, max: 15}).withMessage('Title should be from 3 to 15 letters. Enter another title or dont use Title in your search.') 
export const queryGenreValidatorMiddleware = query('genre').trim().isLength({min: 3, max: 15}).withMessage('Genre should be from 3 to 15 letters. Enter another title or dont use Title in your search.') 
export const paramsIdValidatorMiddleware = param('id').trim().isNumeric().withMessage('Incorrect ID.')
export const bodyTitleValidatorMiddleware = body('title').trim().isLength({min: 3, max: 15}).withMessage('Title should be from 3 to 15 letters.')
export const bodyGenreValidatorMiddleware = body('genre').trim().isLength({min: 3, max: 15}).withMessage('Genre should be from 3 to 15 letters.')
