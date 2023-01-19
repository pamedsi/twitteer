import validate from "npm: uuid-validate";
import { client } from "../../database/database.ts";
import { followerModel } from "../../models/follower.ts";
import { Tweet } from "../../models/tweet.ts";

export class SeeTweetsService {
  async execute (loggedUserID: string) {
    if (!validate(loggedUserID, 4)) throw new Error("ID Inválido (SeeTweetsService)")
    const queryForTweetsFromLogged = `SELECT * FROM public.tweets WHERE tweet_owner_id = '${loggedUserID}';`
    const {rows: tweetsOfTheLogged} = await client.queryObject<Tweet>(queryForTweetsFromLogged)

    const queryForFollowing = `SELECT * FROM public.followers WHERE follower_id = '${loggedUserID}';`
    const {rows: IDsFollowedByTheLogged} =  await client.queryObject<followerModel>(queryForFollowing)
    const tweetsOfFollowing: Tweet[] = []

    for (let index = 0; index < IDsFollowedByTheLogged.length; index++) {
      const {followed_id} = IDsFollowedByTheLogged[index]
      const queryForTweetsFromFollowed = `SELECT * FROM public.tweets WHERE tweet_owner_id = '${followed_id};`
      const {rows} = await client.queryObject<Tweet>(queryForTweetsFromFollowed)
      tweetsOfFollowing.push(rows[0])
    }

    return {
      myTweets: tweetsOfTheLogged,
      tweetsThatIFollow: tweetsOfFollowing
    }
  }
}