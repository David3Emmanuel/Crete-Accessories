import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const strapiRes = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      },
    )

    const data = await strapiRes.json()

    if (!strapiRes.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Invalid credentials' },
        { status: strapiRes.status },
      )
    }

    // Set httpOnly cookie for JWT
    const cookieStore = await cookies()
    cookieStore.set('jwt', data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({
      user: {
        ...data.user,
        role: data.user.role || 'authenticated',
      },
      jwt: data.jwt,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    )
  }
}
