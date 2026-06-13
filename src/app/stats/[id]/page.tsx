"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Stats {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  dailyViews: Record<string, number>;
  pageStats: { page: string; count: number }[] | null;
}

export default function StatsPage() {
  const params = useParams();
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/stats?class_id=${params.id}&password=${password}`);
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
          📊 访问统计
        </h1>

        {!isAuthed ? (
          <div className="max-w-sm mx-auto rounded-xl p-8" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
            <p className="text-sm mb-4" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
              请输入班级密码查看统计
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchStats()}
              placeholder="班级密码"
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
              {loading ? "加载中..." : "查看统计"}
            </button>
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* 概览卡片 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl p-6 text-center" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
                <div className="text-3xl font-bold mb-1" style={{ color: "#8B9A7B" }}>{stats.totalViews}</div>
                <div className="text-sm" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>总访问量</div>
              </div>
              <div className="rounded-xl p-6 text-center" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
                <div className="text-3xl font-bold mb-1" style={{ color: "#8B9A7B" }}>{stats.uniqueVisitors}</div>
                <div className="text-sm" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>独立访客</div>
              </div>
              <div className="rounded-xl p-6 text-center" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
                <div className="text-3xl font-bold mb-1" style={{ color: "#8B9A7B" }}>{stats.todayViews}</div>
                <div className="text-sm" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>今日访问</div>
              </div>
            </div>

            {/* 近7天趋势 */}
            <div className="rounded-xl p-6" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
              <h2 className="font-bold mb-4" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>近7天访问趋势</h2>
              <div className="flex items-end gap-2 h-32">
                {Object.entries(stats.dailyViews).map(([day, count]) => {
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
                })}
              </div>
            </div>

            {/* 各页面访问 */}
            <div className="rounded-xl p-6" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
              <h2 className="font-bold mb-4" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>各页面访问量</h2>
              <div className="space-y-3">
                {stats.pageStats?.map((item) => (
                  <div key={item.page} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "#4A3B2C" }}>{item.page}</span>
                    <span className="text-sm font-medium" style={{ color: "#8B9A7B" }}>{item.count} 次</span>
                  </div>
                ))}
                {(!stats.pageStats || stats.pageStats.length === 0) && (
                  <p className="text-sm" style={{ color: "#C4A27A" }}>暂无数据</p>
                )}
              </div>
            </div>

            {/* 成员统计 */}
            <div className="rounded-xl p-6" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0" }}>
              <h2 className="font-bold mb-4" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>成员统计</h2>
              <MemberStats classId={params.id as string} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MemberStats({ classId }: { classId: string }) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/members?class_id=${classId}`)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) return <p className="text-sm" style={{ color: "#C4A27A" }}>加载中...</p>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm" style={{ color: "#8B9A7B" }}>总人数：<strong>{members.length}</strong></span>
        <span className="text-sm" style={{ color: "#8B9A7B" }}>已提交：<strong>{members.filter((m) => m.is_submitted).length}</strong></span>
      </div>
      <div className="space-y-2">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #F5EDE0" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "#F5EDE0", color: "#8B9A7B" }}>
                {member.name?.charAt(0)}
              </div>
              <span className="text-sm" style={{ color: "#4A3B2C" }}>{member.name}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${member.is_submitted ? "" : ""}`} style={{
              background: member.is_submitted ? "#E8F0E0" : "#F5EDE0",
              color: member.is_submitted ? "#8B9A7B" : "#C4A27A",
            }}>
              {member.is_submitted ? "已填写" : "未填写"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
