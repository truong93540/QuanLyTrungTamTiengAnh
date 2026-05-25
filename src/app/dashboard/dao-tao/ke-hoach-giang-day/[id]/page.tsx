"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface HocVien {
  ma_hoc_vien: number;
  ho_ten: string;
}

interface DiemDanh {
  ma_diem_danh: number;
  trang_thai: string | null;
  ghi_chu: string | null;
  hoc_vien: HocVien;
}

interface NhanXet {
  ma_nhan_xet: number;
  da_lam_bai_tap: boolean | null;
  noi_dung_nhan_xet: string | null;
  hoc_vien: HocVien;
}

interface BuoiHoc {
  ma_buoi_hoc: number;
  ngay_hoc: string;
  noi_dung_hoc: string | null;
  ma_giao_vien: number;
  ma_lop_hoc: number;
  diem_danh: DiemDanh[];
  nhan_xet: NhanXet[];
}

interface KetQuaKiemTra {
  ma_ket_qua_kiem_tra: number;
  diem_so: number;
  trang_thai: string | null;
  nhan_xet: string | null;
  hoc_vien: HocVien;
}

interface BaiKiemTra {
  ma_bai_kiem_tra: number;
  ten_bai_kiem_tra: string;
  ngay_kiem_tra: string;
  ket_qua: KetQuaKiemTra[];
}

interface LopHoc {
  ma_lop_hoc: number;
  ten_lop: string;
  ngay_khai_giang: string | null;
  ngay_ket_thuc: string | null;
  buoi_hoc: BuoiHoc[];
  tham_gia: { hoc_vien: HocVien }[];
}

interface KeHoachGiangDay {
  ma_ke_hoach_giang_day: number;
  noi_dung: string | null;
  lich_day: string | null;
  thoi_gian: string | null;
  ma_giao_vien: number;
  giao_vien: {
    ma_giao_vien: number;
    ho_ten: string;
    so_dien_thoai: string | null;
    email: string | null;
  };
  khoa_hoc: {
    ma_khoa_hoc: number;
    ten_khoa_hoc: string;
    chuong_trinh: { ten_chuong_trinh: string };
    lop_hoc: LopHoc[];
    bai_kiem_tra: BaiKiemTra[];
  };
}

// Định nghĩa PageProps với params là một Promise theo chuẩn Next.js 15
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function KeHoachGiangDayDetailPage({ params }: PageProps) {
  // Giải nén params bằng React.use() đồng bộ ngay trong thân component
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [activeTab, setActiveTab] = useState<"overview" | "lessons" | "attendance" | "tests" | "comments">("overview");
  const [data, setData] = useState<KeHoachGiangDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [lessonForm, setLessonForm] = useState({
    ngay_hoc: "",
    noi_dung_hoc: "",
    ma_lop_hoc: "",
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDetail = async () => {
    try {
      // Sửa params.id -> id
      const res = await fetch(`/api/dao-tao/ke-hoach-giang-day/${id}`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        showToast(result.error || "Không thể tải chi tiết kế hoạch", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
    // Sửa mảng phụ thuộc từ [params.id] -> [id]
  }, [id]);

  const handleOpenAddLesson = () => {
    if (!data || data.khoa_hoc.lop_hoc.length === 0) {
      showToast("Cần mở lớp học thuộc khoá này trước khi xếp lịch học!", "error");
      return;
    }
    setEditingLesson(null);
    setLessonForm({
      ngay_hoc: new Date().toISOString().substring(0, 16),
      noi_dung_hoc: "",
      ma_lop_hoc: data.khoa_hoc.lop_hoc[0].ma_lop_hoc.toString(),
    });
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    setLessonForm({
      ngay_hoc: new Date(lesson.ngay_hoc).toISOString().substring(0, 16),
      noi_dung_hoc: lesson.noi_dung_hoc || "",
      ma_lop_hoc: lesson.ma_lop_hoc.toString(),
    });
    setIsLessonModalOpen(true);
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    const payload = {
      action: editingLesson ? "updateBuoiHoc" : "createBuoiHoc",
      ma_buoi_hoc: editingLesson?.ma_buoi_hoc,
      data: {
        ngay_hoc: new Date(lessonForm.ngay_hoc).toISOString(),
        noi_dung_hoc: lessonForm.noi_dung_hoc,
        ma_giao_vien: data.ma_giao_vien,
        ma_lop_hoc: Number(lessonForm.ma_lop_hoc),
      },
    };

    try {
      // Sửa params.id -> id
      const res = await fetch(`/api/dao-tao/ke-hoach-giang-day/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        showToast(editingLesson ? "Sửa buổi học thành công" : "Tạo buổi học thành công");
        setIsLessonModalOpen(false);
        fetchDetail();
      } else {
        showToast(result.error || "Thất bại", "error");
      }
    } catch (err) {
      showToast("Lỗi hệ thống đồng bộ buổi học", "error");
    }
  };

  const handleDeleteLesson = async (ma_buoi_hoc: number) => {
    if (!confirm("Xác nhận xóa bỏ buổi học này?")) return;
    try {
      // Sửa params.id -> id
      const res = await fetch(`/api/dao-tao/ke-hoach-giang-day/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteBuoiHoc", ma_buoi_hoc }),
      });
      const result = await res.json();
      if (result.success) {
        showToast("Xóa lịch học thành công");
        fetchDetail();
      } else {
        showToast(result.error || "Thao tác xóa thất bại", "error");
      }
    } catch (err) {
      showToast("Lỗi hệ thống", "error");
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 text-sm font-semibold animate-pulse">Đang định hình tệp hồ sơ chi tiết kế hoạch...</div>;
  }

  if (!data) {
    return <div className="p-12 text-center text-rose-500 font-bold">Không tìm thấy kế hoạch giảng dạy yêu cầu.</div>;
  }

  const allLessons: BuoiHoc[] = [];
  data.khoa_hoc.lop_hoc.forEach((lop) => {
    if (lop.buoi_hoc) {
      lop.buoi_hoc.forEach((b) => {
        if (b.ma_giao_vien === data.ma_giao_vien) allLessons.push(b);
      });
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-slate-800 text-white font-medium rounded-lg shadow-md">{toast.message}</div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-xl shadow-sm border border-slate-100 gap-4">
        <div>
          <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Mã hồ sơ kế hoạch: #{data.ma_ke_hoach_giang_day}</span>
          <h1 className="text-xl font-bold text-slate-800 mt-1">{data.noi_dung}</h1>
        </div>
        <Link href="/dashboard/dao-tao/ke-hoach-giang-day" className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200">
          Quay Lại Danh Sách
        </Link>
      </div>

      <div className="border-b bg-white px-2 rounded-xl shadow-sm border flex flex-wrap gap-2">
        {(["overview", "lessons", "attendance", "tests", "comments"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 font-bold text-sm border-b-2 capitalize transition-all ${activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            {tab === "overview" ? "Tổng quan" : tab === "lessons" ? `Buổi học (${allLessons.length})` : tab === "attendance" ? "Điểm danh" : tab === "tests" ? "Bài kiểm tra" : "Nhận xét"}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-800 border-l-4 border-indigo-600 pl-2 text-sm uppercase tracking-wide">Cấu Hình Khung Kế Hoạch</h3>
                <div className="text-sm text-slate-700 pt-1">
                  <p><span className="font-medium text-slate-400">Nội dung cốt lõi:</span> {data.noi_dung}</p>
                  <p><span className="font-medium text-slate-400">Khung lịch học phân bổ:</span> {data.lich_day || "Chưa xếp"}</p>
                  <p><span className="font-medium text-slate-400">Giờ học ấn định:</span> {data.thoi_gian || "Chưa xếp"}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-800 border-l-4 border-emerald-600 pl-2 text-sm uppercase tracking-wide">Nhân Sự Đảm Nhiệm</h3>
                <div className="text-sm text-slate-700 pt-1">
                  <p><span className="font-medium text-slate-400">Giảng viên:</span> {data.giao_vien?.ho_ten}</p>
                  <p><span className="font-medium text-slate-400">Điện thoại liên hệ:</span> {data.giao_vien?.so_dien_thoai || "N/A"}</p>
                  <p><span className="font-medium text-slate-400">Địa chỉ email:</span> {data.giao_vien?.email || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-sm border-l-4 border-amber-600 pl-2 uppercase tracking-wide">Lớp học thuộc quản lý của khóa</h3>
              <table className="w-full text-left text-sm border border-slate-100 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase">
                    <th className="p-3">Tên lớp</th>
                    <th className="p-3">Ngày khai giảng</th>
                    <th className="p-3">Ngày bế giảng</th>
                    <th className="p-3 text-center">Sĩ số hiện hành</th>
                  </tr>
                </thead>
                <tbody>
                  {data.khoa_hoc.lop_hoc.map((lop) => (
                    <tr key={lop.ma_lop_hoc} className="border-b last:border-0">
                      <td className="p-3 font-bold text-slate-800">{lop.ten_lop}</td>
                      <td className="p-3 text-slate-600">{lop.ngay_khai_giang ? new Date(lop.ngay_khai_giang).toLocaleDateString("vi-VN") : "N/A"}</td>
                      <td className="p-3 text-slate-600">{lop.ngay_ket_thuc ? new Date(lop.ngay_ket_thuc).toLocaleDateString("vi-VN") : "N/A"}</td>
                      <td className="p-3 text-center font-semibold text-indigo-600">{lop.tham_gia?.length || 0} học viên</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "lessons" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Lộ Trình Các Tiết Học Chi Tiết</h3>
              <button onClick={handleOpenAddLesson} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded font-bold transition-all">
                + Thêm Buổi Học
              </button>
            </div>
            {allLessons.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm italic">Chưa xếp lịch trình buổi giảng dạy nào.</div>
            ) : (
              <table className="w-full text-left text-sm border">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs font-semibold border-b">
                    <th className="p-3">Mã</th>
                    <th className="p-3">Lớp học</th>
                    <th className="p-3">Thời điểm bắt đầu</th>
                    <th className="p-3">Nội dung cốt lõi tiết học</th>
                    <th className="p-3 text-center">Tác vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {allLessons.map((b) => (
                    <tr key={b.ma_buoi_hoc} className="border-b last:border-0 hover:bg-slate-50/40">
                      <td className="p-3 text-slate-400">#{b.ma_buoi_hoc}</td>
                      <td className="p-3 font-semibold text-indigo-600">
                        {data.khoa_hoc.lop_hoc.find((l) => l.ma_lop_hoc === b.ma_lop_hoc)?.ten_lop}
                      </td>
                      <td className="p-3 font-medium text-slate-700">{new Date(b.ngay_hoc).toLocaleString("vi-VN")}</td>
                      <td className="p-3 text-slate-500 max-w-sm truncate">{b.noi_dung_hoc || "Chưa thiết lập"}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => handleOpenEditLesson(b)} className="text-amber-600 hover:underline text-xs font-bold">Sửa</button>
                          <button onClick={() => handleDeleteLesson(b.ma_buoi_hoc)} className="text-rose-600 hover:underline text-xs font-bold">Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Nhật ký trạng thái điểm danh học viên</h3>
            {allLessons.map((b) => (
              <div key={b.ma_buoi_hoc} className="border rounded-lg p-4 bg-slate-50/50 space-y-2 mb-3">
                <div className="text-xs font-bold text-slate-700 border-b pb-1 flex justify-between">
                  <span>Buổi học mã số #{b.ma_buoi_hoc} - Lớp {data.khoa_hoc.lop_hoc.find(l => l.ma_lop_hoc === b.ma_lop_hoc)?.ten_lop}</span>
                  <span className="text-slate-400 font-medium">{new Date(b.ngay_hoc).toLocaleDateString("vi-VN")}</span>
                </div>
                {!b.diem_danh || b.diem_danh.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Chưa thực hiện ghi nhận điểm danh cho tiết học này.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {b.diem_danh.map((dd) => (
                      <div key={dd.ma_diem_danh} className="bg-white p-2 border rounded flex justify-between items-center shadow-xs">
                        <span className="font-medium text-slate-700">{dd.hoc_vien?.ho_ten}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${dd.trang_thai === "Có mặt" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                          {dd.trang_thai || "Vắng"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "tests" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Kết Quả Các Bài Kiểm Tra Khóa Đào Tạo</h3>
            {data.khoa_hoc.bai_kiem_tra?.map((kt) => (
              <div key={kt.ma_bai_kiem_tra} className="border rounded-xl overflow-hidden shadow-xs mb-4">
                <div className="bg-slate-50 p-3 font-bold text-xs text-slate-800 border-b flex justify-between">
                  <span>{kt.ten_bai_kiem_tra}</span>
                  <span className="text-slate-400">Thời điểm thi: {new Date(kt.ngay_kiem_tra).toLocaleDateString("vi-VN")}</span>
                </div>
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-100/40 text-slate-500 border-b font-semibold">
                      <th className="p-2">Tên Học Viên</th>
                      <th className="p-2 text-center">Điểm Số Đạt</th>
                      <th className="p-2">Trạng Thái Đạt</th>
                      <th className="p-2">Nhận Xét Hệ Thống</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kt.ket_qua?.map((kq) => (
                      <tr key={kq.ma_ket_qua_kiem_tra} className="border-b last:border-0">
                        <td className="p-2 font-medium text-slate-800">{kq.hoc_vien?.ho_ten}</td>
                        <td className="p-2 text-center font-bold text-indigo-600">{kq.diem_so}</td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${kq.diem_so >= 5 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                            {kq.trang_thai || (kq.diem_so >= 5 ? "Đạt" : "Không đạt")}
                          </span>
                        </td>
                        <td className="p-2 text-slate-400 italic">{kq.nhan_xet || "Chưa bổ sung"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Nhận Xét Tiết Học Tổng Quan Từ Giảng Viên</h3>
            {allLessons.map((b) => (
              <div key={b.ma_buoi_hoc} className="border rounded-lg p-4 bg-slate-50/30 text-xs mb-3">
                <div className="font-bold text-slate-500 border-b pb-1 mb-2">
                  Buổi học #{b.ma_buoi_hoc} - Lớp {data.khoa_hoc.lop_hoc.find(l => l.ma_lop_hoc === b.ma_lop_hoc)?.ten_lop}
                </div>
                {!b.nhan_xet || b.nhan_xet.length === 0 ? (
                  <p className="text-slate-400 italic">Chưa cập nhật đánh giá học viên.</p>
                ) : (
                  <div className="divide-y space-y-2">
                    {b.nhan_xet.map((nx) => (
                      <div key={nx.ma_nhan_xet} className="pt-2 first:pt-0">
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-800">{nx.hoc_vien?.ho_ten}</span>
                          <span className={nx.da_lam_bai_tap ? "text-emerald-600" : "text-rose-500"}>
                            {nx.da_lam_bai_tap ? "✓ Đã nộp BTVN" : "✗ Thiếu BTVN"}
                          </span>
                        </div>
                        <p className="text-slate-600 italic mt-0.5">{nx.noi_dung_nhan_xet || "Chưa có nhận xét chi tiết"}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800">{editingLesson ? "Sửa Buổi Học" : "Lên Lịch Buổi Học Mới"}</h2>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleLessonSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lớp Học Áp Dụng *</label>
                <select
                  value={lessonForm.ma_lop_hoc}
                  onChange={(e) => setLessonForm({ ...lessonForm, ma_lop_hoc: e.target.value })}
                  className="w-full border rounded-lg p-2 bg-slate-50 text-slate-800 focus:outline-none"
                >
                  {data.khoa_hoc.lop_hoc.map((l) => (
                    <option key={l.ma_lop_hoc} value={l.ma_lop_hoc}>{l.ten_lop}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Thời Gian Khai Giảng Tiết Học *</label>
                <input
                  type="datetime-local"
                  required
                  value={lessonForm.ngay_hoc}
                  onChange={(e) => setLessonForm({ ...lessonForm, ngay_hoc: e.target.value })}
                  className="w-full border rounded-lg p-2 bg-slate-50 text-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nội Dung Chi Tiết Tiết Học</label>
                <textarea
                  rows={3}
                  value={lessonForm.noi_dung_hoc}
                  onChange={(e) => setLessonForm({ ...lessonForm, noi_dung_hoc: e.target.value })}
                  placeholder="Nhập nội dung bài giảng và phân phối..."
                  className="w-full border rounded-lg p-2 bg-slate-50 text-slate-800 focus:outline-none"
                />
              </div>
              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsLessonModalOpen(false)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded">Hủy</button>
                <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white rounded font-semibold shadow-sm">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}