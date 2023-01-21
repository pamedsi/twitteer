export interface ILikeModel {
  like_id: string
  tweet_liked_id: string
  user_who_liked: string
  created_at: Date
}

export class Like {
  like_id: string
  tweet_liked_id: string
  user_who_liked: string
  created_at: string

  constructor(tweetToBeLiked: string, loggedUser: string, ) {
    this.like_id = crypto.randomUUID()
    this.tweet_liked_id = tweetToBeLiked.trim()
    this.user_who_liked = loggedUser.trim()
    this.created_at = new Date().toISOString()
  }
}