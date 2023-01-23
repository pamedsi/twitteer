import { client } from "../../database/database.ts";
import { Tweet } from "../../models/tweet.ts";

export const tweetExists = async function (tweet_id: string) {
  const queryForFindingTweet = `SELECT * FROM public.tweets WHERE tweet_id = '${tweet_id}' and deleted = false LIMIT 1;`
  const {rows: tweetFound} = await client.queryObject<Tweet>(queryForFindingTweet)
  if (tweetFound.length) return tweetFound[0]
  return false
}
