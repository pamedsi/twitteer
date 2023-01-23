import { client } from "../../database/database.ts"
import { ILikeModel } from "../../models/like.ts"
import { User } from "../../models/user.ts"
import { userExists } from "../../utils/helperFunctions.ts"

export const getLikes = async function (tweet_id: string) {
  const gettingLikes = `SELECT * FROM public.likes WHERE tweet_liked_id = '${tweet_id}';`
  const { rows: likesList } = await client.queryObject<ILikeModel>(gettingLikes)
  return likesList

}

export const showWhoLiked = async function (likes: ILikeModel[]) {
  const usersList: User[] = []

  for (let index = 0; index < likes.length; index++) {
    const {user_who_liked} = likes[index]
    const user = await userExists('', user_who_liked)

    if (user) usersList.push(user.userFound)
  }

  return usersList
}