import validate from "npm: uuid-validate";
import { client } from "../../database/database.ts"
import { User } from "../../models/user.ts";
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
    const {rows: alreadyFollows} = await client.queryObject<User>(`SELECT * FROM public.followers WHERE followed_id='${unfollowed_id}' AND follower_id='${unfollower_id}' LIMIT 1;`)
    if(!alreadyFollows.length) throw new Error("Este usuário não segue ao que você tentou deixar de seguir.")

    // E finalmente deleta do banco de dados:
    const query = `DELETE FROM public.followers WHERE follower_id = '${unfollower_id}' and followed_id = '${unfollowed_id}';`
    await client.queryObject(query)
    console.log("\nRemoção no banco de dados feita!\nQuery:\n", query) 
  }
}