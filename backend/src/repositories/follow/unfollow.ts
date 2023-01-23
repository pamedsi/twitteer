import { client } from "../../database/database.ts";

export const unfollow = async function (unfollower_id: string, unfollowed_id: string) {
  const query = `DELETE FROM public.followers WHERE follower_id = '${unfollower_id}' and followed_id = '${unfollowed_id}';`
  await client.queryObject(query)
  console.log("\nRemoção no banco de dados feita!\nQuery:\n", query) 
}