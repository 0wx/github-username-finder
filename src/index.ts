import axios, { AxiosInstance } from "axios"
import fs from "fs"

const alfabetic = "abcdefghijklmnopqrstuvwxyz"
const numbers = "0123456789"
const github: AxiosInstance = axios.create({ baseURL: "https://github.com" })

const addToList = (character: string): void => {
  fs.appendFileSync('./result.txt', character + '\n')
}
const random = (maxChar: number, number: boolean): string => {
  let result = ""
  const data = number ? alfabetic + numbers : alfabetic

  for (let i = 0; i < maxChar; i++) {
    result += data[Math.floor(Math.random() * data.length)]
  }

  return result
}
const validate = async (character: string): Promise<boolean> => {
  try {
    await github.get('/' + character)
    return true
  } catch (error) {
    return false
  }
}


const main = async (
  maxTryings: number,
  maxChar: number,
  number: boolean
): Promise<void> => {
  for (let i = 0; i < maxTryings; i++) {
    const character = random(maxChar, number)
    const isValid = await validate(character)

    if(isValid) {
      addToList(character)
      console.log(character, 'is valid!')
    }
  }
}


const maxTryings = !!process.argv[2]? +process.argv[2] : 10000
const maxChar = !!process.argv[3]? +process.argv[3] : 3
const number = !!process.argv[4]

if(!process.argv[2] || !process.argv[3]) {
  console.log(
    `You don't specify maxTrying, maxChar, and/or number\n
    Set to default:\n
    - maxTrying: 10000,\n
    - maxChar: 3,\n
    - number: false\n
    `
    )

} else {
  console.log(`
  - maxTrying: ${maxTryings},\n
  - maxChar: ${maxChar},\n
  - number: ${number}\n
  `)
}

main(maxTryings, maxChar, number)