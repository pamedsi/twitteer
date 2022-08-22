import {client} from './utils/database.ts'
import { sameDateTweet } from './utils/helperFunctions.ts'
import {Context} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { commentModel } from './../models/comment.ts';

export const getComments = async function (ctx: Context) {
    try {
        const {rows} = await client.queryObject('SELECT * FROM public.comments;')
        ctx.response.body = rows
        ctx.response.status = 200

    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
        ctx.response.body = {message: "Não foi possível Procurar os comentários."}

    }
}

export const createComment = async function (ctx: Context) {
    try {
        const comment = await ctx.request.body().value
        const {commented_post_id, content, } = comment
        const {user_id: comment_owner_id} = ctx.state.user

        // Queria conseguir fazer uma query só buscando o mesmo tweet tanto na tabela de comentários quanto
        // na de tweets, mas, quando tentei deu o erro de "ambiguous" por causa das colunas com mesmo nome.
        // Está na lista pesquisar para resolver isso.

        const {rows: tweets} = await client.queryObject(`SELECT * FROM public.posts WHERE post_owner_id='${comment_owner_id}' AND content='${content}';`)
        const {rows: comments} = await client.queryObject(`SELECT * FROM public.comments WHERE comment_owner_id='${comment_owner_id}' AND content='${content}';`)

        if (tweets.length === 0 && comments.length === 0) {
            await client.queryObject(`INSERT INTO public.comments (comment_owner_id, commented_post_id, content, comment_datetime) VALUES ('${comment_owner_id}', '${commented_post_id}', '${content}', '${new Date().toISOString()}');`)
            ctx.response.status = 201
            ctx.response.body = {message : "Comentado!"}
        }
        else {
            comments.forEach(comment => {
                // Para cada comentário igual que foi achado, postado pelo mesmo usuário
                // será verificado se foi postado no mesmo dia.
                if (sameDateTweet(new Date(), comment.comment_datetime)) {
                    ctx.response.status = 200
                    ctx.response.body = {message : "Você já twittou isso!"}
                    return
                }
            })

            tweets.forEach(tweet:  => {
                // Para cada comentário igual que foi achado, postado pelo mesmo usuário
                // será verificado se foi postado no mesmo dia.
                const {post_datetime} = tweet
                if (sameDateTweet(new Date().toISOString(), post_datetime)) {
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

export const removeComment = async function(ctx: Context) {
    try {
        const {comment_id} = await ctx.request.body().value
        await client.queryObject(`DELETE FROM public.comments WHERE comment_id='${comment_id}'`)
        ctx.response.body = {message: "Tweet exluído com sucesso!"}
        ctx.response.status = 200
    }
    catch (error) {
        ctx.response.body = {message: "Não foi possível deletar o tweet"}
        ctx.response.status = 200
        console.log(`Não foi possível deletar o tweet.\n`, error)
    }
}