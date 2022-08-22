import { generateJWT } from "./JWTGenerator.js";
import { userExist } from '../api/controllers/utils/helperFunctions.js'
import { compare } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts"

export const login = async function (ctx) {
    const {login, password} = await ctx.request.body().value
    const user = await userExist(login)
    if (!user) {
        ctx.response.status = 422
        ctx.response.body = { message:  'Usuário ou senha incorretos!'}
        return
    }

    const {password: passwordHash} = user
    const passwordMatch = await compare(password, passwordHash)
    if (!passwordMatch) {
        ctx.response.status = 422
        ctx.response.body = { message:  'Usuário ou senha incorretos!'}
        return
    }

    const {user_id, full_name} = user

    try {
        const jwt = await generateJWT(user_id, full_name)
        ctx.response.status = 200
        ctx.response.body = { user_id, full_name, jwt }
        }

    catch (error) {
        console.log('Não foi possível logar', error)
        ctx.response.status = 500
        ctx.response.body = {message: 'Internal server error'}
    }
}
