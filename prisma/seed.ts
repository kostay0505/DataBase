import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const login = process.env.ADMIN_LOGIN || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'changeme'
  const hash = await bcrypt.hash(password, 12)

  console.log(`\nAdmin credentials:`)
  console.log(`  Login: ${login}`)
  console.log(`  Password hash (paste to .env ADMIN_PASSWORD_HASH):\n`)
  console.log(hash)
  console.log()
}

main().finally(() => db.$disconnect())
