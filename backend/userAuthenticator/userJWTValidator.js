import { validate } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { decode } from "https://deno.land/x/djwt@v2.7/mod.ts";

export const JWTValidator = async function (ctx, next) {
    const {headers} = ctx.request
    const authorization = headers.get('Authorization')
    if (!authorization) {
        ctx.response.status = 401
        ctx.response.body = {message: "JWT inválido!"}
    }
    const jwt = authorization.split(' ')[1]

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
