import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import isEmail from "https://deno.land/x/deno_validator@v0.0.5/lib/isEmail.ts";
import { isMobilePhone } from "https://deno.land/x/deno_validator@v0.0.5/mod.ts";
import { User } from "../../models/user.ts";
import { insertNewUser } from "../../utils/forUsers/forCreatingUsers.ts";
import { availableData, validateDate, validPassword, validUsername } from "../../utils/forUsers/utils.ts";

export interface IUserRequest {
	full_name: string;
  birth_date: string;
  city?: string;
  phone?: string;
  email: string;
  username: string;
  password: string;
  social_name?: string;
  bio?: string;
  url_on_bio?: string;
  profile_pic?: string;
  cover_pic?: string;
}

export class CreateUserService {
  async execute(incomingUser: IUserRequest){
    const {email, username, phone, password, birth_date} = incomingUser;
    // Validando as propriedades que não podem se repetir: "email", "username" e "phone"
    
    if (!isEmail(email)) throw new Error("Email inválido")
    const {isValidUsername, reason} = validUsername(username)
    if(!isValidUsername) throw new Error(reason);
    if(phone && !isMobilePhone(phone)) throw new Error("Número de celular inválido!")
    // Checando se está disponível para uso
    const {available, data} = await availableData(incomingUser)
    if (!available) throw new Error(`${data} já cadastrado!`);

    // Validando data de nascimento:
    const {valid, error} = validateDate(birth_date)
    if(!valid) throw new Error(error)

    // Por último, a senha:
    const {isValidPassword, missing} = validPassword(password)
    if(!isValidPassword) throw new Error(`Senha inválida! Precisa de ${missing}.`)    

    const newUser = new User(incomingUser)
    newUser.password = await hash(newUser.password)
    console.log('\n', newUser)
    await insertNewUser(newUser)
  }
}