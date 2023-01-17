// deno-lint-ignore-file
import { validate, decode } from "https://deno.land/x/djwt@v2.7/mod.ts";
import isEmail from "https://deno.land/x/deno_validator@v0.0.5/lib/isEmail.ts";
import { isMobilePhone } from "https://deno.land/x/deno_validator@v0.0.5/mod.ts";

import { ctxModel } from "../models/context.ts"
import { querySearch } from "../models/queryResult.ts";
import { client } from "../database/database.ts"
import { User } from "../models/user.ts";


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
    console.log(error)
    ctx.response.body = {message: "Ocorreu um erro."}
  }

}

export const userExists = async function (login: string, user_id?: string)  {

  if(user_id) {
    const {rows: result} = (await client.queryObject<User>(`SELECT * FROM public.users WHERE user_id ='${user_id}' LIMIT 1;`))

    if (result.length) return {dataFound: 'user_id', userFound: result[0]} as querySearch
    return false
  }

  let kindOfLogin: string

  if (isEmail(login)) kindOfLogin = 'email'
  else if (isMobilePhone(login)) kindOfLogin = 'phone'
  else kindOfLogin = 'username'

  const {rows: result} = (await client.queryObject<User>(`SELECT * FROM public.users WHERE ${kindOfLogin}='${login}' LIMIT 1;`))
  if (result.length) return {dataFound: kindOfLogin, userFound: result[0]} as querySearch

  return false
}