import { valid } from "https://deno.land/x/validation@v0.4.0/email.ts"
import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts"

// Úteis

export const nowInTimestamp = function () {
    // YYYY-MM-DD HH:MM:SS
    const now = new Date()
    let [month, day] = [now.getUTCMonth() + 1, now.getUTCDate()]
    let [hour, minute, second] = [now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds() ]

    if (month < 10) month = `0${month}`
    if (day < 10) day = `0${day}`

    if (hour < 10) hour = `0${hour}`
    if (minute < 10) minute = `0${minute}`
    if (second < 10) second = `0${second}`
    return `${now.getUTCFullYear()}-${month}-${day} ${hour}:${minute}:${second}`
}

export const sameDateTweet = function (tweetToPostTimestamp, tweetFoundTimestamp) {
    // Aqui eu separo as datas do tweet no formato timestamp.
    // Deixando um array com 3 strings: [ "YYYY", "MM", "DD" ]
    tweetToPostTimestamp = tweetToPostTimestamp.split(' ')[0].split('-')
    tweetFoundTimestamp = tweetFoundTimestamp.split(' ')[0].split('-')
    let sameTime = 0

    tweetToPostTimestamp.forEach((time, index) => {
        if (time === tweetFoundTimestamp[index]) sameTime++
    })

    return sameTime === 3
}

// Para o controlador de usuários

export const checkingProperty = function (queryResults, key, value) {
    let finder = false
    queryResults.forEach(user => {
        if (user[key] === value) {
            finder = true
            return
        }
    })
    return finder
}

export const phoneValid = function (phone) {
    return Boolean(phone.match(/^\+[1-9][0-9]\d{1,14}$/))
}

const validProperty =  function (property) {
    const properties = ['full_name', 'birth_date', 'city', 'phone', 'email', 'username', 'social_name', 'bio', 'url_on_bio', 'profile_pic', 'cover_pic']
    return properties.some(key => key === property)
}

export const stringForCreateUser = async function (object) {

    let [keys, values, first] = ['', '', true]

    for (const key in object) {
        if (key === "password" && first) {
            keys += `"${key}"`
            values += `'${await hash(object[key])}'`
        }

        else if (first && validProperty(key)) {
            keys += `${key}`
            values += `'${object[key]}'`
        }

        else if (key === "password") {
            keys += `, "${key}"`
            values += `, '${await hash(object[key])}'`
        }

        else if (validProperty(key)){
            keys += `, ${key}`
            values += `, '${object[key]}'`
        }
        first = false
    }

    return [keys, values]
}

export const stringForUpdateUser = async function (object) {
    let [changes, first] = ['', true]

    for (const key in object) {
        if (key === 'password' && first) {
            changes += `"${key}"='${await hash(object[key])}'`
        }
        else if (key === 'password') {
            changes += `,"${key}"='${await hash(object[key])}'`
        }
        else if (first && validProperty(key)) {
            changes += `${key}='${object[key]}'`
        }
        else if (validProperty(key)){
            changes += `,${key}='${object[key]}'`
        }
        fixer = false
    }

    return changes
}

export const userExist = async function (login) {
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
