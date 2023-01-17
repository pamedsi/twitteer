CREATE TABLE public.comments (
    -- comment_id uuid not null default uuid_generate_v4() primary key,
    comment_id uuid not null primary key,
    comment_owner_id uuid not null, --chave estrangeira
    commented_tweet_id uuid not null, --chave estrangeira
    content varchar not null,
    created_at timestamp not null,
    deleted boolean not null default false
    CONSTRAINT comments_fk FOREIGN KEY (comment_owner_id) REFERENCES public.users(user_id)
    CONSTRAINT comments_fk_1 FOREIGN KEY (commented_tweet_id) REFERENCES public.tweets(tweet_id)
);
