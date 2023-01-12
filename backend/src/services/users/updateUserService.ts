import isEmail from "https://deno.land/x/deno_validator@v0.0.5/lib/isEmail.ts";
import { isMobilePhone } from "https://deno.land/x/deno_validator@v0.0.5/mod.ts";
import { dataAlreadyRegistered, errorMessageForSameData, updateUserQuery } from "../../utils/forUsers/forUpdatingUsers.ts";
import { availableData, validateDate, validPassword, validRegexUsername } from "../../utils/forUsers/utils.ts";
import { DeleteUserService } from "./deleteUserService.ts";

export interface IUpdateUserRequest {
	full_name?: string;
  birth_date?: string;
  city?: string;
  phone?: string;
  email?: string;
  username?: string;
  password?: string;
  social_name?: string;
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
    const {birth_date, email, phone, username, password} = updatesRequest
    
    // Validando as informações recebidas:
    // Primeiro verificando se da nova data de nascimento inserida até a data da criação da conta o usuário tinha menos que 13 anos.
    
    if (birth_date) {
      const {valid, error} = validateDate(String(birth_date), created_at)
      if (!valid && error === 'Idade insuficiente!') {
        await updateUserQuery( {birth_date} as IUpdateUserRequest, user_id)
        const deleteUserService = new DeleteUserService()
        await deleteUserService.execute(user_id)
        throw new Error("Sua conta foi suspensa por violar os termos de uso do aplicativo.")
      }
      if(!valid) throw new Error(error);
    }

    // Agora validando "email", "username" e "phone":

    if (email && !isEmail(email)) throw new Error("Email inválido!")
    if (username && !validRegexUsername(String(username))) throw new Error("Nome de invlálido!")
    if (phone && !isMobilePhone(phone)) throw new Error("Número de celular inválido!")
    const {available, data} = await availableData(updatesRequest)
    if (!available) throw new Error(`${data} já cadastrado!`)

    // A senha
    if (password) {
      const {valid, missing}  = validPassword(password)
      if(!valid) throw new Error(`Senha inválida, necessário: ${missing}.`);
    }   

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