import { IUserRequest } from "../services/users/createUserService.ts";

export interface userProperty {
    key: 'user_id' | 'display_name'| 'birth_date'| 'location'| 'phone'| 'email'| 'username'| 'social_name'| 'created_at' |'bio'| 'url_on_bio'| 'profile_pic'| 'cover_pic'
}

export class User {
    user_id: string
    active: boolean
	display_name: string
    birth_date: string
    location?: string
    phone?: string
    email: string
    username: string
    password: string
    created_at: string
    bio?: string
    url_on_bio?: string
    profile_pic?: string
    cover_pic?: string

    constructor({display_name, birth_date, email, username, password, location, phone, bio, url_on_bio, profile_pic, cover_pic}: IUserRequest) {
        if (location) this.location = location.trim(); if(phone) this.phone = phone.trim();
        if (bio) this.bio = bio.trim(); if (url_on_bio) this.url_on_bio = url_on_bio.trim(); if (profile_pic) this.profile_pic = profile_pic.trim()
        if(cover_pic) this.cover_pic = cover_pic.trim()

        this.active = true
        this.display_name = display_name.trim(); this.birth_date = birth_date.trim(); this.email = email.trim(); this.username = username.trim(); this.password = password;
        this.user_id = crypto.randomUUID()
        this.created_at = new Date().toISOString()
    }
}