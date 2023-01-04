import { valid } from "https://deno.land/x/validation@v0.4.0/email.ts"
import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts"
import { client } from './database.ts';
import { User } from "../../models/user.ts";
import {IUserRequest} from "../../services/createUserService.ts"
import { Post, postModel } from "../../models/post.ts";

// Úteis

export const sameDateTweet = async function (user_id: string, content: string) {
    const rows = (await client.queryObject(`SELECT * FROM public.posts WHERE post_owner_id='${user_id}' AND content='${content}';`)).rows as postModel[]
    if (rows.length === 0) return false
    return rows.some(tweet => {
        // Aqui eu separo as datas do tweet no formato timestamp.
        // Deixando um array com 3 strings: [ "YYYY", "MM", "DD" ]

        const [now, postFoundTime] = [new Date().toISOString().split('T')[0].split('-'), tweet.created_at.toISOString().split('T')[0].split('-')]

        let sameTime = 0

        now.forEach((time, index) => {
            if (time === postFoundTime[index]) sameTime++
        })

        return sameTime === 3
    })    
}

export const insertNewTweet = async function ({post_id, content, created_at, post_owner_id}: Post) {
    const query = `INSERT INTO public.posts (post_id, content, created_at, post_owner_id) VALUES ('${post_id}', '${content}', '${created_at}', '${post_owner_id}');`
    // console.log(query)
    await client.queryObject(query)
    console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}

// Para o controlador de usuários

export const phoneValid = function (phone: string) {
    return Boolean(phone.match(/^\+[1-9][0-9]\d{1,14}$/))
}

const validProperty =  function (property: string) {
    const properties = ['user_id', 'full_name', 'birth_date', 'city', 'phone', 'email', 'username', 'social_name', 'created_at','bio', 'url_on_bio', 'profile_pic', 'cover_pic', ]
    return properties.some(key => key === property)
}

export const stringForCreateUser = async function (user: User) {

    let [keys, values, first] = ['', '', true]

    for (const key in user) {
        if (key === "password" && first) {
            keys += `"${key}"`
            values += `'${await hash(user[key])}'`
        }

        else if (first && validProperty(key)) {
            keys += `${key}`
            values += `'${user[key as keyof User]}'`
        }

        else if (!user[key as keyof User] && validProperty(key)) continue
        // Caso a propriedade seja undefined, não irá para a string da query

        else if (key === "password") {
            keys += `, "${key}"`
            values += `, '${await hash(user[key])}'`
        }

        else if (validProperty(key)){
            keys += `, ${key}`
            values += `, '${user[key as keyof User]}'`
        }
        first = false
    }

    return [keys, values]
}

export const stringForUpdateUser = async function (user: User) {
    let [changes, first] = ['', true]

    for (const key in user) {
        if (key === 'password' && first) {
            changes += `"${key}"='${await hash(user[key])}'`
        }
        else if (key === 'password') {
            changes += `,"${key}"='${await hash(user[key])}'`
        }
        else if (first && validProperty(key)) {
            changes += `${key}='${user[key as keyof User]}'`
        }
        else if (validProperty(key)){
            changes += `,${key}='${user[key as keyof User]}'`
        }
        first = false
    }

    return changes
}

export const userExist = async function (login: 'username' | 'email' | 'phone') {
    try {
        let result
        if (valid(login)) {
            result = await client.queryObject(`SELECT * FROM public.users WHERE email='${login}' LIMIT 1;`)
         }
         else if (phoneValid(login)) {
            result = await client.queryObject(`SELECT * FROM public.users WHERE phone='${login}' LIMIT 1;`)
         }
         else {
            result = await client.queryObject(`SELECT * FROM public.users WHERE username='${login}' LIMIT 1;`)
         }

        if(result.rows[0]) return result.rows[0]
        return null

    } catch (error) {
        console.log("Não foi possível buscar o usuário.\n", error)
    }
}

export const loginRegistered = async function (user: IUserRequest)  {
    let phone: string | null
    if (!user.phone) phone = null
    else phone = user.phone
  
    const {email, username} = user
    const result = (await client.queryObject(`SELECT * FROM public.users WHERE email='${email}' OR phone='${phone}' OR username='${username}' LIMIT 1;`)).rows as User[]
  
    if (result.length !== 0) {
      if(result[0].phone == phone && phone !== null) return 'phone'
      else if (result[0].email === email) return 'email'
      else return 'username'
    }
    
    return false
}

// export const loginRegistered = function (user: IUserRequest, users: User[])  {
//     let phone: string | null
//     if (!user.phone) phone = null
//     else phone = user.phone
  
//     const {email} = user
  
//     if (users.length !== 0) {
//       if(users[0].phone == phone && phone !== null) return 'phone'
//       else if (users[0].email === email) return 'email'
//       else return 'username'
//     }
    
//     return false
// }

export const insertNewUser = async function (user: User) {
    const [keys, values] = await stringForCreateUser(user)
    const query = `INSERT INTO public.users (${keys}) VALUES (${values});`
    await client.queryObject(query)
    console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}