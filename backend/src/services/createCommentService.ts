import { Comment } from "../models/comment.ts";
import {sameDateTweet, insertNewComment} from '../utils/forTweets.ts'


export interface ICommentRequest {
  commented_post_id: string,
  content: string,
}

export class CreateCommentService {
  constructor (private comment_owner_id: string) {this.comment_owner_id = comment_owner_id}

  async execute(comment:  ICommentRequest){
    const postInfo = await sameDateTweet(this.comment_owner_id, comment.content)
    if (postInfo) throw new Error(`Você já twittou isso!`);
    const newComment = new Comment(comment, this.comment_owner_id)
    await insertNewComment(newComment)
  }
}