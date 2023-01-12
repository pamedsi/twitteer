import { prohibitedWords } from "../../assets/prohibitedWords.ts";
import { regexForUsername } from "../../assets/usernameRegex.ts";
import { lowercase, symbols, numbers, uppercase } from "../../assets/validPassword.ts";
import { querySearch } from "../../models/queryResult.ts";
import { userExists } from "../helperFunctions.ts";
import {INonRepeatableData} from '../../models/nonRepeatableData.ts'

export const validProperty = function (key: string) {
  // Essas são as propriedades do usuário que podem ser alteradas por ele.
  const properties = ['full_name', 'birth_date', 'city', 'phone', 'email', 'username', 'social_name','bio', 'url_on_bio', 'profile_pic', 'cover_pic']

  return properties.some(property => property === key)
}

export const validRegexUsername = function (username: string): boolean {
  return Boolean(username.match(regexForUsername)) && !username.match(prohibitedWords)
}

export const validPassword = function (password: string) {
  interface validityOfPassword {
    valid: boolean
    missing?:  'moreCharacters' | 'uppercase' | 'lowercase' | 'numbers' | 'symbols'
  }
  
  if (password.length < 10) return {valid: false, missing: 'moreCharacters'} as validityOfPassword
  if (!password.match(uppercase)) return {valid: false, missing: 'uppercase'} as validityOfPassword
  if (!password.match(lowercase)) return {valid: false, missing: 'lowercase'} as validityOfPassword
  if (!password.match(numbers)) return {valid: false, missing: 'numbers'} as validityOfPassword
  if (!password.match(symbols)) return {valid: false, missing: 'symbols'} as validityOfPassword
  return {valid: true} as validityOfPassword
}

export const validateDate = function (birthDate: string | Date, when: string | Date = new Date()) {
  interface validity {
    valid: boolean,
    error?: string
  }
  
  const [date, month, year] = String(birthDate).split('/')
  birthDate = new Date(`${year}-${month}-${date}`)
  if (String(birthDate) === 'Invalid Date') return {valid: false, error: 'Data inválida!'} as validity
    // Vi a conversão de milissegundos para anos no site: https://www.kylesconverter.com/time/years-to-milliseconds
  const age = (Number(when) - Number(birthDate)) / 31556952000
  if (age < 13) return {valid: false, error: 'Idade insuficiente!'}
  return {valid: true}
}

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

  return {available: true} as availability
}
