import validate from "npm: uuid-validate";

import { client } from "../../database/database.ts"
import { followerModel } from "../../models/follower.ts";
import { User } from "../../models/user.ts"

export class SeeFollowersService {
  async execute (loggedUserID: string) {
    if (!validate(loggedUserID, 4)) throw new Error("ID Inválido (SeeFollowersService)")
    const queryForFollowersID = `SELECT * FROM public.followers WHERE followed_id = '${loggedUserID}';`
    const {rows: IDsFound} =  await client.queryObject<followerModel>(queryForFollowersID)
    const followers: User[] = []
    
    for (let index = 0; index < IDsFound.length; index++) {
      const {follower_id} = IDsFound[index];
      const query = `SELECT * FROM public.users WHERE user_id = '${follower_id}' LIMIT 1;`
      const {rows} =  await client.queryObject<User>(query)
      followers.push(rows[0])
    }

    return followers
  }
}