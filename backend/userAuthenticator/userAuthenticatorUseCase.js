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
    if (!user) throw new Error('email or password incorrect')
    const {password: passwordHash} = user
    const passwordMatch = compare(password, passwordHash)
    if (!passwordMatch) throw new Error('email or password incorrect')

    const jwt = await create(
    {
        alg: "HS512",
        typ: "JWT"
    },
    {
        userID: user.user_id,
        name: user.full_name,
    }, jwtKey)

    return {
        user: user,
        jwt: jwt
    }
}
