import { dataAlreadyRegistered, errorMessageForSameData, updateUserQuery } from "../../utils/forUsers.ts";
import { sizeof } from "../../utils/helperFunctions.ts";
import { IUserRequest } from "./createUserService.ts";

export class UpdateUserService {
  async execute(user_id: string, updatesRequest: IUserRequest){
    const {sameData, newData} = await dataAlreadyRegistered(user_id, updatesRequest)
    const [lengthOfSame, lenghtOfNew] = [sizeof(sameData), sizeof(newData)]

    if (!lenghtOfNew && !lengthOfSame) throw new Error("Sem dados para atualizar");
    if (!lenghtOfNew) throw new Error("Dados já cadastrados!");
    if (!lengthOfSame) await updateUserQuery(updatesRequest, user_id)

    else if (lenghtOfNew) {
      await updateUserQuery(newData, user_id)
      const message = `Algumas atualizações foram feitas, mas os seguites dados já estavam cadastrados: ${errorMessageForSameData(sameData)} então foram descartados.`
      console.error(message)
      // throw new Error(message)  
    }
  }
}