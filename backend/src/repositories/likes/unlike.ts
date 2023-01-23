import { client } from "../../database/database.ts";

export const unlike  = async function(tweetLiked: string, loggedUser: string) {
  const query = `DELETE FROM public.likes WHERE tweet_liked_id = '${tweetLiked}' and user_who_liked = '${loggedUser}';`
  await client.queryObject(query)
  console.log(`\nRemoção no banco de dados feita.\nQuery:\n${query}`)
}