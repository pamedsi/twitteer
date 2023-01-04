import {client} from '../database/database.ts'
import {Context} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import {User} from '../models/user.ts'
import { ctxModel } from './../models/context.ts';
import { CreateCommentService, ICommentRequest } from '../services/createCommentService.ts';

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
        const comment: ICommentRequest = await ctx.request.body().value
        const {user_id: comment_owner_id}: User = ctx.state.user
        const newCommentService = new CreateCommentService(comment_owner_id)
        await newCommentService.execute(comment)
        ctx.response.status = 201
        ctx.response.body = {message : "Twittado!"}

    } catch (error) {
        ctx.response.status = 200
        ctx.response.body = {message : `Não foi possível twittar! ${(String(error).split('\n')[0]).replace('Error: ', '')}`}
        console.log("Não foi possível twittar.\n", error)
    }
}

export const removeComment = async function(ctx: ctxModel) {
    try {
        const {comment_id} = ctx.params
        await client.queryObject(`DELETE FROM public.comments WHERE comment_id='${comment_id}'`)
        ctx.response.body = {message: "Comentário exluído com sucesso!"}
        ctx.response.status = 200
    }
    catch (error) {
        ctx.response.body = {message: "Não foi possível deletar o comentário"}
        ctx.response.status = 200
        console.log(`Não foi possível deletar o tweet.\n`, error)
    }
}
