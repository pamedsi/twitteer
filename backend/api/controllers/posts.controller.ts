import {client} from './utils/database.ts'
import {sameDateTweet} from './utils/helperFunctions.ts';
import {Context} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { postModel } from './../models/post.ts';
import { ctxModel } from './../models/context.ts';


export const getTweets = async function (ctx: Context) {
    try {
        const result = await client.queryObject('SELECT * FROM public.posts;')
        ctx.response.body = result.rows
        ctx.response.status = 200
    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
        ctx.response.body = {message: "Não foi possível buscar os tweets"}

    }
}

export const createPost = async function (ctx: Context) {
    try {
        const {content} = await ctx.request.body().value
        const {user_id: post_owner_id} = ctx.state.user
        const {rows} = await client.queryObject(`SELECT * FROM public.posts WHERE post_owner_id='${post_owner_id}' AND content='${content}';`)

        if (rows.some((tweet: any) => sameDateTweet(new Date(), tweet.post_datetime))) {
            ctx.response.status = 200
            ctx.response.body = {message : "Você já twittou isso!"}
        }

        else {
            await client.queryObject(`INSERT INTO public.posts (content, post_datetime, post_owner_id) VALUES ('${content}', '${new Date().toISOString()}', '${post_owner_id}');`)
            ctx.response.status = 201
            ctx.response.body = {message : "Tweetado!"}
        }

    }
    catch (error) {
        ctx.response.status = 200
        ctx.response.body = {message : "Não foi possível twittar!"}
        console.log("Não foi possível twittar.\n", error)
    }
}

export const removePost = async function(ctx: ctxModel) {
    try {
        await client.queryObject(`DELETE FROM public.comments WHERE post_id='${ctx.params.post_id}';`)
        ctx.response.body = {message: "Comentário exluído com sucesso!"}
        ctx.response.status = 200
    }
    catch (error) {
        ctx.response.body = {message: "Não foi possível deletar o comentário"}
        ctx.response.status = 200
        console.log(`Não foi possível deletar o comentário.\n`, error)
    }
}
