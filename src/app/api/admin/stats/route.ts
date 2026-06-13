import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 管理员密码（你自己设置的，部署后改）
const ADMIN_PASSWORD = 'liuxia2024'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const password = searchParams.get('password')

  // 验证管理员密码
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // ===== 全站访问统计 =====
    const { count: totalViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })

    const { count: uniqueVisitors } = await supabase
      .from('page_views')
      .select('ip', { count: 'exact', head: true })
      .not('ip', 'is', null)

    // 今日访问
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: todayViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    // 近7天每日访问
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const { data: dailyData } = await supabase
      .from('page_views')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString())

    const dailyViews: Record<string, number> = {}
    dailyData?.forEach((item: any) => {
      const day = new Date(item.created_at).toISOString().split('T')[0]
      dailyViews[day] = (dailyViews[day] || 0) + 1
    })

    // 各页面访问量
    const { data: pageStats } = await supabase
      .from('page_views')
      .select('page, count')

    // ===== 班级统计 =====
    const { count: totalClasses } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })

    // 今日创建的班级
    const { count: todayClasses } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    // ===== 成员统计 =====
    const { count: totalMembers } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })

    const { count: submittedMembers } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('is_submitted', true)

    // 今日填写的成员
    const { count: todayMembers } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    // ===== 最近创建的班级 =====
    const { data: recentClasses } = await supabase
      .from('classes')
      .select('id, school, grade, class_name, creator_name, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    // 每个班级的成员数
    const classMemberCounts: Record<string, number> = {}
    if (recentClasses) {
      for (const cls of recentClasses) {
        const { count } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('class_id', cls.id)
        classMemberCounts[cls.id] = count || 0
      }
    }

    return NextResponse.json({
      // 访问统计
      totalViews,
      uniqueVisitors,
      todayViews,
      dailyViews,
      pageStats,
      // 班级统计
      totalClasses,
      todayClasses,
      // 成员统计
      totalMembers,
      submittedMembers,
      todayMembers,
      // 最近班级
      recentClasses: recentClasses?.map(cls => ({
        ...cls,
        member_count: classMemberCounts[cls.id] || 0,
      })),
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}
