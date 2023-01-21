import { client } from "../../database/database.ts";
import { Like } from "../../models/like.ts";

export const insertNewLike  = async function({like_id, tweet_liked_id,user_who_liked, created_at}: Like) {
  
  const query = `INSERT INTO public.likes (like_id, tweet_liked_id, user_who_liked, created_at) VALUES ('${like_id}', '${tweet_liked_id}', '${user_who_liked}', '${created_at}');`
  console.log(query)

  await client.queryObject(query)
  console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}