CREATE TABLE public.users (
	user_id uuid not null default uuid_generate_v4() primary key,
    full_name varchar NOT NULL,
    birth_date date NOT NULL ,
    city varchar,
    phone varchar,
    email varchar not null ,
    username varchar not null,
    "password" varchar not null,
    social_name varchar,
    profile_creation_date date,
    bio varchar,
    url_on_bio varchar,
    profile_pic varchar,
    cover_pic varchar
);
-- DEFAULT CHARSET = utf8; não funcionou.
