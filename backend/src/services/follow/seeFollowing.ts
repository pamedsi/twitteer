import validate from "npm: uuid-validate";

import { client } from "../../database/database.ts"
import { followerModel } from "../../models/follower.ts";
import { User } from "../../models/user.ts"

export class SeeFollowingService {
  async execute (loggedUserID: string) {
    if (!validate(loggedUserID, 4)) throw new Error("ID Inválido (SeeFollowingService)")
    const queryForFollowedID = `SELECT * FROM public.followers WHERE follower_id = '${loggedUserID}';`
    const {rows: IDsFound} =  await client.queryObject<followerModel>(queryForFollowedID)
    const following: User[] = []
    
    for (let index = 0; index < IDsFound.length; index++) {
      const {followed_id} = IDsFound[index]
      const query = `SELECT * FROM public.users WHERE user_id = '${followed_id}' LIMIT 1;`
      const {rows} =  await client.queryObject<User>(query)
      following.push(rows[0])
    }

    return following
  }
}