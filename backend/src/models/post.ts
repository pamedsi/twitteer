export interface postModel {
    post_id: string,
    post_owner_id: string,
    content: string,
    created_at: Date,
}

export class Post {
    post_id: string
    post_owner_id: string
    content: string
    created_at: string

    constructor(user_id: string, content: string) {
        this.post_id = crypto.randomUUID()
        this.post_owner_id = user_id
        this.content = content.trim()
        this.created_at = new Date().toISOString()
    }
}