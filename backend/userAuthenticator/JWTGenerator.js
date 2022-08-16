import { create } from "https://deno.land/x/djwt@v2.7/mod.ts"
import { jwtKey }  from './../api/env.ts';

export async function generateJWT(user_id, full_name) {
    return await create({alg: "HS512", typ: "JWT"}, {user_id, full_name}, jwtKey)
}
