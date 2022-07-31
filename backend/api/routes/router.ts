import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts"
import { getUsers, createUser, updateUser, removeUser} from '../controllers/user.controller.ts';
import { follow } from '../controllers/follower.controller.ts'

export const router = new Router()

// Para usuários

router.get('/api/users', getUsers)
router.get('/api/users/:key/:value', getUsers)

router.post('/api/users', createUser)

router.put('/api/users/:user_id', updateUser)

router.delete('/api/users/:user_id', removeUser)

// Para seguir e deixar de seguir

router.post('/api/followers', follow)
// router.post('/api/followers/', follow)

// router.delete()