CREATE TABLE public.comments (
    comment_id uuid not null default uuid_generate_v4() primary key,
    user_id uuid,
    commented_post_id uuid,
    content varchar,
    post_datetime timestamp,
    likes int,
    retweets int,
    comments int
);