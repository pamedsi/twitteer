import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts"
import { getUsers, createUser, updateUser, removeUser} from '../controllers/user.controller.js';
import { follow, unfollow, seeFollowers } from '../controllers/follower.controller.js'
import { createPost, getTweets,removePost } from './../controllers/posts.controller.js';
import { getComments, createComment, removeComment } from './../controllers/comments.controller.js';
import { login } from './../../userAuthenticator/login.js';
import { JWTValidator } from './../../userAuthenticator/JWTValidator.js';
import { authenticate } from './../../userAuthenticator/authenticator.js';

export const router = new Router()

// Para usuários:

router.get('/api/users', getUsers)
router.get('/api/users/:key/:value', getUsers)
router.post('/api/users', createUser)
router.put('/api/users/:user_id', updateUser)
router.delete('/api/users/:user_id', removeUser)

// Para login

router.post('/login', login)

// Para seguir e deixar de seguir:

router.get('/api/followers', JWTValidator , seeFollowers)
router.post('/api/followers', follow)
router.delete('/api/followers', unfollow)

// Para tweets:

router.get('/api/tweets', JWTValidator, getTweets)
router.get('/api/tweets/:key/:value', getTweets)
router.post('/api/tweets', JWTValidator ,createPost)
router.delete('/api/tweets/:post_id', removePost)

// Para comentários

router.get('/api/comments', getComments)
router.get('/api/comments/:key/:value', getComments)
router.post('/api/comments', createComment)
router.delete('/api/comments/:comment_id', removeComment)
