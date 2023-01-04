import { insertNewUser, loginRegistered } from "../utils/helperFunctions.ts";
import { User } from "../models/user.ts";

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
    const userInfo = await loginRegistered(IncomingUser)

    if (userInfo) throw new Error(`Não foi possível cadastrar o usuário, ${userInfo} já cadastrado.`);

    const newUser = new User(IncomingUser)
    await insertNewUser(newUser)
  }

}
