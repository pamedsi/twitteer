import validate from "npm: uuid-validate";

import { deleteTweet } from "../../repositories/tweets/deleteTweet.ts";
import { tweetExists } from "../../repositories/tweets/findTweet.ts";

export class DeleteTweetService {
    async execute(tweet_id: string, tweet_owner_id: string){
      if (!validate(tweet_id, 4)) throw new Error("ID de tweet inválido!")

      const tweetFound = await tweetExists(tweet_id)
      if (tweetFound && tweetFound.tweet_owner_id === tweet_owner_id) throw new Error("client: Você não é o dono deste tweet, portanto, não pode apagá-lo.")

      await deleteTweet(tweet_id)
  }
}