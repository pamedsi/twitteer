import { getUsers } from './../api/controllers/user.controller.js'
import { compare } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts"
import { create } from "https://deno.land/x/djwt@v2.7/mod.ts"
import { jwtKey }  from './../api/env.ts';

const userExist = async function (email) {
    const user = await getUsers({params: {key: 'email', value: email}})
    if (user) return user
    return null
}

export async function generateJWT(email, password) {

    const user = await userExist(email)
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
