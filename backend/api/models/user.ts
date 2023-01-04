import { IUserRequest } from "../services/createUserService.ts";

export interface userProperty {
    key: 'user_id' | 'full_name'| 'birth_date'| 'city'| 'phone'| 'email'| 'username'| 'social_name'| 'created_at' |'bio'| 'url_on_bio'| 'profile_pic'| 'cover_pic'
}

export class User {
    user_id: string;
	full_name: string;
    birth_date: string;
    city?: string;
    phone?: string;
    email: string;
    username: string;
    password: string;
    social_name?: string;
    created_at: string
    bio?: string;
    url_on_bio?: string;
    profile_pic?: string;
    cover_pic?: string;

    constructor({full_name, birth_date, email, username, password}: IUserRequest) {
        this.full_name = full_name; this.birth_date = birth_date; this.email = email; this.username = username; this.password = password;
        this.user_id = crypto.randomUUID()
        this.created_at = new Date().toISOString()
    }
}