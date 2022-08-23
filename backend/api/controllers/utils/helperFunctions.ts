import { valid } from "https://deno.land/x/validation@v0.4.0/email.ts"
import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts"
import { client } from './database.ts';
import {userModel} from '../../models/user.ts'

// Úteis

export const sameDateTweet = function (tweetToPostTime: Date , tweetFoundTime: Date ) {
    // Aqui eu separo as datas do tweet no formato timestamp.
    // Deixando um array com 3 strings: [ "YYYY", "MM", "DD" ]
    const [now, postTime] = [tweetToPostTime.toISOString().split('T')[0].split('-'), tweetFoundTime.toISOString().split('T')[0].split('-')]

    let sameTime = 0

    now.forEach((time, index) => {
        if (time === postTime[index]) sameTime++
    })

    return sameTime === 3
}

// Para o controlador de usuários

export const checkingProperty = function (queryResults: userModel[], key: 'phone' | 'email' , value: string) {
    let finder = false
    queryResults.forEach(user => {
        if (user[key] === value) {
            finder = true
            return
        }
    })
    return finder
}

export const phoneValid = function (phone: string) {
    return Boolean(phone.match(/^\+[1-9][0-9]\d{1,14}$/))
}

const validProperty =  function (property: string) {
    const properties = ['full_name', 'birth_date', 'city', 'phone', 'email', 'username', 'social_name', 'bio', 'url_on_bio', 'profile_pic', 'cover_pic']
    return properties.some(key => key === property)
}

export const stringForCreateUser = async function (user: any) {

    let [keys, values, first] = ['', '', true]

    for (const key in user) {
        if (key === "password" && first) {
            keys += `"${key}"`
            values += `'${await hash(user[key])}'`
        }

        else if (first && validProperty(key)) {
            keys += `${key}`
            values += `'${user[key]}'`
        }

        else if (key === "password") {
            keys += `, "${key}"`
            values += `, '${await hash(user[key])}'`
        }

        else if (validProperty(key)){
            keys += `, ${key}`
            values += `, '${user[key]}'`
        }
        first = false
    }

    return [keys, values]
}

export const stringForUpdateUser = async function (user: any) {
    let [changes, first] = ['', true]

    for (const key in user) {
        if (key === 'password' && first) {
            changes += `"${key}"='${await hash(user[key])}'`
        }
        else if (key === 'password') {
            changes += `,"${key}"='${await hash(user[key])}'`
        }
        else if (first && validProperty(key)) {
            changes += `${key}='${user[key]}'`
        }
        else if (validProperty(key)){
            changes += `,${key}='${user[key]}'`
        }
        first = false
    }

    return changes
}

export const userExist = async function (login: string) {
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
