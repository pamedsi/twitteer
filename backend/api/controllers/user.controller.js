import {client} from './database.ts'
import {stringForPost, stringForPut, checkingProperty} from './settingQueries.js'

export const getUsers = async function (ctx) {
    try {
        const result = await client.queryObject('SELECT * FROM public.users;')
        if (Object.keys(ctx.params).length === 0) {
        ctx.response.body = result.rows
        ctx.response.status = 200
        }
        else if (result.rows.length === 0) {
            ctx.response.status = 404
            ctx.response.body = {message: "Usuário não encontrado!"}
        }
        else {
            const {key, value} = ctx.params
            const result = await client.queryObject(`SELECT * FROM public.users WHERE ${key}='${value}';`)
            ctx.response.body = result.rows
            ctx.response.status = 200
        }
    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
        ctx.response.body = {message: "Não foi possível buscar os usuários"}

    }
}

export const createUser = async function (ctx) {
    try {
        const user = await ctx.request.body().value
        const {email, username} = user
        let phone
        if (!user.phone) phone = null
        else phone = user.phone

        const result = await client.queryObject(`SELECT * FROM public.users WHERE email='${email}' OR phone='${phone}' OR username='${username} LIMIT 0,1';`)

        if(result.rows.length === 0) {
            const [keys, values] = await stringForPost(user)
            await client.queryObject(`INSERT INTO public.users (${keys}) VALUES (${values});`)
            ctx.response.status = 201
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

export const updateUser = async function(ctx) {
    try {
        const user = await ctx.request.body().value
        const changes = await stringForPut(user)
        await client.queryObject(`UPDATE public.users SET ${changes} WHERE user_id='${ctx.params.user_id}'`)
        ctx.response.body = {message : "Atualização feita com sucesso!"}
        ctx.response.status = 201
    } catch (error) {
        console.log(`Não foi possível atualizar o usuário!\n`, error)
        ctx.response.body = {message: "Não foi possível atualizar o usuário"}
        ctx.response.status = 404
    }
}

export const removeUser = async function(ctx) {
    try {
        await client.queryObject(`DELETE FROM public.users WHERE user_id='${ctx.params.user_id}'`)
        ctx.response.body = {message: "Usuário exluído com sucesso!"}
        ctx.response.status = 204
    }
    catch (error) {
        ctx.response.body = {message: "Não foi possível deletar o usuário"}
        ctx.response.status = 200
        console.log(`Não foi possível deletar o usuário.\n`, error)
    }
}
