import validate from "npm: uuid-validate";
import { client } from "../../database/database.ts";
import { Like } from "../../models/like.ts";
import { Tweet } from "../../models/tweet.ts";
import { insertNewLike } from "../../repositories/twets/likeTweet.ts";

export class LikeTweetService {
    async execute(tweetToBeLiked: string, loggedUser: string){
      if (!validate(tweetToBeLiked, 4)) throw new Error("client: ID de tweet inválido!")
      if (!validate(loggedUser, 4)) throw new Error("ID de usuário inválido!")

      const queryForFindingTweet = `SELECT * FROM public.tweets WHERE tweet_id = '${tweetToBeLiked}' LIMIT 1;`
      const {rows: tweetFound} = await client.queryObject<Tweet>(queryForFindingTweet)
      if (!tweetFound.length) throw new Error("client: Tweet não encontrado!");
      if (tweetFound[0].deleted) throw new Error("client: Tweet está deletado!");

      const like = new Like(tweetToBeLiked, loggedUser)
      await insertNewLike(like)
  }
}