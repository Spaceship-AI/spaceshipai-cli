import { createInterface } from 'readline'

export async function promptApiKey() {
  const rl = createInterface({ input: process.stdin, output: process.stderr })

  return new Promise((resolve) => {
    rl.question('Enter your Spaceship API key (sk_live_...): ', (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}
