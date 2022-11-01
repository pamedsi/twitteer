export interface userProperty {
    key: 'full_name'| 'birth_date'| 'city'| 'phone'| 'email'| 'username'| 'social_name'| 'bio'| 'url_on_bio'| 'profile_pic'| 'cover_pic'
}

export interface userModel {
    user_id: string
	full_name: string,
    birth_date: string,
    city?: string,
    phone?: string,
    email: string,
    username: string,
    password: string,
    social_name?: string,
    profile_creation_date?: Date,
    bio?: string
    url_on_bio?: string,
    profile_pic?: string,
    cover_pic?: string
}
