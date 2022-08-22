import {client} from './utils/database.ts'

export const follow = async function (ctx) {
    try {
        const {user_id: following_id} = ctx.state.user
        const {followed_id} = await ctx.request.body().value
        const {rows} = await client.queryObject(`SELECT * FROM public.followers WHERE followed_id='${followed_id}' AND following_id='${following_id}' LIMIT 1;`)

        if (rows.length === 0) {
            await client.queryObject(`INSERT INTO public.followers (followed_id, following_id, created_at) VALUES ('${followed_id}'::uuid,'${following_id}'::uuid, '${new Date().toISOString()}');`)
            ctx.response.status = 201
            ctx.response.body = {message : "Operação de seguir realizada com sucesso!"}
        }
        else {
            ctx.response.status = 200
            ctx.response.body = {message : "Este usuário já segue ao que você tentou seguir."}
        }
    }

    catch (error) {
            console.log("Não foi possível seguir o usuário\n", error)
            ctx.response.body = {message : "Não foi possível seguir o usuário"}
    }
}

export const unfollow = async function (ctx) {
    try {
    const {user_id: following_id} = ctx.state.user
    const {followed_id} = await ctx.request.body().value
    const {rows} = await client.queryObject(`SELECT * FROM public.followers WHERE followed_id='${followed_id}' AND following_id='${following_id}' LIMIT 1;`)

    // Se o usuário que for dar unfollow não seguir o que será "desseguido".
    if (rows.length === 0) {
        ctx.response.body = {message: `Não foi possível deixar de seguí-lo. Verifique se este usuário, realmente segue quem você acredita seguir.`}
        ctx.response.status = 200
    }
    else {
        await client.queryObject(`DELETE FROM public.followers WHERE follow_id='${rows[0].follow_id}';`)
        ctx.response.body = {message: "Usuário deixou de seguir com sucesso!"}
        ctx.response.status = 200
    }
    }
    catch(error) {
        console.log(`Não foi deixar de seguir.\n`, error)
    }
}

export const seeFollowers = async function (ctx) {
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
