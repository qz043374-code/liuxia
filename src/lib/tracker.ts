// 页面访问统计
export function trackPageView(page: string, classId?: string) {
  // 使用 sendBeacon 在页面卸载时也能发送
  const data: any = { page }
  if (classId) {
    data.class_id = classId
  }
  data.referrer = document.referrer || null

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/stats', JSON.stringify(data))
    } else {
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      })
    }
  } catch {
    // 静默失败，不影响用户体验
  }
}
