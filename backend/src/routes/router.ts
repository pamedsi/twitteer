import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts"

import { createUser, removeUser, updateUser, reactivateUser} from '../controllers/user.controller.ts';
import { follow, unfollow, seeFollowers, seeFollowing } from '../controllers/follower.controller.ts'
import { createTweet, likeTweet, removeTweet, seeTweets } from './../controllers/tweets.controller.ts';
import { login } from './../userAuthenticator/login.ts';
import { JWTValidator } from './../userAuthenticator/JWTValidator.ts';
import { homePage, isLogged } from "../utils/helperFunctions.ts";
import { logout } from "../userAuthenticator/logout.ts";
import { pageNotFound } from "../controllers/page.not.found.ts";

export const router = new Router()

// Para usuários:

router.post('/api/users', createUser)
router.put('/api/users/:user_id', JWTValidator, updateUser)
router.post('/api/users/:user_id', reactivateUser)
router.delete('/api/users/:user_id', JWTValidator, removeUser)

// Para login

router.post('/login', login)
router.post('/logout', logout)
router.get('/home', isLogged, homePage)

// Para seguir e deixar de seguir:

router.get('/api/followers', JWTValidator ,seeFollowers)
router.get('/api/following', JWTValidator ,seeFollowing)
router.post('/api/followers/:followed_id',JWTValidator, follow)
router.delete('/api/followers/:unfollowed_id', JWTValidator, unfollow)

// Para tweets:

router.get('/api/tweets', JWTValidator, seeTweets)
router.post('/api/tweet', JWTValidator ,createTweet)
router.post('/api/like-tweet/:tweet_id', JWTValidator ,likeTweet)
router.delete('/api/tweet/:tweet_id', JWTValidator, removeTweet)

// Erro 404:

router.get("/(.*)", pageNotFound)
router.post("/(.*)", pageNotFound)
router.patch("/(.*)", pageNotFound)
router.put("/(.*)", pageNotFound)
router.delete("/(.*)", pageNotFound)
