import { client } from "../../database/database.ts";

export const deleteTweet = async function (tweet_id: string) {
  const query = `UPDATE public.tweets SET deleted = true WHERE tweet_id = '${tweet_id}';`
  await client.queryObject(query)
  console.log(`\nRemoção de tweet feita com sucesso\nQuery:\n`, query)
}