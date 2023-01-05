// Para o controlador de usuários

import { client } from "../database/database.ts";
import { User } from "../models/user.ts";
import { IUserRequest } from "../services/createUserService.ts";

export const phoneValid = function (phone: string) {
  return Boolean(phone.match(/^\+[1-9][0-9]\d{1,14}$/))
}

// const validProperty =  function (property: string) {
//   const properties = ['user_id', 'full_name', 'birth_date', 'city', 'phone', 'email', 'username', 'social_name', 'created_at','bio', 'url_on_bio', 'profile_pic', 'cover_pic', ]
//   return properties.some(key => key === property)
// }

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

// export const stringForUpdateUser = async function (user: User) {
//   let [changes, first] = ['', true]

//   for (const key in user) {
//       if (key === 'password' && first) {
//           changes += `"${key}"='${await hash(user[key])}'`
//       }
//       else if (key === 'password') {
//           changes += `,"${key}"='${await hash(user[key])}'`
//       }
//       else if (first && validProperty(key)) {
//           changes += `${key}='${user[key as keyof User]}'`
//       }
//       else if (validProperty(key)){
//           changes += `,${key}='${user[key as keyof User]}'`
//       }
//       first = false
//   }

//   return changes
// }

// export const userExist = async function (login: 'username' | 'email' | 'phone') {
//   try {
//       let result
//       if (valid(login)) {
//           result = await client.queryObject(`SELECT * FROM public.users WHERE email='${login}' LIMIT 1;`)
//        }
//        else if (phoneValid(login)) {
//           result = await client.queryObject(`SELECT * FROM public.users WHERE phone='${login}' LIMIT 1;`)
//        }
//        else {
//           result = await client.queryObject(`SELECT * FROM public.users WHERE username='${login}' LIMIT 1;`)
//        }

//       if(result.rows[0]) return result.rows[0]
//       return null

//   } catch (error) {
//       console.log("Não foi possível buscar o usuário.\n", error)
//   }
// }

interface querySearch {
  dataFound: 'phone' | 'email' | 'username'
  userFound: User
}

export const userExists = async function (user: IUserRequest)  {
  let phone: string | null
  if (!user.phone) phone = null
  else phone = user.phone

  const {email, username} = user
  const result = (await client.queryObject(`SELECT * FROM public.users WHERE email='${email}' OR phone='${phone}' OR username='${username}' LIMIT 1;`)).rows as User[]

  if (result.length !== 0) {
    if(result[0].phone == phone && phone !== null) return {dataFound: 'phone', userFound: result[0]} as querySearch
    else if (result[0].email === email) return {dataFound: 'email', userFound: result[0]} as querySearch
    else return {dataFound: 'username', userFound: result[0]} as querySearch
  }
  
  return false
}

export const insertNewUser = async function (user: User) {
  const [keys, values] = stringForCreateUser(user)
  const query = `INSERT INTO public.users (${keys}) VALUES (${values});`
  await client.queryObject(query)
  console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}