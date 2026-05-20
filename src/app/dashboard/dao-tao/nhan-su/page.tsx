"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PhongBan {
  ma_phong_ban: number;
  ten_phong_ban: string;
}

interface ChucVu {
  ma_chuc_vu: number;
  ten_chuc_vu: string;
}

interface NhanSu {
  ma_nhan_su: number;
  ho_ten: string;
  ngay_sinh: string | null;
  gioi_tinh: string | null;
  so_dien_thoai: string | null;
  email: string | null;
  dia_chi: string | null;
  ma_chuc_vu: number;
  ma_phong_ban: number;
  chuc_vu: ChucVu;
  phong_ban: PhongBan;
}

export default function NhanSuPage() {
  const [nhanSus, setNhanSus] = useState<NhanSu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const [phongBans, setPhongBans] = useState<PhongBan[]>([]);
  const [chucVus, setChucVus] = useState<ChucVu[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState({
    ma_nhan_su: "",
    ho_ten: "",
    ngay_sinh: "",
    gioi_tinh: "Nam",
    so_dien_thoai: "",
    email: "",
    dia_chi: "",
    ma_chuc_vu: "",
    ma_phong_ban: "",
  });

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchNhanSus = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/dao-tao/nhan-su?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearch)}`;
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) {
        setNhanSus(result.data);
        setPagination(result.pagination);
      } else {
        showToast(result.message || "Lỗi tải danh sách", "error");
      }
    } catch (err) {
      showToast("Không thể kết nối đến máy chủ", "error");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  const fetchMetadata = async () => {
    try {
      const res = await fetch("/api/dao-tao/nhan-su?meta=true");
      const result = await res.json();
      if (result.success) {
        setPhongBans(result.phongBans);
        setChucVus(result.chucVus);
      }
    } catch (err) {
      console.error("Lỗi khi tải metadata");
    }
  };

  useEffect(() => {
    fetchNhanSus();
  }, [fetchNhanSus]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const handleOpenAddModal = () => {
    setModalType("add");
    setFormData({
      ma_nhan_su: "",
      ho_ten: "",
      ngay_sinh: "",
      gioi_tinh: "Nam",
      so_dien_thoai: "",
      email: "",
      dia_chi: "",
      ma_chuc_vu: chucVus[0]?.ma_chuc_vu.toString() || "",
      ma_phong_ban: phongBans[0]?.ma_phong_ban.toString() || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ns: NhanSu, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalType("edit");
    setFormData({
      ma_nhan_su: ns.ma_nhan_su.toString(),
      ho_ten: ns.ho_ten || "",
      ngay_sinh: ns.ngay_sinh ? ns.ngay_sinh.substring(0, 10) : "",
      gioi_tinh: ns.gioi_tinh || "Nam",
      so_dien_thoai: ns.so_dien_thoai || "",
      email: ns.email || "",
      dia_chi: ns.dia_chi || "",
      ma_chuc_vu: ns.ma_chuc_vu.toString(),
      ma_phong_ban: ns.ma_phong_ban.toString(),
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = modalType === "add" ? "POST" : "PUT";
      const url = modalType === "add" ? `/api/dao-tao/nhan-su` : `/api/dao-tao/nhan-su/${formData.ma_nhan_su}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        showToast(modalType === "add" ? "Thêm mới nhân sự thành công!" : "Cập nhật thông tin thành công!");
        setIsModalOpen(false);
        fetchNhanSus();
      } else {
        showToast(result.message || "Có lỗi xảy ra", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối hệ thống", "error");
    }
  };

  const handleDelete = async (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ nhân sự "${name}" khỏi cơ sở dữ liệu không?`)) {
      try {
        const res = await fetch(`/api/dao-tao/nhan-su/${id}`, { method: "DELETE" });
        const result = await res.json();
        if (result.success) {
          showToast("Xóa hồ sơ nhân sự thành công!");
          fetchNhanSus();
        } else {
          showToast(result.message || "Lỗi khi xóa dữ liệu", "error");
        }
      } catch (err) {
        showToast("Lỗi hệ thống khi xóa nhân sự", "error");
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium ${toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản Lý Hồ Sơ Nhân Sự</h1>
          <p className="text-slate-500 text-sm">Quản lý danh sách thông tin hồ sơ nhân sự, phòng ban nội bộ.</p>
        </div>
        <button onClick={handleOpenAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-sm">
          Thêm nhân sự mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <input
          type="text"
          placeholder="Tìm kiếm theo Tên, Số điện thoại hoặc Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 text-sm">Đang tải dữ liệu nhân sự hệ thống...</p>
          </div>
        ) : nhanSus.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="font-medium text-slate-700">Không tìm thấy dữ liệu nhân sự nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                  <th className="p-4">Mã</th>
                  <th className="p-4">Họ và Tên</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phòng Ban</th>
                  <th className="p-4">Chức Vụ</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {nhanSus.map((ns) => (
                  <tr key={ns.ma_nhan_su} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono text-xs text-slate-500">#{ns.ma_nhan_su}</td>
                    <td className="p-4 font-medium text-slate-900">
                      <Link href={`/dashboard/dao-tao/nhan-su/${ns.ma_nhan_su}`} className="text-indigo-600 hover:underline">
                        {ns.ho_ten}
                      </Link>
                    </td>
                    <td className="p-4">{ns.so_dien_thoai || "—"}</td>
                    <td className="p-4">{ns.email || "—"}</td>
                    <td className="p-4">{ns.phong_ban?.ten_phong_ban || "—"}</td>
                    <td className="p-4">{ns.chuc_vu?.ten_chuc_vu || "—"}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={(e) => handleOpenEditModal(ns, e)} className="text-indigo-600 hover:bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200 text-xs">
                        Sửa
                      </button>
                      <button onClick={(e) => handleDelete(ns.ma_nhan_su, ns.ho_ten, e)} className="text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded border border-rose-200 text-xs">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {nhanSus.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <div>
              Hiển thị trang <span className="font-semibold text-slate-700">{pagination.page}</span> / {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 border border-slate-200 bg-white rounded-md disabled:opacity-50">
                Trước
              </button>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 border border-slate-200 bg-white rounded-md disabled:opacity-50">
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">{modalType === "add" ? "Thêm mới Nhân sự" : "Sửa thông tin Nhân sự"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Họ và Tên *</label>
                <input type="text" required value={formData.ho_ten} onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày sinh</label>
                  <input type="date" value={formData.ngay_sinh} onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Giới tính</label>
                  <select value={formData.gioi_tinh} onChange={(e) => setFormData({ ...formData, gioi_tinh: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại</label>
                  <input type="text" value={formData.so_dien_thoai} onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Địa chỉ</label>
                <input type="text" value={formData.dia_chi} onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phòng Ban *</label>
                  <select required value={formData.ma_phong_ban} onChange={(e) => setFormData({ ...formData, ma_phong_ban: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    {phongBans.map((pb) => <option key={pb.ma_phong_ban} value={pb.ma_phong_ban}>{pb.ten_phong_ban}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Chức Vụ *</label>
                  <select required value={formData.ma_chuc_vu} onChange={(e) => setFormData({ ...formData, ma_chuc_vu: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    {chucVus.map((cv) => <option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>{cv.ten_chuc_vu}</option>)}
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}