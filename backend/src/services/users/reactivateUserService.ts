import validate from "npm: uuid-validate"

import { reactivateUser } from "../../repositories/users/reactivateUser.ts";
import { userExists } from "../../repositories/users/userExists.ts";

export class ReactivateUserService {
  async execute(user_id: string) {
      // Fazendo as verificações:
      if (!validate(user_id, 4)) throw new Error("ID Inválido!")
      const userFound = await userExists('', user_id)
      if(!userFound) throw new Error("Usuário não encontrado!");
      if (userFound.userFound.active) throw new Error("Usuário já está ativo!");

      // Reativando:
      await reactivateUser(user_id)
    }  
}
