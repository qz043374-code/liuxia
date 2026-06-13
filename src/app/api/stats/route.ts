import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 记录页面访问
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { page, class_id, referrer } = body

    const { error } = await supabase
      .from('page_views')
      .insert([
        {
          page: page || 'unknown',
          class_id: class_id || null,
          referrer: referrer || null,
          user_agent: request.headers.get('user-agent') || null,
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        },
      ])

    if (error) {
      console.error('Stats insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

// 获取统计数据
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const classId = searchParams.get('class_id')
  const password = searchParams.get('password')

  // 验证密码（从 classes 表获取）
  if (classId) {
    const { data: classData } = await supabase
      .from('classes')
      .select('password')
      .eq('id', classId)
      .single()

    if (!classData || classData.password !== password) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    // 总访问量
    let totalQuery = supabase.from('page_views').select('*', { count: 'exact', head: true })
    if (classId) {
      totalQuery = totalQuery.eq('class_id', classId)
    }
    const { count: totalViews } = await totalQuery

    // 独立访客（按 IP 去重）
    let uniqueQuery = supabase.from('page_views').select('ip', { count: 'exact', head: true })
    if (classId) {
      uniqueQuery = uniqueQuery.eq('class_id', classId)
    }
    const { count: uniqueVisitors } = await uniqueQuery.not('ip', 'is', null)

    // 各页面访问量
    let pageQuery = supabase.from('page_views').select('page, count')
    if (classId) {
      pageQuery = pageQuery.eq('class_id', classId)
    }
    const { data: pageStats } = await pageQuery

    // 今日访问量
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let todayQuery = supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
    if (classId) {
      todayQuery = todayQuery.eq('class_id', classId)
    }
    const { count: todayViews } = await todayQuery

    // 近7天每日访问量
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    let dailyQuery = supabase
      .from('page_views')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
    if (classId) {
      dailyQuery = dailyQuery.eq('class_id', classId)
    }
    const { data: dailyData } = await dailyQuery

    // 按天统计
    const dailyViews: Record<string, number> = {}
    dailyData?.forEach((item: any) => {
      const day = new Date(item.created_at).toISOString().split('T')[0]
      dailyViews[day] = (dailyViews[day] || 0) + 1
    })

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      todayViews,
      dailyViews,
      pageStats,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}
