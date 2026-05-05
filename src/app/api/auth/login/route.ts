import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { login, password } = await req.json()

  const adminLogin = process.env.ADMIN_LOGIN
  const adminHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminLogin || !adminHash) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

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
