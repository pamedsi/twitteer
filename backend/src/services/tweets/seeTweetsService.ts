import validate from "npm: uuid-validate"

import { tweetModel } from "../../models/tweet.ts"
import { getTweetsFromFollowing, getTweetsOfTheLogged } from "../../repositories/twets/getTweets.ts"

export class SeeTweetsService {
  async execute (loggedUserID: string) {
    if (!validate(loggedUserID, 4)) throw new Error("ID Inválido")
    interface IListedTweets {
      myTweets: tweetModel[],
      tweetsFromThoseIFollow: tweetModel[]
    }

    const tweetsOfTheLogged = await getTweetsOfTheLogged(loggedUserID)
    const tweetsOfFollowing = await getTweetsFromFollowing(loggedUserID)

  return {
      myTweets: tweetsOfTheLogged,
      tweetsFromThoseIFollow: tweetsOfFollowing
    } as IListedTweets
  }
}