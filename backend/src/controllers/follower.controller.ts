import { decode, Payload } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { ctxModel } from '../models/context.ts'
import { FollowService } from "../services/follow/follow.ts";
import { SeeFollowersService } from "../services/follow/seeFollowers.ts";
import { SeeFollowingService } from "../services/follow/seeFollowing.ts";
import { UnfollowService } from "../services/follow/unfollow.ts";

export const seeFollowers = async function (ctx: ctxModel) {
    try {        
    const jwt = await ctx.cookies.get('jwt')
    // if (!jwt) throw new Error("JWT Inválido!")
    if (!jwt) throw new Error("client: Usuário não logado!")
        const { user_id: loggedUser } = decode(jwt)[1] as Payload
        const seeFollowers = new SeeFollowersService()
        const followers = await seeFollowers.execute(String(loggedUser))
        
        ctx.response.body = followers
        ctx.response.status = 200
    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
        ctx.response.body = {message: "Não foi possível buscar os usuários, erro interno, tente novamente mais tarde!"}
        ctx.response.status = 500

    }
}

export const seeFollowing = async function (ctx: ctxModel){
    try {        
        const jwt = await ctx.cookies.get('jwt')
        // if (!jwt) throw new Error("JWT Inválido!")
        if (!jwt) throw new Error("client: Usuário não logado!")
            const { user_id: loggedUser } = decode(jwt)[1] as Payload
            const seeFollowing = new SeeFollowingService()
            const following = await seeFollowing.execute(String(loggedUser))
            
            ctx.response.body = following
            ctx.response.status = 200
        }
        catch (error) {
            console.log(`Requisição mal sucedida!\n`, error)
            ctx.response.body = {message: "Não foi possível buscar os usuários, erro interno, tente novamente mais tarde!"}
            ctx.response.status = 500
        }
}

export const follow = async function (ctx: ctxModel) {
    try {
        const jwt = await ctx.cookies.get('jwt')
        if (!jwt) throw new Error("JWT Inválido!")
        const { user_id: follower_id } = decode(jwt)[1] as Payload
        const { followed_id } = ctx.params
        
        const followService = new FollowService()
        await followService.execute(String(follower_id), String(followed_id))
                
        ctx.response.status = 201
        ctx.response.body = {message : "Operação de seguir realizada com sucesso!"}

    }

    catch (error) {
            console.log("Não foi possível seguir o usuário.\n", error)
            ctx.response.body = {message : "Não foi possível seguir o usuário, erro interno, tente novamente mais tarde!"}
            ctx.response.status = 500
    }
}

export const unfollow = async function (ctx: ctxModel) {
    try {
        const jwt = await ctx.cookies.get('jwt')
        if (!jwt) throw new Error("JWT Inválido!")
        const { user_id: unffollower_id } = decode(jwt)[1] as Payload
        const { unfollowed_id } = ctx.params

        const unfollowService = new UnfollowService()
        await unfollowService.execute(String(unffollower_id), String(unfollowed_id))

        ctx.response.body = {message: "Usuário deixou de seguir com sucesso!"}
        ctx.response.status = 200

}

    catch(error) {
        console.log(`\nNão foi possível deixar de seguir.\n`, error)
        ctx.response.body = {message : "Não foi possível deixar de seguir."}
        ctx.response.status = 500
    }
}

