import {client} from '../utils/database.js'
import { stringForCreateComment, equalTweets } from './helperFunctions.js';
import { nowInTimestamp } from '../utils/helper.js'

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

        // Queria conseguir fazer uma query só buscando o mesmo tweet tanto na tabela de comentários quanto
        // na de tweets, mas, quando tentei deu o erro de "ambiguous" por causa das colunas com mesmo nome.
        // Está na lista pesquisar para resolver isso.

        const {rows: tweets} = await client.queryObject(`SELECT * FROM public.posts WHERE post_owner_id='${comment_owner_id}' AND content='${content}';`)
        const {rows: comments} = await client.queryObject(`SELECT * FROM public.comments WHERE comment_owner_id='${comment_owner_id}' AND content='${content}';`)

        if (tweets.length === 0 && comments.length === 0) {
            const [keys, values] = stringForCreateComment(comment)
            await client.queryObject(`INSERT INTO public.comments (${keys}) VALUES (${values});`)
            ctx.response.status = 201
            ctx.response.body = {message : "Comentado!"}
        }
        else {
            comments.forEach(comment => {
                // Para cada comentário igual que foi achado, postado pelo mesmo usuário
                // será verificado se foi postado no mesmo dia.
                if (equalTweets(nowInTimestamp(), comment.comment_datetime)) {
                    ctx.response.status = 200
                    ctx.response.body = {message : "Você já twittou isso!"}
                    return
                }
            })

            tweets.forEach(tweet => {
                // Para cada comentário igual que foi achado, postado pelo mesmo usuário
                // será verificado se foi postado no mesmo dia.
                if (equalTweets(nowInTimestamp(), tweet.post_datetime)) {
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

export const removeComment = async function(ctx) {
    try {
        await client.queryObject(`DELETE FROM public.comments WHERE comment_id='${ctx.params.comment_id}'`)
        ctx.response.body = {message: "Tweet exluído com sucesso!"}
        ctx.response.status = 200
    }
    catch (error) {
        ctx.response.body = {message: "Não foi possível deletar o tweet"}
        ctx.response.status = 200
        console.log(`Não foi possível deletar o tweet.\n`, error)
    }
}
