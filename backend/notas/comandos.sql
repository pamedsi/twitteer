ALTER TABLE
  "public"."perfis" RENAME COLUMN "id" TO "id_do_usuario";

ALTER TABLE
  "public"."posts"
ALTER COLUMN
  "id_da_postagem" TYPE "id" uuid not null default uuid_generate_v4();

ALTER TABLE public.posts ALTER COLUMN texto_da_posatgem TYPE varchar USING texto_da_posatgem::varchar;

ALTER TABLE public.perfis RENAME COLUMN url_da_bio TO url_na_bio;

create EXTENSION if not exists "uuid-ossp";

CREATE TABLE "public.questions" (
	"id" uuid not null default primary key uuid_generate_v4(),
);

SELECT * FROM 'nome_da_tabela' WHERE 'nome_da_coluna' = 'valor' -- esse valor pode ser número string ou qq outro tipo

SELECT * FROM 'nome_da_tabela' WHERE 'nome_da_coluna' like 'j%' -- pra pegar os que começam com j

SELECT * FROM 'nome_da_tabela' WHERE 'nome_da_coluna' like '%j%' -- pega os que tem j em algum lugar no valor

SELECT 'nome_da_coluna', 'outro_nome_de_coluna' FROM 'nome_da_tabela' WHERE 'nome_da_outra_coluna' like '%j%' -- pega os que tem j em algum lugar no valor
-- Vai mostrar tipo, só os cpfs e emails de quem tem j no nome

