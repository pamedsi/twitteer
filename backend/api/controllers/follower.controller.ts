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
            console.log("Não foi possível seguir o usuário", error)
            ctx.response.body = {message : "Não foi possível seguir o usuário"}
    }
} 
