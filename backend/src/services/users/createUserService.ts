import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import { User } from "../../models/user.ts";
import { insertNewUser, userExists } from "../../utils/forUsers.ts";

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

    const {email, username, phone} = incomingUser;
    if (!email) throw new Error("Email necessário!");
    if (await userExists(email)) throw new Error(`Não foi possível cadastrar o usuário, email já cadastrado.`);
    if (!username) throw new Error("Nome de usuário necessário!");
    if (await userExists(username)) throw new Error(`Não foi possível cadastrar o usuário, nome de usuário já cadastrado.`);

    // Não gostei desses ifs, mas, ainda não consegui pensar num jeito melhor de fazer.
    if (phone) {
      if (await userExists(phone)) throw new Error("Não foi possível cadastrar o usuário, número de telefone já cadastrado!")
    }
    const newUser = new User(incomingUser)
    newUser.password = await hash(newUser.password)
    console.log('\n', newUser)

    await insertNewUser(newUser)
  }
}