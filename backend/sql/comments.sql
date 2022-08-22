CREATE TABLE public.comments (
    comment_id uuid not null default uuid_generate_v4() primary key,
    comment_owner_id uuid, --chave estrangeira
    commented_post_id uuid, --chave estrangeira
    content varchar,
    comment_datetime timestamp,
    CONSTRAINT comments_fk FOREIGN KEY (comment_owner_id) REFERENCES public.users(user_id)
    CONSTRAINT comments_fk_1 FOREIGN KEY (commented_post_id) REFERENCES public.posts(post_id)
);
