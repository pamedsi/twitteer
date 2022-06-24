const json = await Deno.readTextFile('./teste.json')
const object = JSON.parse(json)

const getDataForQuery = function (object) {
    let [keys, values, fixer] = ['', '', true]

    for (const key in object) {
        if (fixer) {
            keys += `${key}`
            values += `${object[key]}`
        }
        else {
            keys += `, ${key}`
            values += `, ${object[key]}`
        }
        fixer = false
    }

    return [keys, values]
}

const [keys, values] = getDataForQuery(object)
console.log(keys)
