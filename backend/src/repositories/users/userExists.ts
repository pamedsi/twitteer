import { isEmail,isMobilePhone } from "https://deno.land/x/deno_validator@v0.0.5/mod.ts";
import { client } from "../../database/database.ts";
import { querySearch } from "../../models/queryResult.ts";
import { User } from "../../models/user.ts";

export const userExists = async function (login: string, user_id?: string)  {

  if(user_id) {
    const {rows: result} = (await client.queryObject<User>(`SELECT * FROM public.users WHERE user_id ='${user_id}' LIMIT 1;`))

    if (result.length) return {dataFound: 'user_id', userFound: result[0]} as querySearch
    return false
  }

  let kindOfLogin: string

  if (isEmail(login, {})) kindOfLogin = 'email'
  else if (isMobilePhone(login, '', {})) kindOfLogin = 'phone'
  else kindOfLogin = 'username'

  const {rows: result} = (await client.queryObject<User>(`SELECT * FROM public.users WHERE ${kindOfLogin} = '${login}' LIMIT 1;`))
  if (result.length) return {dataFound: kindOfLogin, userFound: result[0]} as querySearch

  return false
}