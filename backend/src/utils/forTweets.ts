import { client } from '../database/database.ts';
import { Tweet, tweetModel } from "../models/tweet.ts";
import { Comment, commentModel } from './../models/comment.ts';

export const insertNewTweet = async function ({tweet_id, content, created_at, tweet_owner_id}: Tweet) {
    const query = `INSERT INTO public.tweets (tweet_id, content, created_at, tweet_owner_id) VALUES ('${tweet_id}', '${content}', '${created_at}', '${tweet_owner_id}');`
    await client.queryObject(query)
    console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}

export const insertNewComment  = async function({comment_id, comment_owner_id, commented_tweet_id, content, created_at}: Comment) {
    const query = `INSERT INTO public.comments (comment_id, comment_owner_id, commented_tweet_id, content, created_at) VALUES ('${comment_id}', '${comment_owner_id}', '${commented_tweet_id}', '${content}', '${created_at}');`
    await client.queryObject(query)
    console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}

export const sameDateTweet = async function (user_id: string, content: string){
    content = content.trim()
    const queryForTweets = `SELECT * FROM public.tweets where cast (created_at as DATE) = current_date and tweet_owner_id = '${user_id}' and "content" = '${content}' LIMIT 1;`
    const queryForComments = `SELECT * FROM public.comments where cast (created_at as DATE) = current_date and comment_owner_id = '${user_id}' and "content" = '${content}' LIMIT 1;`

    const {rows: tweets} = (await client.queryObject <tweetModel> (queryForTweets))
    const {rows: comments} = (await client.queryObject <commentModel> (queryForComments))

    return Boolean(tweets.length || comments.length)
}