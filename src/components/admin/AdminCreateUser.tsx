"use client";

import { useState } from "react";

const ROLES = [
  {
    value: "country_rep",
    label: "Đại diện quốc gia",
    description: "Chỉ xem toàn bộ thông tin giám khảo (điện thoại, email, chứng chỉ…). Không truy cập trang Admin, không chỉnh sửa nội dung.",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Toàn quyền quản trị: duyệt hồ sơ, quản lý hội viên, tin tức, đối tác và chỉnh sửa xếp hạng giám khảo.",
  },
] as const;

export default function AdminCreateUser() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "country_rep" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const selectedRole = ROLES.find((r) => r.value === form.role) ?? ROLES[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        confirmPassword: form.password,
        role: form.role,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("success");
      setMsg(`Đã tạo tài khoản ${selectedRole.label}: ${form.email}`);
      setForm({ fullName: "", email: "", password: "", role: "country_rep" });
    } else {
      setStatus("error");
      setMsg(data.error ?? "Lỗi tạo tài khoản");
    }
  }

  return (
    <div className="card-compact">
      <h2 className="font-display text-lg font-semibold text-gray-900">Tạo tài khoản đăng nhập</h2>
      <p className="mt-1 text-sm text-gray-500">
        Chỉ Admin cấp tài khoản. Đại diện quốc gia sau khi đăng nhập chỉ được xem thông tin giám khảo — không vào trang Admin, không chỉnh sửa gì trên website.
      </p>
      <div className="mt-2 h-px w-8 bg-brand-gold" />

      {msg && (
        <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Họ tên *</label>
          <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-field" placeholder="Nguyễn Văn A" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Email *</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="email@..." />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Mật khẩu *</label>
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Tối thiểu 8 ký tự, 1 hoa, 1 số" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Vai trò *</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="select-field">
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">{selectedRole.label}</p>
          <p className="mt-1 leading-relaxed">{selectedRole.description}</p>
        </div>
        <div className="sm:col-span-2">
          <button type="submit" disabled={status === "loading"} className="btn-primary btn-sm">
            {status === "loading" ? "Đang tạo..." : "Tạo tài khoản"}
          </button>
        </div>
      </form>
    </div>
  );
}
