import { ITweetRequest } from "../services/tweets/createTweetService.ts"

export interface tweetModel {
    tweet_id: string
    tweet_owner_id: string
    content: string
    created_at: Date
    location?: string
    deleted: boolean
}

export class Tweet {
    tweet_id: string
    tweet_owner_id: string
    content: string
    created_at: string
    location?: string
    deleted: boolean

    constructor(user_id: string, {content, location}: ITweetRequest) {
        this.tweet_id = crypto.randomUUID()
        this.tweet_owner_id = user_id
        this.content = content.trim()
        this.created_at = new Date().toISOString()
        if (location) this.location = location.trim()
        this.deleted = false
    }
}