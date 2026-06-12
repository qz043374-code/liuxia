"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

export default function FillPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [classData, setClassData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    avatar_url: "",
    quote: "",
    message: "",
    wechat: "",
    qq: "",
    phone: "",
    class_position: "",
    favorite_subject: "",
    hobby: "",
    most_memorable: "",
    future_dream: "",
    photos: [] as string[],
  });

  const role = searchParams.get("role") || "member";

  useEffect(() => {
    const inviteCode = searchParams.get("invite_code");
    if (inviteCode) {
      fetch(`/api/classes?invite_code=${inviteCode}`)
        .then((res) => res.json())
        .then((data) => {
          setClassData(data);
          if (role === "creator" && data.creator_name) {
            setForm((prev) => ({ ...prev, name: data.creator_name }));
          }
        })
        .catch(() => router.push("/join"));
    }
  }, [searchParams, router, role]);

  const generateMessage = async () => {
    if (!form.name) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, nickname: form.nickname }),
      });
      const data = await res.json();
      setForm((prev) => ({ ...prev, message: data.message }));
    } catch (error) {
      console.error("Failed to generate message");
    } finally {
      setGenerating(false);
    }
  };

  const compressImage = (file: File, maxWidth: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Compression failed"));
            },
            "image/jpeg",
            0.8
          );
        };
      };
      reader.onerror = reject;
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const compressedBlob = await compressImage(file, 800);
        const compressedFile = new File([compressedBlob], file.name, {
          type: "image/jpeg",
        });

        const formData = new FormData();
        formData.append("file", compressedFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            photos: [...prev.photos, data.url],
          }));
        }
      }
    } catch (error) {
      console.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const compressedBlob = await compressImage(file, 400);
      const compressedFile = new File([compressedBlob], file.name, {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("file", compressedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, avatar_url: data.url }));
      }
    } catch (error) {
      console.error("Avatar upload failed");
    } finally {
      setAvatarUploading(false);
      if (avatarFileInputRef.current) {
        avatarFileInputRef.current.value = "";
      }
    }
  };

  const removePhoto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData: Record<string, any> = {};
      if (form.nickname) profileData.nickname = form.nickname;
      if (form.quote) profileData.quote = form.quote;
      if (form.message) profileData.message = form.message;
      if (form.wechat) profileData.wechat = form.wechat;
      if (form.qq) profileData.qq = form.qq;
      if (form.phone) profileData.phone = form.phone;
      if (form.class_position) profileData.class_position = form.class_position;
      if (form.favorite_subject) profileData.favorite_subject = form.favorite_subject;
      if (form.hobby) profileData.hobby = form.hobby;
      if (form.most_memorable) profileData.most_memorable = form.most_memorable;
      if (form.future_dream) profileData.future_dream = form.future_dream;
      if (form.photos.length > 0) profileData.photos = form.photos;

      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_id: params.id,
          name: form.name,
          avatar_url: form.avatar_url,
          profile_data: profileData,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      if (role === "member" && classData) {
        const myClasses = JSON.parse(localStorage.getItem("myClasses") || "[]");
        const exists = myClasses.some((c: any) => c.id === params.id);
        if (!exists) {
          myClasses.unshift({
            id: params.id,
            school: classData.school,
            grade: classData.grade,
            class_name: classData.class_name,
            invite_code: searchParams.get("invite_code"),
            role: "member",
          });
          localStorage.setItem("myClasses", JSON.stringify(myClasses.slice(0, 10)));
        }
      }

      router.push(`/wall/${params.id}`);
    } catch (error) {
      alert("提交失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  if (!classData) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center" style={{ background: "#FDF8F0" }}>
        <div className="text-center">
          <p className="text-base" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-12" style={{ background: "#FDF8F0" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
            填写个人信息
          </h1>
          <p className="text-base" style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
            {role === "creator" ? "创建成功！请先填写你的个人信息" : "加入 "}
            <span className="font-bold" style={{ color: "#8B9A7B" }}>{classData.school} {classData.grade} {classData.class_name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="rounded-xl p-8" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0", boxShadow: "0 4px 16px rgba(196, 162, 122, 0.1)" }}>
            <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
              基本信息
            </h2>
            <div className="space-y-5">
              {/* 头像上传 */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold mb-3 overflow-hidden cursor-pointer group"
                  style={{ background: "#F5EDE0", color: "#C4A27A", border: "2px dashed #EDE0D0" }}
                  onClick={() => avatarFileInputRef.current?.click()}
                >
                  {form.avatar_url ? (
                    <img src={form.avatar_url} alt="头像" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg" style={{ color: "#C4A27A" }}>+</span>
                  )}
                  {avatarUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-sm">上传中...</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="text-sm transition-colors"
                  style={{ color: "#C4A27A", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                >
                  {form.avatar_url ? "更换头像" : "上传头像"}
                </button>
                <input
                  ref={avatarFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                    姓名 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="你的名字"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                    昵称 / 外号
                  </label>
                  <input
                    type="text"
                    placeholder="大家怎么叫你？"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                    value={form.nickname}
                    onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                    班级职务
                  </label>
                  <input
                    type="text"
                    placeholder="例如：班长、学习委员..."
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                    value={form.class_position}
                    onChange={(e) => setForm({ ...form, class_position: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                    最喜爱的学科
                  </label>
                  <input
                    type="text"
                    placeholder="例如：数学、语文..."
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                    value={form.favorite_subject}
                    onChange={(e) => setForm({ ...form, favorite_subject: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                  兴趣爱好
                </label>
                <input
                  type="text"
                  placeholder="例如：篮球、音乐、画画..."
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                  value={form.hobby}
                  onChange={(e) => setForm({ ...form, hobby: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 联系方式 */}
          <div className="rounded-xl p-8" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0", boxShadow: "0 4px 16px rgba(196, 162, 122, 0.1)" }}>
            <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
              联系方式
            </h2>
            <div className="space-y-5">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                    微信
                  </label>
                  <input
                    type="text"
                    placeholder="微信号"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                    value={form.wechat}
                    onChange={(e) => setForm({ ...form, wechat: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                    QQ
                  </label>
                  <input
                    type="text"
                    placeholder="QQ号"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                    value={form.qq}
                    onChange={(e) => setForm({ ...form, qq: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                    手机号
                  </label>
                  <input
                    type="text"
                    placeholder="手机号码"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 照片上传 */}
          <div className="rounded-xl p-8" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0", boxShadow: "0 4px 16px rgba(196, 162, 122, 0.1)" }}>
            <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
              照片墙 <span className="text-sm font-normal" style={{ color: "#C4A27A" }}>（至少上传3张照片）</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {form.photos.map((photo, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden" style={{ background: "#F5EDE0" }}>
                  <img
                    src={photo}
                    alt={`照片 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                    style={{ background: "#C4A27A", color: "#FFFDF5" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2"
                style={{ borderColor: "#EDE0D0", color: "#C4A27A" }}
              >
                {uploading ? (
                  <>
                    <span className="text-sm">上传中...</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">+</span>
                    <span className="text-sm" style={{ fontFamily: "'KaiTi', 'STKaiti', serif" }}>添加照片</span>
                  </>
                )}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <p className="text-xs" style={{ color: "#C4A27A" }}>支持 JPG、PNG 格式</p>
          </div>

          {/* 回忆与留言 */}
          <div className="rounded-xl p-8" style={{ background: "#FFFDF5", border: "1px solid #EDE0D0", boxShadow: "0 4px 16px rgba(196, 162, 122, 0.1)" }}>
            <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "'KaiTi', 'STKaiti', serif", color: "#4A3B2C" }}>
              回忆与留言
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                  最值得怀念的事
                </label>
                <textarea
                  rows={3}
                  placeholder="在班级里最难忘的一件事是什么？"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all resize-none"
                  style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                  value={form.most_memorable}
                  onChange={(e) => setForm({ ...form, most_memorable: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                  座右铭 / 签名
                </label>
                <input
                  type="text"
                  placeholder="写一句你的座右铭或签名"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                  未来的梦想
                </label>
                <input
                  type="text"
                  placeholder="你未来想做什么？"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                  value={form.future_dream}
                  onChange={(e) => setForm({ ...form, future_dream: e.target.value })}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium" style={{ color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}>
                    毕业留言
                  </label>
                  <button
                    type="button"
                    onClick={generateMessage}
                    disabled={generating || !form.name}
                    className="text-sm px-3 py-1.5 rounded-full transition-all disabled:opacity-50"
                    style={{ background: "#F5EDE0", color: "#8B9A7B", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                  >
                    {generating ? "AI 生成中..." : "AI 帮我写"}
                  </button>
                </div>
                <textarea
                  rows={5}
                  placeholder="写下你想对同学们说的话..."
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all resize-none"
                  style={{ border: "1px solid #EDE0D0", background: "#FDF8F0", color: "#4A3B2C", fontFamily: "'KaiTi', 'STKaiti', serif" }}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
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
            {loading ? "提交中..." : "提交并进入班级"}
          </button>
        </form>
      </div>
    </div>
  );
}
