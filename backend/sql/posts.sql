CREATE TABLE public.posts (
    post_id uuid not null default uuid_generate_v4() primary key,
    user_id uuid,
    content varchar,
    post_datetime timestamp,
    likes int,
    retweets int,
    comments int
);