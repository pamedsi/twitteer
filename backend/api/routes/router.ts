import { Router } from 'https://deno.land/x/oak/mod.ts'

export const router = new Router()

router.get('api/teste', (ctx) => {
    ctx.response.status = 200
    ctx.response.body = {message: 'salve, família!!'}
})