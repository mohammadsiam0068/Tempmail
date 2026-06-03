const adjectives = ['swift', 'quiet', 'dark', 'cold', 'wild', 'lost', 'grey', 'deep', 'lone', 'bare', 'void', 'null', 'raw', 'stark', 'pale']
const nouns = ['fog', 'ash', 'dust', 'echo', 'flux', 'hex', 'ink', 'arc', 'nox', 'rift', 'sol', 'tide', 'wax', 'zap', 'byte']

export function generateEmailAddress(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 9000) + 1000
  return `${adj}${noun}${num}@temporaries.email`
}

export function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const prefix = 'te_'
  let key = prefix
  for (let i = 0; i < 40; i++) {
    key += chars[Math.floor(Math.random() * chars.length)]
  }
  return key
}
