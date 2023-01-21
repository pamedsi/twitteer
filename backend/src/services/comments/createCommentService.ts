import validate from "npm: uuid-validate"

import { Comment } from "../../models/comment.ts"
import { sameDateTweet } from '../../utils/forTweets.ts'

import { insertNewComment } from "../../repositories/twets/InsertComment.ts"

export interface ICommentRequest {
  commented_tweet_id: string,
  content: string,
  location?: string
}

export class CreateCommentService {
    async execute(comment:  ICommentRequest, comment_owner_id: string){
      if (!validate(comment_owner_id, 4)) throw new Error("ID de usuário inválido!")
      
      const commentInfo = await sameDateTweet(comment_owner_id, comment.content)
      if (commentInfo) throw new Error(`client: Você já twittou isso!`);
      if (comment.content.length === 0) throw new Error("client: Seu tweet não pode estar vazio.");
      if (comment.content.length > 280) throw new Error("client: Seu tweet não pode ter mais que 280 caracteres.");
      
      const newComment = new Comment(comment, comment_owner_id)
      await insertNewComment(newComment)
  }
}