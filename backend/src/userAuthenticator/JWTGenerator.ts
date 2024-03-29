import { create } from "https://deno.land/x/djwt@v2.7/mod.ts"
import { jwtKey }  from '../env.ts';

export async function generateJWT(user_id: string, display_name: string) {
    return await create({alg: "HS512", typ: "JWT"}, {user_id, display_name}, jwtKey)
}