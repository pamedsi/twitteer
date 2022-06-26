const json = await Deno.readTextFile('./teste.json')
const object = JSON.parse(json)

const getDataForQuery = function (object) {
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

const [keys, values] = getDataForQuery(object)
console.log(`INSERT INTO public.users (${keys}) VALUES (${values})`)
