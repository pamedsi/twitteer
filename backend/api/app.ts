import {Application} from "https://deno.land/x/oak@v10.6.0/mod.ts"
import {config} from "https://deno.land/x/dotenv@v3.2.0/mod.ts"
import { router } from './routes/router.ts'

const HOST = config().HOST ?? '127.0.0.1'
const PORT = config().PORT ?? '8080'

const app = new Application()

app.use(router.routes())
console.log(`Servidor iniciado: ${HOST}:${PORT}`)
await app.listen(`${HOST}:${PORT}`)