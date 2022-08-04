import {client} from './database.ts'
import { stringForPost } from './settingQueries.js';

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
        const [keys, values] = await stringForPost(tweet)
        await client.queryObject(`INSERT INTO public.posts (${keys}) VALUES (${values});`)
        ctx.response.status = 201
        ctx.response.body = {message : "Tweetado!"}
    } catch (error) {
        ctx.response.status = 200
        ctx.response.body = {message : "Não foi possível twittar!"}
        console.log("Não foi possível twittar.\n", error)
    }
}

export const removePost = async function(ctx) {
    try {
        await client.queryObject(`DELETE FROM public.posts WHERE post_id='${ctx.params.post_id}'`)
        ctx.response.body = {message: "Usuário exluído com sucesso!"}
        ctx.response.status = 204
    }
    catch (error) {
        ctx.response.body = {message: "Não foi possível deletar o tweet"}
        ctx.response.status = 200
        console.log(`Não foi possível deletar o tweet.\n`, error)
    }
}
