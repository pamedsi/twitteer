import { ICommentRequest } from "../services/createCommentService.ts"

export interface commentModel {
    comment_id: string,
    comment_owner_id: string,
    commented_post_id: string,
    content: string,
    created_at: Date,
}

export class Comment {
    comment_id: string
    comment_owner_id: string
    commented_post_id: string
    content: string
    created_at: string

    constructor({commented_post_id, content}:  ICommentRequest, comment_owner_id: string){
        this.comment_id = crypto.randomUUID()
        this.comment_owner_id = comment_owner_id
        this.commented_post_id = commented_post_id
        this.content = content.trim()
        this.created_at = new Date().toISOString()
    }
}