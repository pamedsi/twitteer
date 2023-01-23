import validate from "npm: uuid-validate";
import { Like } from "../../models/like.ts";
import { canLikeTWeet } from "../../repositories/likes/canLike.ts";
import { insertNewLike } from "../../repositories/likes/like.ts";

export class LikeTweetService {
    async execute(tweetToBeLiked: string, loggedUser: string){
      if (!validate(tweetToBeLiked, 4)) throw new Error("ID de tweet inválido!")
      if (!validate(loggedUser, 4)) throw new Error("ID de usuário inválido!")
      const {can, reason} = await canLikeTWeet(tweetToBeLiked, loggedUser)
      if (!can) throw new Error(`client: ${reason}`);
      
      const like = new Like(tweetToBeLiked, loggedUser)
      await insertNewLike(like)
  }
}