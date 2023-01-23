import validate from "npm: uuid-validate";
import { getFollowing } from "../../repositories/follow/getFolloing.ts";

export class SeeFollowingService {
  async execute (loggedUserID: string) {
    if (!validate(loggedUserID, 4)) throw new Error("ID Inválido (SeeFollowingService)")
    const following = await getFollowing(loggedUserID)
    return following
  }
}