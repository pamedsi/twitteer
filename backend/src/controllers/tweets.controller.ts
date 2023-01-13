import { decode, Payload } from "https://deno.land/x/djwt@v2.7/mod.ts";
import {Context} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import {client} from '../database/database.ts'
import { ctxModel } from './../models/context.ts';
import { CreateTweetService, ITweetRequest } from '../services/tweets/createTweetService.ts';
import { DeleteTweetService } from '../services/tweets/deleteTweetService.ts'

export const getTweets = async function (ctx: Context) {
    try {
        const result = await client.queryObject('SELECT * FROM public.tweets;')
        ctx.response.body = result.rows
        ctx.response.status = 200
    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
        ctx.response.body = {message: "Não foi possível buscar os tweets"}

    }
}

export const createTweet = async function (ctx: Context) {
    try {
        const {content}: ITweetRequest = await ctx.request.body().value
        const jwt = await ctx.cookies.get('jwt')
        if (!jwt) throw new Error("JWT Inválido!");

        const {user_id: tweet_owner_id} = decode(jwt)[1] as Payload
        const newTweetService = new CreateTweetService()
        await newTweetService.execute(String(tweet_owner_id), content)

        ctx.response.status = 201
        ctx.response.body = {message : "Twittado!"}
    }
    catch (error) {
        ctx.response.status = 200
        ctx.response.body = {message: "Não foi possível twittar."}
        console.log("\nNão foi possível twittar.\n", error)
    }
}

export const removeTweet = async function(ctx: ctxModel) {
    try {
        const {tweet_id} = ctx.params
        const deleteTweetService = new DeleteTweetService()
        await deleteTweetService.execute(String(tweet_id))

        ctx.response.body = {message: "Tweet exluído com sucesso!"}
        ctx.response.status = 200
    }
    catch (error) {
        ctx.response.body = {message: "Não foi possível deletar o tweet."}
        ctx.response.status = 200
        console.log(`Não foi possível deletar o tweet.\n`, error)
    }
}
