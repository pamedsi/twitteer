import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import {client} from './database.ts'
import {stringForPost, stringForPut, checkingProperty} from './settingQueries.ts'

export const getUsers = async function (ctx: any) {
    try {
        if (Object.keys(ctx.params).length === 0) {
        const result = await client.queryObject('SELECT * FROM public.users;')
        ctx.response.body = result.rows

        }
        else {
            const {key, value} = ctx.params
            const result = await client.queryObject(`SELECT * FROM public.users WHERE ${key}='${value}';`)
            ctx.response.body = result.rows

        }
    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
        ctx.response.body = {message: "Não foi possível buscar os usuários"}
        
    }
}

export const createUser = async function (ctx: any) {
    try {
        const object = await ctx.request.body().value
        const {email, username} = object
        let phone
        if (!object.phone) phone = null
        else phone = object.phone

        const result = await client.queryObject(`SELECT * FROM public.users WHERE email='${email}' OR phone='${phone}' OR username='${username}';`)

        if(result.rows.length === 0) {
            const [keys, values] = await stringForPost(object)
            await client.queryObject(`INSERT INTO public.users (${keys}) VALUES (${values});`)
            ctx.response.body = {message : "Usuário cadastrado!"}
        }
        else if(checkingProperty(result.rows, 'phone', phone) && phone !== null) {
            ctx.response.body = {message: "Não foi possível cadastrar o usuário, número de telefone já cadastrado."}
        }
        else if (checkingProperty(result.rows, 'email', email)) {
            ctx.response.body = {message: "Não foi possível cadastrar o usuário, e-mail já cadastrado."}
        }
        else if (checkingProperty(result.rows, 'username', username)) {
            ctx.response.body = {message: "Não foi possível cadastrar o usuário, nome de usuário já cadastrado."}
        }
    }
    catch (error) {
        console.log(`Nao foi possível cadastrar o usuário.\n`, error)
        ctx.response.body = {message: "Não foi possível cadastrar o usuário"}
    }
}

export const updateUser = async function(ctx: any) {
    try {
        const object = await ctx.request.body().value
        const changes = await stringForPut(object)
        await client.queryObject(`UPDATE public.users SET ${changes} WHERE user_id='${ctx.params.user_id}'`)
        ctx.response.body = {message : "Atualização feita com sucesso!"}
    } catch (error) {
        console.log(`Não foi possível atualizar o usuário!\n`, error)
        ctx.response.body = {message: "Não foi possível atualizar o usuário"}
    }
}

export const removeUser = async function(ctx: any) {
    try {
        await client.queryObject(`DELETE FROM public.users WHERE user_id='${ctx.params.user_id}'`)
        ctx.response.body = {message: "Usuário exluído com sucesso!"}
    }
    catch (error) {
        ctx.response.body = {message: "Não foi possível deletar o usuário"}
        console.log(`Não foi possível deletar o usuário.\n`, error)
    }
}