export interface comment {
    comment_id: string,
    comment_owner_id: string,
    commented_post_id: string,
    content: string,
    post_datetime: string,
    likes: number,
    retweets: number,
    comments: number
}