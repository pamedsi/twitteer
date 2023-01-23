import validate from "npm: uuid-validate"

import { checkIfFollows } from "../../repositories/follow/checkIfFollows.ts"
import { unfollow } from "../../repositories/follow/unfollow.ts"
import { userExists } from "../../utils/helperFunctions.ts"

export class UnfollowService {
  async execute (unfollower_id: string, unfollowed_id: string) {
    // Inicialmente apenas verificações:

    // Primeiro para quem vai deixar de seguir:
    if (!validate(unfollower_id, 4) || !validate(unfollowed_id, 4)) throw new Error("ID de usuário inválido!")
    const unfollowerFound = await userExists('', unfollower_id)
    if (!unfollowerFound) throw new Error("Usuário que vai deixar de seguir não encontrado!")
    if (!unfollowerFound.userFound.active) throw new Error("Usuário seguidor desativado!")

    // Depois para quem vai deixar de ser seguido:
    const unfollowedFound = await userExists('', unfollowed_id)
    if (!unfollowedFound) throw new Error("Usuário seguido não encontrado!")
    if (!unfollowedFound.userFound.active) throw new Error("Usuário seguido desativado!")

    // Agora vai verificar se os usuários já se seguem:
    if(!checkIfFollows(unfollower_id, unfollowed_id)) throw new Error("Este usuário não segue ao que você tentou deixar de seguir.")
    
    // E finalmente deleta do banco de dados:
    await unfollow(unfollower_id, unfollowed_id)

  }
}