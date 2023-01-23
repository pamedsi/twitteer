import validate from "npm: uuid-validate";

import { canUnlike } from "../../repositories/likes/canUnlike.ts";
import { unlike } from "../../repositories/likes/unlike.ts";

export class UnlikeService {
    async execute(tweetToBeUnliked: string, loggedUser: string){
      if (!validate(tweetToBeUnliked, 4)) throw new Error("ID de tweet inválido!")
      if (!validate(loggedUser, 4)) throw new Error("ID de usuário inválido!")
      const {can, reason} = await canUnlike(tweetToBeUnliked, loggedUser)
      if (!can) throw new Error(`client: ${reason}`);
  
      await unlike(tweetToBeUnliked, loggedUser)
  }
}