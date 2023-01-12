import { IUserRequest } from "../services/users/createUserService.ts";

export interface userProperty {
    key: 'user_id' | 'full_name'| 'birth_date'| 'city'| 'phone'| 'email'| 'username'| 'social_name'| 'created_at' |'bio'| 'url_on_bio'| 'profile_pic'| 'cover_pic'
}

export class User {

    user_id: string
    active: boolean
	full_name: string
    birth_date: string
    city?: string
    phone?: string
    email: string
    username: string
    password: string
    social_name?: string
    created_at: string
    bio?: string
    url_on_bio?: string
    profile_pic?: string
    cover_pic?: string 

    constructor({full_name, birth_date, email, username, password, city, phone, social_name, bio, url_on_bio, profile_pic, cover_pic}: IUserRequest) {
        if (city) this.city = city.trim(); if(phone) this.phone = phone.trim(); if (social_name) this.social_name = social_name.trim();
        if (bio) this.bio = bio.trim(); if (url_on_bio) this.url_on_bio = url_on_bio.trim(); if (profile_pic) this.profile_pic = profile_pic.trim()
        if(cover_pic) this.cover_pic = cover_pic.trim()

        this.active = true
        this.full_name = full_name.trim(); this.birth_date = birth_date.trim(); this.email = email.trim(); this.username = username.trim(); this.password = password;
        this.user_id = crypto.randomUUID()
        this.created_at = new Date().toISOString()
    }
}