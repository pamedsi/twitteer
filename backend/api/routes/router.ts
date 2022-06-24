import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts"
import { getUsers, createUser } from './../controllers/user.controller.ts';

const router = new Router()

router.get('/api/teste', (ctx) => {
    ctx.response.status = 200
    ctx.response.body = {salve: 'salve, família!!'}
})

router.get('/api/users', getUsers)

router.post('/api/users', createUser)

router.put('/api/users', getUsers)

router.delete('/api/users', getUsers)
export {router}