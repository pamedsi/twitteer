import {client} from './database.js'
import { stringForPost, checkingEqualTweets } from './settingQueries.js';

export const getComments = async function (ctx) {
    try {
        const {rows} = await client.queryObject('SELECT * FROM public.comments;')
        if (Object.keys(ctx.params).length === 0) {
            ctx.response.body = rows
            ctx.response.status = 200
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
        ctx.response.body = {message: "Não foi possível Procurar os comentários."}

    }
}

export const createComment = async function (ctx) {
    try {
        const comment = await ctx.request.body().value
        const {comment_owner_id, content} = comment
        const {rows} = await client.queryObject(`SELECT * FROM public.posts, public.comments WHERE comment_owner_id='${comment_owner_id}' or post_owner_id='${comment_owner_id}' AND content='${content}';`)

        if (rows.length === 0) {
            const [keys, values] = await stringForPost(tweet)
            await client.queryObject(`INSERT INTO public.posts (${keys}) VALUES (${values});`)
            ctx.response.status = 201
            ctx.response.body = {message : "Comentado!"}
        }
        else {
            rows.forEach(tweet => {
                // Para cada tweet igual que foi achado, postado pelo mesmo usuário
                // será verificado se foi postado no mesmo dia.
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
