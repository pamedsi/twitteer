import { ctxModel } from "../models/context.ts";

export const logout = async function (ctx: ctxModel) {
  try {
    if (! await ctx.cookies.get('jwt')) ctx.response.body = {message: "Você já efetuou logout."}
    else {
    ctx.cookies.delete('jwt')
    ctx.response.body = {message: "Você efetuou logout."}
    }
  } catch (error) {
    console.log("Não foi possível efetuar logout.", error)
    ctx.response.body = {message: "Não foi possível efetuar logout."}
  }

}