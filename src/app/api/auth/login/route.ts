import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

function loadCredentials(): { login: string; hash: string } | null {
  try {
    const file = path.join(process.cwd(), '.credentials.json')
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    if (data.login && data.hash) return data
  } catch {}
  const login = process.env.ADMIN_LOGIN
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (login && hash) return { login, hash }
  return null
}

export async function POST(req: NextRequest) {
  const { login, password } = await req.json()

  const creds = loadCredentials()

  if (!creds) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const { login: adminLogin, hash: adminHash } = creds

  if (login !== adminLogin || !(await bcrypt.compare(password, adminHash))) {
    return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 })
  }

  const token = await signToken({ sub: 'admin' })

  const res = NextResponse.json({ ok: true })
  res.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
