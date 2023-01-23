import { client } from "../../database/database.ts";
import { IUpdateUserRequest } from "../../services/users/updateUserService.ts";
import { stringForUpdateUser } from "../../utils/forUsers/forUpdatingUsers.ts";

export const updateUser = async function (user: IUpdateUserRequest, user_id: string) {
  const changes = await stringForUpdateUser(user)
  const query = `UPDATE public.users SET ${changes} WHERE user_id = '${user_id}'`
  await client.queryObject(query)
  console.log(`\nAtualização feita.\nQuery:\n${query}`)
}