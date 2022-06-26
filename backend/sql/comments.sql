CREATE TABLE public.comments (
    comment_id uuid not null default uuid_generate_v4() primary key,
    comment_owner_id uuid, --chave estrangeira
    commented_post_id uuid, --chave estrangeira
    content varchar,
    post_datetime timestamp,
    likes int,
    retweets int,
    comments int
);