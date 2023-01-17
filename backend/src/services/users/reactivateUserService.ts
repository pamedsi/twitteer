import { client } from "../../database/database.ts"
import { User } from "../../models/user.ts"
import validate from "npm: uuid-validate"

export class ReactivateUserService {
  async execute(user_id: string) {

      // Fazendo as verificações:
      if (!validate(user_id, 4)) throw new Error("ID Inválido!")
      const queryForFindingUser = `SELECT * FROM public.users WHERE user_id = '${user_id}' LIMIT 1;`
      const {rows: userFound} = await client.queryObject<User>(queryForFindingUser)
      if(!userFound.length) throw new Error("Usuário não encontrado!");
      if (userFound[0].active) throw new Error("Usuário já está ativo!");

      const query = `UPDATE public.users SET active = true WHERE user_id = '${user_id}';`
      await client.queryObject(query)
      console.log(`\nReativação feita com sucesso\nQuery:\n`, query)
    }  
}