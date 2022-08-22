import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts"
import { getUsers, createUser, updateUser, removeUser} from '../controllers/user.controller/user.controller.js';
import { follow, unfollow, seeFollowers } from '../controllers/follower.controller.js'
import { createPost, getTweets,removePost } from './../controllers/posts.controller.js';
import { getComments, createComment, removeComment } from './../controllers/comments.controller.js';
import { login } from './../../userAuthenticator/login.js';
import { JWTValidator } from './../../userAuthenticator/JWTValidator.js';

export const router = new Router()

// Para usuários:

router.get('/api/users', getUsers)
router.post('/api/users', createUser)
router.put('/api/users/:user_id', JWTValidator, updateUser)
router.delete('/api/users/:user_id', JWTValidator, removeUser)

// Para login

router.post('/login', login)

// Para seguir e deixar de seguir:

router.get('/api/followers', seeFollowers)
router.post('/api/followers',JWTValidator, follow)
router.delete('/api/followers', JWTValidator, unfollow)

// Para tweets:

router.get('/api/tweets', getTweets)
router.post('/api/tweets', JWTValidator ,createPost)
router.delete('/api/tweets/:post_id', JWTValidator, removePost)

// Para comentários

router.get('/api/comments', getComments)
router.post('/api/comments', JWTValidator, createComment)
router.delete('/api/comments/:comment_id', JWTValidator, removeComment)
