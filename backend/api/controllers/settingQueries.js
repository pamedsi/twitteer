import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";

export const stringForPost = async function (object) {
    let [keys, values, fixer] = ['', '', true]

    for (const key in object) {
        if (key === "password") {
            keys += `, "${key}"`
            values += `, '${await hash(object[key])}'`
        }
        else if (fixer) {
            keys += `${key}`
            values += `'${object[key]}'`
        }
        else {
            keys += `, ${key}`
            values += `, '${object[key]}'`
        }
        fixer = false
    }

    return [keys, values]
}

export const stringForPut = async function (object) {
    let [changes, fixer] = ['', true]

    for (const key in object) {
        if (key === 'password' && fixer) {
            changes += `"${key}"='${await hash(object[key])}'`
        }
        else if (key === 'password' && !fixer) {
            changes += `,"${key}"='${await hash(object[key])}'`
        }
        else if (fixer) {
            changes += `${key}='${object[key]}'`
        }
        else {
            changes += `,${key}='${object[key]}'`
        }
        fixer = false
    }

    return changes
}

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

export const timeStampConversor = function () {
    // YYYY-MM-DD HH:MM:SS
    const now = new Date()
    let [month, day] = [now.getUTCMonth() + 1, now.getUTCDay()]
    let [hour, minute, second] = [now.getUTCHours() - 3, now.getUTCMinutes(), now.getUTCSeconds() ]

    if (month < 10) month = `0${month}`
    if (day < 10) day = `0${day}`

    if (hour < 10) hour = `0${hour}`
    if (minute < 10) minute = `0${minute}`
    if (second < 10) second = `0${second}`
    return `${now.getUTCFullYear()}-${month}-${day} ${hour}:${minute}:${second}`
}

export const checkingEqualTweets = function (tweetToPost, tweetFound) {
    // Os indexes 8 e 9 das strings de timestamp são os correspondentes ao dia
    // Então se essa função retornar true, significa que os tweets foram postados no mesmo dia.
    return tweetToPost[8] + tweetToPost[9] === tweetFound[8] + tweetToPost[9]
}
console.log(timeStampConversor())
