import validate from "npm: uuid-validate";

import { getFollowers } from "../../repositories/follow/getFollowers.ts";

export class SeeFollowersService {
  async execute (loggedUserID: string) {
    if (!validate(loggedUserID, 4)) throw new Error("ID Inválido (SeeFollowersService)")
    const followers = await getFollowers(loggedUserID)
    return followers
  }
}