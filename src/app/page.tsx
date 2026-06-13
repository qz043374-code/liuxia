"use client";

import { useEffect, useState } from "react";
import { trackPageView } from "@/lib/tracker";

interface MyClass {
  id: string;
  school: string;
  grade: string;
  class_name: string;
  invite_code: string;
  role: string;
}

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [myClasses, setMyClasses] = useState<MyClass[]>([]);

  useEffect(() => {
    setVisible(true);
    trackPageView("home");
    const saved = localStorage.getItem("myClasses");
    if (saved) {
      setMyClasses(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: "#FDF8F0" }}>
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium mb-8" style={{ background: "#F5EDE0", color: "#8B9A7B", border: "1px solid #EDE0D0", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
            🌿 毕业季 · 青春不散场
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'KaiTi', 'STKaiti', serif" }}>
            <span style={{ color: "#8B9A7B" }}>留住夏天</span>
            <br />
            <span className="text-4xl md:text-5xl font-medium" style={{ color: "#C4A27A" }}>
              把青春写成一本纪念册
            </span>
          </h1>
          <p className="text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
            创建班级纪念册，邀请同学们一起填写信息、上传照片、写下祝福。
            <br />
            用 AI 生成温暖的毕业留言，导出 PDF 永久珍藏。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/create"
              className="px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
              style={{ 
                background: "linear-gradient(135deg, #C4A27A, #B8956E)",
                color: "#FFFDF5",
                boxShadow: "0 2px 8px rgba(196, 162, 122, 0.3)",
                fontFamily: "'KaiTi', 'STKaiti', serif"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(196, 162, 122, 0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              创建纪念册
            </a>
            <a
              href="/join"
              className="px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              style={{ 
                border: "2px solid #EDE0D0",
                color: "#8B9A7B",
                fontFamily: "'KaiTi', 'STKaiti', serif"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F5EDE0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              加入纪念册
            </a>
          </div>
        </div>
      </section>

      {/* My Classes Section */}
      {myClasses.length > 0 && (
        <section className="px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
              📚 我的班级
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {myClasses.map((cls) => (
                <a
                  key={cls.id}
                  href={`/wall/${cls.id}`}
                  className="group rounded-xl p-5 transition-all duration-300 flex items-center gap-4"
                  style={{ background: "#FFFDF5", border: "1px solid #EDE0D0", boxShadow: "0 2px 8px rgba(196, 162, 122, 0.08)" }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0" style={{ background: "#F5EDE0", color: "#8B9A7B" }}>
                    {cls.school.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold transition-colors" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                      {cls.school}
                    </h3>
                    <p className="text-sm" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                      {cls.grade} · {cls.class_name}
                    </p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full" style={{ background: "#F5EDE0", color: "#8B9A7B", border: "1px solid #EDE0D0" }}>
                      {cls.role === "creator" ? "创建者" : "成员"}
                    </span>
                  </div>
                  <span className="transition-colors" style={{ color: "#EDE0D0" }}>→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
            简单三步，留住青春
          </h2>
          <p className="text-center mb-16 max-w-md mx-auto" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
            和同学们一起，把美好的回忆变成一本可以永久珍藏的纪念册
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "创建班级",
                desc: "填写学校、班级信息，生成专属邀请码",
                icon: "📝",
              },
              {
                step: "02",
                title: "邀请同学",
                desc: "分享邀请码，同学们一起填写信息、上传照片和留言",
                icon: "🤝",
              },
              {
                step: "03",
                title: "永久珍藏",
                desc: "AI 生成温暖留言，导出精美纪念册，青春永不散场",
                icon: "📖",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-xl p-8 transition-all duration-500 hover:-translate-y-1"
                style={{ background: "#FFFDF5", border: "1px solid #EDE0D0", boxShadow: "0 2px 8px rgba(196, 162, 122, 0.08)" }}
              >
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl">{feature.icon}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#F5EDE0", color: "#8B9A7B" }}>
                      {feature.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>{feature.title}</h3>
                  <p className="leading-relaxed text-sm" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-2xl p-12 shadow-lg" style={{ background: "linear-gradient(135deg, #C4A27A, #B8956E)" }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#FFFDF5", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
              现在就开启你们的纪念之旅
            </h2>
            <p className="mb-8 text-base" style={{ color: "#F5EDE0", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
              青春不散场，回忆永留存。让我们一起创造属于你们的独家记忆。
            </p>
            <a
              href="/create"
              className="inline-block px-10 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all duration-300"
              style={{ background: "#FFFDF5", color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}
            >
              免费创建 →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
