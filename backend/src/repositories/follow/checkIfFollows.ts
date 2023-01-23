import { client } from "../../database/database.ts";
import { User } from "../../models/user.ts";

export const checkIfFollows = async function (follower_id: string, followed_id: string) {

  const {rows: alreadyFollows} = await client.queryObject<User>(`SELECT * FROM public.followers WHERE followed_id='${followed_id}' AND follower_id = '${follower_id}' LIMIT 1;`)

  return Boolean(alreadyFollows.length)
}

