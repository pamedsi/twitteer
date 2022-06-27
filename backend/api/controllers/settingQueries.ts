import { user } from '../models/user.ts';

export const stringForPost = function (object: user) {
    let [keys, values, fixer] = ['', '', true]

    for (const key in object) {
        if (key === "password") {
            keys += `, "${key}"`
            values += `, '${object[key]}'`
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

export const stringForPut = function (object: user) {
    let [changes, fixer] = ['', true]

    for (const key in object) {
        if (fixer) {
            changes += `${key}='${object[key]}'`
        }
        else {
            changes += `,${key}='${object[key]}'`
        }
        fixer = false
    }

    return changes
}