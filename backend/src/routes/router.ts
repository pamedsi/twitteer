import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts"
import { createUser, removeUser, updateUser, reactivateUser} from '../controllers/user.controller.ts';
import { follow, unfollow, seeFollowers, seeFollowing } from '../controllers/follower.controller.ts'
import { createTweet, getTweets,removeTweet } from './../controllers/tweets.controller.ts';
import { getComments, createComment, removeComment } from './../controllers/comments.controller.ts';
import { login } from './../userAuthenticator/login.ts';
import { JWTValidator } from './../userAuthenticator/JWTValidator.ts';
import { homePage, isLogged } from "../utils/helperFunctions.ts";
import { logout } from "../userAuthenticator/logout.ts";

export const router = new Router()

// Para usuários:

router.post('/api/users', createUser)
router.put('/api/users/:user_id', updateUser)
router.post('/api/users/:user_id', reactivateUser)
router.delete('/api/users/:user_id', removeUser)

// Para login

router.post('/login', login)
router.post('/logout', logout)
router.get('/', isLogged, homePage)

// Para seguir e deixar de seguir:

router.get('/api/followers', JWTValidator ,seeFollowers)
router.get('/api/following', JWTValidator ,seeFollowing)
router.post('/api/followers/:followed_id',JWTValidator, follow)
router.delete('/api/followers/:unfollowed_id', JWTValidator, unfollow)

// Para tweets:

router.get('/api/tweet', getTweets) // interna
router.post('/api/tweet', JWTValidator ,createTweet)
router.delete('/api/tweet/:tweet_id', removeTweet)

// Para comentários

router.get('/api/comments', getComments) // interna
router.post('/api/comments', JWTValidator, createComment)
router.delete('/api/comments/:comment_id', removeComment)
