# Twitteer
Este projeto é uma réplica do Twitter com apenas algumas funcionalidades básicas, a fim de testar meus conhecimentos e habilidades.
Ainda está em andamento por isso, muitas funcionalidades ainda não estão indisponíveis.
Ainda não tem frontend, a pasta possui apenas um projeto React Native inicializado, mas não tem componentes criados, apenas o padrão que já vem quando se inicia um projeto react.

Até então está sendo usado:

No backend:

- Deno, com algumas bibliotecas do npm e do próprio deno, utilizando typescript.
- Postgresql.

No frontend:

- React Native com expo.

Primeiramente, é necessário instalar o Deno, neste link é possível encontrar como instalar para cada sistema operacional:
- https://deno.land/manual/getting_started/installation

Instale também o Postgresql, de preferência a versão mais recente. Encontre a versão para o seu sistema operacional no link:
- https://www.postgresql.org/download/

As informações referente à conexão com o banco de dados estão no arquivo "backend/src/database/database.ts".
O seguinte objeto é passado como argumento da nova instância de "Client" criada no arquivo acima.

      user: "",
      database: "",
      hostname: "",
      port: ,
      password: ''


Os valores de cada propriedade devem ser preenchidos através do .env, na pasta /backend/src.
Ex:
      user=postgres
      database=postgres
      hostname=localhost
      port=5432
      password="myDatabasePassword"
      HOST="127.0.0.1"
      PORT=8080

Para criar as tabelas no banco de dados, é necessário executar todos os scripts SQL que estão em "backend/src/database/sql".

Para iniciar o servidor e poder usar a API é necessário executar o arquivo "backend/src/app.ts":
OBS: Para que o .env seja lido, é necessário executar o comando estando dentro da pasta "src", ex:
```
$ cd backend/src/
```
 E depois disso:
```
$ deno run app.ts
```
Aparecerão alguns pedidos de autorização, para permitir, digite "Y" e aperte Enter.

Caso queira autorizar todos os pedidos de permissões de uma vez (não recomendado) insira a flag --allow-all:

```
$ deno run --allow-all app.ts
```

Em seguida o servidor iniciará na porta configurada no arquivo ".env".

# Implementações feitas até então no backend:

- Validação de propriedades ao cadastrar ou atualizar o usuário como: "display_name", "birth_date", "phone", "email", "username", "password" e "bio" para que obedeçam aos requisitos do twitter.
- Login e logout, utilizando JWT e cookies.
- Não permite que usuários com o mesmo e-mail, telefone ou nome de usuário se cadastre ou atualize.
- Twitta, mas não permite tweets idênticos feitos pelo mesmo usuário no mesmo dia, nem maiores que 280 caracteres.
- Desativa contas que tenham atualizado a data de nascimento de forma que o usuário tenha, em algum momento, utilizado o twitter sem ter a idade mínima exigida (13 anos).
- Segue e deixa de seguir
- Lista tweets com base em quem está logado, para que apareçam apenas os tweets feitos pelas pessoas quais aquele usuário segue, e os próprios tweets.

# Implementações pendentes:

- Criar documentação com swagger.
- Receber imagens por post para guardar no banco de dados, para perfil e de capa.
- Utilizar docker.

OBS: No twitter, a senha é exigida apenas que tenha, no mínimo, 10 caracteres. E é recomendado que a senha que misture caractereses especiais, números e letras maiúsculas e minúsculas. Nesta aplicação eu tornei essas recomendações obrigatórias, junto com o mínimo de caracteres.

Enquanto a documentação não está pronta, o arquivo "/backend/src/routes/router.ts" pode auxiliar na compreensão dos endpoints.