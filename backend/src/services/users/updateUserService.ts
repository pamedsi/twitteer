import isEmail from "https://deno.land/x/deno_validator@v0.0.5/lib/isEmail.ts";
import { isMobilePhone } from "https://deno.land/x/deno_validator@v0.0.5/mod.ts";
import { dataAlreadyRegistered, errorMessageForSameData, updateUserQuery } from "../../utils/forUsers/forUpdatingUsers.ts";
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
    if (!lenghtOfNew && !lengthOfSame) throw new Error("Sem dados para atualizar")
    if (!lenghtOfNew) throw new Error("Dados já cadastrados!")
    const {birth_date, email, phone, username, password, display_name, url_on_bio, bio} = updatesRequest
    
    // Validando as informações recebidas:
    // Primeiro verificando se da nova data de nascimento inserida até a data da criação da conta o usuário tinha menos que 13 anos.
    
    if (birth_date) {
      const {isValidDate, error} = validDate(String(birth_date), created_at)
      if (!isValidDate && error === 'Idade insuficiente!') {
        await updateUserQuery( {birth_date} as IUpdateUserRequest, user_id)
        const deleteUserService = new DeleteUserService()
        await deleteUserService.execute(user_id)
        throw new Error("Sua conta foi suspensa por violar os termos de uso do aplicativo.")
      }
      if(!isValidDate) throw new Error(error);
    }

    // Validando nome de usuário:
    if (display_name) {
      const {isValidName, problem} = validDisplayName(display_name)
      if (!isValidName) throw new Error(problem);
    }
    if (email && !isEmail(email)) throw new Error("Email inválido")
    if (username) {
      const {isValidUsername, reason} = validUsername(username)
      if(!isValidUsername) throw new Error(reason);
    }
    if(phone && !isMobilePhone(phone)) throw new Error("Número de celular inválido!")
    const {available, data} = await availableData(updatesRequest)
    if (!available) throw new Error(`${data} já cadastrado!`);

    // Validando a senha:
    if (password) {
      const {isValidPassword, missing} = validPassword(password)
      if(!isValidPassword) throw new Error(`Senha inválida! Precisa de ${missing}.`)
    }
    // Validando data de nascimento:
    if(birth_date) {
      const {isValidDate, error} = validDate(birth_date)
      if(!isValidDate) throw new Error(error)
    }

    // Verificando a URL na bio e a bio:
    if (url_on_bio) {
      if(!is_uri(url_on_bio)) throw new Error("URL da bio inválida!");
    }
    if(bio && bio.length > 160) throw new Error("Bio muito longa! Utilize no máximo 160 caracteres.");

    // Atualizando:

    if (!lengthOfSame) await updateUserQuery(updatesRequest, user_id)
    else if (lenghtOfNew) {
      await updateUserQuery(newData, user_id)
      const message = `Algumas atualizações foram feitas, mas os seguites dados já estavam cadastrados: ${errorMessageForSameData(sameData)}então foram descartados.`
      console.error(message)
      // throw new Error(message)  
    }
  }
}