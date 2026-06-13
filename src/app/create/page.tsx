"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackPageView } from "@/lib/tracker";

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackPageView("create");
  }, []);
  const [form, setForm] = useState({
    school: "",
    grade: "",
    class_name: "",
    creator_name: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create");

      const data = await res.json();

      const myClasses = JSON.parse(localStorage.getItem("myClasses") || "[]");
      myClasses.unshift({
        id: data.id,
        school: data.school,
        grade: data.grade,
        class_name: data.class_name,
        invite_code: data.invite_code,
        role: "creator",
      });
      localStorage.setItem("myClasses", JSON.stringify(myClasses.slice(0, 10)));

      router.push(`/fill/${data.id}?invite_code=${data.invite_code}&role=creator`);
    } catch (error) {
      alert("创建失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-12" style={{ background: "#FDF8F0" }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
            创建班级纪念册
          </h1>
          <p className="text-base" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>填写以下信息，开启你们的青春纪念之旅</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl p-8 space-y-6" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0", boxShadow: "0 4px 16px rgba(196, 162, 122, 0.1)" }}>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                学校名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="例如：XX市第一中学"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                value={form.school}
                onChange={(e) => setForm({ ...form, school: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                  年级 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：2024届"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                  班级 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：高三(1)班"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                  value={form.class_name}
                  onChange={(e) => setForm({ ...form, class_name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                你的姓名 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="你的名字"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                value={form.creator_name}
                onChange={(e) => setForm({ ...form, creator_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                管理密码 <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="设置一个管理密码"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
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
            {loading ? "创建中..." : "创建纪念册"}
          </button>
        </form>
      </div>
    </div>
  );
}
