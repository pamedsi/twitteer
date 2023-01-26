import { Application } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { router } from './routes/router.ts';
import { env } from './env.ts';

const {HOST, PORT} = env
const app = new Application()

app.use(router.routes())
console.log(`Servidor iniciado: ${HOST}:${PORT}`)
await app.listen(`${HOST}:${PORT}`)