import validate from "npm: uuid-validate";
import { client } from "../../database/database.ts";
import { Tweet } from "../../models/tweet.ts";

export class DeleteTweetService {
    async execute(tweet_id: string){
      if (!validate(tweet_id, 4)) throw new Error("ID de tweet inválido!")

      const queryForFindingComment = `SELECT * FROM public.tweets WHERE tweet_id = '${tweet_id}' LIMIT 1;`
      const {rows: tweetFound} = await client.queryObject<Tweet>(queryForFindingComment)
      if (!tweetFound.length) throw new Error("Tweet não encontrado!");
      if (tweetFound[0].deleted) throw new Error("Tweet já está deletado!");

      const query = `UPDATE public.tweets SET deleted = true WHERE tweet_id = '${tweet_id}';`
      await client.queryObject(query)
      console.log(`\nRemoção de tweet feita com sucesso\nQuery:\n`, query)
  }
}