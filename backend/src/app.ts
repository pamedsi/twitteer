import { Application } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { router } from './routes/router.ts';
import { env } from './env.ts';

const {HOST, PORT} = env
const app = new Application()

app.use(router.routes())
console.log(`Servidor iniciado: ${'127.0.0.1'}:${8080}`)

HOST && PORT ? await app.listen(`${HOST}:${PORT}`) : await app.listen(`127.0.0.1:8080`)
