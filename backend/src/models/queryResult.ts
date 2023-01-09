import { User } from "./user.ts";

export interface querySearch {
  dataFound: 'phone' | 'email' | 'username'
  userFound: User
}