import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts"
import { getUsers, createUser, updateUser } from './../controllers/user.controller.ts';

const router = new Router()

router.get('/api/users', getUsers) // ok

router.post('/api/users', createUser) // ok

router.put('/api/users', updateUser)

router.delete('/api/users', getUsers)
export {router}