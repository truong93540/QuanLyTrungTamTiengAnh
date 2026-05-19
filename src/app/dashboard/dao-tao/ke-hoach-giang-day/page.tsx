"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface GiaoVien {
  ma_giao_vien: number;
  ho_ten: string;
}

interface ChuongTrinhHoc {
  ma_chuong_trinh: number;
  ten_chuong_trinh: string;
}

interface LopHoc {
  ma_lop_hoc: number;
  ten_lop: string;
  ngay_khai_giang: string | null;
  ngay_ket_thuc: string | null;
}

interface KhoaHoc {
  ma_khoa_hoc: number;
  ten_khoa_hoc: string;
  chuong_trinh: ChuongTrinhHoc;
  lop_hoc: LopHoc[];
}

interface KeHoachGiangDay {
  ma_ke_hoach_giang_day: number;
  noi_dung: string | null;
  lich_day: string | null;
  thoi_gian: string | null;
  ma_giao_vien: number;
  ma_khoa_hoc: number;
  giao_vien: GiaoVien;
  khoa_hoc: KhoaHoc;
}

export default function KeHoachGiangDayPage() {
  const [data, setData] = useState<KeHoachGiangDay[]>([]);
  const [options, setOptions] = useState<{ giaoVien: GiaoVien[]; khoaHoc: KhoaHoc[] }>({
    giaoVien: [],
    khoaHoc: [],
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KeHoachGiangDay | null>(null);
  const [formData, setFormData] = useState({
    noi_dung: "",
    lich_day: "",
    thoi_gian: "",
    ma_giao_vien: "",
    ma_khoa_hoc: "",
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dao-tao/ke-hoach-giang-day");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setOptions(result.options);
      } else {
        showToast(result.error || "Không thể tải dữ liệu", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      noi_dung: "",
      lich_day: "",
      thoi_gian: "",
      ma_giao_vien: options.giaoVien[0]?.ma_giao_vien?.toString() || "",
      ma_khoa_hoc: options.khoaHoc[0]?.ma_khoa_hoc?.toString() || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: KeHoachGiangDay) => {
    setEditingItem(item);
    setFormData({
      noi_dung: item.noi_dung || "",
      lich_day: item.lich_day || "",
      thoi_gian: item.thoi_gian || "",
      ma_giao_vien: item.ma_giao_vien.toString(),
      ma_khoa_hoc: item.ma_khoa_hoc.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ma_giao_vien || !formData.ma_khoa_hoc || !formData.noi_dung) {
      showToast("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    try {
      const url = editingItem
        ? `/api/dao-tao/ke-hoach-giang-day/${editingItem.ma_ke_hoach_giang_day}`
        : "/api/dao-tao/ke-hoach-giang-day";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        showToast(editingItem ? "Cập nhật kế hoạch thành công" : "Tạo mới kế hoạch thành công");
        setIsModalOpen(false);
        fetchData();
      } else {
        showToast(result.error || "Thực hiện thất bại", "error");
      }
    } catch (err) {
      showToast("Lỗi hệ thống đồng bộ dữ liệu", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn loại bỏ kế hoạch giảng dạy này chứ?")) return;
    try {
      const res = await fetch(`/api/dao-tao/ke-hoach-giang-day/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        showToast("Xóa bản ghi thành công");
        fetchData();
      } else {
        showToast(result.error || "Xóa thất bại", "error");
      }
    } catch (err) {
      showToast("Lỗi hệ thống tác vụ xóa", "error");
    }
  };

  const filteredData = data.filter((item) => {
    const combinedText = `${item.noi_dung} ${item.giao_vien?.ho_ten} ${item.khoa_hoc?.ten_khoa_hoc}`.toLowerCase();
    return combinedText.includes(search.toLowerCase());
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white font-medium ${toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản Lý Kế Hoạch Giảng Dạy</h1>
          <p className="text-sm text-slate-500">Giám sát và phân phối kế hoạch đào tạo toàn hệ thống</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
        >
          + Thêm Kế Hoạch
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <input
          type="text"
          placeholder="Tìm nhanh theo nội dung, giáo viên hoặc khóa học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg text-sm bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-sm font-medium">Đang tải cấu trúc dữ liệu...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center text-slate-400">Không có dữ liệu hiển thị.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold tracking-wider border-b">
                  <th className="p-4">Nội Dung Kế Hoạch</th>
                  <th className="p-4">Giáo Viên Phụ Trách</th>
                  <th className="p-4">Khóa Học</th>
                  <th className="p-4">Chương Trình Học</th>
                  <th className="p-4">Danh Sách Lớp Vận Hành</th>
                  <th className="p-4">Khung Lịch</th>
                  <th className="p-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredData.map((item) => (
                  <tr key={item.ma_ke_hoach_giang_day} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-900 max-w-xs truncate">{item.noi_dung}</td>
                    <td className="p-4 font-semibold text-slate-800">{item.giao_vien?.ho_ten}</td>
                    <td className="p-4 text-slate-600 font-medium">{item.khoa_hoc?.ten_khoa_hoc}</td>
                    <td className="p-4 text-slate-400 text-xs">{item.khoa_hoc?.chuong_trinh?.ten_chuong_trinh}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {item.khoa_hoc?.lop_hoc?.map((l) => (
                          <span key={l.ma_lop_hoc} className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded border">
                            {l.ten_lop}
                          </span>
                        )) || <span className="text-slate-400 italic text-xs">Chưa mở lớp</span>}
                      </div>
                    </td>
                    <td className="p-4 text-xs space-y-0.5">
                      <div>Lịch: {item.lich_day || "N/A"}</div>
                      <div className="text-slate-400">Khung: {item.thoi_gian || "N/A"}</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/dashboard/dao-tao/ke-hoach-giang-day/${item.ma_ke_hoach_giang_day}`} className="bg-indigo-50 text-indigo-600 px-2.5 py-1.5 rounded font-semibold text-xs hover:bg-indigo-100">
                          Chi tiết
                        </Link>
                        <button onClick={() => handleOpenEditModal(item)} className="bg-amber-50 text-amber-600 px-2.5 py-1.5 rounded font-semibold text-xs hover:bg-amber-100">
                          Sửa
                        </button>
                        <button onClick={() => handleDelete(item.ma_ke_hoach_giang_day)} className="bg-rose-50 text-rose-600 px-2.5 py-1.5 rounded font-semibold text-xs hover:bg-rose-100">
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">{editingItem ? "Cập Nhật Kế Hoạch" : "Thêm Kế Hoạch Mới"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nội Dung Kế Hoạch *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.noi_dung}
                  onChange={(e) => setFormData({ ...formData, noi_dung: e.target.value })}
                  placeholder="Nhập nội dung, lộ trình cốt lõi..."
                  className="w-full text-sm border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Giáo Viên Phụ Trách *</label>
                  <select
                    value={formData.ma_giao_vien}
                    onChange={(e) => setFormData({ ...formData, ma_giao_vien: e.target.value })}
                    className="w-full text-sm border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  >
                    {options.giaoVien.map((g) => (
                      <option key={g.ma_giao_vien} value={g.ma_giao_vien}>{g.ho_ten}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Áp Dụng Cho Khóa Học *</label>
                  <select
                    value={formData.ma_khoa_hoc}
                    onChange={(e) => setFormData({ ...formData, ma_khoa_hoc: e.target.value })}
                    className="w-full text-sm border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  >
                    {options.khoaHoc.map((k) => (
                      <option key={k.ma_khoa_hoc} value={k.ma_khoa_hoc}>{k.ten_khoa_hoc}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lịch Dạy (Thứ/Ca)</label>
                  <input
                    type="text"
                    value={formData.lich_day}
                    onChange={(e) => setFormData({ ...formData, lich_day: e.target.value })}
                    placeholder="VD: Thứ 2-4-6 Ca 2"
                    className="w-full text-sm border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Thời Gian (Khung giờ)</label>
                  <input
                    type="text"
                    value={formData.thoi_gian}
                    onChange={(e) => setFormData({ ...formData, thoi_gian: e.target.value })}
                    placeholder="VD: 19h30 - 21h00"
                    className="w-full text-sm border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>
              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700">Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}