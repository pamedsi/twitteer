import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import { User } from "../../models/user.ts";
import { availableData, insertNewUser, userExists } from "../../utils/forUsers.ts";

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
    const {email, username} = incomingUser;
    if (!email) throw new Error("Email necessário!");
    if (!username) throw new Error("Nome de usuário necessário!")
    if (!available) throw new Error(`Não foi possível cadastrar o usuário, ${data} já cadastrado.`);

    const newUser = new User(incomingUser)
    newUser.password = await hash(newUser.password)
    console.log('\n', newUser)
    await insertNewUser(newUser)
  }
}