import { param, query, body, validationResult } from "express-validator";


export const queryTitleValidatorMiddleware = query('title').trim().isLength({min: 3, max: 15}).withMessage('Title should be from 3 to 15 letters. Enter another title or dont use Title in your search.') 
export const queryGenreValidatorMiddleware = query('genre').trim().isLength({min: 3, max: 15}).withMessage('Genre should be from 3 to 15 letters. Enter another title or dont use Title in your search.') 

export const paramsIdValidatorMiddleware = param('id').trim().isNumeric().withMessage('Incorrect ID.')

export const gameDataInputValidatorMiddleware = [
    body('title').trim().isLength({min: 3}).withMessage('Title should be from letters.'),
    body('genre').trim().isLength({min: 3, max: 15}).withMessage('Genre should be from 3 to 15 letters.'),
    body('release_year').isInt({ min: 1970, max: 2028 }).withMessage('Incorrect release year.'),
    body('developer').trim().isLength({min: 3, max: 40}).withMessage('Name of developers should be from 3 to 40 letters.'),
    body('description').trim().isLength({max: 2000}).withMessage('Description should be max 2000 letters.'),
    body('imageUrl').isLength({max: 300}).withMessage('Image URL should be real'),
    body('trailerYoutubeId').isLength({min: 5, max: 20}).withMessage('Trailer Youtube code should be real')
]


// export const bodyTitleValidatorMiddleware = body('title').trim().isLength({min: 3, max: 15}).withMessage('Title should be from 3 to 15 letters.')
// export const bodyGenreValidatorMiddleware = body('genre').trim().isLength({min: 3, max: 15}).withMessage('Genre should be from 3 to 15 letters.')
// export const bodyReleaseYearValidatorMiddleware = body('release_year').isInt({ min: 1970, max: 2028 }).withMessage('Incorrect release year.')
// export const bodyDevelopersValidatorMiddleware = body('developer').trim().isLength({min: 3, max: 40}).withMessage('Name of developers should be from 3 to 40 letters.')
// export const bodyDescriptionYearValidatorMiddleware = body('description').trim().isLength({max: 2000}).withMessage('Description should be max 2000 letters.')
// export const bodyimageURLValidatorMiddleware = body('imageUrl').isURL().withMessage('Image URL should be real')
// export const bodytrailerURLValidatorMiddleware = body('trailerURL').isURL().withMessage('Trailer URL should be real')
