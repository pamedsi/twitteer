import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts"

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

export const equalTweets = function (tweetToPostTimestamp, tweetFoundTimestamp) {
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
