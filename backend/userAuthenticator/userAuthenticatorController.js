import { generateJWT } from './userAuthenticator.js'

export const login = async function (ctx) {
    const {email, password} = await ctx.request.body().value
    const loginData = await generateJWT(email, password)

    try {
        if (loginData) {
            const {jwt, user_id, name} = loginData
            ctx.response.status = 200
            ctx.response.body = { user_id: user_id, name: name, jwt: jwt }
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
