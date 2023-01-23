import { client } from "../../database/database.ts";
import { followerModel } from "../../models/follower.ts";
import { tweetModel } from "../../models/tweet.ts";
import { getReplies } from "./getReplies.ts";
import { getLikes } from "../likes/getLikes.ts";

export const getTweetsOfTheLogged = async function (loggedUserID: string) {
  const queryForTweetsFromLogged = `SELECT * FROM public.tweets WHERE tweet_owner_id = '${loggedUserID}';`
  const {rows: tweetsOfTheLogged} = await client.queryObject<tweetModel>(queryForTweetsFromLogged)

  // Colocando o número de likes do tweet.
  for (let index = 0; index < tweetsOfTheLogged.length; index++) {
    const tweet = tweetsOfTheLogged[index];
    const likesFound = await getLikes(tweet.tweet_id)
    tweetsOfTheLogged[index].likes = likesFound.length
    tweetsOfTheLogged[index].replies = await getReplies(tweetsOfTheLogged[index].tweet_id)
  }

  return tweetsOfTheLogged
}

export const getTweetsFromFollowing = async function (loggedUserID: string){
  const queryForFollowing = `SELECT * FROM public.followers WHERE follower_id = '${loggedUserID}';`
  const {rows: IDsFollowedByTheLogged} =  await client.queryObject<followerModel>(queryForFollowing)
  const tweetsOfFollowing: tweetModel[] = []

  for (let i = 0; i < IDsFollowedByTheLogged.length; i++) {
    const { followed_id } = IDsFollowedByTheLogged[i]
    const queryForTweetsFromFollowed = `SELECT * FROM public.tweets WHERE tweet_owner_id = '${followed_id}' and deleted = false;`
    const {rows: tweets} = await client.queryObject<tweetModel>(queryForTweetsFromFollowed)

    // Colocando o número de likes do tweet.
    for (let j = 0; j < tweets.length; j++) {
      const tweet = tweets[j];
      const likes = await getLikes(tweet.tweet_id)
      tweets[j].likes = likes.length
      tweets[j].replies = await getReplies(tweets[j].tweet_id)
    }

    tweetsOfFollowing.push(...tweets)
  }

  return tweetsOfFollowing
}
