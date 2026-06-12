import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateInviteCode } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { school, grade, class_name, creator_name, password } = body

    const inviteCode = generateInviteCode()

    const { data, error } = await supabase
      .from('classes')
      .insert([
        {
          school,
          grade,
          class_name,
          creator_name,
          password,
          invite_code: inviteCode,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const inviteCode = searchParams.get('invite_code')

  if (inviteCode) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('invite_code', inviteCode)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
