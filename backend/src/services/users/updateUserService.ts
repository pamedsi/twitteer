import isEmail from "https://deno.land/x/deno_validator@v0.0.5/lib/isEmail.ts"
import { isMobilePhone } from "https://deno.land/x/deno_validator@v0.0.5/mod.ts"
import { errorMessageForSameData } from "../../utils/forUsers/forUpdatingUsers.ts"

import { updateUser } from "../../repositories/users/updateUser.ts"
import { dataAlreadyRegistered } from "../../repositories/users/dataAlreadyRegistered.ts"
import { availableData } from "../../utils/forUsers/utils.ts";
import { validDate, validDisplayName, validPassword, validUsername } from "../../utils/forUsers/validators.ts"
import { DeleteUserService } from "./deleteUserService.ts";
import {is_uri} from "npm: valid-url"

export interface IUpdateUserRequest {
	display_name?: string;
  birth_date?: string;
  location?: string;
  phone?: string;
  email?: string;
  username?: string;
  password?: string;
  bio?: string;
  url_on_bio?: string;
  profile_pic?: string;
  cover_pic?: string;
}

export class UpdateUserService {
  async execute(user_id: string, updatesRequest: IUpdateUserRequest){
    const {sameData, newData, created_at} = await dataAlreadyRegistered(user_id, updatesRequest)
    const [lengthOfSame, lenghtOfNew] = [Object.keys(sameData).length, Object.keys(newData).length]
    if (!lenghtOfNew && !lengthOfSame) throw new Error("client: Sem dados para atualizar")
    if (!lenghtOfNew) throw new Error("client: Dados já cadastrados!")
    const {birth_date, email, phone, username, password, display_name, url_on_bio, bio} = updatesRequest
    
    // Validando as informações recebidas:
    // Primeiro verificando se da nova data de nascimento inserida até a data da criação da conta o usuário tinha menos que 13 anos.
    
    if (birth_date) {
      const {isValidDate, error} = validDate(String(birth_date), created_at)
      if (!isValidDate && error === 'Idade insuficiente!') {
        await updateUser( {birth_date} as IUpdateUserRequest, user_id)
        const deleteUserService = new DeleteUserService()
        await deleteUserService.execute(user_id)
        throw new Error("Sua conta foi suspensa por violar os termos de uso do aplicativo.")
      }
      if(!isValidDate) throw new Error(`client: ${error}`);
    }

    // Validando nome de usuário:
    if (display_name) {
      const {isValidName, problem} = validDisplayName(display_name)
      if (!isValidName) throw new Error(`client: ${problem}`);
    }
    if (email && !isEmail(email, {})) throw new Error("client: Email inválido")
    if (username) {
      const {isValidUsername, reason} = validUsername(username)
      if(!isValidUsername) throw new Error(`client: ${reason}`);
    }
    if(phone && !isMobilePhone(phone, '', {})) throw new Error("client: Número de celular inválido!")
    const {available, data} = await availableData(updatesRequest)
    if (!available) throw new Error(`client: ${data} já cadastrado!`);

    // Validando a senha:
    if (password) {
      const {isValidPassword, missing} = validPassword(password)
      if(!isValidPassword) throw new Error(`client: Senha inválida! Precisa de ${missing}.`)
    }
    // Validando data de nascimento:
    if(birth_date) {
      const {isValidDate, error} = validDate(birth_date)
      if(!isValidDate) throw new Error(`client: ${error}`)
    }

    // Verificando a URL na bio e a bio:
    if (url_on_bio) {
      if(!is_uri(url_on_bio)) throw new Error("client: URL da bio inválida!");
    }
    if(bio && bio.length > 160) throw new Error("client: Bio muito longa! Utilize no máximo 160 caracteres.");

    // Atualizando:
    if (!lengthOfSame) await updateUser(updatesRequest, user_id)
    else if (lenghtOfNew) {
      await updateUser(newData, user_id)
      const message = `Algumas atualizações foram feitas, mas os seguites dados já estavam cadastrados: ${errorMessageForSameData(sameData)}então foram descartados.`
      console.error(message)
      // throw new Error(message)  
    }
  }
}