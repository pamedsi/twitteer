export interface tweetModel {
    tweet_id: string
    tweet_owner_id: string
    content: string
    created_at: Date
    location?: string
    replies_to?: string,
    deleted: boolean
}

export interface ITweetRequest {
    content: string,
    replies_to?: string,
    location?: string
  }

export class Tweet {
    tweet_id: string
    tweet_owner_id: string
    content: string
    created_at: string
    location?: string
    replies_to?: string
    deleted: boolean

    constructor(user_id: string, {content, location, replies_to}: ITweetRequest) {
        this.tweet_id = crypto.randomUUID()
        this.tweet_owner_id = user_id
        this.content = content.trim()
        this.created_at = new Date().toISOString()
        if (location) this.location = location.trim()
        if (replies_to) this.replies_to = replies_to
        this.deleted = false
    }
}