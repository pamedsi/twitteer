import { client } from "../../database/database.ts";
import { Tweet } from "../../models/tweet.ts";

export const insertNewTweet = async function ({tweet_id, tweet_owner_id, content, created_at, location, replies_to}: Tweet) {
  
  let query: string
  if (!location && ! replies_to) query = `INSERT INTO public.tweets (tweet_id, tweet_owner_id, content, created_at) VALUES ('${tweet_id}', '${tweet_owner_id}', '${content}', '${created_at}');`

  else if (!location) query = `INSERT INTO public.tweets (tweet_id, tweet_owner_id, content, created_at, replies_to) VALUES ('${tweet_id}', '${tweet_owner_id}', '${content}', '${created_at}', '${replies_to}');`

  else if (!replies_to) query = `INSERT INTO public.tweets (tweet_id, tweet_owner_id, content, created_at, location) VALUES ('${tweet_id}', '${tweet_owner_id}', '${content}', '${created_at}', '${location}' );`

  else query = `INSERT INTO public.tweets (tweet_id, tweet_owner_id, content, created_at, location, replies_to) VALUES ('${tweet_id}', '${tweet_owner_id}', '${content}', '${created_at}', '${location}', '${replies_to}');`

  await client.queryObject(query)
  console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}