"use client";

import React, { useState, useEffect, useCallback } from "react";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function HocVienPage() {
  // States quản lý danh sách & bộ lọc
  const [hocViens, setHocViens] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, totalPages: 1 });

  // States quản lý Modal Thêm / Sửa
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState({
    ma_hoc_vien: "",
    ho_ten: "",
    ngay_sinh: "",
    gioi_tinh: "Nam",
    so_dien_thoai: "",
    email: "",
    dia_chi: "",
    dau_ra_chung_chi: "",
    trang_thai: "Đang học",
  });

  // States quản lý Modal Xem chi tiết (Include Relation Data)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedHocVien, setSelectedHocVien] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("info");

  // State thông báo toast thông minh tự tạo từ Tailwind (tránh cài thư viện)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Debounce tìm kiếm
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Hàm gọi API lấy danh sách học viên
  const fetchHocViens = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/dao-tao/hoc-vien?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearch)}`;
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) {
        setHocViens(result.data);
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

  useEffect(() => {
    fetchHocViens();
  }, [fetchHocViens]);

  // Xử lý mở Modal Thêm mới
  const handleOpenAddModal = () => {
    setModalType("add");
    setFormData({
      ma_hoc_vien: "",
      ho_ten: "",
      ngay_sinh: "",
      gioi_tinh: "Nam",
      so_dien_thoai: "",
      email: "",
      dia_chi: "",
      dau_ra_chung_chi: "",
      trang_thai: "Đang học",
    });
    setIsModalOpen(true);
  };

  // Xử lý mở Modal Sửa thông tin
  const handleOpenEditModal = (hv: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Tránh kích hoạt sự kiện click dòng xem chi tiết
    setModalType("edit");
    setFormData({
      ma_hoc_vien: hv.ma_hoc_vien.toString(),
      ho_ten: hv.ho_ten || "",
      ngay_sinh: hv.ngay_sinh ? hv.ngay_sinh.substring(0, 10) : "",
      gioi_tinh: hv.gioi_tinh || "Nam",
      so_dien_thoai: hv.so_dien_thoai || "",
      email: hv.email || "",
      dia_chi: hv.dia_chi || "",
      dau_ra_chung_chi: hv.dau_ra_chung_chi || "",
      trang_thai: hv.trang_thai || "Đang học",
    });
    setIsModalOpen(true);
  };

  // Xử lý xem chi tiết học viên (Bao gồm dữ liệu liên quan)
  const handleOpenDetailModal = (hv: any) => {
    setSelectedHocVien(hv);
    setActiveTab("info");
    setIsDetailOpen(true);
  };

  // Xử lý Submit Form (Add/Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = modalType === "add" ? "POST" : "PUT";
      const url = modalType === "add" ? `/api/dao-tao/hoc-vien` : `/api/dao-tao/hoc-vien?id=${formData.ma_hoc_vien}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        showToast(modalType === "add" ? "Thêm mới học viên thành công!" : "Cập nhật hồ sơ thành công!");
        setIsModalOpen(false);
        fetchHocViens();
      } else {
        showToast(result.message || "Đã xảy ra lỗi khi lưu dữ liệu", "error");
      }
    } catch (err) {
      showToast("Lỗi gửi dữ liệu lên hệ thống", "error");
    }
  };

  // Xử lý Xóa Mềm học viên
  const handleSoftDelete = async (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ học viên "${name}" không?`)) {
      try {
        const res = await fetch(`/api/dao-tao/hoc-vien?id=${id}`, { method: "DELETE" });
        const result = await res.json();
        if (result.success) {
          showToast("Xóa mềm hồ sơ học viên thành công!");
          fetchHocViens();
        } else {
          showToast(result.message || "Lỗi khi xóa dữ liệu", "error");
        }
      } catch (err) {
        showToast("Lỗi kết nối khi xóa dữ liệu", "error");
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium transition-all ${
            toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản Lý Hồ Sơ Học Viên</h1>
          <p className="text-slate-500 text-sm">Quản lý danh sách, cam kết đào tạo, bài kiểm tra và học phí học viên.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition text-sm flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm học viên mới
        </button>
      </div>

      {/* Filter & Search Panel */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo Tên, Số điện thoại hoặc Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>
      </div>

      {/* Main Content View (Table / Loading / Empty State) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 text-sm">Đang truy xuất dữ liệu từ Database hệ thống...</p>
          </div>
        ) : hocViens.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium text-slate-700">Không tìm thấy dữ liệu học viên nào</p>
            <p className="text-xs text-slate-400 mt-1">Vui lòng thử điều chỉnh bộ lọc hoặc thêm mới học viên.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                  <th className="p-4 w-16">Mã HV</th>
                  <th className="p-4">Họ và Tên</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Đầu ra chứng chỉ</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {hocViens.map((hv) => (
                  <tr
                    key={hv.ma_hoc_vien}
                    onClick={() => handleOpenDetailModal(hv)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="p-4 font-mono text-xs text-slate-500">#{hv.ma_hoc_vien}</td>
                    <td className="p-4 font-medium text-slate-900">{hv.ho_ten}</td>
                    <td className="p-4 text-slate-600">{hv.so_dien_thoai || "—"}</td>
                    <td className="p-4 text-slate-600">{hv.email || "—"}</td>
                    <td className="p-4 text-slate-600">{hv.dau_ra_chung_chi || "—"}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          hv.trang_thai === "Đang học"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : hv.trang_thai === "Bảo lưu"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {hv.trang_thai || "Đang học"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={(e) => handleOpenEditModal(hv, e)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium text-xs border border-indigo-200 hover:bg-indigo-50 px-2.5 py-1 rounded transition"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={(e) => handleSoftDelete(hv.ma_hoc_vien, hv.ho_ten, e)}
                        className="text-rose-600 hover:text-rose-900 font-medium text-xs border border-rose-200 hover:bg-rose-50 px-2.5 py-1 rounded transition"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Panel */}
        {hocViens.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <div>
              Hiển thị trang <span className="font-semibold text-slate-700">{pagination.page}</span> / {pagination.totalPages} (Tổng {pagination.total} học viên)
            </div>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-md disabled:opacity-50 hover:bg-slate-50 transition"
              >
                Trước
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-md disabled:opacity-50 hover:bg-slate-50 transition"
              >
                Tiếp sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: THÊM / SỬA HỌC VIÊN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-xl border w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                {modalType === "add" ? "Thêm mới Hồ sơ Học viên" : "Cập nhật Thông tin Học viên"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Họ và Tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.ho_ten}
                    onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    value={formData.ngay_sinh}
                    onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Giới tính</label>
                  <select
                    value={formData.gioi_tinh}
                    onChange={(e) => setFormData({ ...formData, gioi_tinh: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.so_dien_thoai}
                    onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Địa chỉ Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Địa chỉ thường trú</label>
                  <input
                    type="text"
                    value={formData.dia_chi}
                    onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Đầu ra chứng chỉ mục tiêu</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: IELTS 6.5, HSK 4"
                    value={formData.dau_ra_chung_chi}
                    onChange={(e) => setFormData({ ...formData, dau_ra_chung_chi: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Trạng thái học tập</label>
                  <select
                    value={formData.trang_thai}
                    onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Đang học">Đang học</option>
                    <option value="Bảo lưu">Bảo lưu</option>
                    <option value="Tốt nghiệp">Tốt nghiệp</option>
                    <option value="Nghỉ học">Nghỉ học</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Lưu hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XEM CHI TIẾT & DỮ LIỆU QUAN HỆ (INCLUDE RELATION DATA) */}
      {isDetailOpen && selectedHocVien && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-xl border w-full max-w-4xl max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedHocVien.ho_ten}</h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Mã số học viên: #{selectedHocVien.ma_hoc_vien}</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Điều hướng Tab nội bộ để chứa hết các Relations data yêu cầu */}
            <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto text-sm">
              <button
                onClick={() => setActiveTab("info")}
                className={`py-3 px-4 font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === "info" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Thông tin chung
              </button>
              <button
                onClick={() => setActiveTab("lop")}
                className={`py-3 px-4 font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === "lop" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Lớp học ({selectedHocVien.tham_gia_lop?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("camket")}
                className={`py-3 px-4 font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === "camket" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Cam kết đào tạo ({selectedHocVien.cam_ket?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("taichinh")}
                className={`py-3 px-4 font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === "taichinh" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Học phí & Phiếu thu ({selectedHocVien.phieu_thu?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("kiemtra")}
                className={`py-3 px-4 font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === "kiemtra" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Kết quả kiểm tra ({selectedHocVien.ket_qua_kt?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("buoihoc")}
                className={`py-3 px-4 font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === "buoihoc" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Điểm danh buổi học ({selectedHocVien.diem_danh?.length || 0})
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-sm bg-slate-50/50">
              {/* Tab 1: Thông tin hồ sơ cơ bản */}
              {activeTab === "info" && (
                <div className="bg-white p-5 rounded-lg border grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  <div><span className="text-slate-400 block text-xs">Giới tính:</span> <p className="font-medium text-slate-800">{selectedHocVien.gioi_tinh || "—"}</p></div>
                  <div><span className="text-slate-400 block text-xs">Ngày sinh:</span> <p className="font-medium text-slate-800">{selectedHocVien.ngay_sinh ? new Date(selectedHocVien.ngay_sinh).toLocaleDateString("vi-VN") : "—"}</p></div>
                  <div><span className="text-slate-400 block text-xs">Số điện thoại:</span> <p className="font-medium text-slate-800">{selectedHocVien.so_dien_thoai || "—"}</p></div>
                  <div><span className="text-slate-400 block text-xs">Email:</span> <p className="font-medium text-slate-800">{selectedHocVien.email || "—"}</p></div>
                  <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Địa chỉ thường trú:</span> <p className="font-medium text-slate-800">{selectedHocVien.dia_chi || "—"}</p></div>
                  <div><span className="text-slate-400 block text-xs">Đầu ra chứng chỉ:</span> <p className="font-medium text-slate-800">{selectedHocVien.dau_ra_chung_chi || "—"}</p></div>
                  <div><span className="text-slate-400 block text-xs">Trạng thái hiện tại:</span> <p className="font-medium text-slate-800">{selectedHocVien.trang_thai || "Đang học"}</p></div>
                </div>
              )}

              {/* Tab 2: Lớp học tham gia (Relation: ThamGiaLop -> LopHoc) */}
              {activeTab === "lop" && (
                <div className="space-y-3">
                  {!selectedHocVien.tham_gia_lop || selectedHocVien.tham_gia_lop.length === 0 ? (
                    <p className="text-slate-500 italic text-center p-4">Học viên chưa đăng ký lớp học nào.</p>
                  ) : (
                    selectedHocVien.tham_gia_lop.map((tgl: any) => (
                      <div key={tgl.ma_tham_gia_lop} className="bg-white p-4 rounded-lg border flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">{tgl.lop_hoc?.ten_lop || "Lớp học ẩn"}</p>
                          <p className="text-xs text-slate-400 mt-1">Ngày đăng ký lớp: {new Date(tgl.ngay_dang_ky).toLocaleDateString("vi-VN")}</p>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 rounded text-slate-700">
                          {tgl.trang_thai || "Đang tham gia"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Cam kết đào tạo (Relation: CamKet) */}
              {activeTab === "camket" && (
                <div className="space-y-3">
                  {!selectedHocVien.cam_ket || selectedHocVien.cam_ket.length === 0 ? (
                    <p className="text-slate-500 italic text-center p-4">Không có bản cam kết đào tạo nào.</p>
                  ) : (
                    selectedHocVien.cam_ket.map((ck: any) => (
                      <div key={ck.ma_cam_ket} className="bg-white p-4 rounded-lg border space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-slate-800">{ck.noi_dung_cam_ket || "Cam kết chuẩn đào tạo đầu ra"}</p>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded ${ck.bi_vi_pham ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {ck.bi_vi_pham ? "Bị Vi Phạm" : "Nghiêm chỉnh"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                          <div>Vắng cho phép: <span className="font-bold text-slate-800">{ck.so_buoi_vang_cho_phep || 0}</span></div>
                          <div>Vắng thực tế: <span className={`font-bold ${ck.so_buoi_vang_thuc_te > (ck.so_buoi_vang_cho_phep || 0) ? "text-rose-600" : "text-slate-800"}`}>{ck.so_buoi_vang_thuc_te || 0}</span></div>
                          <div>Đi muộn thực tế: <span className="font-bold text-slate-800">{ck.so_buoi_di_muon_thuc_te || 0}</span></div>
                        </div>
                        {ck.ly_do_vi_pham && <p className="text-xs text-rose-600 font-medium">Lý do vi phạm: {ck.ly_do_vi_pham}</p>}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 4: Tài chính & Phiếu thu (Relation: PhieuThu) */}
              {activeTab === "taichinh" && (
                <div className="space-y-3">
                  {!selectedHocVien.phieu_thu || selectedHocVien.phieu_thu.length === 0 ? (
                    <p className="text-slate-500 italic text-center p-4">Chưa phát sinh phiếu thu học phí nào.</p>
                  ) : (
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                          <tr>
                            <th className="p-3">Mã phiếu</th>
                            <th className="p-3">Ngày thu</th>
                            <th className="p-3">Nội dung thu</th>
                            <th className="p-3 text-right">Số tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                          {selectedHocVien.phieu_thu.map((pt: any) => (
                            <tr key={pt.ma_phieu_thu} className="hover:bg-slate-50">
                              <td className="p-3 font-mono">#{pt.ma_phieu_thu}</td>
                              <td className="p-3">{new Date(pt.ngay_thu).toLocaleDateString("vi-VN")}</td>
                              <td className="p-3 text-slate-600">{pt.noi_dung || "Thu học phí khóa học"}</td>
                              <td className="p-3 text-right font-bold text-slate-900">
                                {Number(pt.so_tien).toLocaleString("vi-VN")} đ
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Kết quả kiểm tra (Relation: KetQuaKiemTra -> BaiKiemTra) */}
              {activeTab === "kiemtra" && (
                <div className="space-y-3">
                  {!selectedHocVien.ket_qua_kt || selectedHocVien.ket_qua_kt.length === 0 ? (
                    <p className="text-slate-500 italic text-center p-4">Học viên chưa tham gia bài kiểm tra nào.</p>
                  ) : (
                    selectedHocVien.ket_qua_kt.map((kq: any) => (
                      <div key={kq.ma_ket_qua_kiem_tra} className="bg-white p-4 rounded-lg border flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-slate-800">{kq.bai_kiem_tra?.ten_bai_kiem_tra || "Bài kiểm tra đánh giá năng lực"}</p>
                          {kq.nhan_xet && <p className="text-xs text-slate-500 mt-1">Giáo viên nhận xét: {kq.nhan_xet}</p>}
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-indigo-600">{kq.diem_so}</span> <span className="text-xs text-slate-400">điểm</span>
                          <p className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">{kq.trang_thai || "Đạt"}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 6: Điểm danh các buổi học (Relation: DiemDanh -> BuoiHoc) */}
              {activeTab === "buoihoc" && (
                <div className="space-y-3">
                  {!selectedHocVien.diem_danh || selectedHocVien.diem_danh.length === 0 ? (
                    <p className="text-slate-500 italic text-center p-4">Chưa có dữ liệu điểm danh buổi học nào.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedHocVien.diem_danh.map((dd: any) => (
                        <div key={dd.ma_diem_danh} className="bg-white p-3 rounded-lg border flex justify-between items-center">
                          <div>
                            <p className="font-medium text-slate-800">
                              Ngày học: {dd.buoi_hoc?.ngay_hoc ? new Date(dd.buoi_hoc.ngay_hoc).toLocaleDateString("vi-VN") : "—"}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[240px]">Nội dung: {dd.buoi_hoc?.noi_dung_hoc || "Theo đề cương"}</p>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${dd.trang_thai === "Có mặt" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                            {dd.trang_thai || "Vắng"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-xl">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}