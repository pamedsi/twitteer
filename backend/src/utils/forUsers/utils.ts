import { querySearch } from "../../models/queryResult.ts";
import { userExists } from "../../repositories/users/userExists.ts";
import { INonRepeatableData } from '../../models/nonRepeatableData.ts'

export const availableData = async function ({email, username, phone}: INonRepeatableData){
  interface availability {
    available: boolean,
    data?: 'email' | 'username' | 'phone'
  }

  const logins = [email, username, phone]
  let exists: false | querySearch

  for (let index = 0; index < logins.length; index++) {
    const login = logins[index];
    exists = await userExists(String(login))
    if (!exists) continue
    return {available: false, data: exists.dataFound} as availability
  }

  return { available: true } as availability
}
