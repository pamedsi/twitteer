import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts"
import { getUsers, createUser, updateUser, removeUser} from '../controllers/user.controller.js';
import { follow, unfollow } from '../controllers/follower.controller.js'
import { createPost, getTweets,removePost } from './../controllers/posts.controller.js';

export const router = new Router()

// Para usuários:

router.get('/api/users', getUsers)
router.get('/api/users/:key/:value', getUsers)
router.post('/api/users', createUser)
router.put('/api/users/:user_id', updateUser)
router.delete('/api/users/:user_id', removeUser)

// Para seguir e deixar de seguir:

router.post('/api/followers', follow)
router.delete('/api/followers/follow_id', unfollow)

// Para tweets:

router.get('/api/tweets', getTweets)
router.get('/api/tweets/:key/:value', getTweets)
router.post('/api/tweets', createPost)
router.delete('/api/tweets/:post_id', removePost)
