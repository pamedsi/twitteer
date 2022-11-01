CREATE TABLE public.posts (
    post_id uuid not null default uuid_generate_v4() primary key,
    post_owner_id uuid, --chave estrangeira
    content varchar,
    post_datetime timestamp,
    CONSTRAINT posts_fk FOREIGN KEY (post_owner_id) REFERENCES public.users(user_id)
);
