import { ICommentRequest } from "../services/comments/createCommentService.ts"

export interface commentModel {
    comment_id: string,
    comment_owner_id: string,
    commented_tweet_id: string,
    content: string,
    created_at: Date,
    location?: string
    deleted: false
}

export class Comment {
    comment_id: string
    comment_owner_id: string
    commented_tweet_id: string
    content: string
    created_at: string
    location?: string
    deleted: false

    constructor({commented_tweet_id, content, location}:  ICommentRequest, comment_owner_id: string){
        this.comment_id = crypto.randomUUID()
        this.comment_owner_id = comment_owner_id
        this.commented_tweet_id = commented_tweet_id
        this.content = content.trim()
        this.created_at = new Date().toISOString()
        if (location) this.location = location.trim()
        this.deleted = false
    }
}