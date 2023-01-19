import {client} from '../database/database.ts'
import {Context} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { ctxModel } from './../models/context.ts';
import { CreateCommentService, ICommentRequest } from '../services/comments/createCommentService.ts';
import { DeleteCommentService } from '../services/comments/deleteCommentService.ts'
import { decode, Payload } from "https://deno.land/x/djwt@v2.7/mod.ts";

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
        // const {user_id: comment_owner_id}: User = ctx.state.user
        const jwt = await ctx.cookies.get('jwt')
        if (!jwt) throw new Error("JWT Inválido!");

        const {user_id: comment_owner_id} = decode(jwt)[1] as Payload
        const newCommentService = new CreateCommentService()
        await newCommentService.execute(comment, String(comment_owner_id))
        
        ctx.response.status = 201
        ctx.response.body = {message : "Comentado!"}

    } catch (error) {
        const clientError = String(error).split('\n')[0].split(': ')
        if (clientError[1] === 'client') {
            console.log(`\nNao foi possível cadastrar o usuário.\n`, error)
            ctx.response.body = {message: clientError[2]}
            ctx.response.status = 400
        }
        else {
            ctx.response.body = {message: "Nao foi possível comentar, erro interno, tente novamente mais tarde!"}
            ctx.response.status = 500
            console.log(`\nNao foi possível twittar.\n`, error)
        }
    }
}

export const removeComment = async function(ctx: ctxModel) {
    try {
        const {comment_id} = ctx.params
        const deleteCommentService = new DeleteCommentService()
        await deleteCommentService.execute(String(comment_id))
        
        ctx.response.body = {message: "Comentário exluído com sucesso!"}
        ctx.response.status = 200
    }
    catch (error) {
        ctx.response.body = {message: "Não foi possível deletar o comentário"}
        ctx.response.status = 500
        console.log(`Não foi possível deletar o comentário.\n`, error)
    }
}
