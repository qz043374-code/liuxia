import { NextResponse } from 'next/server'
import { generateMessage } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, nickname } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const message = await generateMessage(name, nickname || name)

    return NextResponse.json({ message })
  } catch (error) {
    console.error('OpenAI error:', error)
    return NextResponse.json(
      { message: '愿友谊长存，前程似锦！🌟' },
      { status: 200 }
    )
  }
}
