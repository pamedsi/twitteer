import { decode, Payload } from "https://deno.land/x/djwt@v2.7/mod.ts";
import {Context} from "https://deno.land/x/oak@v10.6.0/mod.ts";

import { ctxModel } from './../models/context.ts';
import { CreateTweetService } from '../services/tweets/createTweetService.ts';
import { DeleteTweetService } from '../services/tweets/deleteTweetService.ts'
import { SeeTweetsService } from "../services/tweets/seeTweetsService.ts";
import { LikeTweetService } from "../services/like/likeTweetService.ts"
import { ITweetRequest } from "../models/tweet.ts";
import { UnlikeService } from "../services/like/unlikeService.ts"

export const seeTweets = async function (ctx: Context) {
    try {
        const jwt = await ctx.cookies.get('jwt')
        if (!jwt) throw new Error("client: Usuário não logado!")
        const { user_id: loggedUser } = decode(jwt)[1] as Payload
        const seeTweetsService = new SeeTweetsService()
        const tweets = await seeTweetsService.execute(String(loggedUser))

        ctx.response.body = tweets
        ctx.response.status = 200

    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
        ctx.response.body = {message: "Não foi possível buscar os tweets"}
        ctx.response.status = 500

    }
}

export const createTweet = async function (ctx: Context) {
    try {
        const incomingUserTweet: ITweetRequest = await ctx.request.body().value
        const jwt = await ctx.cookies.get('jwt')
        if (!jwt) throw new Error("JWT Inválido!");

        const {user_id: tweet_owner_id} = decode(jwt)[1] as Payload
        const newTweetService = new CreateTweetService()
        await newTweetService.execute(String(tweet_owner_id), incomingUserTweet)

        ctx.response.status = 201
        ctx.response.body = {message : "Twittado!"}
    }
    catch (error) {
        const clientError = String(error).split('\n')[0].split(': ')
        if (clientError[1] === 'client') {
            console.log(`\nNao foi possível twittar.\n`, error)
            ctx.response.body = {message: clientError[2]}
            ctx.response.status = 400
        }
        else {
            ctx.response.body = {message: "Nao foi possível twitter, erro interno, tente novamente mais tarde!"}
            ctx.response.status = 500
            console.log(`\nNao foi possível twittar.\n`, error)
        }
    }
}

export const removeTweet = async function(ctx: ctxModel) {
    try {
        const {tweet_id} = ctx.params
        const jwt = await ctx.cookies.get('jwt')
        if (!jwt) throw new Error("JWT Inválido!");

        const {user_id: tweet_owner_id} = decode(jwt)[1] as Payload
        const deleteTweetService = new DeleteTweetService()
        await deleteTweetService.execute(String(tweet_id), String(tweet_owner_id))

        ctx.response.body = {message: "Tweet exluído com sucesso!"}
        ctx.response.status = 200
    }
    catch (error) {
        const clientError = String(error).split('\n')[0].split(': ')
        if (clientError[1] === 'client') {
            console.log(`\nNao foi possível apagar o tweet.\n`, error)
            ctx.response.body = {message: clientError[2]}
            ctx.response.status = 400
        }
        else {
            ctx.response.body = {message: "Nao foi possível remover o tweet, erro interno, tente novamente mais tarde!"}
            ctx.response.status = 500
            console.log(`\nNao foi possível apagar tweet.\n`, error)
        }
    }
}

export const likeTweet = async function(ctx: ctxModel) {
    try {
        const {tweet_id} = ctx.params
        const jwt = await ctx.cookies.get('jwt')
        if (!jwt) throw new Error("JWT Inválido!");

        const {user_id: loggedUser} = decode(jwt)[1] as Payload
        const likeTweetService = new LikeTweetService()
        await likeTweetService.execute(String(tweet_id), String(loggedUser))

        ctx.response.body = {message: "Tweet curtido!"}
        ctx.response.status = 200
    }
    catch (error) {
        const clientError = String(error).split('\n')[0].split(': ')
        if (clientError[1] === 'client') {
            console.log(`\nNao foi possível curtir o tweet.\n`, error)
            ctx.response.body = {message: clientError[2]}
            ctx.response.status = 400
        }
        else {
            ctx.response.body = {message: "Nao foi possível curtir o tweet, erro interno, tente novamente mais tarde!"}
            ctx.response.status = 500
            console.log(`\nNao foi possível curtir tweet.\n`, error)
        }
    }
}

export const unlikeTweet = async function (ctx: ctxModel) {
    try {
        const {tweet_id} = ctx.params
        const jwt = await ctx.cookies.get('jwt')
        if (!jwt) throw new Error("JWT Inválido!");

        const {user_id: loggedUser} = decode(jwt)[1] as Payload
        const likeTweetService = new UnlikeService()
        await likeTweetService.execute(String(tweet_id), String(loggedUser))

        ctx.response.body = {message: "Tweet descurtido!"}
        ctx.response.status = 200
    }
    catch (error) {
        const clientError = String(error).split('\n')[0].split(': ')
        if (clientError[1] === 'client') {
            console.log(`\nNao foi possível descurtir o tweet.\n`, error)
            ctx.response.body = {message: clientError[2]}
            ctx.response.status = 400
        }
        else {
            ctx.response.body = {message: "Nao foi possível descurtir o tweet, erro interno, tente novamente mais tarde!"}
            ctx.response.status = 500
            console.log(`\nNao foi possível curtir tweet.\n`, error)
        }
    }
}