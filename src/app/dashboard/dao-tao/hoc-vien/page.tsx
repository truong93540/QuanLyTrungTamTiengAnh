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
  const [isMounted, setIsMounted] = useState(false);

  const [hocViens, setHocViens] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, totalPages: 1 });

  // Dữ liệu danh mục nền
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
    metadata.khoaHocs.map((k: any) => [k.ma_khoa_hoc, k.ten_khoa_hoc])
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
      } catch (err) {
        console.error("Lỗi lấy metadata:", err);
      }
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
      showToast("Không thể kết nối đến máy chủ API", "error");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { if (isMounted) fetchHocViens(); }, [fetchHocViens, isMounted]);

  const refreshHocVienDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/dao-tao/hoc-vien?id=${id}`);
      const result = await res.json();
      if (result.success) setSelectedHocVien(result.data);
    } catch (err) {
      showToast("Lỗi khi làm mới dữ liệu hồ sơ", "error");
    } finally {
      setDetailLoading(false);
    }
  };

  // --- HÀM XỬ LÝ MAIN MODAL HỌC VIÊN ---
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
        if (selectedHocVien && modalType === "edit") {
          refreshHocVienDetail(selectedHocVien.ma_hoc_vien);
        }
      } else { showToast(result.message, "error"); }
    } catch (err) { showToast("Lỗi gửi dữ liệu", "error"); }
  };

  const handleSoftDelete = async (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc muốn xóa hồ sơ học viên "${name}"? (Xóa mềm)`)) {
      try {
        const res = await fetch(`/api/dao-tao/hoc-vien?id=${id}`, { method: "DELETE" });
        const result = await res.json();
        if (result.success) { 
          showToast("Xóa thành công!"); 
          setIsDetailOpen(false);
          fetchHocViens(); 
        } else { showToast(result.message, "error"); }
      } catch (err) { showToast("Lỗi xóa dữ liệu", "error"); }
    }
  };

  // --- HÀM XỬ LÝ SUB-MODAL (CON) ---
  const handleOpenSubModal = (type: "lop-hoc" | "cam-ket" | "phieu-thu", mode: "add" | "edit", data: any = null) => {
    let initialData = {};
    const parseDate = (d: string) => d ? new Date(d).toISOString().substring(0, 10) : "";
    const todayStr = new Date().toISOString().substring(0, 10);
    
    if (mode === "add") {
      if (type === "lop-hoc") initialData = { ma_lop_hoc: "", ngay_dang_ky: todayStr, trang_thai: "Đang học" };
      if (type === "cam-ket") {
        initialData = { 
          ma_khoa_hoc: "", 
          noi_dung_cam_ket: "", 
          ngay_ky: todayStr, 
          ngay_het_han: "",
          trang_thai: "Hiệu lực",
          so_buoi_vang_cho_phep: 3,
          tham_gia_thi_day_du: true,
          so_buoi_di_muon: 3,
          so_lan_thieu_bai_tap: 2,
          bi_vi_pham: false,
          da_bo_thi: false,
          ly_do_vi_pham: "",
          so_buoi_di_muon_thuc_te: 0,
          so_buoi_vang_thuc_te: 0,
          so_lan_thieu_bai_tap_thuc_te: 0
        };
      }
      if (type === "phieu-thu") initialData = { ma_khoa_hoc: "", ma_nhan_su: "", so_tien: "", ngay_thu: todayStr, noi_dung: "", ma_khuyen_mai: "" };
    } else if (data) {
      if (type === "lop-hoc") initialData = { ma_lop_hoc: data.ma_lop_hoc, ngay_dang_ky: parseDate(data.ngay_dang_ky), trang_thai: data.trang_thai };
      else if (type === "cam-ket") {
        // Ánh xạ đầy đủ tất cả các trường từ schema dữ liệu cũ khi sửa cam kết
        initialData = { 
          ma_khoa_hoc: data.ma_khoa_hoc, 
          noi_dung_cam_ket: data.noi_dung_cam_ket || "", 
          ngay_ky: parseDate(data.ngay_ky), 
          ngay_het_han: parseDate(data.ngay_het_han),
          trang_thai: data.trang_thai || "Hiệu lực",
          so_buoi_vang_cho_phep: data.so_buoi_vang_cho_phep ?? 0,
          tham_gia_thi_day_du: data.tham_gia_thi_day_du ?? true,
          so_buoi_di_muon: data.so_buoi_di_muon ?? 0,
          so_lan_thieu_bai_tap: data.so_lan_thieu_bai_tap ?? 0,
          bi_vi_pham: data.bi_vi_pham ?? false,
          da_bo_thi: data.da_bo_thi ?? false,
          ly_do_vi_pham: data.ly_do_vi_pham || "",
          so_buoi_di_muon_thuc_te: data.so_buoi_di_muon_thuc_te ?? 0,
          so_buoi_vang_thuc_te: data.so_buoi_vang_thuc_te ?? 0,
          so_lan_thieu_bai_tap_thuc_te: data.so_lan_thieu_bai_tap_thuc_te ?? 0
        };
      }
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
    if (confirm("Bạn có chắc muốn xóa vĩnh viễn bản ghi liên kết này?")) {
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

  if (!isMounted) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative text-black">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded shadow-lg text-white font-medium transition-all ${toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"}`}>
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản Lý Hồ Sơ Học Viên</h1>
          <p className="text-slate-500 text-sm">Quản lý danh sách học viên, cam kết đào tạo, tình trạng lớp và phiếu thu học phí.</p>
        </div>
        <button onClick={handleOpenAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Thêm học viên
        </button>
      </div>

      {/* FILTER SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo Tên, Số điện thoại hoặc Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-slate-50 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>
      </div>

      {/* MAIN DATA TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500">Đang truy xuất dữ liệu từ máy chủ...</p>
          </div>
        ) : hocViens.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="font-medium text-slate-600">Không tìm thấy dữ liệu học viên hợp lệ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-slate-700">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b text-xs uppercase tracking-wider">
                  <th className="p-4 w-16">Mã HV</th>
                  <th className="p-4">Họ và Tên</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {hocViens.map((hv) => (
                  <tr key={hv.ma_hoc_vien} onClick={() => { setSelectedHocVien(hv); setActiveTab("info"); setIsDetailOpen(true); }} className="hover:bg-slate-50/80 cursor-pointer transition">
                    <td className="p-4 font-mono text-xs text-slate-400">{hv.ma_hoc_vien}</td>
                    <td className="p-4 font-semibold text-slate-900">{hv.ho_ten}</td>
                    <td className="p-4 font-mono text-slate-600">{hv.so_dien_thoai || "—"}</td>
                    <td className="p-4 text-slate-600">{hv.email || "—"}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${hv.trang_thai === "Đang học" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                        {hv.trang_thai || "Đang học"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => handleOpenEditModal(hv, e)} className="text-indigo-600 hover:bg-indigo-50 px-2 py-1 border rounded text-xs transition">Sửa</button>
                      <button onClick={(e) => handleSoftDelete(hv.ma_hoc_vien, hv.ho_ten, e)} className="text-rose-600 hover:bg-rose-50 px-2 py-1 border rounded text-xs transition">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {hocViens.length > 0 && (
          <div className="p-4 border-t bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <div>Hiển thị trang <span className="font-semibold text-slate-700">{pagination.page}</span> / {pagination.totalPages} (Tổng số {pagination.total} bản ghi)</div>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 border bg-white rounded-md hover:bg-slate-50 disabled:opacity-50 transition">Trước</button>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 border bg-white rounded-md hover:bg-slate-50 disabled:opacity-50 transition">Sau</button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL THÊM / SỬA HỌC VIÊN CHÍNH */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">{modalType === "add" ? "Thêm mới Hồ sơ Học viên" : "Cập nhật Thông tin Học viên"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
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
                <div className="pt-4 border-t flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50">Hủy</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Lưu hồ sơ</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT HỒ SƠ & TABS SUB-DATA */}
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
                <h2 className="text-xl font-bold text-slate-800">{selectedHocVien.ho_ten}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Mã học viên: {selectedHocVien.ma_hoc_vien}</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex border-b px-6 overflow-x-auto bg-white sticky top-0">
              <button onClick={() => setActiveTab("info")} className={`py-3 px-4 font-medium text-sm border-b-2 whitespace-nowrap transition ${activeTab === "info" ? "border-indigo-600 text-indigo-600 font-semibold" : "border-transparent text-slate-500 hover:text-slate-800"}`}>Thông tin chung</button>
              <button onClick={() => setActiveTab("lop")} className={`py-3 px-4 font-medium text-sm border-b-2 whitespace-nowrap transition ${activeTab === "lop" ? "border-indigo-600 text-indigo-600 font-semibold" : "border-transparent text-slate-500 hover:text-slate-800"}`}>Lớp học ({selectedHocVien.tham_gia_lop?.length || 0})</button>
              <button onClick={() => setActiveTab("camket")} className={`py-3 px-4 font-medium text-sm border-b-2 whitespace-nowrap transition ${activeTab === "camket" ? "border-indigo-600 text-indigo-600 font-semibold" : "border-transparent text-slate-500 hover:text-slate-800"}`}>Cam kết ({selectedHocVien.cam_ket?.length || 0})</button>
              <button onClick={() => setActiveTab("taichinh")} className={`py-3 px-4 font-medium text-sm border-b-2 whitespace-nowrap transition ${activeTab === "taichinh" ? "border-indigo-600 text-indigo-600 font-semibold" : "border-transparent text-slate-500 hover:text-slate-800"}`}>Phiếu thu ({selectedHocVien.phieu_thu?.length || 0})</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              
              {/* TAB THÔNG TIN CHUNG */}
              {activeTab === "info" && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs font-medium">Mã hệ thống:</span> 
                    <p className="font-semibold text-slate-800">{selectedHocVien.ma_hoc_vien}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs font-medium">Giới tính:</span> 
                    <p className="font-medium text-slate-800">{selectedHocVien.gioi_tinh || "—"}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs font-medium">Ngày sinh:</span> 
                    <p className="font-medium text-slate-800">
                      {selectedHocVien.ngay_sinh ? new Date(selectedHocVien.ngay_sinh).toLocaleDateString("vi-VN") : "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs font-medium">Số điện thoại:</span> 
                    <p className="font-mono font-medium text-slate-800">{selectedHocVien.so_dien_thoai || "—"}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs font-medium">Địa chỉ Email:</span> 
                    <p className="font-medium text-slate-800">{selectedHocVien.email || "—"}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs font-medium">Mục tiêu đầu ra chứng chỉ:</span> 
                    <p className="font-semibold text-indigo-600">{selectedHocVien.dau_ra_chung_chi || "—"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-400 block text-xs font-medium">Địa chỉ thường trú:</span> 
                    <p className="font-medium text-slate-800">{selectedHocVien.dia_chi || "—"}</p>
                  </div>
                  <div className="md:col-span-2 border-t pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-xs font-medium">Trạng thái hiện tại:</span> 
                      <span className={`inline-block px-2.5 py-0.5 mt-1 rounded text-xs font-semibold ${selectedHocVien.trang_thai === 'Đang học' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {selectedHocVien.trang_thai || "Đang học"}
                      </span>
                    </div>
                    <button onClick={(e) => { handleOpenEditModal(selectedHocVien, e); }} className="px-3 py-1.5 border bg-white rounded-lg hover:bg-slate-50 text-xs font-medium">Sửa nhanh thông tin cá nhân</button>
                  </div>
                </div>
              )}

              {/* TAB LỚP HỌC */}
              {activeTab === "lop" && (
                <div className="space-y-4">
                  <div className="flex justify-end"><button onClick={() => handleOpenSubModal("lop-hoc", "add")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">+ Ghi danh vào lớp học</button></div>
                  {!selectedHocVien.tham_gia_lop?.length ? <p className="text-slate-500 italic text-center p-6 bg-white border rounded-xl">Học viên chưa tham gia lớp học nào.</p> : selectedHocVien.tham_gia_lop.map((tgl: any) => (
                    <div key={tgl.ma_tham_gia_lop} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{tgl.lop_hoc?.ten_lop || "Không tìm thấy tên lớp"}</p>
                        <p className="text-xs text-slate-400 font-mono mt-1">Mã lớp: {tgl.ma_lop_hoc} • Ngày đăng ký: {new Date(tgl.ngay_dang_ky).toLocaleDateString("vi-VN")}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 text-xs bg-slate-100 font-medium rounded-full text-slate-700">{tgl.trang_thai}</span>
                        <button onClick={() => handleOpenSubModal("lop-hoc", "edit", tgl)} className="text-indigo-600 text-xs font-semibold hover:underline">Sửa</button>
                        <button onClick={() => handleSubDelete("lop-hoc", tgl.ma_tham_gia_lop)} className="text-rose-600 text-xs font-semibold hover:underline">Gỡ</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB CAM KẾT (Cập nhật hiển thị nhiều trường hơn ngoài thực tế) */}
              {activeTab === "camket" && (
                <div className="space-y-4">
                  <div className="flex justify-end"><button onClick={() => handleOpenSubModal("cam-ket", "add")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">+ Thiết lập cam kết đầu ra</button></div>
                  {!selectedHocVien.cam_ket?.length ? <p className="text-slate-500 italic text-center p-6 bg-white border rounded-xl">Không tồn tại biên bản cam kết kết quả đào tạo cho học viên này.</p> : selectedHocVien.cam_ket.map((ck: any) => (
                    <div key={ck.ma_cam_ket} className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-start gap-4 shadow-sm text-sm">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-center flex-wrap gap-2">
                          <p className="font-bold text-slate-800 text-sm">{khoaHocMap[ck.ma_khoa_hoc] || `Khóa học ${ck.ma_khoa_hoc}`}</p>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${ck.trang_thai === "Hiệu lực" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{ck.trang_thai}</span>
                          {ck.bi_vi_pham && <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-100 text-rose-700">⚠️ Bị vi phạm</span>}
                          {ck.da_bo_thi && <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600">❌ Đã bỏ thi</span>}
                        </div>
                        <p className="text-xs text-slate-400 font-mono">
                          Ngày ký: {new Date(ck.ngay_ky).toLocaleDateString("vi-VN")} 
                          {ck.ngay_het_han && ` • Hết hạn: ${new Date(ck.ngay_het_han).toLocaleDateString("vi-VN")}`}
                        </p>
                        
                        {/* Hiển thị tóm lược các chỉ số cam kết chỉ tiêu */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border bg-slate-50 p-2 rounded-lg">
                          <div>
                            <span className="text-slate-400 block">Vắng cho phép:</span>
                            <span className="font-semibold">{ck.so_buoi_vang_cho_phep ?? "—"} buổi ({ck.so_buoi_vang_thuc_te ?? 0} thực tế)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Đi muộn tối đa:</span>
                            <span className="font-semibold">{ck.so_buoi_di_muon ?? "—"} buổi ({ck.so_buoi_di_muon_thuc_te ?? 0} thực tế)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Thiếu bài tập:</span>
                            <span className="font-semibold">{ck.so_lan_thieu_bai_tap ?? "—"} lần ({ck.so_lan_thieu_bai_tap_thuc_te ?? 0} thực tế)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Thi đầy đủ:</span>
                            <span className="font-semibold">{ck.tham_gia_thi_day_du ? "Bắt buộc" : "Không"}</span>
                          </div>
                        </div>

                        {ck.ly_do_vi_pham && (
                          <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-100">
                            <strong>Lý do vi phạm:</strong> {ck.ly_do_vi_pham}
                          </p>
                        )}

                        <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-dashed border-slate-200">
                          <span className="font-semibold block text-slate-500 text-[10px] uppercase mb-0.5">Nội dung văn bản chi tiết:</span>
                          {ck.noi_dung_cam_ket || "Chưa nhập nội dung chi tiết thỏa thuận."}
                        </div>
                      </div>
                      <div className="space-x-3 text-xs flex-shrink-0 font-medium">
                        <button onClick={() => handleOpenSubModal("cam-ket", "edit", ck)} className="text-indigo-600 hover:underline">Sửa</button>
                        <button onClick={() => handleSubDelete("cam-ket", ck.ma_cam_ket)} className="text-rose-600 hover:underline">Xóa</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB TÀI CHÍNH (PHIẾU THU) */}
              {activeTab === "taichinh" && (
                <div className="space-y-4">
                  <div className="flex justify-end"><button onClick={() => handleOpenSubModal("phieu-thu", "add")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">+ Lập phiếu thu học phí</button></div>
                  {!selectedHocVien.phieu_thu?.length ? <p className="text-slate-500 italic text-center p-6 bg-white border rounded-xl">Không tìm thấy chứng từ lịch sử giao dịch nộp học phí.</p> : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 text-slate-600 border-b font-semibold uppercase tracking-wider">
                          <tr>
                            <th className="p-3">Mã phiếu</th>
                            <th className="p-3">Khóa học áp dụng</th>
                            <th className="p-3">Ngày thu</th>
                            <th className="p-3">Nội dung thu</th>
                            <th className="p-3">Số tiền nộp</th>
                            <th className="p-3 text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-600">
                          {selectedHocVien.phieu_thu.map((pt: any) => (
                            <tr key={pt.ma_phieu_thu} className="hover:bg-slate-50/50 transition">
                              <td className="p-3 font-mono">{pt.ma_phieu_thu}</td>
                              <td className="p-3 font-medium text-slate-800">{khoaHocMap[pt.ma_khoa_hoc] || `Mã KH: ${pt.ma_khoa_hoc}`}</td>
                              <td className="p-3">{new Date(pt.ngay_thu).toLocaleDateString("vi-VN")}</td>
                              <td className="p-3 max-w-[200px] truncate" title={pt.noi_dung}>{pt.noi_dung || "—"}</td>
                              <td className="p-3 font-mono font-bold text-emerald-600 text-sm">+{Number(pt.so_tien).toLocaleString("vi-VN")} đ</td>
                              <td className="p-3 text-right space-x-2 font-medium" onClick={(e)=>e.stopPropagation()}>
                                <button onClick={() => handleOpenSubModal("phieu-thu", "edit", pt)} className="text-indigo-600 hover:underline">Sửa</button>
                                <button onClick={() => handleSubDelete("phieu-thu", pt.ma_phieu_thu)} className="text-rose-600 hover:underline">Xóa</button>
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
            <div className="p-4 border-t bg-slate-50 flex justify-end">
              <button onClick={() => setIsDetailOpen(false)} className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-4 py-2 rounded-lg text-sm transition">Đóng hồ sơ</button>
            </div>
          </div>
        </div>
      )}

      {/* SUB MODAL FORM CHO QUAN HỆ CON */}
      {subModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-100 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b bg-slate-50 flex justify-between items-center flex-shrink-0">
              <h2 className="text-base font-bold text-slate-800">
                {subModal.mode === "add" ? "Thêm mới " : "Cập nhật "}
                {subModal.type === "lop-hoc" ? "Liên kết Lớp" : subModal.type === "cam-ket" ? "Biên bản Cam kết" : "Chứng từ Phiếu thu"}
              </h2>
              <button onClick={() => setSubModal({ isOpen: false, mode: "add", type: "" })} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubModalSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
              
              {/* LAYOUT FORM: LỚP HỌC */}
              {subModal.type === "lop-hoc" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Tìm & Chọn Lớp học học viên tham gia *</label>
                    <SearchableSelect 
                      options={metadata.lopHocs.map((l: any) => ({ value: l.ma_lop_hoc, label: `${l.ten_lop} (Mã: ${l.ma_lop_hoc})` }))}
                      value={subFormData.ma_lop_hoc}
                      onChange={(val: any) => setSubFormData({ ...subFormData, ma_lop_hoc: val })}
                      placeholder="-- Gõ từ khóa để tìm lớp --"
                      disabled={subModal.mode === "edit"} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Ngày ghi danh đăng ký học *</label>
                    <input type="date" required value={subFormData.ngay_dang_ky} onChange={e => setSubFormData({...subFormData, ngay_dang_ky: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Trạng thái học tập trong lớp</label>
                    <select value={subFormData.trang_thai} onChange={e => setSubFormData({...subFormData, trang_thai: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="Đang học">Đang học</option>
                      <option value="Bảo lưu">Bảo lưu</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Đã thôi học">Đã thôi học</option>
                    </select>
                  </div>
                </div>
              )}

              {/* LAYOUT FORM: CAM KẾT (ĐÃ BỔ SUNG ĐẦY ĐỦ TẤT CẢ CÁC TRƯỜNG DỮ LIỆU SCHEMA) */}
              {subModal.type === "cam-ket" && (
                <div className="space-y-4">
                  {/* Hàng 1: Khóa học */}
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Khóa học áp dụng văn bản cam kết *</label>
                    <SearchableSelect 
                      options={metadata.khoaHocs.map((k: any) => ({ value: k.ma_khoa_hoc, label: `${k.ten_khoa_hoc} (Mã: ${k.ma_khoa_hoc})` }))}
                      value={subFormData.ma_khoa_hoc}
                      onChange={(val: any) => setSubFormData({ ...subFormData, ma_khoa_hoc: val })}
                      placeholder="-- Tìm kiếm khóa học --"
                    />
                  </div>

                  {/* Hàng 2: Ngày ký & Ngày hết hạn */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600">Ngày ký biên bản *</label>
                      <input type="date" required value={subFormData.ngay_ky} onChange={e => setSubFormData({...subFormData, ngay_ky: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600">Ngày hết hạn cam kết</label>
                      <input type="date" value={subFormData.ngay_het_han} onChange={e => setSubFormData({...subFormData, ngay_het_han: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>

                  {/* Hàng 3: Trạng thái & Thi đầy đủ */}
                  <div className="grid grid-cols-2 gap-3 items-center pt-1">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600">Trạng thái hiệu lực</label>
                      <select value={subFormData.trang_thai} onChange={e => setSubFormData({...subFormData, trang_thai: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="Hiệu lực">Hiệu lực</option>
                        <option value="Tạm ngưng">Tạm ngưng</option>
                        <option value="Hết hạn">Hết hạn</option>
                      </select>
                    </div>
                    <div className="flex items-center h-full mt-5">
                      <label className="relative flex items-center cursor-pointer select-none">
                        <input type="checkbox" checked={subFormData.tham_gia_thi_day_du} onChange={e => setSubFormData({...subFormData, tham_gia_thi_day_du: e.target.checked})} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                        <span className="ml-2 text-xs font-semibold text-slate-700">Bắt buộc thi đầy đủ</span>
                      </label>
                    </div>
                  </div>

                  {/* Phân đoạn: CHỈ TIÊU ĐIỀU KIỆN CAM KẾT (Dạng Số Nguyên) */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                    <span className="block text-[11px] font-bold uppercase text-slate-500 tracking-wider">Hạn mức chỉ tiêu điều kiện</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Số buổi vắng tối đa</label>
                        <input type="number" min="0" value={subFormData.so_buoi_vang_cho_phep} onChange={e => setSubFormData({...subFormData, so_buoi_vang_cho_phep: e.target.value === "" ? "" : parseInt(e.target.value, 10)})} className="w-full px-2 py-1.5 border rounded-md outline-none bg-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Số buổi đi muộn tối đa</label>
                        <input type="number" min="0" value={subFormData.so_buoi_di_muon} onChange={e => setSubFormData({...subFormData, so_buoi_di_muon: e.target.value === "" ? "" : parseInt(e.target.value, 10)})} className="w-full px-2 py-1.5 border rounded-md outline-none bg-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Số lần thiếu bài tập tối đa</label>
                        <input type="number" min="0" value={subFormData.so_lan_thieu_bai_tap} onChange={e => setSubFormData({...subFormData, so_lan_thieu_bai_tap: e.target.value === "" ? "" : parseInt(e.target.value, 10)})} className="w-full px-2 py-1.5 border rounded-md outline-none bg-white font-mono" />
                      </div>
                    </div>
                  </div>

                  {/* Phân đoạn: GIÁ TRỊ GHI NHẬN THỰC TẾ & VI PHẠM (Dành cho việc theo dõi, sửa đổi) */}
                  <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 space-y-3">
                    <span className="block text-[11px] font-bold uppercase text-amber-700 tracking-wider">Theo dõi tình hình thực tế</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-amber-800 mb-0.5">Số buổi vắng thực tế</label>
                        <input type="number" min="0" value={subFormData.so_buoi_vang_thuc_te} onChange={e => setSubFormData({...subFormData, so_buoi_vang_thuc_te: e.target.value === "" ? "" : parseInt(e.target.value, 10)})} className="w-full px-2 py-1.5 border border-amber-200 rounded-md outline-none bg-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-amber-800 mb-0.5">Số buổi muộn thực tế</label>
                        <input type="number" min="0" value={subFormData.so_buoi_di_muon_thuc_te} onChange={e => setSubFormData({...subFormData, so_buoi_di_muon_thuc_te: e.target.value === "" ? "" : parseInt(e.target.value, 10)})} className="w-full px-2 py-1.5 border border-amber-200 rounded-md outline-none bg-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-amber-800 mb-0.5">Thiếu bài thực tế</label>
                        <input type="number" min="0" value={subFormData.so_lan_thieu_bai_tap_thuc_te} onChange={e => setSubFormData({...subFormData, so_lan_thieu_bai_tap_thuc_te: e.target.value === "" ? "" : parseInt(e.target.value, 10)})} className="w-full px-2 py-1.5 border border-amber-200 rounded-md outline-none bg-white font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <label className="flex items-center cursor-pointer select-none">
                        <input type="checkbox" checked={subFormData.bi_vi_pham} onChange={e => setSubFormData({...subFormData, bi_vi_pham: e.target.checked})} className="w-4 h-4 text-rose-600 border-amber-300 rounded focus:ring-rose-500" />
                        <span className="ml-2 text-xs font-semibold text-rose-700">Đánh dấu: Bị vi phạm cam kết</span>
                      </label>
                      <label className="flex items-center cursor-pointer select-none">
                        <input type="checkbox" checked={subFormData.da_bo_thi} onChange={e => setSubFormData({...subFormData, da_bo_thi: e.target.checked})} className="w-4 h-4 text-slate-600 border-amber-300 rounded focus:ring-slate-500" />
                        <span className="ml-2 text-xs font-semibold text-slate-700">Học viên đã bỏ thi</span>
                      </label>
                    </div>

                    {subFormData.bi_vi_pham && (
                      <div className="pt-1">
                        <label className="block text-[10px] font-semibold text-rose-800 mb-0.5">Lý do vi phạm hệ thống hoặc ghi chú giải trình</label>
                        <input type="text" placeholder="Nhập lý do học viên vi phạm cam kết..." value={subFormData.ly_do_vi_pham} onChange={e => setSubFormData({...subFormData, ly_do_vi_pham: e.target.value})} className="w-full px-3 py-1.5 border border-rose-200 rounded-md outline-none bg-white text-xs" />
                      </div>
                    )}
                  </div>

                  {/* Văn bản nội dung chi tiết */}
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Nội dung văn bản thỏa thuận cam kết chi tiết</label>
                    <textarea rows={3} placeholder="Mô tả ràng buộc chi tiết..." value={subFormData.noi_dung_cam_ket} onChange={e=>setSubFormData({...subFormData, noi_dung_cam_ket: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              )}

              {/* LAYOUT FORM: PHIẾU THU */}
              {subModal.type === "phieu-thu" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Khóa học áp dụng thu tiền học phí *</label>
                    <SearchableSelect 
                      options={metadata.khoaHocs.map((k: any) => ({ value: k.ma_khoa_hoc, label: k.ten_khoa_hoc }))}
                      value={subFormData.ma_khoa_hoc}
                      onChange={(val: any) => setSubFormData({ ...subFormData, ma_khoa_hoc: val })}
                      placeholder="-- Tìm khóa học --"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Nhân sự thực hiện lập phiếu thu *</label>
                    <SearchableSelect 
                      options={metadata.nhanSus.map((n: any) => ({ value: n.ma_nhan_su, label: n.ho_ten }))}
                      value={subFormData.ma_nhan_su}
                      onChange={(val: any) => setSubFormData({ ...subFormData, ma_nhan_su: val })}
                      placeholder="-- Tìm nhân sự tiếp nhận --"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Số tiền VNĐ thực tế thu từ học viên *</label>
                    <input type="number" required min="1000" placeholder="Ví dụ: 3000000" value={subFormData.so_tien} onChange={e=>setSubFormData({...subFormData, so_tien: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Ngày lập chứng từ thu phí *</label>
                    <input type="date" required value={subFormData.ngay_thu} onChange={e => setSubFormData({...subFormData, ngay_thu: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Ghi chú lý do nội dung thu</label>
                    <input type="text" placeholder="Ví dụ: Thu tiền học phí đợt 1 khóa IELTS..." value={subFormData.noi_dung} onChange={e=>setSubFormData({...subFormData, noi_dung: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              )}

            </form>

            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2 flex-shrink-0">
              <button type="button" onClick={() => setSubModal({ isOpen: false, mode: "add", type: "" })} className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 text-sm">Hủy</button>
              <button type="button" onClick={handleSubModalSubmit} disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-70 text-sm font-medium hover:bg-indigo-700 transition">
                {isSubmitting ? "Đang xử lý..." : "Lưu dữ liệu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}