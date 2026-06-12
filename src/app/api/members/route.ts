import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { class_id, name, avatar_url, profile_data } = body

    const { data, error } = await supabase
      .from('members')
      .insert([
        {
          class_id,
          name,
          avatar_url,
          profile_data: profile_data || {},
          is_submitted: true,
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
  const classId = searchParams.get('class_id')

  if (!classId) {
    return NextResponse.json({ error: 'class_id is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('class_id', classId)
    .order('joined_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
