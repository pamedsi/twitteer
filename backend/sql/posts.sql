CREATE TABLE posts (
    id_da_postagem uuid not null default uuid_generate_v4(),
    id_do_usuario uuid,
    texto_da_posatgem text,
    data_e_hora_da_postagem timestamp,
    curtidas int,
    retweets int,
    comentarios int
);