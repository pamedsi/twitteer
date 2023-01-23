import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts"

import { validProperty } from "./validators.ts"
import {IUpdateUserRequest} from "../../services/users/updateUserService.ts"

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