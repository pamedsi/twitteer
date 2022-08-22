import {client} from './database.js'
import { stringForPost, checkingEqualTweets, timeStampConversor} from './helperFunctions.js';

export const getTweets = async function (ctx) {
    try {
        console.log(ctx.state.user.user_id)
        const result = await client.queryObject('SELECT * FROM public.posts;')
        if (Object.keys(ctx.params).length === 0) {
        ctx.response.body = result.rows
        ctx.response.status = 200
        }
        else if (result.rows.length === 0) {
            ctx.response.status = 404
            ctx.response.body = {message: "Tweet não encontrado!"}
        }
        else {
            const {key, value} = ctx.params
            const result = await client.queryObject(`SELECT * FROM public.posts WHERE ${key}='${value}';`)
            ctx.response.body = result.rows
            ctx.response.status = 200
        }
    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
        ctx.response.body = {message: "Não foi possível buscar os usuários"}

    }
}

export const createPost = async function (ctx) {
    try {
        const {content} = await ctx.request.body().value
        const {user_id: post_owner_id} = ctx.state.user
        const {rows} = await client.queryObject(`SELECT * FROM public.posts WHERE post_owner_id='${post_owner_id}' AND content='${content}';`)

        if (rows.length === 0) {
            const [keys, values] = await stringForPost({content})
            await client.queryObject(`INSERT INTO public.posts (${keys}, post_datetime, post_owner_id) VALUES (${values}, '${timeStampConversor()}', '${post_owner_id}');`)
            ctx.response.status = 201
            ctx.response.body = {message : "Tweetado!"}
        }
        else {
            rows.forEach(tweet => {
                if (checkingEqualTweets(content, tweet.content)) {
                    ctx.response.status = 200
                    ctx.response.body = {message : "Você já twittou isso!"}
                    return
                }
            })
        }
    }
    catch (error) {
        ctx.response.status = 200
        ctx.response.body = {message : "Não foi possível twittar!"}
        console.log("Não foi possível twittar.\n", error)
    }
}

export const removePost = async function(ctx) {
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
