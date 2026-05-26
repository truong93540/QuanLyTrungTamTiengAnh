"use client";

import React, { useState, useEffect, useCallback } from "react";

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

interface HopDongLaoDong {
  ma_hop_dong: number;
  so_hop_dong: string;
  luong_co_ban: number | null;
  ten_cong_viec: string | null;
  tg_thu_viec: string | null;
  tg_het_hop_dong: string | null;
}

interface HoSoBangCap {
  ma_ho_so: number;
  ten_bang_cap: string;
  noi_cap: string | null;
  ngay_cap: string | null;
  loai_bang_cap: string | null;
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

interface NhanSuDetail extends NhanSu {
  hop_dong: HopDongLaoDong[];
  ho_so_bang_cap: HoSoBangCap[];
}

export default function NhanSuPage() {
  // States cho danh sách nhân sự tổng quát
  const [nhanSus, setNhanSus] = useState<NhanSu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const [phongBans, setPhongBans] = useState<PhongBan[]>([]);
  const [chucVus, setChucVus] = useState<ChucVu[]>([]);

  // States chi tiết nhân sự hiện tại
  const [selectedNhanSuId, setSelectedNhanSuId] = useState<number | null>(null);
  const [nhanSuDetail, setNhanSuDetail] = useState<NhanSuDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  // Modal 1: Thêm/Sửa thông tin Nhân Sự
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

  // Modal 2: Thêm/Sửa Hợp Đồng Lao Động
  const [isHdModalOpen, setIsHdModalOpen] = useState<boolean>(false);
  const [hdModalType, setHdModalType] = useState<"add" | "edit">("add");
  const [hdFormData, setHdFormData] = useState({
    ma_hop_dong: "",
    so_hop_dong: "",
    luong_co_ban: "",
    ten_cong_viec: "",
    tg_thu_viec: "",
    tg_het_hop_dong: "",
  });

  // Modal 3: Thêm/Sửa Hồ Sơ Bằng Cấp
  const [isBcModalOpen, setIsBcModalOpen] = useState<boolean>(false);
  const [bcModalType, setBcModalType] = useState<"add" | "edit">("add");
  const [bcFormData, setBcFormData] = useState({
    ma_ho_so: "",
    ten_bang_cap: "",
    noi_cap: "",
    ngay_cap: "",
    loai_bang_cap: "",
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

  // Hàm tải danh sách chính
  const fetchNhanSus = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/dao-tao/nhan-su?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearch)}`;
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) {
        setNhanSus(result.data);
        setPagination(result.pagination);
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
      console.error("Lỗi khi tải dữ liệu cấu hình");
    }
  };

  // Hàm reload thông tin chi tiết
  const refreshDetail = useCallback(async () => {
    if (!selectedNhanSuId) return;
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/dao-tao/nhan-su?id=${selectedNhanSuId}`);
      const result = await res.json();
      if (result.success) {
        setNhanSuDetail(result.data);
      } else {
        setErrorDetail(result.message || "Không tìm thấy dữ liệu.");
      }
    } catch (err) {
      setErrorDetail("Lỗi tải chi tiết.");
    } finally {
      setLoadingDetail(false);
    }
  }, [selectedNhanSuId]);

  useEffect(() => {
    if (selectedNhanSuId) refreshDetail();
  }, [selectedNhanSuId, refreshDetail]);

  useEffect(() => {
    fetchNhanSus();
  }, [fetchNhanSus]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  // Mở modal thêm mới nhân sự (Được làm sạch dữ liệu cũ)
  const handleOpenAddNhanSu = () => {
    setModalType("add");
    setFormData({
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
    setIsModalOpen(true);
  };

  // Xử lý nộp Form chính Nhân Sự
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = modalType === "add" ? "POST" : "PUT";
      const url = modalType === "add" ? `/api/dao-tao/nhan-su` : `/api/dao-tao/nhan-su?id=${formData.ma_nhan_su}`;

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
        if (selectedNhanSuId && Number(formData.ma_nhan_su) === selectedNhanSuId) {
          refreshDetail();
        }
      } else {
        showToast(result.message || "Có lỗi xảy ra", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối hệ thống", "error");
    }
  };

  const handleDelete = async (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ nhân sự "${name}"?`)) {
      try {
        const res = await fetch(`/api/dao-tao/nhan-su?id=${id}`, { method: "DELETE" });
        const result = await res.json();
        if (result.success) {
          showToast("Xóa hồ sơ nhân sự thành công!");
          fetchNhanSus();
          if (selectedNhanSuId === id) {
            setSelectedNhanSuId(null);
          }
        } else {
          // THÊM NHÁNH ELSE NÀY ĐỂ HIỂN THỊ LỖI TỪ SERVER TRẢ VỀ
          showToast(result.message || "Xóa hồ sơ nhân sự thất bại", "error");
        }
      } catch (err) {
        showToast("Lỗi hệ thống khi xóa", "error");
      }
    }
  };

  const handleOpenEditNhanSu = (ns: NhanSu) => {
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

  // ================= THAO TÁC CRUD HỢP ĐỒNG LAO ĐỘNG =================
  const handleOpenAddHd = () => {
    setHdModalType("add");
    setHdFormData({ ma_hop_dong: "", so_hop_dong: "", luong_co_ban: "", ten_cong_viec: "", tg_thu_viec: "", tg_het_hop_dong: "" });
    setIsHdModalOpen(true);
  };

  const handleOpenEditHd = (hd: HopDongLaoDong) => {
    setHdModalType("edit");
    setHdFormData({
      ma_hop_dong: hd.ma_hop_dong.toString(),
      so_hop_dong: hd.so_hop_dong,
      luong_co_ban: hd.luong_co_ban?.toString() || "",
      ten_cong_viec: hd.ten_cong_viec || "",
      tg_thu_viec: hd.tg_thu_viec || "",
      tg_het_hop_dong: hd.tg_het_hop_dong ? hd.tg_het_hop_dong.substring(0, 10) : "",
    });
    setIsHdModalOpen(true);
  };

  const handleHdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isAdd = hdModalType === "add";
      const url = isAdd 
        ? `/api/dao-tao/nhan-su?type=hop-dong` 
        : `/api/dao-tao/nhan-su?type=hop-dong&id=${hdFormData.ma_hop_dong}`;
      
      const payload = isAdd ? { ...hdFormData, ma_nhan_su: selectedNhanSuId } : hdFormData;

      const res = await fetch(url, {
        method: isAdd ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        showToast(isAdd ? "Thêm hợp đồng mới thành công!" : "Cập nhật hợp đồng thành công!");
        setIsHdModalOpen(false);
        refreshDetail();
      } else {
        showToast(result.message || "Xảy ra lỗi xử lý hợp đồng", "error");
      }
    } catch {
      showToast("Lỗi hệ thống", "error");
    }
  };

  const handleDeleteHd = async (ma_hd: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa văn bản hợp đồng lao động này?")) return;
    try {
      const res = await fetch(`/api/dao-tao/nhan-su?type=hop-dong&id=${ma_hd}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        showToast("Xóa hợp đồng thành công!");
        refreshDetail();
      }
    } catch {
      showToast("Lỗi hệ thống khi xóa", "error");
    }
  };

  // ================= THAO TÁC CRUD HỒ SƠ BẰNG CẤP =================
  const handleOpenAddBc = () => {
    setBcModalType("add");
    setBcFormData({ ma_ho_so: "", ten_bang_cap: "", noi_cap: "", ngay_cap: "", loai_bang_cap: "" });
    setIsBcModalOpen(true);
  };

  const handleOpenEditBc = (bc: HoSoBangCap) => {
    setBcModalType("edit");
    setBcFormData({
      ma_ho_so: bc.ma_ho_so.toString(),
      ten_bang_cap: bc.ten_bang_cap,
      noi_cap: bc.noi_cap || "",
      ngay_cap: bc.ngay_cap ? bc.ngay_cap.substring(0, 10) : "",
      loai_bang_cap: bc.loai_bang_cap || "",
    });
    setIsBcModalOpen(true);
  };

  const handleBcSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isAdd = bcModalType === "add";
      const url = isAdd 
        ? `/api/dao-tao/nhan-su?type=bang-cap` 
        : `/api/dao-tao/nhan-su?type=bang-cap&id=${bcFormData.ma_ho_so}`;
      
      const payload = isAdd ? { ...bcFormData, ma_nhan_su: selectedNhanSuId } : bcFormData;

      const res = await fetch(url, {
        method: isAdd ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        showToast(isAdd ? "Thêm bằng cấp thành công!" : "Cập nhật bằng cấp thành công!");
        setIsBcModalOpen(false);
        refreshDetail();
      } else {
        showToast(result.message || "Xảy ra lỗi xử lý văn bằng", "error");
      }
    } catch {
      showToast("Lỗi hệ thống", "error");
    }
  };

  const handleDeleteBc = async (ma_bc: number) => {
    if (!confirm("Bạn có chắc chắn muốn gỡ bỏ văn bằng này khỏi hồ sơ?")) return;
    try {
      const res = await fetch(`/api/dao-tao/nhan-su?type=bang-cap&id=${ma_bc}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        showToast("Xóa văn bằng thành công!");
        refreshDetail();
      }
    } catch {
      showToast("Lỗi hệ thống khi xóa", "error");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium ${toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"}`}>
          {toast.message}
        </div>
      )}

      {/* CHẾ ĐỘ CHI TIẾT */}
      {selectedNhanSuId ? (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Chi Tiết Hồ Sơ Nhân Sự</h1>
              <p className="text-slate-500 text-sm">Mã nhân sự: #{selectedNhanSuId}</p>
            </div>
            <button onClick={() => { setSelectedNhanSuId(null); setNhanSuDetail(null); }} className="border px-4 py-2 rounded-lg text-black font-medium hover:bg-slate-50 transition">
              Quay lại danh sách
            </button>
          </div>

          {loadingDetail ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-slate-500">Đang đồng bộ dữ liệu...</p>
            </div>
          ) : errorDetail || !nhanSuDetail ? (
            <div className="p-6 text-center text-rose-600">
              <p>{errorDetail || "Hồ sơ không tồn tại."}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Khối 1: Thông tin cơ bản */}
              <div className="bg-white border rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                <div className="md:col-span-2 font-bold text-slate-800 border-b pb-1 mb-2">Thông tin cá nhân</div>
                <div><span className="text-slate-500">Họ và tên:</span> <span className="font-medium text-slate-900">{nhanSuDetail.ho_ten}</span></div>
                <div><span className="text-slate-500">Ngày sinh:</span> <span className="font-medium text-slate-900">{nhanSuDetail.ngay_sinh ? new Date(nhanSuDetail.ngay_sinh).toLocaleDateString("vi-VN") : "—"}</span></div>
                <div><span className="text-slate-500">Giới tính:</span> <span className="font-medium text-slate-900">{nhanSuDetail.gioi_tinh || "—"}</span></div>
                <div><span className="text-slate-500">Số điện thoại:</span> <span className="font-medium text-slate-900">{nhanSuDetail.so_dien_thoai || "—"}</span></div>
                <div><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-900">{nhanSuDetail.email || "—"}</span></div>
                <div><span className="text-slate-500">Địa chỉ:</span> <span className="font-medium text-slate-900">{nhanSuDetail.dia_chi || "—"}</span></div>
                <div><span className="text-slate-500">Phòng ban:</span> <span className="font-medium text-slate-900">{nhanSuDetail.phong_ban?.ten_phong_ban || "—"}</span></div>
                <div><span className="text-slate-500">Chức vụ:</span> <span className="font-medium text-slate-900">{nhanSuDetail.chuc_vu?.ten_chuc_vu || "—"}</span></div>
              </div>

              {/* Khối 2: Quản lý Hợp Đồng */}
              <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-base font-bold text-slate-800">Thông tin hợp đồng lao động</h3>
                  <button onClick={handleOpenAddHd} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                    + Thêm hợp đồng
                  </button>
                </div>
                {!nhanSuDetail.hop_dong || nhanSuDetail.hop_dong.length === 0 ? (
                  <p className="text-slate-400 italic">Chưa liên kết hợp đồng lao động nào.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {nhanSuDetail.hop_dong.map((hd) => (
                      <div key={hd.ma_hop_dong} className="border p-4 rounded-lg bg-slate-50 relative group">
                        <div className="absolute top-4 right-4 space-x-2 opacity-80 group-hover:opacity-100 transition">
                          <button onClick={() => handleOpenEditHd(hd)} className="text-indigo-600 hover:underline text-xs">Sửa</button>
                          <button onClick={() => handleDeleteHd(hd.ma_hop_dong)} className="text-rose-600 hover:underline text-xs">Xóa</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-black">
                          <div><span className="text-slate-500">Số HĐ:</span> <span className="font-mono font-semibold text-slate-900">{hd.so_hop_dong}</span></div>
                          <div><span className="text-slate-500">Vị trí:</span> <span className="font-medium text-slate-900">{hd.ten_cong_viec || "—"}</span></div>
                          <div><span className="text-slate-500">Lương:</span> <span className="font-medium text-emerald-700">{hd.luong_co_ban ? Number(hd.luong_co_ban).toLocaleString("vi-VN") + " đ" : "—"}</span></div>
                          <div><span className="text-slate-500">Thời gian hết hạn:</span> <span className="font-medium text-slate-900">{hd.tg_het_hop_dong ? new Date(hd.tg_het_hop_dong).toLocaleDateString("vi-VN") : "Vô thời hạn"}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Khối 3: Quản lý Hồ sơ bằng cấp */}
              <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-base font-bold text-slate-800">Hồ sơ bằng cấp, chứng chỉ</h3>
                  <button onClick={handleOpenAddBc} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                    + Thêm bằng cấp
                  </button>
                </div>
                {!nhanSuDetail.ho_so_bang_cap || nhanSuDetail.ho_so_bang_cap.length === 0 ? (
                  <p className="text-slate-400 italic">Chưa cập nhật hồ sơ văn bằng.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {nhanSuDetail.ho_so_bang_cap.map((bc) => (
                      <div key={bc.ma_ho_so} className="border p-4 rounded-lg bg-slate-50 relative group">
                        <div className="absolute top-4 right-4 space-x-2 opacity-80 group-hover:opacity-100 transition">
                          <button onClick={() => handleOpenEditBc(bc)} className="text-indigo-600 hover:underline text-xs">Sửa</button>
                          <button onClick={() => handleDeleteBc(bc.ma_ho_so)} className="text-rose-600 hover:underline text-xs">Xóa</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-black">
                          <div><span className="text-slate-500">Tên văn bằng:</span> <span className="font-semibold text-slate-900">{bc.ten_bang_cap}</span></div>
                          <div><span className="text-slate-500">Xếp loại / Cấp độ:</span> <span className="font-medium text-slate-900">{bc.loai_bang_cap || "—"}</span></div>
                          <div><span className="text-slate-500">Nơi cấp:</span> <span className="font-medium text-slate-700">{bc.noi_cap || "—"}</span></div>
                          <div><span className="text-slate-500">Ngay cấp:</span> <span className="font-medium text-slate-900">{bc.ngay_cap ? new Date(bc.ngay_cap).toLocaleDateString("vi-VN") : "—"}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* CHẾ ĐỘ DANH SÁCH */
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Quản Lý Hồ Sơ Nhân Sự</h1>
              <p className="text-black">Danh sách quản lý nhân sự tổng quan</p>
            </div>
            <button onClick={handleOpenAddNhanSu} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition">
              Thêm nhân sự mới
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <input type="text" placeholder="Tìm kiếm nhân sự..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full max-w-md px-4 py-2 border rounded-lg text-black bg-slate-50 outline-none focus:bg-white" />
          </div>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {loading ? (
              <p className="p-12 text-center text-slate-500">Đang tải dữ liệu...</p>
            ) : (
              <table className="w-full text-left border-collapse text-black">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-600">
                    <th className="p-4">Mã</th>
                    <th className="p-4">Họ và Tên</th>
                    <th className="p-4">Số điện thoại</th>
                    <th className="p-4">Phòng Ban</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {nhanSus.map((ns) => (
                    <tr key={ns.ma_nhan_su} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 text-xs font-mono text-slate-400">#{ns.ma_nhan_su}</td>
                      <td className="p-4"><button onClick={() => setSelectedNhanSuId(ns.ma_nhan_su)} className="text-indigo-600 hover:underline font-medium">{ns.ho_ten}</button></td>
                      <td className="p-4">{ns.so_dien_thoai || "—"}</td>
                      <td className="p-4">{ns.phong_ban?.ten_phong_ban || "—"}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditNhanSu(ns)}
                          className="text-indigo-600 hover:bg-indigo-50 px-2.5 py-1 rounded text-xs border border-indigo-200"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={(e) => handleDelete(ns.ma_nhan_su, ns.ho_ten, e)}
                          className="text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded text-xs border border-rose-200"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ================= MODAL HIỂN THỊ CON PHỤ TRỢ ================= */}

      {/* 1. Modal Hợp đồng */}
      {isHdModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleHdSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 bg-slate-50 border-b font-bold text-slate-800">{hdModalType === "add" ? "Thêm hợp đồng mới" : "Chỉnh sửa hợp đồng"}</div>
            <div className="p-4 space-y-3 text-black">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Số hợp đồng *</label>
                <input type="text" required value={hdFormData.so_hop_dong} onChange={(e) => setHdFormData({ ...hdFormData, so_hop_dong: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Tên công việc / Vị trí</label>
                <input type="text" value={hdFormData.ten_cong_viec} onChange={(e) => setHdFormData({ ...hdFormData, ten_cong_viec: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Lương cơ bản (VNĐ)</label>
                <input type="number" value={hdFormData.luong_co_ban} onChange={(e) => setHdFormData({ ...hdFormData, luong_co_ban: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Thời hạn hết hợp đồng</label>
                <input type="date" value={hdFormData.tg_het_hop_dong} onChange={(e) => setHdFormData({ ...hdFormData, tg_het_hop_dong: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
            </div>
            <div className="p-3 bg-slate-50 border-t flex justify-end gap-2 text-black">
              <button type="button" onClick={() => setIsHdModalOpen(false)} className="px-4 py-2 border rounded-md">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Lưu</button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Modal Bằng cấp */}
      {isBcModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleBcSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 bg-slate-50 border-b font-bold text-slate-800">{bcModalType === "add" ? "Bổ sung bằng cấp mới" : "Chỉnh sửa văn bằng"}</div>
            <div className="p-4 space-y-3 text-black">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Tên văn bằng, chứng chỉ *</label>
                <input type="text" required value={bcFormData.ten_bang_cap} onChange={(e) => setBcFormData({ ...bcFormData, ten_bang_cap: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Xếp loại / Cấp độ</label>
                <input type="text" placeholder="Ví dụ: Giỏi, Khá, Xuất sắc, Nâng cao" value={bcFormData.loai_bang_cap} onChange={(e) => setBcFormData({ ...bcFormData, loai_bang_cap: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Nơi cấp / Trường cấp</label>
                <input type="text" value={bcFormData.noi_cap} onChange={(e) => setBcFormData({ ...bcFormData, noi_cap: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Ngày cấp bằng</label>
                <input type="date" value={bcFormData.ngay_cap} onChange={(e) => setBcFormData({ ...bcFormData, ngay_cap: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
            </div>
            <div className="p-3 bg-slate-50 border-t flex justify-end gap-2 text-black">
              <button type="button" onClick={() => setIsBcModalOpen(false)} className="px-4 py-2 border rounded-md">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md">Lưu</button>
            </div>
          </form>
        </div>
      )}

      {/* 3. BỔ SUNG: Modal Thêm/Sửa Nhân Sự Chính */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleFormSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 bg-slate-50 border-b font-bold text-slate-800">
              {modalType === "add" ? "Thêm nhân sự mới" : "Chỉnh sửa hồ sơ nhân sự"}
            </div>
            <div className="p-4 max-h-[75vh] overflow-y-auto space-y-3 text-black">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Họ và tên *</label>
                  <input type="text" required value={formData.ho_ten} onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Ngày sinh</label>
                  <input type="date" value={formData.ngay_sinh} onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Giới tính</label>
                  <select value={formData.gioi_tinh} onChange={(e) => setFormData({ ...formData, gioi_tinh: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none bg-white">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Số điện thoại</label>
                  <input type="text" value={formData.so_dien_thoai} onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Địa chỉ</label>
                  <input type="text" value={formData.dia_chi} onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Phòng ban *</label>
                  <select required value={formData.ma_phong_ban} onChange={(e) => setFormData({ ...formData, ma_phong_ban: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none bg-white">
                    <option value="">-- Chọn phòng ban --</option>
                    {phongBans.map((pb) => (
                      <option key={pb.ma_phong_ban} value={pb.ma_phong_ban}>{pb.ten_phong_ban}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Chức vụ *</label>
                  <select required value={formData.ma_chuc_vu} onChange={(e) => setFormData({ ...formData, ma_chuc_vu: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none bg-white">
                    <option value="">-- Chọn chức vụ --</option>
                    {chucVus.map((cv) => (
                      <option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>{cv.ten_chuc_vu}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border-t flex justify-end gap-2 text-black">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}