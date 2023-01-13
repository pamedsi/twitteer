import { decode, Payload } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { client } from "../database/database.ts";
import { ctxModel } from '../models/context.ts'
import { FollowService } from "../services/follow/follow.ts";

export const seeFollowers = async function (ctx: ctxModel) {
    try {
        const result = await client.queryObject('SELECT * FROM public.followers;')
        ctx.response.body = result.rows
        ctx.response.status = 200
    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
        ctx.response.body = {message: "Não foi possível buscar os usuários"}

    }
}

export const follow = async function (ctx: ctxModel) {
    try {
        const jwt = await ctx.cookies.get('jwt')
        if (!jwt) throw new Error("JWT Inválido!")
        const { user_id: follower_id } = decode(jwt)[1] as Payload
        const { followed_id } = ctx.params
        
        const followService = new FollowService()
        followService.execute(String(follower_id), String(followed_id))

        ctx.response.status = 201
        ctx.response.body = {message : "Operação de seguir realizada com sucesso!"}

    }

    catch (error) {
            console.log("Não foi possível seguir o usuário\n", error)
            ctx.response.body = {message : "Não foi possível seguir o usuário"}
    }
}

export const unfollow = function (ctx: ctxModel) {
    try {
    // const {user_id: following_id} = ctx.state.user
    // const {followed_id} = await ctx.request.body().value
    // const rows = (await client.queryObject(`SELECT * FROM public.followers WHERE followed_id='${followed_id}' AND following_id='${following_id}' LIMIT 1;`)).rows as followerModel[]

    // // Se o usuário que for dar unfollow não seguir o que será "desseguido".
    // if (rows.length === 0) {
    //     ctx.response.body = {message: `Não foi possível deixar de seguí-lo. Verifique se este usuário, realmente segue quem você acredita seguir.`}
    //     ctx.response.status = 200
    // }
    // else {
    //     await client.queryObject(`DELETE FROM public.followers WHERE follow_id='${rows[0].follow_id}';`)
    //     ctx.response.body = {message: "Usuário deixou de seguir com sucesso!"}
    //     ctx.response.status = 200
    // }
    }
    catch(error) {
        console.log(`Não foi deixar de seguir.\n`, error)
    }
}

