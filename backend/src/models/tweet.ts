import { getLikes, showWhoLiked } from "../repositories/twets/getTweetLikes.ts"
import { ILikeModel } from "./like.ts"

export interface tweetModel {
    tweet_id: string
    tweet_owner_id: string
    content: string
    created_at: Date
    location?: string
    replies_to?: string
    likes?: number
    replies?: tweetModel[]
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
    created_at: Date | string
    location?: string
    replies_to?: string
    deleted: boolean
    likes?: number
    replies?: tweetModel[]
    likeData?: ILikeModel[]

    constructor({tweet_id, tweet_owner_id, content, created_at, location, replies_to, deleted}: tweetModel, user_id?: string) {
        // Se for passado como argumento um id do usuário logado, sabemos que é um novo tweet que está sendo criado.

        if (user_id) {
            this.tweet_id = crypto.randomUUID()
            this.tweet_owner_id = user_id
            this.content = content.trim()
            this.created_at = new Date().toISOString()
            if (location) this.location = location.trim()
            if (replies_to) this.replies_to = replies_to
            this.deleted = false
        }

        else {
            this.tweet_id = tweet_id
            this.tweet_owner_id = tweet_owner_id
            this.content = content.trim()
            this.created_at = created_at
            if (location) this.location = location.trim()
            if (replies_to) this.replies_to = replies_to
            this.deleted = deleted           
        }
    }

    async getTweetLikes () {
        const likes = await getLikes(this.tweet_id)
        this.likes = likes.length
        this.likeData = likes
        return {
            numberOfLikes: likes.length,
            likesInfo: likes
        }
    }

    async seeWhoLiked() {
        if (!this.likeData) {
            const { likesInfo } = await this.getTweetLikes()
            const usersWhoLiked = await showWhoLiked(likesInfo)
            return usersWhoLiked
        }        
    }
}