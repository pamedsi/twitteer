CREATE TABLE comentarios (
    id_do_comentario uuid not null default uuid_generate_v4(),
    id_da_postagem uuid,
    nome_de_usuario text,
    texto_da_posatgem text,
    data_e_hora_da_postagem timestamp,
    curtidas int,
    retweets int,
    comentarios int
);