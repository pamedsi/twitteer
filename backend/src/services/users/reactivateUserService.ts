import { client } from "../../database/database.ts"
import { User } from "../../models/user.ts"
import validate from "npm: uuid-validate";

export class ReactivateUserService {
  async execute(user_id: string) {
    // Esse bloco try/catch não era para estar aqui.
    // Mas, Por algum motivo, o catch do controlador não está pegando o erro da linha 15, de quando o usuário já está ativo.
    // Então criei essa interface para corrigir esse erro.
    interface successfully {
      successful: boolean
      error?: string
    }

    try {
      if (!validate(user_id, 4)) throw new Error("ID Inválido!")
      const queryForFindingUser = `SELECT * FROM public.users WHERE user_id = '${user_id}' LIMIT 1;`
      const {rows: userFound} = await client.queryObject<User>(queryForFindingUser)
      if(!userFound.length) throw new Error("Usuário não encontrado!");
      if (userFound[0].active) throw new Error("Usuário já está ativo!");
      const query = `UPDATE public.users SET active = true WHERE user_id = '${user_id}';`
      await client.queryObject(query)
      console.log(`Reativação feita com sucesso\nQuery:\n`, query)
      return { successful: true } as successfully
    } 
    catch (error) {
      return { successful: false, error: String(error).replace('Error: ', '') } as successfully
    }
  }
}