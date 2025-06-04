import { Router } from "express"
import { RequestWithBody } from "../models/RequestTypes"
import { LoginInputModel } from "../models/LoginInputModel"
import { bodyLoginValidatorMiddleware, bodyPasswordValidatorMiddleware } from "../validator/LoginAndRegInputDataValidator"
import { validationResult } from "express-validator"
import { HTTP_CODES } from "../utility"
import { UserRepository } from "../repositories/user-db-repository"

export const LoginRouter =  Router({})



LoginRouter.get('/', 
    (req, res) => {
    res.render('login')
})

LoginRouter.post('/',
    bodyLoginValidatorMiddleware,
    bodyPasswordValidatorMiddleware,
    async (req: RequestWithBody<LoginInputModel>, res) => {
    const validation = validationResult(req)
    if (validation.isEmpty()) {
        const user = await UserRepository.FindUserByLogin(req.body.login)
        if (user && req.body.password === user.password) {
                // @ts-ignore
                req.session.user = { id: user.id, username: user.login, isAdmin: user.isAdmin };
                res.redirect('/profile');
            } else {
                res.status(HTTP_CODES.BAD_REQUEST_400).send('Неправильний логін або пароль')
            }
        }
    else {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
})