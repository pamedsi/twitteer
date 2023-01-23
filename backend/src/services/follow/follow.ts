import validate from "npm: uuid-validate";

import { checkIfFollows } from "../../repositories/follow/checkIfFollows.ts";
import { follow } from "../../repositories/follow/follow.ts";
import { userExists } from "../../utils/helperFunctions.ts";

export class FollowService {
  async execute (follower_id: string, followed_id: string) {
    // Inicialmente apenas verificações:
    
    // Primeiro para o seguidor:
    if (!validate(follower_id, 4) || !validate(followed_id, 4)) throw new Error("ID de usuário inválido!")
    const followerFound = await userExists('', follower_id)
    if (!followerFound) throw new Error("Usuário seguidor não encontrado!")
    if (!followerFound.userFound.active) throw new Error("Usuário seguidor desativado!")

    // Depois para quem vai ser seguido:
    const followedFound = await userExists('', followed_id)
    if (!followedFound) throw new Error("Usuário seguido não encontrado!")
    if (!followedFound.userFound.active) throw new Error("Usuário seguido desativado!")

    // Agora vai verificar se os usuários já se seguem:
    if (await checkIfFollows(follower_id, followed_id)) throw new Error("Este usuário já segue ao que você tentou seguir.");
        
    // E finalmente insere no banco de dados:
    await follow(follower_id, followed_id)
  }
}