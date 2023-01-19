import { decode, Payload } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { Context } from 'https://deno.land/x/oak@v10.6.0/mod.ts';

import { ctxModel } from './../models/context.ts';
import { CreateUserService, IUserRequest } from '../services/users/createUserService.ts';
import { UpdateUserService } from '../services/users/updateUserService.ts';
import { DeleteUserService } from '../services/users/deleteUserService.ts';
import { ReactivateUserService } from "../services/users/reactivateUserService.ts";

export const createUser = async function (ctx: Context) {
    try {
        const incomingUser: IUserRequest = await ctx.request.body().value
        const createUserService = new CreateUserService()
        await createUserService.execute(incomingUser)
        ctx.response.status = 201
        ctx.response.body = {message : "Usuário cadastrado!"}
    }
    catch (error) {
        const clientError = String(error).split('\n')[0].split(': ')
        if (clientError[1] === 'client') {
            console.log(`\nNao foi possível cadastrar o usuário.\n`, error)
            ctx.response.body = {message: clientError[2]}
            ctx.response.status = 400
        }
        else {
            ctx.response.body = {message: "Nao foi possível cadastrar o usuário, erro interno, tente novamente mais tarde!"}
            ctx.response.status = 500
            console.log(`\nNao foi possível cadastrar o usuário.\n`, error)
        }
    }
}

export const updateUser = async function(ctx: ctxModel) {
    try {
        const userUpdates: IUserRequest = await ctx.request.body().value
        const jwt = await ctx.cookies.get('jwt')
        if (!jwt) throw new Error("JWT Inválido!");
        const {user_id: loggedUserID } = decode(jwt)[1] as Payload
        
        const updateUserService = new UpdateUserService()
        await updateUserService.execute(String(loggedUserID), userUpdates)
        ctx.response.body = {message : "Atualização feita com sucesso!"}
        ctx.response.status = 201
    } catch (error) {
        const clientError = String(error).split('\n')[0].split(': ')
        if (clientError[1] === 'client') {
            console.log(`\nNao foi possível cadastrar o usuário.\n`, error)
            ctx.response.body = {message: clientError[2]}
            ctx.response.status = 400
        }
        else {
            ctx.response.body = {message: "Nao foi possível atualizar o usuário, erro interno, tente novamente mais tarde!"}
            ctx.response.status = 500
            console.log(`\nNao foi possível cadastrar o usuário.\n`, error)
        }
    }
}

export const removeUser = async function(ctx: ctxModel) {
    try {
        const jwt = await ctx.cookies.get('jwt')
        if (!jwt) throw new Error("JWT Inválido!");
        const {user_id: loggedUserID } = decode(jwt)[1] as Payload
        const IDToBeDeleted = String(ctx.params.user_id)

        const deleteUserService = new DeleteUserService()
        if (loggedUserID === IDToBeDeleted) {
            await deleteUserService.execute(IDToBeDeleted)
        ctx.response.status = 201
        ctx.response.body = {message: "Usuário exluído com sucesso!"}
        }
        else throw new Error("Usuário tentou excluir outra conta!");
        
    }
    catch (error) {
        ctx.response.body = {message: "Não foi possível deletar o usuário erro interno, tente novamente mais tarde."}
        ctx.response.status = 500
        console.log(`Não foi possível deletar o usuário.\n`, error)
    }
}

export const reactivateUser = async function (ctx: ctxModel) {
    try {
        const user_id = String(ctx.params.user_id)
        const reactivateUserService = new ReactivateUserService()
        await reactivateUserService.execute(user_id)
        ctx.response.status = 201
        ctx.response.body = {message: "Usuário reativado com sucesso!"}
    }

    catch (error) {
        ctx.response.body = {message: "Não foi possível reativar o usuário, erro interno, tente novamente mais tarde."}
        ctx.response.status = 500
        console.log(`\nNão foi possível reativar o usuário.\n`, error)
    }
}