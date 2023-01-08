// deno-lint-ignore-file
import { validate, decode } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { ctxModel } from "../models/context.ts"

export const sizeof = function (object: {}) {
  let length = 0

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) length++
  }

  return length
}

export const homePage = function (ctx: ctxModel){
  ctx.response.body = {message: "Bem vindo!"}
}

export const isLogged = async function (ctx: ctxModel, next: any) {
  try {
    const jwt = await ctx.cookies.get('jwt')
    if (!jwt) {
      ctx.response.redirect('/login')
      return
    }
    if (validate(decode(jwt))) await next()
    else ctx.response.redirect('/login')
  } catch (error) {
    console.log("Não foi possível efetuar logout.\n", error)
    ctx.response.body = {message: "Não foi possível efetuar logout."}
  }

}