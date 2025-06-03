import { UserRepository } from "../repositories/user-db-repository"

export const UserService = {
    async CreateNewUser (login: string, email: string, password: string) : Promise<any> {
            let newUser = {
            id: +(new Date()),
            login: login,
            email: email,
            password: password,
            isAdmin: false
            }
        await UserRepository.CreateNewUser(newUser)
        let CreatedUser = await UserRepository.FindUserByLogin(newUser.login)
        return CreatedUser
    }
}