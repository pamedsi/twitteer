import {client} from './database.ts'
import { stringForPost } from './settingQueries.js';

const checkingEqualTweets = function (tweetToPost, tweetFound) {
    // Os indexes 8 e 9 das strings de timestamp são os correspondentes ao dia
    // Então se essa função retornar true, significa que os tweets foram postados no mesmo dia.
    return tweetToPost[8] + tweetToPost[9] === tweetFound[8] + tweetToPost[9]
}

export const getTweets = async function (ctx) {
    try {
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
        const tweet = await ctx.request.body().value
        const {post_owner_id, content} = tweet
        const {rows} = await client.queryObject(`SELECT * FROM public.posts WHERE post_owner_id='${post_owner_id}' AND content='${content}';`)

        if (rows.length === 0) {
            const [keys, values] = await stringForPost(tweet)
            await client.queryObject(`INSERT INTO public.posts (${keys}) VALUES (${values});`)
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



    } catch (error) {
        ctx.response.status = 200
        ctx.response.body = {message : "Não foi possível twittar!"}
        console.log("Não foi possível twittar.\n", error)
    }
}

export const removePost = async function(ctx) {
    try {
        await client.queryObject(`DELETE FROM public.posts WHERE post_id='${ctx.params.post_id}'`)
        ctx.response.body = {message: "Tweet exluído com sucesso!"}
        ctx.response.status = 200
    }
    catch (error) {
        ctx.response.body = {message: "Não foi possível deletar o tweet"}
        ctx.response.status = 200
        console.log(`Não foi possível deletar o tweet.\n`, error)
    }
}
