import { client } from "../../database/database.ts";
import { User } from "../../models/user.ts";
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

export const insertNewUser = async function (user: User) {
  const [keys, values] = stringForCreateUser(user)
  const query = `INSERT INTO public.users (${keys}) VALUES (${values});`
  await client.queryObject(query)
  console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}
