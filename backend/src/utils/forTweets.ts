import { client } from '../database/database.ts';
import { Post, postModel } from "../models/post.ts";
import { Comment, commentModel } from './../models/comment.ts';

export const insertNewTweet = async function ({post_id, content, created_at, post_owner_id}: Post) {
    const query = `INSERT INTO public.posts (post_id, content, created_at, post_owner_id) VALUES ('${post_id}', '${content}', '${created_at}', '${post_owner_id}');`
    await client.queryObject(query)
    console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}

export const insertNewComment  = async function({comment_id, comment_owner_id, commented_post_id, content, created_at}: Comment) {
    const query = `INSERT INTO public.comments (comment_id, comment_owner_id, commented_post_id, content, created_at) VALUES ('${comment_id}', '${comment_owner_id}', '${commented_post_id}', '${content.trim()}', '${created_at}');`
    await client.queryObject(query)
    console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}

export const sameDateTweet = async function (user_id: string, content: string){
    content = content.trim()
    const queryForTweets = `SELECT * FROM public.posts where cast (created_at as DATE) = current_date and post_owner_id = '${user_id}' and "content" = '${content}' LIMIT 1;`
    const queryForComments = `SELECT * FROM public.comments where cast (created_at as DATE) = current_date and comment_owner_id = '${user_id}' and "content" = '${content}' LIMIT 1;`

    const {rows: tweets} = (await client.queryObject <postModel> (queryForTweets))
    const {rows: comments} = (await client.queryObject <commentModel> (queryForComments))

    return tweets.length || comments.length
}