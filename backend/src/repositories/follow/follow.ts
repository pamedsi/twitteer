import { client } from "../../database/database.ts";

export const follow = async function (follower_id: string, followed_id: string) {
  const query = `INSERT INTO public.followers (follow_id, followed_id, follower_id, created_at) VALUES ('${crypto.randomUUID()}', '${followed_id}'::uuid,'${follower_id}'::uuid, '${new Date().toISOString()}');`
  await client.queryObject(query)
  console.log("\nInserção no banco de dados feita!\nQuery:\n", query)
}
