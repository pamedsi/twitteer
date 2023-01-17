import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import { validProperty } from "./validators.ts";
import {IUpdateUserRequest} from "../../services/users/updateUserService.ts"
import { client } from "../../database/database.ts";
import { User } from "../../models/user.ts";

export const stringForUpdateUser = async function (user: IUpdateUserRequest) {

  let [changes, first] = ['', true]

  for (const key in user) {
      if (key === 'password' && first) {
          changes += `"${key}" = '${await hash(user[key]!)}'`
      }
      else if (key === 'password') {
          changes += `, "${key}" = '${await hash(user[key]!)}'`
      }
      else if (first && validProperty(key)) {
          changes += `${key} = '${user[key as keyof IUpdateUserRequest]}'`
      }
      else if (validProperty(key)){
          changes += `, ${key} = '${user[key as keyof IUpdateUserRequest]}'`
      }
      if (changes !== '') first = false
  }

  return changes
}

// Essa função checa se os dados que o usuário está tentando atualizar já estão cadastrados.
export const dataAlreadyRegistered = async function (user_id: string, updates: IUpdateUserRequest){
    interface repetiions {
      sameData: IUpdateUserRequest
      newData: IUpdateUserRequest
      created_at: Date | string
    }
  
    const query = `SELECT * FROM public.users WHERE user_id = '${user_id}' LIMIT 1;`
    const oldData = (await client.queryObject<User>(query)).rows[0]
    const [sameData, newData]  = [{} as IUpdateUserRequest, {} as IUpdateUserRequest]
      
      for (const key1 in oldData) {
        if (Object.prototype.hasOwnProperty.call(oldData, key1)) {
          for (const key2 in updates) {
            if (Object.prototype.hasOwnProperty.call(updates, key2)) {
              if (key1 === key2 && oldData[key1 as keyof IUpdateUserRequest] === updates[key2 as keyof IUpdateUserRequest] && validProperty(key1)) sameData[key1 as keyof IUpdateUserRequest] = String(oldData[key1 as keyof IUpdateUserRequest])
              else if (validProperty(key1) && key1 === key2) newData[key2 as keyof IUpdateUserRequest] = String(updates[key2 as keyof IUpdateUserRequest])
            }
          }
        }
      }
  return {sameData, newData, created_at: oldData.created_at} as repetiions
}

export const updateUserQuery = async function (user: IUpdateUserRequest, user_id: string) {
    const changes = await stringForUpdateUser(user)
    const query = `UPDATE public.users SET ${changes} WHERE user_id = '${user_id}'`
    await client.queryObject(query)
    console.log(`\nAtualização feita.\nQuery:\n${query}`)
}

export const errorMessageForSameData = function (object: IUpdateUserRequest) {
  let keys = ''
  
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      let first = true
      if (first) {
        if (Object.keys(object).length === 1) return key
        keys += `${key}, `
      }
      else keys += `, ${keys}`
      first = false
    }
  }

  return keys
}