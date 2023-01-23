import { client } from "../../database/database.ts";

export const reactivateUser = async function (user_id: string) {
  const query = `UPDATE public.users SET active = true WHERE user_id = '${user_id}';`
  await client.queryObject(query)
  console.log(`\nReativação feita com sucesso\nQuery:\n`, query)
}