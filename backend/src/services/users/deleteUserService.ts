import validate from "npm: uuid-validate"

import { userExists } from "../../repositories/users/userExists.ts"
import { deleteUser } from "../../repositories/users/deleteUser.ts"

export class DeleteUserService {
  async execute(user_id: string) {
    if (!validate(user_id, 4)) throw new Error("ID Inválido!")

    const userFound = await userExists('', user_id)
    if(!userFound) throw new Error("Usuário não encontrado!")
    if (!userFound.userFound.active) throw new Error("Usuário já está desativado!")
    
    await deleteUser(user_id)
  }
}
