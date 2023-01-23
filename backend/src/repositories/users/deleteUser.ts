import { client } from "../../database/database.ts";

export const deleteUser = async function (user_id: string) {
  const query = `UPDATE public.users SET active = false WHERE user_id = '${user_id}';`
  await client.queryObject(query)
  console.log(`Remoção feita com sucesso\nQuery:\n`, query)
}
