import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import { user } from '../models/user.ts';

export const stringForPost = async function (object: user) {
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

export const stringForPut = async function (object: user) {
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

export const checkingProperty = function (queryResults: user[], key, value) {
    let finder = false
    queryResults.forEach(user => {
        if (user[key] === value) {
            finder = true
            return
        }
    })
    return finder
}