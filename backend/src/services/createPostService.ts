import {sameDateTweet, insertNewTweet} from '../utils/forTweets.ts'
import { Post } from "../models/post.ts";

export interface IPostRequest {
  content: string,
}

export class CreatePostService {
  constructor (private user_id: string) {this.user_id = user_id}

  async execute(content: string){
    const postInfo = await sameDateTweet(this.user_id, content)
    if (postInfo) throw new Error(`Você já twittou isso!`);
    const newPost = new Post(this.user_id, content)
    await insertNewTweet(newPost)
  }

}
