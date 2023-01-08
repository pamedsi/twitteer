ALTER TABLE
  "public"."perfis" RENAME COLUMN "id" TO "id_do_usuario";

ALTER TABLE
  "public"."posts"
ALTER COLUMN
  "id_da_postagem" TYPE "id" uuid not null default uuid_generate_v4();

ALTER TABLE public.posts ALTER COLUMN texto_da_posatgem TYPE varchar USING texto_da_posatgem::varchar;

ALTER TABLE public.perfis RENAME COLUMN url_da_bio TO url_na_bio;

ALTER TABLE public.users ALTER COLUMN email SET NOT NULL;

create EXTENSION if not exists "uuid-ossp";

CREATE TABLE "public.questions" (
	"id" uuid not null default primary key uuid_generate_v4(),
);

SELECT * FROM 'nome_da_tabela' WHERE 'nome_da_coluna' = 'valor' -- esse valor pode ser número string ou qq outro tipo

SELECT * FROM 'nome_da_tabela' WHERE 'nome_da_coluna' like 'j%' -- pra pegar os que começam com j

SELECT * FROM 'nome_da_tabela' WHERE 'nome_da_coluna' like '%j%' -- pega os que tem j em algum lugar no valor

SELECT 'nome_da_coluna', 'outro_nome_de_coluna' FROM 'nome_da_tabela' WHERE 'nome_da_outra_coluna' like '%j%' -- pega os que tem j em algum lugar no valor
-- Vai mostrar tipo, só os cpfs e emails de quem tem j no nome

-- Pesquisar tweets feitos no mesmo dia (está errado porque só compara o dia, e não checa o mês e o ano)
SELECT * FROM public.posts WHERE date_part('day',created_at) = date_part('day', now()) and post_owner_id = 'some-v4-uuid' and "content" = 'tweet-text' LIMIT 1;
-- Agora sim:
SELECT * FROM public.posts where cast (created_at as DATE) = current_date;

-- Auto-generated SQL script #202206261509
INSERT INTO public.users (full_name,birth_date,email,username,"password")
	VALUES ('Patrick Abimael Melo da Silva','1999-03-26','patrickabimael@yahoo.com.br','pamedsi','4002');

-- Auto-generated SQL script #202206261527
DELETE FROM public.users
	WHERE user_id='693e9129-bf0a-4dc6-b1bc-729b5c68b1c1'::uuid::uuid;

UPDATE public.users
	SET full_name='José Arnaldo',birth_date='2000-03-26',"password"='8922'
	WHERE user_id='109c9815-73a9-4255-9b96-51658c30500b'::uuid::uuid;

UPDATE 'cadastro', 'gafanhotos' set 'cursopreferido' = '22' where 'id' = '2';