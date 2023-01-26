CREATE TABLE public.users (
	user_id uuid not null primary key,
    active boolean not null default true,
    -- user_id uuid not null default uuid_generate_v4() primary key,
    display_name varchar (50) NOT NULL,
    birth_date date NOT NULL ,
    location varchar,
    phone varchar (15),
    email varchar not null (320),
    username varchar not null (15),
    "password" varchar not null,
    created_at timestamp,
    bio varchar (160),
    url_on_bio varchar (2048),
    profile_pic varchar,
    cover_pic varchar
);
-- DEFAULT CHARSET = utf8; não funcionou.
