import { client } from "../../database/database.ts";
import { followerModel } from "../../models/follower.ts";
import { tweetModel } from "../../models/tweet.ts";
import { getLikes } from "./getTweetLikes.ts";

export const getTweetsOfTheLogged = async function (loggedUserID: string) {
  const queryForTweetsFromLogged = `SELECT * FROM public.tweets WHERE tweet_owner_id = '${loggedUserID}';`
  const {rows: tweetsOfTheLogged} = await client.queryObject<tweetModel>(queryForTweetsFromLogged)

  // Colocando o número de likes do tweet.
  tweetsOfTheLogged.forEach(async (tweet, index) => {
    const likes = await getLikes(tweet.tweet_id)
    tweetsOfTheLogged[index].likes = likes.length

  })

  return tweetsOfTheLogged
}

export const getTweetsFromFollowing = async function (loggedUserID: string){
  const queryForFollowing = `SELECT * FROM public.followers WHERE follower_id = '${loggedUserID}';`
  const {rows: IDsFollowedByTheLogged} =  await client.queryObject<followerModel>(queryForFollowing)
  const tweetsOfFollowing: tweetModel[] = []

  for (let index = 0; index < IDsFollowedByTheLogged.length; index++) {
    const { followed_id } = IDsFollowedByTheLogged[index]
    const queryForTweetsFromFollowed = `SELECT * FROM public.tweets WHERE tweet_owner_id = '${followed_id}' and deleted = false;`
    const {rows} = await client.queryObject<tweetModel>(queryForTweetsFromFollowed)

    // Colocando o número de likes do tweet.
    rows.forEach(async (tweet, index) => {
      const likes = await getLikes(tweet.tweet_id)
      rows[index].likes = likes.length
    })

    tweetsOfFollowing.push(...rows)
  }

  return tweetsOfFollowing
}
