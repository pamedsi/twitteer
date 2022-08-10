# twitteer
Este projeto é uma réplica do Twitter com apenas algumas funcionalidades básicas, a fim de testar meus conhecimentos e habilidades, ainda está em andamento por isso, muitas funcionalidades ainda estão indisponíveis.

Até então está sendo usado:

No backend:

- Deno:
    Com as libs: bcrypt, oak, DJWT
    Linguagens: Typescript, Javascript
- Postgresql

No frontend:

- NodeJS:
    React Native
    Expo
    Axios

 Para iniciar o servidor e poder usar a API é necessário executar o arquivo "backend/api/app.ts"

# Implementações feitas até então no backend:

- Não permite que usuários com o mesmo e-mail, telefone ou nome de usuário se cadastre.
- Twitta, mas não permite tweets idênticos feitos pelo mesmo usuário no mesmo dia.
- Segue e deixa de seguir
