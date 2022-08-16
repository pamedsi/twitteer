import { validate } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { decode } from "https://deno.land/x/djwt@v2.7/mod.ts";

export const JWTValidator = async function (ctx, next) {
    const {headers} = ctx.request
    console.log('oieee')
    try {
        const jwt = headers.get('Authorization').split(' ')[1]

        if (!jwt) {
            ctx.response.status = 401
            ctx.response.body = {message: "JWT inválido!"}
        }

        if (!jwt) {
            ctx.response.status = 401
            ctx.response.body = {message: "JWT inválido!"}
            return
        }

        if (validate(decode(jwt))) {
            await next()
            return
        }

        ctx.response.status = 401
        ctx.response.body = {message: "JWT inválido!"}
    }

    catch (error) {
        ctx.response.status = 401
        ctx.response.body = {message: "JWT inválido!"}
        console.log(error)
    }


}
