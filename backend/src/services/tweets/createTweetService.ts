import validate from "npm: uuid-validate";
import { Tweet } from "../../models/tweet.ts";
import { sameDateTweet,insertNewTweet } from "../../utils/forTweets.ts";

export interface ITweetRequest {
  content: string,
}

export class CreateTweetService {
  async execute(user_id: string, content: string){
    if (!validate(user_id, 4)) throw new Error("ID de usuário inválido!")

    const tweetInfo = await sameDateTweet(user_id, content)
    if (tweetInfo) throw new Error("Você já twittou isso!")
    if (content.length > 280) throw new Error("Seu tweet não pode ter mais que 280 caracteres.")

    const newTweet = new Tweet(user_id, content)
    await insertNewTweet(newTweet)
  }
}
