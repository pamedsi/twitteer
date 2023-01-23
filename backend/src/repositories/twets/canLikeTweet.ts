import { client } from "../../database/database.ts";
import { Like } from "../../models/like.ts";
import { Tweet } from "../../models/tweet.ts";

export const canLikeTWeet = async function (tweet_id: string, loggedUser: string) {
  interface tweetValidity {
    can: boolean,
    reason?: string
  }
  
  const queryForFindingTweet = `SELECT * FROM public.tweets WHERE tweet_id = '${tweet_id}' and deleted = false LIMIT 1;`
  const {rows: tweetFound} = await client.queryObject<Tweet>(queryForFindingTweet)
  if (!tweetFound.length) return { can: false, reason: "Tweet não encontrado."} as tweetValidity
  
  // Checando se o tweeet já foi curtido pelo usuário logado.
  const queryForCheckLike = `SELECT * FROM public.likes WHERE user_who_liked = '${loggedUser}' LIMIT 1;`
  const {rows: likeFound} = await client.queryObject<Like>(queryForCheckLike)
  if (likeFound.length) return {can: false, reason: "Você já curtiu esse tweet."} as tweetValidity
 
  return {
    can: true
  } as tweetValidity

}