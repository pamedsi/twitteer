CREATE TABLE perfis

(
	nome_completo text,
    data_de_nascimento date,
    localizacao text,
    telefone text,
    email text,
    nome_de_usuario text,
    senha text,
    id_do_usuario uuid not null default uuid_generate_v4(),

    nome_social text,
    data_de_criacao_do_perfil date,
    descricao text,
    url_da_bio text,
    foto_de_perfil text,
    foto_de_capa text
);
-- DEFAULT CHARSET = utf8; não deu certo!
