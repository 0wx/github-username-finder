import axios, { AxiosInstance } from "axios"
import console from "console"
import fs from "fs"

const alfabetic = "abcdefghijklmnopqrstuvwxyz"
const numbers = "0123456789"
const github: AxiosInstance = axios.create({ baseURL: "https://github.com" })

const wait = (ms: number = 5000): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

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
    return false
  } catch (error) {
    return true
  }
}


const main = async (
  maxTryings: number,
  maxChar: number,
  number: boolean
): Promise<void> => {
  for (let i = 0; i < maxTryings; i++) {
    // Wait 1 seconds so github doesnt block your request
    await wait(1000)
    const character = random(maxChar, number)
    const isValid = await validate(character)

    if(isValid) {
      addToList(character)
      console.log(character, 'is valid! (maybe)')
      continue
    }

    console.log(character, 'is invalid!')
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
    \n
    Example Usage: 'yarn start 10000 3 number'`
    )

} else {
  console.log(`
  - maxTrying: ${maxTryings},\n
  - maxChar: ${maxChar},\n
  - number: ${number}\n
  `)
}

main(maxTryings, maxChar, number)