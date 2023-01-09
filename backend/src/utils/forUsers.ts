import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import isEmail from 'https://deno.land/x/deno_validator/lib/isEmail.ts';
import { isMobilePhone } from "https://deno.land/x/deno_validator@v0.0.5/mod.ts";
import { client } from "../database/database.ts";
import { querySearch } from "../models/queryResult.ts";
import { User } from "../models/user.ts";
import { IUserRequest } from "../services/users/createUserService.ts";
import { sizeof } from "./helperFunctions.ts";


export const stringForCreateUser = function (user: User) {

  let [keys, values, first] = ['', '', true]

  for (const key in user) {
      if (key === "password" && first) {
          keys += `"${key}"`
          values += `'${user[key]}'`
      }

      else if (first && !user[key as keyof User]) continue
      // Caso o valor da propriedade seja undefined, não irá para a string da query

      else if (first) {
          keys += `${key}`
          values += `'${user[key as keyof User]}'`
        }

      else if (!user[key as keyof User]) continue

      else if (key === "password") {
          keys += `, "${key}"`
          values += `, '${user[key]}'`
      }

      else if (user[key as keyof User]) {
          keys += `, ${key}`
          values += `, '${user[key as keyof User]}'`
      }
      first = false
  }

  return [keys, values]
}

export const stringForUpdateUser = async function (user: IUserRequest) {

  const validProperty = function (key: string) {
    // Essas são as propriedades do usuário que podem ser alteradas por ele.
    const properties = ['full_name', 'birth_date', 'city', 'phone', 'email', 'username', 'social_name','bio', 'url_on_bio', 'profile_pic', 'cover_pic']

    return properties.some(property => property === key)
  }

  let [changes, first] = ['', true]

  for (const key in user) {
      if (key === 'password' && first) {
          changes += `"${key}"='${await hash(user[key])}'`
      }
      else if (key === 'password') {
          changes += `,"${key}"='${await hash(user[key])}'`
      }
      else if (first && validProperty(key)) {
          changes += `${key}='${user[key as keyof IUserRequest]}'`
      }
      else if (validProperty(key)){
          changes += `,${key}='${user[key as keyof IUserRequest]}'`
      }
      first = false
  }

  return changes
}

export const userExists = async function (login: string)  {

  let kindOfLogin: string

  if (isEmail(login)) kindOfLogin = 'email'
  else if (isMobilePhone(login)) kindOfLogin = 'phone'
  else kindOfLogin = 'username'

  const result = (await client.queryObject(`SELECT * FROM public.users WHERE ${kindOfLogin}='${login}' LIMIT 1;`)).rows as User[]
  if (result.length) return {dataFound: kindOfLogin, userFound: result[0]} as querySearch

  return false
}

export const availableData = async function (user: IUserRequest){
  interface availability {
    available: boolean,
    data?: 'email' | 'username' | 'phone'
  }
  
  const {email, username, phone} = user;
  const logins = [email, username, phone]
  let exists: false | querySearch

  for (let index = 0; index < logins.length; index++) {
    const login = logins[index];
    exists = await userExists(String(login))
    if (!exists) continue
    return {available: false, data: exists.dataFound} as availability
  }

  return {available: true} as availability
}

export const insertNewUser = async function (user: User) {
  const [keys, values] = stringForCreateUser(user)
  const query = `INSERT INTO public.users (${keys}) VALUES (${values});`
  await client.queryObject(query)
  console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}

export const updateUserQuery = async function (user: IUserRequest, user_id: string) {
  const changes = await stringForUpdateUser(user)
  const query = `UPDATE public.users SET ${changes} WHERE user_id='${user_id}'`
  await client.queryObject(query)
  console.log(`\nAtualização feita.\nQuery:\n${query}`)
}

export const dataAlreadyRegistered = async function (user_id: string, updates: IUserRequest){
  interface repetiions {
    sameData: User
    newData: User
  }

  const query = `SELECT * FROM public.users WHERE user_id = '${user_id}' LIMIT 1;`
  const oldData = (await client.queryObject<User>(query)).rows[0]
  const [sameData, newData]  = [{} as User, {} as User]
  
    for (const key1 in oldData) {
      if (Object.prototype.hasOwnProperty.call(oldData, key1)) {
        for (const key2 in updates) {
          if (Object.prototype.hasOwnProperty.call(updates, key2)) {
            if (key1 === key2 && oldData[key1 as keyof User] === updates[key2 as keyof IUserRequest]) sameData[key1] = oldData[key1 as keyof User]
            else newData[key2] = updates[key2 as keyof IUserRequest]
          }
        }
      }
    }
  
    return {sameData, newData} as repetiions
}

export const errorMessageForSameData = function (object: User) {
  let keys = ''
  
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      let first = true
      if (first) {
        if (sizeof(object) === 1) return key
        keys += `${key}, `
      }
      else keys += `, ${keys}`
      first = false
    }
  }

  return keys
}

export const validateDate = function (birthDate: string | Date) {
  interface validity {
    valid: boolean,
    error?: string
  }
  
  const [date, month, year] = String(birthDate).split('/')
  birthDate = new Date(`${year}-${month}-${date}`)
  if (String(birthDate) === 'Invalid Date') return {valid: false, error: 'Data inválida!'} as validity
    // Vi a conversão de milissegundos para anos no site: https://www.kylesconverter.com/time/years-to-milliseconds
  const age = (Number(new Date()) - Number(birthDate)) / 31556952000
  if (age < 13) return {valid: false, error: 'Idade insuficiente!'}
  return {valid: true}
}