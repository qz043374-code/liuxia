"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackPageView } from "@/lib/tracker";

export default function JoinPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    trackPageView("join");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/classes?invite_code=${inviteCode}`);
      if (!res.ok) throw new Error("Invalid invite code");

      const data = await res.json();
      router.push(`/fill/${data.id}?invite_code=${inviteCode}&role=member`);
    } catch (error) {
      setError("邀请码无效，请检查后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-12" style={{ background: "#FDF8F0" }}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
            加入纪念册
          </h1>
          <p className="text-base" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>输入创建者分享给你的邀请码</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl p-8" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0", boxShadow: "0 4px 16px rgba(196, 162, 122, 0.1)" }}>
            <label className="block text-sm font-medium mb-3" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
              邀请码
            </label>
            <input
              type="text"
              required
              placeholder="请输入邀请码"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all text-center text-lg tracking-widest"
              style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(e.target.value);
                setError("");
              }}
            />
            {error && (
              <p className="mt-3 text-sm" style={{ color: "#C4A27A" }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full text-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: "linear-gradient(135deg, #C4A27A, #B8956E)",
              color: "#FFFDF5",
              boxShadow: "0 2px 8px rgba(196, 162, 122, 0.3)",
              fontFamily: "'KaiTi', 'STKaiti', serif"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(196, 162, 122, 0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            {loading ? "验证中..." : "加入纪念册"}
          </button>
        </form>
      </div>
    </div>
  );
}
