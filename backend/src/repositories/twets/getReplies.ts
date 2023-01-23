import { client } from "../../database/database.ts";
import { tweetModel } from "../../models/tweet.ts";
import { getLikes } from "./getTweetLikes.ts";

export const getReplies = async function (tweet_id: string) {
  const queryForFindingReplies = `SELECT * FROM public.tweets WHERE replies_to = '${tweet_id}' and deleted = false;`
  const {rows: tweetsFound} = await client.queryObject<tweetModel>(queryForFindingReplies)
  
  for (let index = 0; index < tweetsFound.length; index++) {
    const likes = await getLikes(tweetsFound[index].tweet_id)
    tweetsFound[index].likes = likes.length

    const findingReplies = `SELECT * FROM public.tweets WHERE replies_to = '${tweetsFound[index].tweet_id}' and deleted = false;`
    const {rows: repliesFound} = await client.queryObject<tweetModel>(findingReplies)
    tweetsFound[index].replies = repliesFound
  } 

  return tweetsFound
}