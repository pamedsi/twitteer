export const stringForCreateComment = function (object) {

    const validProperty =  function (property) {
        const properties = ['comment_owner_id', 'commented_post_id', 'content']
        return properties.some(key => key === property)
    }

    let [keys, values, first] = ['', '', true]

    for (const key in object) {
        if (validProperty(key) && first) {
            keys += `${key}`
            values += `'${object[key]}'`
        }
        else if (validProperty(key)) {
            keys += `, ${key}`
            values += `, '${object[key]}'`
        }

        first = false
    }

    return [keys, values]
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
