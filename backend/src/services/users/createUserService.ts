import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import isEmail from "https://deno.land/x/deno_validator@v0.0.5/lib/isEmail.ts";
import { isMobilePhone } from "https://deno.land/x/deno_validator@v0.0.5/mod.ts";
import { User } from "../../models/user.ts";
import { availableData, insertNewUser, validateDate } from "../../utils/forUsers.ts";

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
    const {available, data} = await availableData(incomingUser)
    const {email, username, phone} = incomingUser;
    if (!email || isEmail(email)) throw new Error("Email inválido");
    if (!username) throw new Error("Nome de usuário necessário!")
    if (!available) throw new Error(`${data} já cadastrado!`);
    const {valid, error} = validateDate(incomingUser.birth_date)
    if(!valid) throw new Error(error);
    if(phone && !isMobilePhone(phone)) throw new Error("Número de celular inválido!");
        
    const newUser = new User(incomingUser)
    newUser.password = await hash(newUser.password)
    console.log('\n', newUser)
    await insertNewUser(newUser)
  }
}