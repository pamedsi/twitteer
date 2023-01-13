CREATE TABLE public.tweets (
    -- tweet_id uuid not null default uuid_generate_v4() primary key,
    tweet_id uuid not null primary key
    tweet_owner_id uuid not null, --chave estrangeira
    content varchar not null,
    created_at timestamp not null,
    deleted boolean not null default false
    CONSTRAINT tweets_fk FOREIGN KEY (tweet_owner_id) REFERENCES public.users(user_id)
);
