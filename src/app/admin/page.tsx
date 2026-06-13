"use client";

import { useState } from "react";

interface AdminStats {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  dailyViews: Record<string, number>;
  pageStats: { page: string; count: number }[] | null;
  totalClasses: number;
  todayClasses: number;
  totalMembers: number;
  submittedMembers: number;
  todayMembers: number;
  recentClasses: {
    id: string;
    school: string;
    grade: string;
    class_name: string;
    creator_name: string;
    created_at: string;
    member_count: number;
  }[];
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/stats?password=${password}`);
      if (!res.ok) {
        setError("密码错误");
        setIsAuthed(false);
        return;
      }
      const data = await res.json();
      setStats(data);
      setIsAuthed(true);
    } catch {
      setError("获取数据失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-12" style={{ background: "#FDF8F0" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
            🌿 留住夏天 · 管理后台
          </h1>
          <p className="text-sm" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
            查看全站数据：访问量、班级数、成员数
          </p>
        </div>

        {!isAuthed ? (
          <div className="max-w-sm mx-auto rounded-xl p-8" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
            <p className="text-sm mb-4" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
              请输入管理员密码
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchStats()}
              placeholder="管理员密码"
              className="w-full px-4 py-3 rounded-lg mb-4 outline-none transition-all"
              style={{ border: "1.5px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C" }}
            />
            {error && (
              <p className="text-sm mb-4" style={{ color: "#D4A0A0" }}>{error}</p>
            )}
            <button
              onClick={fetchStats}
              disabled={loading}
              className="w-full px-6 py-3 rounded-full font-medium transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #C4A27A, #B8956E)", color: "#FFFDF5" }}
            >
              {loading ? "加载中..." : "进入后台"}
            </button>
          </div>
        ) : stats ? (
          <div className="space-y-8">
            {/* ===== 概览卡片 ===== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-5 text-center" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
                <div className="text-3xl font-bold mb-1" style={{ color: "#8B9A7B" }}>{stats.totalViews}</div>
                <div className="text-xs" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>总访问量</div>
              </div>
              <div className="rounded-xl p-5 text-center" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
                <div className="text-3xl font-bold mb-1" style={{ color: "#8B9A7B" }}>{stats.uniqueVisitors}</div>
                <div className="text-xs" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>独立访客</div>
              </div>
              <div className="rounded-xl p-5 text-center" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
                <div className="text-3xl font-bold mb-1" style={{ color: "#8B9A7B" }}>{stats.totalClasses}</div>
                <div className="text-xs" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>创建的班级</div>
              </div>
              <div className="rounded-xl p-5 text-center" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
                <div className="text-3xl font-bold mb-1" style={{ color: "#8B9A7B" }}>{stats.totalMembers}</div>
                <div className="text-xs" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>填写的成员</div>
              </div>
            </div>

            {/* ===== 今日数据 ===== */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: "linear-gradient(135deg, #F5EDE0, #EDE0D0)" }}>
                <div className="text-2xl font-bold" style={{ color: "#8B9A7B" }}>{stats.todayViews}</div>
                <div className="text-xs mt-1" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>今日访问</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: "linear-gradient(135deg, #F5EDE0, #EDE0D0)" }}>
                <div className="text-2xl font-bold" style={{ color: "#8B9A7B" }}>{stats.todayClasses}</div>
                <div className="text-xs mt-1" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>今日创建班级</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: "linear-gradient(135deg, #F5EDE0, #EDE0D0)" }}>
                <div className="text-2xl font-bold" style={{ color: "#8B9A7B" }}>{stats.todayMembers}</div>
                <div className="text-xs mt-1" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>今日填写成员</div>
              </div>
            </div>

            {/* ===== 近7天趋势 ===== */}
            <div className="rounded-xl p-6" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
              <h2 className="font-bold mb-4" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>近7天访问趋势</h2>
              <div className="flex items-end gap-2 h-32">
                {Object.entries(stats.dailyViews).length > 0 ? (
                  Object.entries(stats.dailyViews).map(([day, count]) => {
                    const maxCount = Math.max(...Object.values(stats.dailyViews), 1);
                    const height = (count / maxCount) * 100;
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-medium" style={{ color: "#8B9A7B" }}>{count}</span>
                        <div
                          className="w-full rounded-t-lg transition-all"
                          style={{
                            height: `${height}%`,
                            background: "linear-gradient(180deg, #C4A27A, #B8956E)",
                            minHeight: count > 0 ? "4px" : "0",
                          }}
                        />
                        <span className="text-xs" style={{ color: "#C4A27A" }}>
                          {day.slice(5)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center py-8" style={{ color: "#C4A27A" }}>
                    暂无数据，快去宣传吧！
                  </div>
                )}
              </div>
            </div>

            {/* ===== 各页面访问量 ===== */}
            <div className="rounded-xl p-6" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
              <h2 className="font-bold mb-4" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>各页面访问量</h2>
              <div className="space-y-3">
                {stats.pageStats && stats.pageStats.length > 0 ? (
                  stats.pageStats.map((item) => (
                    <div key={item.page} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #F5EDE0" }}>
                      <span className="text-sm" style={{ color: "#4A3B2C" }}>
                        {item.page === "home" ? "🏠 首页" :
                         item.page === "create" ? "📝 创建页" :
                         item.page === "join" ? "🔗 加入页" :
                         item.page === "fill" ? "✏️ 填写页" :
                         item.page === "wall" ? "🖼️ 成员墙" :
                         item.page === "yearbook" ? "📖 纪念册" : item.page}
                      </span>
                      <span className="text-sm font-medium" style={{ color: "#8B9A7B" }}>{item.count} 次</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm" style={{ color: "#C4A27A" }}>暂无数据</p>
                )}
              </div>
            </div>

            {/* ===== 成员提交率 ===== */}
            <div className="rounded-xl p-6" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
              <h2 className="font-bold mb-4" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>成员提交率</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-4 rounded-full overflow-hidden" style={{ background: "#F5EDE0" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.totalMembers > 0 ? (stats.submittedMembers / stats.totalMembers) * 100 : 0}%`,
                        background: "linear-gradient(90deg, #C4A27A, #8B9A7B)",
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: "#8B9A7B" }}>
                  {stats.totalMembers > 0 ? Math.round((stats.submittedMembers / stats.totalMembers) * 100) : 0}%
                </span>
              </div>
              <div className="flex gap-4 mt-3 text-sm" style={{ color: "#C4A27A" }}>
                <span>已提交：{stats.submittedMembers} 人</span>
                <span>未提交：{stats.totalMembers - stats.submittedMembers} 人</span>
              </div>
            </div>

            {/* ===== 最近创建的班级 ===== */}
            <div className="rounded-xl p-6" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
              <h2 className="font-bold mb-4" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>最近创建的班级</h2>
              {stats.recentClasses.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #F5EDE0" }}>
                      <div>
                        <p className="font-medium text-sm" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                          {cls.school} · {cls.grade} {cls.class_name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#C4A27A" }}>
                          创建者：{cls.creator_name} · {new Date(cls.created_at).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium" style={{ color: "#8B9A7B" }}>{cls.member_count} 人</span>
                        <br />
                        <a
                          href={`/wall/${cls.id}`}
                          className="text-xs hover:underline"
                          style={{ color: "#C4A27A" }}
                          target="_blank"
                        >
                          查看 →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                  还没有人创建班级，快去小红书宣传吧！🎉
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
