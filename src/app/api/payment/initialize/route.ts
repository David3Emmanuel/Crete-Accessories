import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { amount, email, metadata } = await req.json()

  if (!amount || !email) {
    return NextResponse.json(
      { error: 'amount and email are required' },
      { status: 400 },
    )
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      // Paystack expects amount in kobo (smallest unit)
      amount: Math.round(amount * 100),
      currency: 'NGN',
      callback_url: `${siteUrl}/checkout/success`,
      metadata,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    return NextResponse.json({ error: body }, { status: 502 })
  }

  const data = await res.json()
  return NextResponse.json({
    authorization_url: data.data.authorization_url,
    reference: data.data.reference,
  })
}
