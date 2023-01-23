import validate from "npm: uuid-validate"

import { ITweetRequest, Tweet, tweetModel } from "../../models/tweet.ts"
import { insertNewTweet } from "../../repositories/twets/insertTweet.ts"
import { sameDateTweet } from "../../utils/forTweets.ts"

export class CreateTweetService {
  async execute(user_id: string, {content, location, replies_to}: ITweetRequest){
    if (!validate(user_id, 4)) throw new Error("ID de usuário inválido!")

    const tweetInfo = await sameDateTweet(user_id, content)
    if (tweetInfo) throw new Error("client: Você já twittou isso!")
    if (content.length === 0) throw new Error("client: Seu tweet não pode estar vazio!")
    if (content.length > 280) throw new Error("client: Seu tweet não pode ter mais que 280 caracteres.")

    const newTweet = new Tweet({content, location, replies_to} as tweetModel, user_id)
    await insertNewTweet(newTweet)
  }
}
