import { client } from "../../database/database.ts";
import { User } from "../../models/user.ts";
import { IUpdateUserRequest } from "../../services/users/updateUserService.ts";
import { validProperty } from "../../utils/forUsers/validators.ts";

// Essa função checa se os dados que o usuário está tentando atualizar já estão cadastrados.
export const dataAlreadyRegistered = async function (user_id: string, updates: IUpdateUserRequest){
  interface repetiions {
    sameData: IUpdateUserRequest
    newData: IUpdateUserRequest
    created_at: Date | string
  }

  const query = `SELECT * FROM public.users WHERE user_id = '${user_id}' LIMIT 1;`
  const oldData = (await client.queryObject<User>(query)).rows[0]
  const [sameData, newData]  = [{} as IUpdateUserRequest, {} as IUpdateUserRequest]
    
    for (const key1 in oldData) {
      if (Object.prototype.hasOwnProperty.call(oldData, key1)) {
        for (const key2 in updates) {
          if (Object.prototype.hasOwnProperty.call(updates, key2)) {
            if (key1 === key2 && oldData[key1 as keyof IUpdateUserRequest] === updates[key2 as keyof IUpdateUserRequest] && validProperty(key1)) sameData[key1 as keyof IUpdateUserRequest] = String(oldData[key1 as keyof IUpdateUserRequest])
            else if (validProperty(key1) && key1 === key2) newData[key2 as keyof IUpdateUserRequest] = String(updates[key2 as keyof IUpdateUserRequest])
          }
        }
      }
    }
return {sameData, newData, created_at: oldData.created_at} as repetiions
}
