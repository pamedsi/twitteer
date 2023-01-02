import {client} from './utils/database.ts'
import {insertNewUser, stringForUpdateUser, loginRegistered} from './utils/helperFunctions.ts'
import { Context } from 'https://deno.land/x/oak@v10.6.0/mod.ts';
import { ctxModel } from './../models/context.ts';
import { User, userDTO } from "../models/user.ts";

export const getUsers = async function (ctx: ctxModel) {
    try {
        const {rows} = await client.queryObject('SELECT * FROM public.users;')
        if (Object.keys(ctx.params).length === 0) {
        ctx.response.body = rows
        ctx.response.status = 200
        }
        else if (rows.length === 0) {
            ctx.response.status = 404
            ctx.response.body = {message: "Usuário não encontrado!"}
        }
        else {
            const {key, value} = ctx.params
            const {rows} = await client.queryObject(`SELECT * FROM public.users WHERE ${key}='${value}' LIMIT 1;`)
            if (ctx.response.body) ctx.response.body = rows
            if (ctx.response.status) ctx.response.status = 200
            return rows[0]
        }
    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
        if (ctx.response.body) ctx.response.body = {message: "Não foi possível buscar os usuários"}
    }
}

export const createUser = async function (ctx: Context) {
    
    try {
        const incomingUser: userDTO = await ctx.request.body().value
        const userInfo = await loginRegistered(incomingUser)
        if (userInfo) ctx.response.body = {message: `Não foi possível cadastrar o usuário, ${userInfo} já cadastrado.`}
        else {
            const newUser = new User()
            Object.assign(newUser, incomingUser)
            await insertNewUser(newUser)
            ctx.response.status = 201
            ctx.response.body = {message : "Usuário cadastrado!"}

        }
    }
    catch (error) {
        console.log(`Nao foi possível cadastrar o usuário.\n`, error)
        ctx.response.body = {message: "Não foi possível cadastrar o usuário"}
    }
}

export const updateUser = async function(ctx: ctxModel) {
    try {
        const user = await ctx.request.body().value
        const changes = await stringForUpdateUser(user)
        await client.queryObject(`UPDATE public.users SET ${changes} WHERE user_id='${ctx.params.user_id}'`)
        ctx.response.body = {message : "Atualização feita com sucesso!"}
        ctx.response.status = 201
    } catch (error) {
        console.log(`Não foi possível atualizar o usuário!\n`, error)
        ctx.response.body = {message: "Não foi possível atualizar o usuário"}
        ctx.response.status = 404
    }
}

export const removeUser = async function(ctx: ctxModel) {
    try {
        await client.queryObject(`DELETE FROM public.users WHERE user_id='${ctx.params.user_id}'`)
        ctx.response.status = 200
        ctx.response.body = {message: "Usuário exluído com sucesso!"}
    }
    catch (error) {
        ctx.response.body = {message: "Não foi possível deletar o usuário"}
        ctx.response.status = 200
        console.log(`Não foi possível deletar o usuário.\n`, error)
    }
}
