import { getUsers } from './../api/controllers/user.controller.js';
import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts"

const userExist = async function (email) {
    const result = await getUsers({params: {key: 'email', value: email}})
    return Boolean(result)
}

userExist('patrickabimael@yahoo.com.br')
// console.log(await compare("40028922", "$2a$10$LvZbR0xd8s9e4okOmSujTOFo9PzmuXKx0PLrVYT4EFNxvbDt.I2wq"))

// class AuthenticateUserUseCase {
//     async execute(email, password) {

//     }
// }
