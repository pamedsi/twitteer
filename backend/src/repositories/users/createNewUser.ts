import { client } from "../../database/database.ts";
import { User } from "../../models/user.ts";
import { stringForCreateUser } from "../../utils/forUsers/forCreatingUsers.ts";

export const insertNewUser = async function (user: User) {
  const [keys, values] = stringForCreateUser(user)
  const query = `INSERT INTO public.users (${keys}) VALUES (${values});`
  await client.queryObject(query)
  console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}
