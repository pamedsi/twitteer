import validate from "npm: uuid-validate";
import { client } from "../../database/database.ts";
import { User } from "../../models/user.ts";
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
    const {rows: alreadyFollows} = await client.queryObject<User>(`SELECT * FROM public.followers WHERE followed_id='${followed_id}' AND follower_id='${follower_id}' LIMIT 1;`)
    if(alreadyFollows.length) throw new Error("Este usuário já segue ao que você tentou seguir.");
        
    // E finalmente insere no banco de dados:
    const query = `INSERT INTO public.followers (follow_id, followed_id, follower_id, created_at) VALUES ('${crypto.randomUUID()}', '${followed_id}'::uuid,'${follower_id}'::uuid, '${new Date().toISOString()}');`
    await client.queryObject(query)
    console.log("\nInserção no banco de dados feita!\nQuery:\n", query)
  }
}