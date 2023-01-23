import { client } from "../../database/database.ts";
import { tweetModel } from "../../models/tweet.ts";


export const sameDateTweet = async function (user_id: string, content: string){
    content = content.trim()
    const queryForTweets = `SELECT * FROM public.tweets where cast (created_at as DATE) = current_date and tweet_owner_id = '${user_id}' and "content" = '${content}' LIMIT 1;`

    const {rows: tweets} = (await client.queryObject <tweetModel> (queryForTweets))

    return Boolean(tweets.length)
}