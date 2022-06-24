import {client} from '../database.ts'
import { user } from './../models/user.ts';

const getDataForQuery = function (object: any) {
    let [keys, values, fixer] = ['', '', true]

    for (const key in object) {
        if (fixer) {
            keys += `${key}`
            values += `${object[key]}`
        }
        else {
            keys += `, ${key}`
            values += `, ${object[key]}`
        }
        fixer = false
    }

    return [keys, values]
}

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
        const [keys, values] = getDataForQuery(object)
        await client.queryObject(`INSERT INTO perfis (${keys}) VALUES (${values})`)
        ctx.response.body = {message : "Todos os cadastros foram realizados"}
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