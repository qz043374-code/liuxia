"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/tracker";

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
  invite_code: string;
}

export default function WallPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    trackPageView("wall", params.id as string);

    const fetchData = async () => {
      try {
        const classRes = await fetch(`/api/classes/${params.id}`);
        const classData = await classRes.json();
        setClassData(classData);

        const membersRes = await fetch(`/api/members?class_id=${params.id}`);
        const membersData = await membersRes.json();
        setMembers(membersData);
      } catch (error) {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const copyInviteCode = () => {
    if (classData) {
      navigator.clipboard.writeText(classData.invite_code);
      alert("邀请码已复制！");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center" style={{ background: "#FDF8F0" }}>
        <div className="text-center">
          <p className="text-base" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>加载中...</p>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center" style={{ background: "#FDF8F0" }}>
        <p className="text-base" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>班级不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-12" style={{ background: "#FDF8F0" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
            {classData.school}
          </h1>
          <p className="text-lg mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
            {classData.grade} · {classData.class_name}
          </p>
          <p className="text-sm" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>创建人：{classData.creator_name}</p>
        </div>

        {/* Invite Code */}
        <div className="rounded-xl p-6 mb-12 max-w-md mx-auto" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0", boxShadow: "0 4px 16px rgba(196, 162, 122, 0.1)" }}>
          <p className="text-sm text-center mb-3" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
            分享邀请码给同学们，让他们加入纪念册
          </p>
          <div className="flex items-center gap-3 justify-center">
            <div className="text-2xl font-bold tracking-[0.3em] px-6 py-3 rounded-xl" style={{ color: "#8B9A7B", background: "#F5EDE0", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
              {classData.invite_code}
            </div>
            <button
              onClick={copyInviteCode}
              className="px-4 py-3 rounded-xl text-sm transition-all"
              style={{ background: "#C4A27A", color: "#FFFDF5" }}
            >
              复制
            </button>
          </div>
        </div>

        {/* Members Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
              班级成员 ({members.length})
            </h2>
            <a
              href={`/yearbook/${params.id}`}
              className="px-6 py-3 rounded-full font-medium transition-all duration-300"
              style={{ 
                background: "linear-gradient(135deg, #C4A27A, #B8956E)",
                color: "#FFFDF5",
                boxShadow: "0 2px 8px rgba(196, 162, 122, 0.3)",
                fontFamily: "'KaiTi', 'STKaiti', serif"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(196, 162, 122, 0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              生成纪念册
            </a>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-20 rounded-xl border border-dashed" style={{ background: "#FFFDF5", borderColor: "#EDE0D0" }}>
              <p className="text-lg" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>还没有同学加入</p>
              <p className="mt-2" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>分享邀请码，让大家一起来填写吧！</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member, index) => {
                const p = member.profile_data || {};
                const nickname = p.nickname || "";
                const quote = p.quote || "";
                const message = p.message || "";
                const classPosition = p.class_position || "";
                const hobby = p.hobby || "";
                const photos = p.photos || [];

                return (
                  <div
                    key={member.id}
                    className="group rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                    style={{ background: "#FFFDF5", border: "1px solid #EDE0D0", boxShadow: "0 2px 8px rgba(196, 162, 122, 0.08)" }}
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden" style={{ background: "#F5EDE0", color: "#8B9A7B" }}>
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{member.name}</h3>
                        {nickname && <p className="text-sm" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>"{nickname}"</p>}
                        {classPosition && (
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full" style={{ background: "#F5EDE0", color: "#8B9A7B", border: "1px solid #EDE0D0" }}>
                            {classPosition}
                          </span>
                        )}
                      </div>
                    </div>
                    {hobby && (
                      <div className="mt-3 text-sm" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                        {hobby}
                      </div>
                    )}
                    {quote && (
                      <div className="mt-3 px-4 py-2 rounded-xl" style={{ background: "#FDF8F0" }}>
                        <p className="text-sm italic" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>"{quote}"</p>
                      </div>
                    )}
                    {photos.length > 0 && (
                      <div className="mt-3 flex gap-1">
                        {photos.slice(0, 3).map((url: string, i: number) => (
                          <div key={i} className="w-10 h-10 rounded-lg overflow-hidden" style={{ background: "#F5EDE0" }}>
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {photos.length > 3 && (
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs" style={{ background: "#F5EDE0", color: "#C4A27A" }}>
                            +{photos.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    {message && (
                      <p className="mt-3 text-sm leading-relaxed line-clamp-2" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                        {message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(74, 59, 44, 0.3)" }}
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ background: "#FFFDF5", boxShadow: "0 8px 32px rgba(196, 162, 122, 0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shrink-0 overflow-hidden" style={{ background: "#F5EDE0", color: "#8B9A7B" }}>
                    {selectedMember.avatar_url ? (
                      <img
                        src={selectedMember.avatar_url}
                        alt={selectedMember.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      selectedMember.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{selectedMember.name}</h2>
                    {selectedMember.profile_data?.nickname && (
                      <p className="text-base" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>"{selectedMember.profile_data.nickname}"</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  style={{ background: "#F5EDE0", color: "#C4A27A" }}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* 基本信息 */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedMember.profile_data?.class_position && (
                    <div className="rounded-xl p-4" style={{ background: "#FDF8F0", border: "1px solid #EDE0D0" }}>
                      <p className="text-xs mb-1" style={{ color: "#C4A27A" }}>班级职务</p>
                      <p className="font-medium" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{selectedMember.profile_data.class_position}</p>
                    </div>
                  )}
                  {selectedMember.profile_data?.favorite_subject && (
                    <div className="rounded-xl p-4" style={{ background: "#FDF8F0", border: "1px solid #EDE0D0" }}>
                      <p className="text-xs mb-1" style={{ color: "#C4A27A" }}>最喜爱的学科</p>
                      <p className="font-medium" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{selectedMember.profile_data.favorite_subject}</p>
                    </div>
                  )}
                  {selectedMember.profile_data?.hobby && (
                    <div className="rounded-xl p-4" style={{ background: "#FDF8F0", border: "1px solid #EDE0D0" }}>
                      <p className="text-xs mb-1" style={{ color: "#C4A27A" }}>兴趣爱好</p>
                      <p className="font-medium" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{selectedMember.profile_data.hobby}</p>
                    </div>
                  )}
                  {selectedMember.profile_data?.future_dream && (
                    <div className="rounded-xl p-4" style={{ background: "#FDF8F0", border: "1px solid #EDE0D0" }}>
                      <p className="text-xs mb-1" style={{ color: "#C4A27A" }}>未来的梦想</p>
                      <p className="font-medium" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{selectedMember.profile_data.future_dream}</p>
                    </div>
                  )}
                </div>

                {/* 联系方式 */}
                {(selectedMember.profile_data?.wechat || selectedMember.profile_data?.qq || selectedMember.profile_data?.phone) && (
                  <div>
                    <h3 className="text-sm font-medium mb-3" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>联系方式</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedMember.profile_data?.wechat && (
                        <span className="px-3 py-1.5 rounded-full text-sm" style={{ background: "#FDF8F0", color: "#8B9A7B", border: "1px solid #EDE0D0" }}>
                          微信：{selectedMember.profile_data.wechat}
                        </span>
                      )}
                      {selectedMember.profile_data?.qq && (
                        <span className="px-3 py-1.5 rounded-full text-sm" style={{ background: "#FDF8F0", color: "#8B9A7B", border: "1px solid #EDE0D0" }}>
                          QQ：{selectedMember.profile_data.qq}
                        </span>
                      )}
                      {selectedMember.profile_data?.phone && (
                        <span className="px-3 py-1.5 rounded-full text-sm" style={{ background: "#FDF8F0", color: "#8B9A7B", border: "1px solid #EDE0D0" }}>
                          {selectedMember.profile_data.phone}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 最值得怀念的事 */}
                {selectedMember.profile_data?.most_memorable && (
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>最值得怀念的事</h3>
                    <div className="rounded-xl p-4" style={{ background: "#FDF8F0", border: "1px solid #EDE0D0" }}>
                      <p className="leading-relaxed" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{selectedMember.profile_data.most_memorable}</p>
                    </div>
                  </div>
                )}

                {/* 座右铭 */}
                {selectedMember.profile_data?.quote && (
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>座右铭</h3>
                    <div className="rounded-xl p-4" style={{ background: "#FDF8F0", border: "1px solid #EDE0D0" }}>
                      <p className="italic" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>"{selectedMember.profile_data.quote}"</p>
                    </div>
                  </div>
                )}

                {/* 照片墙 */}
                {selectedMember.profile_data?.photos && selectedMember.profile_data.photos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>照片墙</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedMember.profile_data.photos.map((url: string, i: number) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden" style={{ background: "#F5EDE0" }}>
                          <img src={url} alt={`照片 ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 毕业留言 */}
                {selectedMember.profile_data?.message && (
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>毕业留言</h3>
                    <div className="rounded-xl p-4" style={{ background: "#FDF8F0", border: "1px solid #EDE0D0" }}>
                      <p className="leading-relaxed whitespace-pre-wrap" style={{ color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}>{selectedMember.profile_data.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
