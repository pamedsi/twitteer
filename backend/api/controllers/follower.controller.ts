import {client} from './database.ts'

export const follow = async function (ctx: any) {

    try {
        const {user_followed, user_following} = await ctx.request.body().value
        const {rows} = await client.queryObject(`SELECT * FROM public.followers WHERE user_followed='${user_followed}';`)
        
        // Caso o usuário, que será seguido, não tiver nenhum seguidor.
        // Ou se dos seguidores que o user_followed tem, verifica se o usuário que irá seguir (user_following) não está na lista.
        if (rows.length === 0 || !rows.some(element => element.user_following === user_following)) {
            await client.queryObject(`INSERT INTO public.followers (user_followed,user_following) VALUES ('${user_followed}'::uuid,'${user_following}'::uuid);`)
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

export const unfollow = async function (ctx: any) {

    try {
    const {user_followed, user_following} = await ctx.request.body().value
    const {rows} = await client.queryObject(`SELECT * FROM public.followers WHERE user_followed='${user_followed}';`)

    if (rows.some(element => element.user_following === user_following)) {
        await client.queryObject(`DELETE FROM public.followers
        WHERE user_followed='${user_followed}'::uuid::uuid AND user_following='${user_following}'::uuid::uuid;`)
        ctx.response.body = {message: "Usuário deixou de seguir com sucesso!"}
        ctx.response.status = 204
    }
    else
    {
        ctx.response.body = {message: `Não foi possível deixar de seguí-lo. Verifique se este usuário, realmente segue quem você acredita seguir.`}
        ctx.response.status = 200
    }
    }
    catch(error) {
        console.log(`Não foi deixar de seguir.\n`, error)
    }
}