import { client } from "../../database/database.ts";
import { Comment } from "../../models/comment.ts";

export const insertNewComment  = async function({comment_id, comment_owner_id, commented_tweet_id, content, created_at}: Comment) {
  const query = `INSERT INTO public.comments (comment_id, comment_owner_id, commented_tweet_id, content, created_at) VALUES ('${comment_id}', '${comment_owner_id}', '${commented_tweet_id}', '${content}', '${created_at}');`
  await client.queryObject(query)
  console.log(`\nInserção no banco de dados feita.\nQuery:\n${query}`)
}