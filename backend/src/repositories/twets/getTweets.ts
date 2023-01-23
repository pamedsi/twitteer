import { client } from "../../database/database.ts";
import { followerModel } from "../../models/follower.ts";
import { tweetModel } from "../../models/tweet.ts";

export const getTweetsOfTheLogged = async function (loggedUserID: string) {
  const queryForTweetsFromLogged = `SELECT * FROM public.tweets WHERE tweet_owner_id = '${loggedUserID}';`
  const {rows: tweetsOfTheLogged} = await client.queryObject<tweetModel>(queryForTweetsFromLogged)
  return tweetsOfTheLogged
}

export const getTweetsFromFollowing = async function (loggedUserID: string){
  const queryForFollowing = `SELECT * FROM public.followers WHERE follower_id = '${loggedUserID}';`
  const {rows: IDsFollowedByTheLogged} =  await client.queryObject<followerModel>(queryForFollowing)
  const tweetsOfFollowing: tweetModel[] = []

  for (let index = 0; index < IDsFollowedByTheLogged.length; index++) {
    const {followed_id} = IDsFollowedByTheLogged[index]
    const queryForTweetsFromFollowed = `SELECT * FROM public.tweets WHERE tweet_owner_id = '${followed_id}' and deleted = false;`
    const {rows} = await client.queryObject<tweetModel>(queryForTweetsFromFollowed)

    tweetsOfFollowing.push(...rows)
  }

  return tweetsOfFollowing
}
