import { Router } from "express"
import { RequestWithBody } from "../models/RequestTypes"
import { LoginInputModel } from "../models/LoginInputModel"
import { bodyLoginValidatorMiddleware, bodyPasswordValidatorMiddleware } from "../validator/LoginAndRegInputDataValidator"
import { validationResult } from "express-validator"
import { HTTP_CODES } from "../utility"
import { UserRepository } from "../repositories/user-db-repository"

export const ProfileRouter =  Router({})



ProfileRouter.get('/', 
    (req, res) => {
    // @ts-ignore
        if (req.session.user) {
        res.render('profile')
    }
    else res.redirect('/login')
})

ProfileRouter.post('/logout',
    async (req, res) => {
        req.session.destroy(() => {
            res.redirect('/')
        })
    }
)