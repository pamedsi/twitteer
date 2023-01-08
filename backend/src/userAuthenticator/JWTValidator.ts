// deno-lint-ignore-file no-explicit-any
import { validate, decode } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { ctxModel } from '../models/context.ts';

export const JWTValidator = async function (ctx: ctxModel, next: any) {
    // const {headers} = ctx.request
    try {
        // let jwt = headers.get('Authorization')
        // console.log(ctx.cookies)
        // console.log(ctx.request.headers)
        // if (jwt) jwt = jwt.split(' ')[1]
        const jwt = await ctx.cookies.get('jwt')

        if (!jwt) {
            ctx.response.status = 401
            ctx.response.body = {message: "JWT inválido!"}
            return
        }

        if (validate(decode(jwt))) {
            ctx.state.user = await decode(jwt)[1]
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
