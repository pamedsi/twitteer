import { compare } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts"
import { create } from "https://deno.land/x/djwt@v2.7/mod.ts"
import { jwtKey }  from './../api/env.ts';
import { userExist } from './../api/controllers/user.controller.js';

export async function generateJWT(login, password) {

    const user = await userExist(login)
    if (!user) return null
    const {password: passwordHash} = user
    const passwordMatch = await compare(password, passwordHash)
    if (!passwordMatch) return null

    const jwt = await create(
    {
        alg: "HS512",
        typ: "JWT"
    },
    {
        user_id: user.user_id,
        name: user.full_name,
    }, jwtKey)

    return {
        jwt: jwt,
        user_id: user.user_id,
        name: user.full_name
    }

}

console.log(await generateJWT('justasaia', 'ehajovem'))
