"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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

interface NhanSuDetail {
  ma_nhan_su: number;
  ho_ten: string;
  ngay_sinh: string | null;
  gioi_tinh: string | null;
  so_dien_thoai: string | null;
  email: string | null;
  dia_chi: string | null;
  chuc_vu: ChucVu;
  phong_ban: PhongBan;
  hop_dong: HopDongLaoDong[];
}

export default function NhanSuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [nhanSu, setNhanSu] = useState<NhanSuDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      if (!params.id) return;
      try {
        const res = await fetch(`/api/dao-tao/nhan-su/${params.id}`);
        const result = await res.json();
        if (result.success) {
          setNhanSu(result.data);
        } else {
          setError(result.message || "Không tìm thấy dữ liệu nhân sự.");
        }
      } catch (err) {
        setError("Không thể kết nối đến máy chủ.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500">Đang truy xuất thông tin hồ sơ chi tiết...</p>
      </div>
    );
  }

  if (error || !nhanSu) {
    return (
      <div className="p-6 text-center text-rose-600 max-w-xl mx-auto">
        <p className="font-semibold">{error || "Hồ sơ không tồn tại."}</p>
        <button onClick={() => router.back()} className="mt-4 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm">Quay lại</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Chi Tiết Hồ Sơ Nhân Sự</h1>
          <p className="text-sm text-slate-500">Mã nhân sự: #{nhanSu.ma_nhan_su}</p>
        </div>
        <button onClick={() => router.back()} className="border px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
          Quay lại danh sách
        </button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-4">Thông tin cá nhân</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">Họ và tên:</span> <span className="font-medium text-slate-900">{nhanSu.ho_ten}</span></div>
            <div><span className="text-slate-500">Ngày sinh:</span> <span className="font-medium text-slate-900">{nhanSu.ngay_sinh ? new Date(nhanSu.ngay_sinh).toLocaleDateString("vi-VN") : "—"}</span></div>
            <div><span className="text-slate-500">Giới tính:</span> <span className="font-medium text-slate-900">{nhanSu.gioi_tinh || "—"}</span></div>
            <div><span className="text-slate-500">Số điện thoại:</span> <span className="font-medium text-slate-900">{nhanSu.so_dien_thoai || "—"}</span></div>
            <div><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-900">{nhanSu.email || "—"}</span></div>
            <div><span className="text-slate-500">Địa chỉ:</span> <span className="font-medium text-slate-900">{nhanSu.dia_chi || "—"}</span></div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-4">Công tác & Phòng ban</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">Phòng ban:</span> <span className="font-medium text-slate-900">{nhanSu.phong_ban?.ten_phong_ban || "—"}</span></div>
            <div><span className="text-slate-500">Chức vụ:</span> <span className="font-medium text-slate-900">{nhanSu.chuc_vu?.ten_chuc_vu || "—"}</span></div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-4">Thông tin hợp đồng lao động</h3>
          {nhanSu.hop_dong.length === 0 ? (
            <p className="text-slate-400 text-sm italic">Chưa có thông tin hợp đồng lao động được liên kết trên hệ thống.</p>
          ) : (
            <div className="space-y-4">
              {nhanSu.hop_dong.map((hd) => (
                <div key={hd.ma_hop_dong} className="border p-4 rounded-lg bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-500">Số hợp đồng:</span> <span className="font-mono font-semibold text-slate-900">{hd.so_hop_dong}</span></div>
                  <div><span className="text-slate-500">Công việc:</span> <span className="font-medium text-slate-900">{hd.ten_cong_viec || "—"}</span></div>
                  <div><span className="text-slate-500">Lương cơ bản:</span> <span className="font-medium text-emerald-700">{hd.luong_co_ban ? Number(hd.luong_co_ban).toLocaleString("vi-VN") + " VNĐ" : "—"}</span></div>
                  <div><span className="text-slate-500">Thời gian thử việc:</span> <span className="font-medium text-slate-900">{hd.tg_thu_viec || "—"}</span></div>
                  <div><span className="text-slate-500">Ngày hết hạn hợp đồng:</span> <span className="font-medium text-slate-900">{hd.tg_het_hop_dong ? new Date(hd.tg_het_hop_dong).toLocaleDateString("vi-VN") : "Vô thời hạn"}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}