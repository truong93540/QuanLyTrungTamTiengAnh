"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SubModalState {
  isOpen: boolean;
  mode: "add" | "edit";
  type: "lop-hoc" | "cam-ket" | "phieu-thu" | "";
  id?: number; 
}

// ==========================================
// COMPONENT SEARCHABLE SELECT (COMBOBOX)
// ==========================================
const SearchableSelect = ({ options, value, onChange, placeholder, disabled = false }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt: any) => opt.value.toString() === value?.toString());
  const filteredOptions = options.filter((opt: any) => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-lg text-black bg-white cursor-pointer flex justify-between items-center ${disabled ? "opacity-60 bg-slate-50 cursor-not-allowed" : "focus-within:ring-2 focus-within:ring-indigo-500"}`}
      >
        <span className={selectedOption ? "text-slate-900" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <input 
              type="text" 
              autoFocus
              placeholder="Nhập để tìm kiếm..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-black border rounded outline-none focus:border-indigo-500"
            />
          </div>
          <div className="overflow-y-auto flex-1 p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-xs text-center text-slate-500">Không tìm thấy kết quả</div>
            ) : (
              filteredOptions.map((opt: any) => (
                <div 
                  key={opt.value} 
                  onClick={() => { onChange(opt.value); setIsOpen(false); setSearch(""); }}
                  className="px-3 py-2 text-black hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer rounded"
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function HocVienPage() {
  // Fix lỗi Hydration (Next.js)
  const [isMounted, setIsMounted] = useState(false);

  const [hocViens, setHocViens] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, totalPages: 1 });

  // Dữ liệu danh mục
  const [metadata, setMetadata] = useState({ lopHocs: [], khoaHocs: [], nhanSus: [], khuyenMais: [] });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState({
    ma_hoc_vien: "", ho_ten: "", ngay_sinh: "", gioi_tinh: "Nam",
    so_dien_thoai: "", email: "", dia_chi: "", dau_ra_chung_chi: "", trang_thai: "Đang học",
  });

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedHocVien, setSelectedHocVien] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("info");
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  const [subModal, setSubModal] = useState<SubModalState>({ isOpen: false, mode: "add", type: "" });
  const [subFormData, setSubFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const khoaHocMap = Object.fromEntries(
    metadata.khoaHocs.map((k: any) => [
      k.ma_khoa_hoc,
      k.ten_khoa_hoc
    ])
  );
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    setIsMounted(true);
    const fetchMetadata = async () => {
      try {
        const res = await fetch("/api/dao-tao/hoc-vien?type=metadata");
        const result = await res.json();
        if (result.success) setMetadata(result.data);
      } catch (err) {}
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 500);
    return () => clearTimeout(handler);
  }, [search]);

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

  useEffect(() => { fetchHocViens(); }, [fetchHocViens]);

  const refreshHocVienDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/dao-tao/hoc-vien?id=${id}`);
      const result = await res.json();
      if (result.success) setSelectedHocVien(result.data);
    } catch (err) {
      showToast("Lỗi khi làm mới dữ liệu", "error");
    } finally {
      setDetailLoading(false);
    }
  };

  // --- HÀM MAIN MODAL ---
  const handleOpenAddModal = () => {
    setModalType("add");
    setFormData({ ma_hoc_vien: "", ho_ten: "", ngay_sinh: "", gioi_tinh: "Nam", so_dien_thoai: "", email: "", dia_chi: "", dau_ra_chung_chi: "", trang_thai: "Đang học" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (hv: any, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = modalType === "add" ? "POST" : "PUT";
      const url = modalType === "add" ? `/api/dao-tao/hoc-vien` : `/api/dao-tao/hoc-vien?id=${formData.ma_hoc_vien}`;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const result = await res.json();
      
      if (result.success) {
        showToast(modalType === "add" ? "Thêm mới thành công!" : "Cập nhật thành công!"); 
        setIsModalOpen(false); 
        fetchHocViens();
      } else { showToast(result.message, "error"); }
    } catch (err) { showToast("Lỗi gửi dữ liệu", "error"); }
  };

  const handleSoftDelete = async (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc muốn xóa hồ sơ học viên "${name}"?`)) {
      try {
        const res = await fetch(`/api/dao-tao/hoc-vien?id=${id}`, { method: "DELETE" });
        const result = await res.json();
        if (result.success) { showToast("Xóa thành công!"); fetchHocViens(); } 
        else { showToast(result.message, "error"); }
      } catch (err) { showToast("Lỗi xóa dữ liệu", "error"); }
    }
  };

  // --- HÀM SUB-MODAL ---
  const handleOpenSubModal = (type: "lop-hoc" | "cam-ket" | "phieu-thu", mode: "add" | "edit", data: any = null) => {
    let initialData = {};
    const parseDate = (d: string) => d ? new Date(d).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10);
    
    if (mode === "add") {
      if (type === "lop-hoc") initialData = { ma_lop_hoc: "", ngay_dang_ky: parseDate(""), trang_thai: "Đang học" };
      if (type === "cam-ket") initialData = { ma_khoa_hoc: "", noi_dung: "", ngay_ky: parseDate(""), trang_thai: "Hiệu lực" };
      if (type === "phieu-thu") initialData = { ma_khoa_hoc: "", ma_nhan_su: "", so_tien: "", ngay_thu: parseDate(""), noi_dung: "", ma_khuyen_mai: "" };
    } else if (data) {
      if (type === "lop-hoc") initialData = { ma_lop_hoc: data.ma_lop_hoc, ngay_dang_ky: parseDate(data.ngay_dang_ky), trang_thai: data.trang_thai };
      else if (type === "cam-ket") initialData = { ma_khoa_hoc: data.ma_khoa_hoc, noi_dung: data.noi_dung_cam_ket, ngay_ky: parseDate(data.ngay_ky), trang_thai: data.trang_thai };
      else if (type === "phieu-thu") initialData = { ma_khoa_hoc: data.ma_khoa_hoc, ma_nhan_su: data.ma_nhan_su, so_tien: data.so_tien, ngay_thu: parseDate(data.ngay_thu), noi_dung: data.noi_dung, ma_khuyen_mai: data.ma_khuyen_mai || "" };
    }
    
    let targetId = undefined;
    if (mode === "edit" && data) {
      if (type === "lop-hoc") targetId = data.ma_tham_gia_lop;
      if (type === "cam-ket") targetId = data.ma_cam_ket;
      if (type === "phieu-thu") targetId = data.ma_phieu_thu;
    }

    setSubFormData(initialData);
    setSubModal({ isOpen: true, mode, type, id: targetId });
  };

  const handleSubModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subModal.type === "lop-hoc" && !subFormData.ma_lop_hoc) return showToast("Vui lòng chọn Lớp học", "error");
    if (subModal.type === "cam-ket" && !subFormData.ma_khoa_hoc) return showToast("Vui lòng chọn Khóa học", "error");
    if (subModal.type === "phieu-thu" && (!subFormData.ma_khoa_hoc || !subFormData.ma_nhan_su)) return showToast("Vui lòng chọn đầy đủ Khóa học và Nhân sự", "error");

    setIsSubmitting(true);
    try {
      const payload = { ...subFormData, ma_hoc_vien: selectedHocVien.ma_hoc_vien };
      const method = subModal.mode === "add" ? "POST" : "PUT";
      const url = subModal.mode === "add" 
        ? `/api/dao-tao/hoc-vien?type=${subModal.type}` 
        : `/api/dao-tao/hoc-vien?type=${subModal.type}&id=${subModal.id}`;

      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await res.json();
      
      if (result.success) {
        showToast(subModal.mode === "add" ? "Thêm mới thành công!" : "Cập nhật thành công!");
        setSubModal({ isOpen: false, mode: "add", type: "" });
        await refreshHocVienDetail(selectedHocVien.ma_hoc_vien);
      } else {
        showToast(result.message || "Lỗi lưu dữ liệu", "error");
      }
    } catch (err) { showToast("Lỗi kết nối", "error"); } 
    finally { setIsSubmitting(false); }
  };

  const handleSubDelete = async (type: string, id: number) => {
    if (confirm("Bạn có chắc muốn xóa/hủy bản ghi này?")) {
      setDetailLoading(true);
      try {
        const res = await fetch(`/api/dao-tao/hoc-vien?type=${type}&id=${id}&studentId=${selectedHocVien.ma_hoc_vien}`, { method: "DELETE" });
        const result = await res.json();
        if (result.success) {
          showToast("Xóa dữ liệu thành công!");
          await refreshHocVienDetail(selectedHocVien.ma_hoc_vien);
        } else { showToast(result.message, "error"); setDetailLoading(false); }
      } catch (err) { showToast("Lỗi kết nối", "error"); setDetailLoading(false); }
    }
  };

  // Ngăn chặn lỗi Hydration
  if (!isMounted) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative">
      {/* TOAST THÔNG BÁO */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded shadow-lg text-white font-medium transition-all ${toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"}`}>
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản Lý Hồ Sơ Học Viên</h1>
          <p className="text-slate-500 text-black">Quản lý danh sách, cam kết đào tạo, bài kiểm tra và học phí.</p>
        </div>
        <button onClick={handleOpenAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition text-black flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Thêm học viên
        </button>
      </div>

      {/* SEARCH HỌC VIÊN */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo Tên, Số điện thoại hoặc Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-black bg-slate-50 text-black placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* TABLE HỌC VIÊN */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 text-black">Đang truy xuất dữ liệu...</p>
          </div>
        ) : hocViens.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="font-medium text-slate-700">Không tìm thấy dữ liệu học viên</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-black">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b">
                  <th className="p-4 w-16">Mã HV</th>
                  <th className="p-4">Họ và Tên</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {hocViens.map((hv) => (
                  <tr key={hv.ma_hoc_vien} onClick={() => { setSelectedHocVien(hv); setActiveTab("info"); setIsDetailOpen(true); }} className="hover:bg-slate-50/80 cursor-pointer transition">
                    <td className="p-4 font-mono text-xs text-slate-500">{hv.ma_hoc_vien}</td>
                    <td className="p-4 font-medium text-slate-900">{hv.ho_ten}</td>
                    <td className="p-4 text-slate-600">{hv.so_dien_thoai || "—"}</td>
                    <td className="p-4 text-slate-600">{hv.email || "—"}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${hv.trang_thai === "Đang học" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                        {hv.trang_thai || "Đang học"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={(e) => handleOpenEditModal(hv, e)} className="text-indigo-600 hover:bg-indigo-50 px-2 py-1 border rounded">Sửa</button>
                      <button onClick={(e) => handleSoftDelete(hv.ma_hoc_vien, hv.ho_ten, e)} className="text-rose-600 hover:bg-rose-50 px-2 py-1 border rounded">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {hocViens.length > 0 && (
          <div className="p-4 border-t bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <div>Hiển thị <span className="font-semibold text-slate-700">{pagination.page}</span> / {pagination.totalPages} (Tổng {pagination.total})</div>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 border bg-white rounded-md hover:bg-slate-50">Trước</button>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 border bg-white rounded-md hover:bg-slate-50">Sau</button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL MAIN THÊM / SỬA HỌC VIÊN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-lg font-bold">{modalType === "add" ? "Thêm mới Học viên" : "Cập nhật Thông tin"}</h2>
                <button onClick={() => setIsModalOpen(false)}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
             </div>
             <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-black">
                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2 md:col-span-1">
                     <label className="block mb-1 font-semibold text-xs text-slate-600">Họ và Tên *</label>
                     <input type="text" required value={formData.ho_ten} onChange={e=>setFormData({...formData, ho_ten: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                   <div className="col-span-2 md:col-span-1">
                     <label className="block mb-1 font-semibold text-xs text-slate-600">Ngày sinh</label>
                     <input type="date" value={formData.ngay_sinh} onChange={e=>setFormData({...formData, ngay_sinh: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                   <div className="col-span-2 md:col-span-1">
                     <label className="block mb-1 font-semibold text-xs text-slate-600">Giới tính</label>
                     <select value={formData.gioi_tinh} onChange={e=>setFormData({...formData, gioi_tinh: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option>
                     </select>
                   </div>
                   <div className="col-span-2 md:col-span-1">
                     <label className="block mb-1 font-semibold text-xs text-slate-600">Số điện thoại</label>
                     <input type="text" value={formData.so_dien_thoai} onChange={e=>setFormData({...formData, so_dien_thoai: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                   <div className="col-span-2">
                     <label className="block mb-1 font-semibold text-xs text-slate-600">Email</label>
                     <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                   <div className="col-span-2">
                     <label className="block mb-1 font-semibold text-xs text-slate-600">Địa chỉ thường trú</label>
                     <input type="text" value={formData.dia_chi} onChange={e=>setFormData({...formData, dia_chi: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                   <div className="col-span-2 md:col-span-1">
                     <label className="block mb-1 font-semibold text-xs text-slate-600">Đầu ra chứng chỉ</label>
                     <input type="text" placeholder="Ví dụ: IELTS 6.5" value={formData.dau_ra_chung_chi} onChange={e=>setFormData({...formData, dau_ra_chung_chi: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                   <div className="col-span-2 md:col-span-1">
                     <label className="block mb-1 font-semibold text-xs text-slate-600">Trạng thái học tập</label>
                     <select value={formData.trang_thai} onChange={e=>setFormData({...formData, trang_thai: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        <option value="Đang học">Đang học</option><option value="Bảo lưu">Bảo lưu</option><option value="Tốt nghiệp">Tốt nghiệp</option><option value="Nghỉ học">Nghỉ học</option>
                     </select>
                   </div>
                </div>
                <div className="pt-4 flex justify-end gap-2"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Lưu hồ sơ</button></div>
             </form>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT */}
      {isDetailOpen && selectedHocVien && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-xl shadow-xl border w-full max-w-4xl max-h-[85vh] flex flex-col relative overflow-hidden">
            {detailLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                 <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold">{selectedHocVien.ho_ten}</h2>
                <p className="text-xs text-slate-500">Mã số: {selectedHocVien.ma_hoc_vien}</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)}><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <div className="flex border-b px-6 overflow-x-auto text-black bg-white">
              <button onClick={() => setActiveTab("info")} className={`py-3 px-4 font-medium border-b-2 whitespace-nowrap ${activeTab === "info" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"}`}>Thông tin chung</button>
              <button onClick={() => setActiveTab("lop")} className={`py-3 px-4 font-medium border-b-2 whitespace-nowrap ${activeTab === "lop" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"}`}>Lớp học ({selectedHocVien.tham_gia_lop?.length || 0})</button>
              <button onClick={() => setActiveTab("camket")} className={`py-3 px-4 font-medium border-b-2 whitespace-nowrap ${activeTab === "camket" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"}`}>Cam kết ({selectedHocVien.cam_ket?.length || 0})</button>
              <button onClick={() => setActiveTab("taichinh")} className={`py-3 px-4 font-medium border-b-2 whitespace-nowrap ${activeTab === "taichinh" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"}`}>Phiếu thu ({selectedHocVien.phieu_thu?.length || 0})</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-black bg-slate-50/50">
              
              {/* TAB THÔNG TIN (ĐÃ KHÔI PHỤC ĐẦY ĐỦ DATA) */}
              {activeTab === "info" && (
                <div className="bg-white p-5 rounded-lg border grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <span className="text-slate-400 block text-xs">Mã học viên:</span> 
                    <p className="font-medium text-slate-800">{selectedHocVien.ma_hoc_vien}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Giới tính:</span> 
                    <p className="font-medium text-slate-800">{selectedHocVien.gioi_tinh || "—"}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Ngày sinh:</span> 
                    <p className="font-medium text-slate-800">
                      {selectedHocVien.ngay_sinh ? new Date(selectedHocVien.ngay_sinh).toLocaleDateString("vi-VN") : "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Số điện thoại:</span> 
                    <p className="font-medium text-slate-800">{selectedHocVien.so_dien_thoai || "—"}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Email:</span> 
                    <p className="font-medium text-slate-800">{selectedHocVien.email || "—"}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Đầu ra chứng chỉ:</span> 
                    <p className="font-medium text-slate-800">{selectedHocVien.dau_ra_chung_chi || "—"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-400 block text-xs">Địa chỉ thường trú:</span> 
                    <p className="font-medium text-slate-800">{selectedHocVien.dia_chi || "—"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-400 block text-xs">Trạng thái hiện tại:</span> 
                    <span className={`inline-block px-2 py-1 mt-1 rounded text-xs font-semibold ${selectedHocVien.trang_thai === 'Đang học' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {selectedHocVien.trang_thai || "Đang học"}
                    </span>
                  </div>
                </div>
              )}

              {/* TAB LỚP HỌC */}
              {activeTab === "lop" && (
                <div className="space-y-4">
                  <div className="flex justify-end"><button onClick={() => handleOpenSubModal("lop-hoc", "add")} className="bg-indigo-50 text-indigo-600 font-medium px-3 py-1.5 rounded-lg border flex items-center gap-1">Thêm Lớp học</button></div>
                  {!selectedHocVien.tham_gia_lop?.length ? <p className="text-slate-500 italic text-center p-4 bg-white border rounded">Chưa tham gia lớp nào.</p> : selectedHocVien.tham_gia_lop.map((tgl: any) => (
                    <div key={tgl.ma_tham_gia_lop} className="bg-white p-4 rounded-lg border flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{tgl.lop_hoc?.ten_lop} (Mã: {tgl.ma_lop_hoc})</p>
                        <p className="text-xs text-slate-400 mt-1">Ngày ĐK: {new Date(tgl.ngay_dang_ky).toLocaleDateString("vi-VN")}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 text-xs bg-slate-100 rounded">{tgl.trang_thai}</span>
                        <button onClick={() => handleOpenSubModal("lop-hoc", "edit", tgl)} className="text-indigo-600 text-xs">Sửa</button>
                        <button onClick={() => handleSubDelete("lop-hoc", tgl.ma_tham_gia_lop)} className="text-rose-600 text-xs">Xóa</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB CAM KẾT */}
              {activeTab === "camket" && (
                <div className="space-y-4">
                  <div className="flex justify-end"><button onClick={() => handleOpenSubModal("cam-ket", "add")} className="bg-indigo-50 text-indigo-600 font-medium px-3 py-1.5 rounded-lg border flex items-center gap-1">Tạo Cam kết</button></div>
                  {!selectedHocVien.cam_ket?.length ? <p className="text-slate-500 italic text-center p-4 bg-white border rounded">Không có cam kết.</p> : selectedHocVien.cam_ket.map((ck: any) => (
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800">
                          {khoaHocMap[ck.ma_khoa_hoc] || `Mã khóa: ${ck.ma_khoa_hoc}`}
                        </p>

                        <p className="text-xs text-slate-500 mt-1 break-words whitespace-normal">
                          {ck.noi_dung_cam_ket}
                        </p>
                      </div>

                      <div className="space-x-3 text-xs flex-shrink-0">
                        <button
                          onClick={() => handleOpenSubModal("cam-ket", "edit", ck)}
                          className="text-indigo-600"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => handleSubDelete("cam-ket", ck.ma_cam_ket)}
                          className="text-rose-600"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB TÀI CHÍNH (PHIẾU THU) */}
              {activeTab === "taichinh" && (
                <div className="space-y-4">
                  <div className="flex justify-end"><button onClick={() => handleOpenSubModal("phieu-thu", "add")} className="bg-indigo-50 text-indigo-600 font-medium px-3 py-1.5 rounded-lg border flex items-center gap-1">Tạo Phiếu thu</button></div>
                  {!selectedHocVien.phieu_thu?.length ? <p className="text-slate-500 italic text-center p-4 bg-white border rounded">Không có phiếu thu.</p> : (
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 border-b"><tr><th className="p-3">Mã PT</th><th className="p-3">Số tiền</th><th className="p-3 text-right">Thao tác</th></tr></thead>
                        <tbody className="divide-y text-slate-700">
                          {selectedHocVien.phieu_thu.map((pt: any) => (
                            <tr key={pt.ma_phieu_thu} className={pt.noi_dung?.includes("[ĐÃ HỦY/XÓA]") ? "opacity-50 bg-slate-50" : ""}>
                              <td className="p-3">{pt.ma_phieu_thu}</td>
                              <td className="p-3 font-bold">{Number(pt.so_tien).toLocaleString("vi-VN")} đ</td>
                              <td className="p-3 text-right space-x-2">
                                <button onClick={() => handleOpenSubModal("phieu-thu", "edit", pt)} className="text-indigo-600">Sửa</button>
                                <button onClick={() => handleSubDelete("phieu-thu", pt.ma_phieu_thu)} className="text-rose-600">Xóa</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-slate-50 flex justify-end"><button onClick={() => setIsDetailOpen(false)} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-black">Đóng</button></div>
          </div>
        </div>
      )}

      {/* MODAL PHỤ: THÊM DỮ LIỆU CÓ COMBOBOX TÌM KIẾM */}
      {subModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl border w-full max-w-md overflow-visible">
            <div className="p-5 border-b bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-800">
                {subModal.mode === "add" ? "Thêm " : "Cập nhật "}
                {subModal.type === "lop-hoc" ? "Tham gia Lớp" : subModal.type === "cam-ket" ? "Cam kết" : "Phiếu thu"}
              </h2>
              <button onClick={() => setSubModal({ isOpen: false, mode: "add", type: "" })}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            <form onSubmit={handleSubModalSubmit} className="p-5 space-y-4 text-black">
              
              {/* SUB FORM: LỚP HỌC */}
              {subModal.type === "lop-hoc" && (
                <>
                  <div className="relative">
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Tìm & Chọn Lớp học *</label>
                    <SearchableSelect 
                      options={metadata.lopHocs.map((l: any) => ({ value: l.ma_lop_hoc, label: `${l.ten_lop} (Mã: ${l.ma_lop_hoc})` }))}
                      value={subFormData.ma_lop_hoc}
                      onChange={(val: any) => setSubFormData({ ...subFormData, ma_lop_hoc: val })}
                      placeholder="-- Gõ để tìm kiếm lớp --"
                      disabled={subModal.mode === "edit"} // Không cho đổi lớp khi Sửa
                    />
                  </div>
                  <div><label className="block text-xs font-semibold mb-1 text-slate-600">Trạng thái</label>
                    <select value={subFormData.trang_thai} onChange={e => setSubFormData({...subFormData, trang_thai: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                      <option value="Đang học">Đang học</option><option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>
                </>
              )}

              {/* SUB FORM: CAM KẾT */}
              {subModal.type === "cam-ket" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Tìm & Chọn Khóa học áp dụng *</label>
                    <SearchableSelect 
                      options={metadata.khoaHocs.map((k: any) => ({ value: k.ma_khoa_hoc, label: `${k.ten_khoa_hoc} (Mã: ${k.ma_khoa_hoc})` }))}
                      value={subFormData.ma_khoa_hoc}
                      onChange={(val: any) => setSubFormData({ ...subFormData, ma_khoa_hoc: val })}
                      placeholder="-- Tìm khóa học --"
                    />
                  </div>
                  <div><label className="block text-xs font-semibold mb-1 text-slate-600">Nội dung</label>
                    <textarea rows={2} value={subFormData.noi_dung} onChange={e=>setSubFormData({...subFormData, noi_dung: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-indigo-500"></textarea>
                  </div>
                </>
              )}

              {/* SUB FORM: PHIẾU THU */}
              {subModal.type === "phieu-thu" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Khóa học thu tiền *</label>
                    <SearchableSelect 
                      options={metadata.khoaHocs.map((k: any) => ({ value: k.ma_khoa_hoc, label: k.ten_khoa_hoc }))}
                      value={subFormData.ma_khoa_hoc}
                      onChange={(val: any) => setSubFormData({ ...subFormData, ma_khoa_hoc: val })}
                      placeholder="-- Tìm khóa học --"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Người lập phiếu (Nhân sự) *</label>
                    <SearchableSelect 
                      options={metadata.nhanSus.map((n: any) => ({ value: n.ma_nhan_su, label: n.ho_ten }))}
                      value={subFormData.ma_nhan_su}
                      onChange={(val: any) => setSubFormData({ ...subFormData, ma_nhan_su: val })}
                      placeholder="-- Tìm nhân sự --"
                    />
                  </div>
                  <div><label className="block text-xs font-semibold mb-1 text-slate-600">Số tiền (VNĐ) *</label><input type="number" required value={subFormData.so_tien} onChange={e=>setSubFormData({...subFormData, so_tien: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                </>
              )}

              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setSubModal({ isOpen: false, mode: "add", type: "" })} className="px-4 py-2 border rounded-lg text-slate-600">Hủy</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-70">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}