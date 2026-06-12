import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "留住夏天 - 班级纪念册",
  description: "创建班级纪念册，邀请同学们一起填写信息、上传照片、写下祝福。用 AI 生成温暖的毕业留言，导出 PDF 永久珍藏。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        {/* 顶部导航 */}
        <header style={{ background: "rgba(253, 248, 240, 0.85)", backdropFilter: "blur(8px)", borderBottom: "1px solid #EDE0D0" }}>
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <span className="font-bold text-lg" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
                留住夏天
              </span>
            </a>
            <nav className="flex items-center gap-4">
              <a
                href="/create"
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{ 
                  background: "linear-gradient(135deg, #C4A27A, #B8956E)",
                  color: "#FFFDF5",
                  boxShadow: "0 2px 8px rgba(196, 162, 122, 0.3)",
                  fontFamily: "'KaiTi', 'STKaiti', serif"
                }}
              >
                创建
              </a>
              <a
                href="/join"
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{ 
                  border: "1.5px solid #EDE0D0",
                  color: "#8B9A7B",
                  fontFamily: "'KaiTi', 'STKaiti', serif"
                }}
              >
                加入
              </a>
            </nav>
          </div>
        </header>

        {/* 主内容 */}
        <main>
          {children}
        </main>

        {/* 底部 */}
        <footer style={{ background: "#FDF8F0", borderTop: "1px solid #EDE0D0" }}>
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-center">
            <p className="text-sm" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
              🌿 留住夏天 · 把青春写成一本纪念册
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
