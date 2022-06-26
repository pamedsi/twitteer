import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts"
import { getUsers, createUser, updateUser, removeUser } from './../controllers/user.controller.ts';

export const router = new Router()

router.get('/api/users', getUsers)

router.post('/api/users', createUser)

router.put('/api/users/:user_id', updateUser)

router.delete('/api/users/:user_id', removeUser)