import {client} from '../database.ts'

export const getUsers = async function (ctx: any) {
    try {
        const result = await client.queryObject('SELECT * FROM perfis')
        ctx.response.body = result.rows
    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
    }
}

export const createUser = async function (ctx: any) {
    try {
        const object = await ctx.request.body().value

        if (object[0]) {
            for (const key in object) {
                await client.queryObject(`INSERT INTO perfis`)
                ctx.response.body = {message : "Todos os cadastros foram realizados"}
            }
        }
    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
    }
}

export const updateUser = async function(ctx: any) {
    try {
        const result = await client.queryObject('SELECT * FROM perfis')
        ctx.response.body = result.rows
    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
    }
}

export const removeUser = async function(ctx: any) {
    try {
        const result = await client.queryObject('SELECT * FROM perfis')
        ctx.response.body = result.rows
    }
    catch (error) {
        console.log(`Requisição mal sucedida!\n`, error)
    }
}