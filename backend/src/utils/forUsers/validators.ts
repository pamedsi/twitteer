import { prohibitedWordsRegex } from "../../assets/prohibitedWords.ts";
import { regexForUsername } from "../../assets/usernameRegex.ts";
import { uppercaseRegex, lowercaseRegex, numbersRegex, symbolsRegex } from "../../assets/validPassword.ts";

export const validProperty = function (key: string) {
  // Essas são as propriedades do usuário que podem ser alteradas por ele.
  const properties = ['display_name', 'birth_date', 'location', 'phone', 'email', 'username', 'social_name','bio', 'url_on_bio', 'profile_pic', 'cover_pic']

  return properties.some(property => property === key)
}

export const validUsername = function (username: string) {

  interface validityOfUsername {
    isValidUsername: boolean
    reason?: string
  }

  const invalidCharacters = 'Caracteres inválidos!'
  const notAllowedWords = 'Não é permitido usar as palavras "Twitter" ou "Admin" para isso!'
  const InvalidSize = 'Seu nome de usuário precisa ter pelo menos 5 caracteres e não pode ter mais que 15.'

  if(username.length < 5 || username.length > 15) return {isValidUsername: false, reason: InvalidSize} as validityOfUsername
  if (!username.match(regexForUsername)) return {isValidUsername: false, reason: invalidCharacters} as validityOfUsername
  if (username.match(prohibitedWordsRegex)) return {isValidUsername: false, reason: notAllowedWords} as validityOfUsername
  return {isValidUsername: true} as validityOfUsername
}

export const validPassword = function (password: string) {
  const [moreCharacters, uppercase, lowercase, numbers, symbols] = ['pelo menos 10 caracteres', 'pelo menos uma letra maiúscula', 'pelo menos uma letra minúscula', 'pelo menos um número', 'pelo menos um símbolo (!@#$%)']
  interface validityOfPassword {
    isValidPassword: boolean
    missing?: string
  }
  
  if (password.length < 10) return {isValidPassword: false, missing: moreCharacters} as validityOfPassword
  if (!password.match(uppercaseRegex)) return {isValidPassword: false, missing: uppercase} as validityOfPassword
  if (!password.match(lowercaseRegex)) return {isValidPassword: false, missing: lowercase} as validityOfPassword
  if (!password.match(numbersRegex)) return {isValidPassword: false, missing: numbers} as validityOfPassword
  if (!password.match(symbolsRegex)) return {isValidPassword: false, missing: symbols} as validityOfPassword
  return {isValidPassword: true} as validityOfPassword
}

export const validDate = function (birthDate: string | Date, when: string | Date = new Date()) {
  interface validity {
    isValidDate: boolean,
    error?: string
  }
  
  const [date, month, year] = String(birthDate).split('/')
  birthDate = new Date(`${year}-${month}-${date}`)
  if (String(birthDate) === 'Invalid Date') return {isValidDate: false, error: 'Data inválida!'} as validity
    // Vi a conversão de milissegundos para anos no site: https://www.kylesconverter.com/time/years-to-milliseconds
  const age = (Number(when) - Number(birthDate)) / 31556952000
  if (age < 13) return {isValidDate: false, error: 'Idade insuficiente!'} as validity
  return {isValidDate: true}
}

export const validDisplayName = function (displayName: string) {
  interface validityOfDisplayName {
    isValidName: boolean
    problem?: string
  }

  const tooLong = 'Seu nome não pode ter mais que 50 caracteres!' 
  const notAllowedWords = 'Não é permitido usar as palavras "Twitter" ou "Admin" para isso!'

  if (displayName.length > 50) return {isValidName: false, problem: tooLong} as validityOfDisplayName
  if (displayName.match(prohibitedWordsRegex)) return {isValidName: false, problem: notAllowedWords} as validityOfDisplayName
  return {isValidName: true} as validityOfDisplayName
}