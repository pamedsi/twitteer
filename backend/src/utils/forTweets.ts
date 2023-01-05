import { client } from '../database/database.ts';
import { Post, postModel } from "../models/post.ts";
import { Comment, commentModel } from './../models/comment.ts';

// Para tweets e comentários

export const sameDateTweet = async function (user_id: string, content: string) {
    const tweets = (await client.queryObject(`SELECT * FROM public.posts WHERE post_owner_id='${user_id}' AND content='${content}';`)).rows as postModel[]
    const comments = (await client.queryObject(`SELECT * FROM public.comments WHERE comment_owner_id='${user_id}' AND content='${content}';`)).rows as commentModel[]
    let tweetTable, commentTable

    if (tweets.length === 0 && comments.length === 0) return false
    if (tweets.length !== 0) {
        tweetTable = tweets.some(tweet => {
            // Aqui eu separo as datas do tweet no formato timestamp.
            // Deixando um array com 3 strings: [ "YYYY", "MM", "DD" ]
            const [now, postFoundTime] = [new Date().toISOString().split('T')[0].split('-'), tweet.created_at.toISOString().split('T')[0].split('-')]
    
            let sameTime = 0
    
            now.forEach((time, index) => {
                if (time === postFoundTime[index]) sameTime++
            })
    
            return sameTime === 3
        })
    }

    if (tweetTable) return true
    if (comments.length !== 0) {
        commentTable = comments.some(comment => {
            const [now, postFoundTime] = [new Date().toISOString().split('T')[0].split('-'), comment.created_at.toISOString().split('T')[0].split('-')]
    
            let sameTime = 0
    
            now.forEach((time, index) => {
                if (time === postFoundTime[index]) sameTime++
            })
    
            return sameTime === 3
        })
    }

    return Boolean(commentTable)
}

export const insertNewTweet = async function ({post_id, content, created_at, post_owner_id}: Post) {
    const query = `INSERT INTO public.posts (post_id, content, created_at, post_owner_id) VALUES ('${post_id}', '${content}', '${created_at}', '${post_owner_id}');`
    // console.log(query)
    await client.queryObject(query)
    console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}

export const insertNewComment  = async function({comment_id, comment_owner_id, commented_post_id, content, created_at}: Comment) {
    const query = `INSERT INTO public.comments (comment_id, comment_owner_id, commented_post_id, content, created_at) VALUES ('${comment_id}', '${comment_owner_id}', '${commented_post_id}', '${content}', '${created_at}');`
    await client.queryObject(query)
    console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}

