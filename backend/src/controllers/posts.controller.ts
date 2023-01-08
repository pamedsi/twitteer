import { decode } from "https://deno.land/x/djwt@v2.7/mod.ts";
import {Context} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import {client} from '../database/database.ts'
import { ctxModel } from './../models/context.ts';
import { CreatePostService, IPostRequest } from '../services/createPostService.ts';

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
        const {content}: IPostRequest = await ctx.request.body().value
        const jwt = await ctx.cookies.get('jwt')
        const post_owner_id = decode(jwt)[1].user_id
        const newTweetService = new CreatePostService(post_owner_id)
        await newTweetService.execute(content)
        ctx.response.status = 201
        ctx.response.body = {message : "Twittado!"}
    }
    catch (error) {
        ctx.response.status = 200
        // ctx.response.body = {message : `Não foi possível twittar! ${(String(error).split('\n')[0]).replace('Error: ', '')}`}
        ctx.response.body = {message: "Não foi possível twittar."}
        console.log("\nNão foi possível twittar.\n", error)
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
