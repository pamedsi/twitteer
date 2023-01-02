import { insertNewUser, loginRegistered } from "../controllers/utils/helperFunctions.ts";
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
  constructor (){}

  async execute(user: IUserRequest){
    const userInfo = await loginRegistered(user)

    if (userInfo) throw new Error(`Não foi possível cadastrar o usuário, ${userInfo} já cadastrado.`);

    const newUser = new User()
    Object.assign(newUser, user)
    await insertNewUser(newUser)
  }

}
