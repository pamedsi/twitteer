import { compare } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts"
import { create } from "https://deno.land/x/djwt@v2.7/mod.ts"
import { jwtKey }  from './../api/env.ts';
import { userExist } from './../api/controllers/user.controller.js';

async function generateJWT(login, password) {

    const user = await userExist(login)
    if (!user) return null
    const {password: passwordHash} = user
    const passwordMatch = await compare(password, passwordHash)
    if (!passwordMatch) return null

    const jwt = await create(
    {
        alg: "HS512",
        typ: "JWT"
    },
    {
        user_id: user.user_id,
        name: user.full_name,
    }, jwtKey)

    return {
        jwt,
        user_id: user.user_id,
        name: user.full_name
    }

}

export const login = async function (ctx) {
    const {login, password} = await ctx.request.body().value
    const loginData = await generateJWT(login, password)

    try {
        if (loginData) {
            const {jwt, user_id, name} = loginData
            ctx.response.status = 200
            ctx.response.body = { user_id, name, jwt }
        }
        else {
            ctx.response.status = 401
            ctx.response.body = {message: 'Email ou senha incorretos'}
        }

    } catch (error) {
        console.log('Não foi possível logar', error)
        ctx.response.status = 500
        ctx.response.body = {message: 'Internal server error'}
    }
}
