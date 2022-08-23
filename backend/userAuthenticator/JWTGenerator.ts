import { create } from "https://deno.land/x/djwt@v2.7/mod.ts"
import { jwtKey }  from './../api/env.ts';
import {userModel} from '../api/models/user.ts'

export async function generateJWT(user_id: userModel, full_name: string) {
    return await create({alg: "HS512", typ: "JWT"}, {user_id, full_name}, jwtKey)
}
