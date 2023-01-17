CREATE TABLE public.users (
	user_id uuid not null primary key,
    active boolean not null default true,
    -- user_id uuid not null default uuid_generate_v4() primary key,
    display_name varchar NOT NULL,
    birth_date date NOT NULL ,
    location varchar,
    phone varchar,
    email varchar not null ,
    username varchar not null,
    "password" varchar not null,
    created_at timestamp,
    bio varchar,
    url_on_bio varchar,
    profile_pic varchar,
    cover_pic varchar
);
-- DEFAULT CHARSET = utf8; não funcionou.
