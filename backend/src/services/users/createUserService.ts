import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import isEmail from "https://deno.land/x/deno_validator@v0.0.5/lib/isEmail.ts";
import { isMobilePhone } from "https://deno.land/x/deno_validator@v0.0.5/mod.ts";
import { User } from "../../models/user.ts";
import { insertNewUser } from "../../utils/forUsers/forCreatingUsers.ts";
import { availableData } from "../../utils/forUsers/utils.ts";
import { validDate, validDisplayName, validPassword, validUsername } from "../../utils/forUsers/validators.ts"
import {is_uri} from "npm: valid-url"

export interface IUserRequest {
	display_name: string;
  birth_date: string;
  location?: string;
  phone?: string;
  email: string;
  username: string;
  password: string;
  bio?: string;
  url_on_bio?: string;
  profile_pic?: string;
  cover_pic?: string;
}

export class CreateUserService {
  async execute(incomingUser: IUserRequest){
    const {email, username, phone, password, birth_date, display_name, url_on_bio, bio} = incomingUser;
    
    // Validando as propriedades que não podem se repetir: "email", "username" e "phone"
    if (!isEmail(email)) throw new Error("Email inválido")
    const {isValidUsername, reason} = validUsername(username)
    if(!isValidUsername) throw new Error(reason);
    if(phone && !isMobilePhone(phone)) throw new Error("Número de celular inválido!")
    // Checando se está disponível para uso
    const {available, data} = await availableData(incomingUser)
    if (!available) throw new Error(`${data} já cadastrado!`);

    // Validando nome de usuário:
    const {isValidName, problem} = validDisplayName(display_name)
    if (!isValidName) throw new Error(problem);

    // Validando a senha:
    const {isValidPassword, missing} = validPassword(password)
    if(!isValidPassword) throw new Error(`Senha inválida! Precisa de ${missing}.`)

    // Validando data de nascimento:
    const {isValidDate, error} = validDate(birth_date)
    if(!isValidDate) throw new Error(error)

    // Verificando a URL na bio:
    if (url_on_bio) {
      if(!is_uri(url_on_bio)) throw new Error("URL da bio inválida!");
    }

    if(bio && bio.length > 160) throw new Error("Bio muito longa! Utilize no máximo 160 caracteres.");
    
    const newUser = new User(incomingUser)
    newUser.password = await hash(newUser.password)
    console.log('\n', newUser)
    await insertNewUser(newUser)
  }
}