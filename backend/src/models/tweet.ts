export interface tweetModel {
    tweet_id: string
    tweet_owner_id: string
    content: string
    created_at: Date
    deleted: boolean
}

export class Tweet {
    tweet_id: string
    tweet_owner_id: string
    content: string
    created_at: string
    deleted: boolean

    constructor(user_id: string, content: string) {
        this.tweet_id = crypto.randomUUID()
        this.tweet_owner_id = user_id
        this.content = content.trim()
        this.created_at = new Date().toISOString()
        this.deleted = false
    }
}