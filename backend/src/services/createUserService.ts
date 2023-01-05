import { hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import { User } from "../models/user.ts";
import { insertNewUser, userExists } from "../utils/forUsers.ts";

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
  async execute(IncomingUser: IUserRequest){
    const userInfo = await userExists(IncomingUser)

    if (userInfo) throw new Error(`Não foi possível cadastrar o usuário, ${userInfo.dataFound} já cadastrado.`);

    const newUser = new User(IncomingUser)
    newUser.password = await hash(newUser.password)
    console.log('\n', newUser)

    await insertNewUser(newUser)
  }
}