import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts"

const router = new Router()

router.get('/api/teste', (ctx) => {
    ctx.response.status = 200
    ctx.response.body = {salve: 'salve, família!!'}
})

export {router}