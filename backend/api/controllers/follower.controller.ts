export const follow (ctx: any) {
    try {
        const {user_following, user_followed} = await ctx.request.body().value
        await client.queryObject(`INSERT INTO public.followers (user_followed,user_following)
            VALUES ('${user_following}'::uuid,'${user_followed};`)
        ctx.response.status = 201
        ctx.response.body = {message : "Operação de seguir realizada com sucesso!"}
    } catch (error) {
        console.log("Não foi possível seguir o usuário", error)
        ctx.response.body = {message : "Não foi possível seguir o usuário"}
    }
}
