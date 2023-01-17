# twitteer
Este projeto é uma réplica do Twitter com apenas algumas funcionalidades básicas, a fim de testar meus conhecimentos e habilidades.
Ainda está em andamento por isso, muitas funcionalidades ainda estão indisponíveis.

Até então está sendo usado:

No backend:

- Deno, com algumas bibliotecas do npm e do próprio deno
- Postgresql

No frontend:

- React Native com expo

 Para iniciar o servidor e poder usar a API é necessário executar o arquivo "backend/src/app.ts"

# Implementações feitas até então no backend:

- Validação de propriedades ao cadastrar ou atualizar o usuário como: "display_name", "birth_date", "phone", "email", "username", "password" e "bio" para que obedeçam aos requisitos do twitter.
- Login e logout, utilizando JWT e cookies.
- Não permite que usuários com o mesmo e-mail, telefone ou nome de usuário se cadastre ou atualize.
- Twitta, mas não permite tweets idênticos feitos pelo mesmo usuário no mesmo dia, nem maiores que 280 caracteres.
- Desativa contas que tenham atualizado a data de nascimento de forma que o usuário tenha, em algum momento, utilizado o twitter sem ter a idade mínima exigida (13 anos).
- Segue e deixa de seguir

# Implementações pendentes:

- Listar tweets com base em quem está logado, para que apareçam apenas os tweets feitos pelas pessoas quais aquele usuário segue.
- Corrigir os status das requisições.
- Personalizar mensagens de erro no body das requisições.
- Criar documentação com swagger.
- Utilizar padronização de commits da Husky.
- Receber imagens por post para guardar no banco de dados, para perfil e de capa.
