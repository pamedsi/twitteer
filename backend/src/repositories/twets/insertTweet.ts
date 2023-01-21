import { client } from "../../database/database.ts";
import { Tweet } from "../../models/tweet.ts";

export const insertNewTweet = async function ({tweet_id, content, created_at, tweet_owner_id}: Tweet) {
  const query = `INSERT INTO public.tweets (tweet_id, content, created_at, tweet_owner_id) VALUES ('${tweet_id}', '${content}', '${created_at}', '${tweet_owner_id}');`
  await client.queryObject(query)
  console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}