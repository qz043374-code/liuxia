"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

interface Member {
  id: string;
  name: string;
  avatar_url: string;
  profile_data: Record<string, any>;
  joined_at: string;
}

interface ClassData {
  id: string;
  school: string;
  grade: string;
  class_name: string;
  creator_name: string;
}

export default function YearbookPage() {
  const params = useParams();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const yearbookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, membersRes] = await Promise.all([
          fetch(`/api/classes/${params.id}`),
          fetch(`/api/members?class_id=${params.id}`),
        ]);

        const classData = await classRes.json();
        const membersData = await membersRes.json();

        setClassData(classData);
        setMembers(membersData);
      } catch (error) {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // 总页数：封面 + 每个成员一页 + 封底
  const totalPages = 1 + members.length + 1;

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPages || flipping) return;
    setFlipping(true);
    setCurrentPage(page);
    setTimeout(() => setFlipping(false), 400);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center" style={{ background: "#FDF8F0" }}>
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">📖</div>
          <p className="text-[#8B9A7B]" style={{ fontFamily: "'KaiTi', 'STKaiti', serif" }}>翻开回忆中...</p>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center" style={{ background: "#FDF8F0" }}>
        <p className="text-[#C4A27A]" style={{ fontFamily: "'KaiTi', 'STKaiti', serif" }}>班级不存在</p>
      </div>
    );
  }

  // 获取当前页要显示的内容
  const renderPage = (pageIndex: number) => {
    // 封面 (第0页)
    if (pageIndex === 0) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FDF8F0 0%, #F5EDE0 50%, #EDE0D0 100%)" }}>
          {/* 装饰元素 */}
          <div className="absolute top-8 left-8 text-2xl opacity-20" style={{ fontFamily: "'Bradley Hand', 'KaiTi', cursive" }}>✦</div>
          <div className="absolute top-8 right-8 text-2xl opacity-20" style={{ fontFamily: "'Bradley Hand', 'KaiTi', cursive" }}>✦</div>
          <div className="absolute bottom-8 left-8 text-2xl opacity-20" style={{ fontFamily: "'Bradley Hand', 'KaiTi', cursive" }}>✦</div>
          <div className="absolute bottom-8 right-8 text-2xl opacity-20" style={{ fontFamily: "'Bradley Hand', 'KaiTi', cursive" }}>✦</div>
          {/* 装饰虚线框 */}
          <div className="absolute inset-6 border border-dashed border-[#C4A27A]/20 rounded-2xl pointer-events-none" />
          {/* 装饰圆点 */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#C4A27A]/10" />
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-[#8B9A7B]/10" />
          
          <div className="text-7xl mb-6 drop-shadow-sm">🎓</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center leading-tight" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
            {classData.school}
          </h1>
          <div className="w-20 h-0.5 mb-5" style={{ background: "#C4A27A" }} />
          <p className="text-xl mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
            {classData.grade} · {classData.class_name}
          </p>
          <p className="text-base mt-4" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
            把学生时代，永久留在这个夏天。
          </p>
          <p className="text-xs mt-3" style={{ color: "#C4A27A", opacity: 0.6, fontFamily: "'KaiTi', 'STKaiti', serif" }}>
            让多年后的自己，依然能够翻开属于那个班级的回忆。
          </p>
        </div>
      );
    }

    // 封底 (最后一页)
    if (pageIndex === totalPages - 1) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #EDE0D0 0%, #F5EDE0 50%, #FDF8F0 100%)" }}>
          <div className="absolute top-8 left-8 text-2xl opacity-20" style={{ fontFamily: "'Bradley Hand', 'KaiTi', cursive" }}>✦</div>
          <div className="absolute top-8 right-8 text-2xl opacity-20" style={{ fontFamily: "'Bradley Hand', 'KaiTi', cursive" }}>✦</div>
          <div className="absolute bottom-8 left-8 text-2xl opacity-20" style={{ fontFamily: "'Bradley Hand', 'KaiTi', cursive" }}>✦</div>
          <div className="absolute bottom-8 right-8 text-2xl opacity-20" style={{ fontFamily: "'Bradley Hand', 'KaiTi', cursive" }}>✦</div>
          <div className="absolute inset-6 border border-dashed border-[#C4A27A]/20 rounded-2xl pointer-events-none" />
          
          <div className="text-7xl mb-6 drop-shadow-sm">🌟</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>愿友谊长存</h2>
          <div className="w-20 h-0.5 mb-5" style={{ background: "#C4A27A" }} />
          <p className="text-xl mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>青春不散场，未来皆可期</p>
          <p className="text-sm" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
            {classData.school} · {classData.grade} {classData.class_name}
          </p>
        </div>
      );
    }

    // 成员页 (第1页到倒数第2页)
    const member = members[pageIndex - 1];
    if (!member) return null;

    const p = member.profile_data || {};

    return (
      <div className="w-full h-full flex flex-col p-8 md:p-10 overflow-y-auto" style={{ background: "#FFFDF5" }}>
        {/* 页码 */}
        <div className="text-xs mb-4 text-center" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
          — {pageIndex} / {totalPages - 1} —
        </div>

        {/* 头部 - 大头像 + 姓名 */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold mb-3 overflow-hidden" style={{ 
            background: "#F5EDE0",
            color: "#8B9A7B",
            border: "3px solid #EDE0D0",
            boxShadow: "0 4px 12px rgba(196, 162, 122, 0.15)"
          }}>
            {member.avatar_url ? (
              <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              member.name.charAt(0)
            )}
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>{member.name}</h2>
          {p.nickname && <p className="text-base mb-1" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>「{p.nickname}」</p>}
          {p.class_position && (
            <span className="px-3 py-0.5 rounded-full text-xs font-medium" style={{ background: "#F5EDE0", color: "#8B9A7B", border: "1px solid #EDE0D0" }}>
              {p.class_position}
            </span>
          )}
        </div>

        {/* 座右铭 */}
        {p.quote && (
          <div className="text-center mb-5 px-5 py-3 rounded-lg mx-auto max-w-xs" style={{ background: "#FDF8F0", border: "1px dashed #EDE0D0" }}>
            <p className="italic text-sm" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>「{p.quote}」</p>
          </div>
        )}

        {/* 信息卡片 */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {p.favorite_subject && (
            <div className="rounded-xl p-3.5" style={{ background: "#FDF8F0", border: "1px solid #EDE0D0" }}>
              <p className="text-xs mb-1" style={{ color: "#C4A27A" }}>📚 最喜爱的学科</p>
              <p className="font-medium text-sm" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{p.favorite_subject}</p>
            </div>
          )}
          {p.hobby && (
            <div className="rounded-xl p-3.5" style={{ background: "#FDF8F0", border: "1px solid #EDE0D0" }}>
              <p className="text-xs mb-1" style={{ color: "#C4A27A" }}>🎯 兴趣爱好</p>
              <p className="font-medium text-sm" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{p.hobby}</p>
            </div>
          )}
          {p.future_dream && (
            <div className="rounded-xl p-3.5" style={{ background: "#FDF8F0", border: "1px solid #EDE0D0" }}>
              <p className="text-xs mb-1" style={{ color: "#C4A27A" }}>🌟 未来梦想</p>
              <p className="font-medium text-sm" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{p.future_dream}</p>
            </div>
          )}
          {(p.wechat || p.qq || p.phone) && (
            <div className="rounded-xl p-3.5" style={{ background: "#FDF8F0", border: "1px solid #EDE0D0" }}>
              <p className="text-xs mb-1" style={{ color: "#C4A27A" }}>📞 联系方式</p>
              <div className="text-sm space-y-0.5" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                {p.wechat && <p>微信：{p.wechat}</p>}
                {p.qq && <p>QQ：{p.qq}</p>}
                {p.phone && <p>📱 {p.phone}</p>}
              </div>
            </div>
          )}
        </div>

        {/* 最值得怀念的事 */}
        {p.most_memorable && (
          <div className="mb-4">
            <p className="text-xs mb-1.5" style={{ color: "#C4A27A" }}>💭 最值得怀念的事</p>
            <div className="rounded-xl p-3.5" style={{ background: "#FDF8F0", border: "1px solid #EDE0D0" }}>
              <p className="text-sm leading-relaxed" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{p.most_memorable}</p>
            </div>
          </div>
        )}

        {/* 照片 */}
        {p.photos && p.photos.length > 0 && (
          <div className="mb-4">
            <p className="text-xs mb-1.5" style={{ color: "#C4A27A" }}>📸 照片</p>
            <div className="grid grid-cols-3 gap-2">
              {p.photos.map((url: string, i: number) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden" style={{ border: "2px solid #EDE0D0", background: "#F5EDE0" }}>
                  <img src={url} alt={`照片 ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 毕业留言 */}
        {p.message && (
          <div className="mt-auto pt-3.5" style={{ borderTop: "1px dashed #EDE0D0" }}>
            <p className="text-xs mb-1.5" style={{ color: "#C4A27A" }}>💌 毕业留言</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{p.message}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "#FDF8F0" }}>
      {/* 纸张纹理背景 */}
      <div className="fixed inset-0 -z-10" style={{ background: "#FDF8F0" }}>
        {/* 噪点纹理 */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px"
        }} />
        {/* 暖色渐变 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDF8F0] via-[#FFF8E7] to-[#FDF8F0]" />
        {/* 装饰性圆点 */}
        <div className="absolute top-32 left-[8%] w-3 h-3 rounded-full opacity-[0.08]" style={{ background: "#C4A27A" }} />
        <div className="absolute top-64 right-[12%] w-2 h-2 rounded-full opacity-[0.06]" style={{ background: "#8B9A7B" }} />
        <div className="absolute bottom-48 left-[15%] w-4 h-4 rounded-full opacity-[0.05]" style={{ background: "#C4A27A" }} />
      </div>

      {/* 打印样式 */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .yearbook-page {
            page-break-after: always;
            page-break-inside: avoid;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* 顶部导航 */}
      <div className="no-print" style={{ background: "rgba(253, 248, 240, 0.85)", backdropFilter: "blur(8px)", borderBottom: "1px solid #EDE0D0" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🌿</span>
            <span className="font-bold text-sm" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
              {classData.school} · {classData.class_name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
              {currentPage === 0 ? "封面" : currentPage === totalPages - 1 ? "封底" : `${members[currentPage - 1]?.name || ""}`}
            </span>
            <span className="text-xs" style={{ color: "#EDE0D0" }}>|</span>
            <span className="text-xs" style={{ color: "#C4A27A" }}>{currentPage + 1} / {totalPages}</span>
          </div>
        </div>
      </div>

      {/* 翻页区域 */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="relative w-full max-w-2xl" style={{ height: "min(80vh, 800px)" }}>
          {/* 翻页容器 */}
          <div className="relative w-full h-full">
            {/* 书页效果 */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ 
              background: "#FFFDF5",
              boxShadow: "0 8px 32px rgba(196, 162, 122, 0.15), 0 2px 8px rgba(196, 162, 122, 0.1)",
              border: "1px solid #EDE0D0"
            }}>
              {/* 左侧阴影 */}
              <div className="absolute left-0 top-0 bottom-0 w-4 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(196, 162, 122, 0.08), transparent)" }} />
              {/* 书脊装饰 */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, #EDE0D0, #C4A27A, #EDE0D0)" }} />
              
              {/* 页面内容 */}
              <div
                key={currentPage}
                className={`yearbook-page w-full h-full transition-all duration-400 ${
                  flipping ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                {renderPage(currentPage)}
              </div>
            </div>
          </div>

          {/* 左右翻页按钮 */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="no-print absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed z-20"
            style={{ 
              background: "rgba(253, 248, 240, 0.9)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px rgba(196, 162, 122, 0.2)",
              border: "1px solid #EDE0D0",
              color: "#C4A27A"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(-4px) scale(1.1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(196, 162, 122, 0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="no-print absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed z-20"
            style={{ 
              background: "rgba(253, 248, 240, 0.9)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px rgba(196, 162, 122, 0.2)",
              border: "1px solid #EDE0D0",
              color: "#C4A27A"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(4px) scale(1.1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(196, 162, 122, 0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="no-print" style={{ background: "rgba(253, 248, 240, 0.85)", backdropFilter: "blur(8px)", borderTop: "1px solid #EDE0D0" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* 页码指示器 */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className="transition-all duration-300"
                style={{
                  width: i === currentPage ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i === currentPage ? "#C4A27A" : "#EDE0D0",
                  border: "none",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => { if (i !== currentPage) e.currentTarget.style.background = "#C4A27A"; }}
                onMouseLeave={(e) => { if (i !== currentPage) e.currentTarget.style.background = "#EDE0D0"; }}
              />
            ))}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={{ 
                background: "linear-gradient(135deg, #C4A27A, #B8956E)",
                color: "#FFFDF5",
                boxShadow: "0 2px 8px rgba(196, 162, 122, 0.3)",
                fontFamily: "'KaiTi', 'STKaiti', serif"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(196, 162, 122, 0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              💾 另存为 PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={{ 
                background: "rgba(253, 248, 240, 0.9)",
                color: "#8B9A7B",
                border: "1.5px solid #EDE0D0",
                fontFamily: "'KaiTi', 'STKaiti', serif"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(196, 162, 122, 0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              🖨️ 打印
            </button>
          </div>
        </div>
      </div>

      {/* 隐藏的完整内容（用于打印） */}
      <div className="hidden print:block">
        {Array.from({ length: totalPages }).map((_, i) => (
          <div key={i} className="yearbook-page">
            {renderPage(i)}
          </div>
        ))}
      </div>
    </div>
  );
}
