'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface HocVien {
  ma_hoc_vien: number;
  ho_ten: string;
  so_dien_thoai: string | null;
}

interface ThamGia {
  hoc_vien: HocVien;
}

interface LopHoc {
  ma_lop_hoc: number;
  ten_lop: string;
  tham_gia: ThamGia[];
}

interface GiaoVien {
  ho_ten: string;
  email: string | null;
}

interface BuoiHocChiTiet {
  ma_buoi_hoc: number;
  ngay_hoc: string;
  noi_dung_hoc: string | null;
  giao_vien: GiaoVien;
  lop_hoc: LopHoc;
}

export default function ChiTietBuoiHocPage() {
  const params = useParams();
  const router = useRouter();
  const buoiHocId = params.buoiHocId as string;

  const [data, setData] = useState<BuoiHocChiTiet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChiTiet = async () => {
      try {
        setLoading(true);
        // Tận dụng API phục vụ view chi tiết buổi học (được triển khai khép kín qua service)
        const res = await fetch(`/api/dao-tao/buoi-hoc?action=detail&id=${buoiHocId}`);
        // Hoặc cấu hình endpoint riêng biệt, ở đây mockup data hoặc fetch trực tiếp từ buoiHocId
        const testRes = await fetch(`/api/dao-tao/buoi-hoc`);
        const result = await testRes.json();
        
        if (result.success) {
          // Lọc tìm chính xác buổi học hiện tại (Phục vụ cấu trúc phase 2 ổn định)
          const matched = result.data.find((b: any) => b.ma_buoi_hoc === parseInt(buoiHocId));
          if (matched) {
            // Mock map data lớp học để hiển thị danh sách chuẩn bị cho layout điểm danh tiếp theo
            const studentsRes = await fetch(`/api/dao-tao/lop-hoc/${matched.ma_lop_hoc}/hoc-vien`);
            const studentsData = await studentsRes.json();
            
            setData({
              ...matched,
              lop_hoc: {
                ma_lop_hoc: matched.ma_lop_hoc,
                ten_lop: `Lớp học #${matched.ma_lop_hoc}`,
                tham_gia: studentsData.success ? studentsData.data : []
              }
            });
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (buoiHocId) fetchChiTiet();
  }, [buoiHocId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang chuẩn bị dữ liệu phòng học...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Không tìm thấy thông tin chi tiết của buổi học yêu cầu.</div>;

  const dateObj = new Date(data.ngay_hoc);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b pb-5">
        <div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">PHASE 2 - KHUNG BÀI GIẢNG</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Chi tiết Buổi học & Layout Điểm danh</h1>
          <p className="text-sm text-gray-500">Giám sát chuyên cần và nội dung giảng dạy</p>
        </div>
        <button onClick={() => router.back()} className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50">
          Quay lại danh sách
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 border rounded-xl space-y-3 shadow-sm">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Thông tin buổi dạy</h3>
          <div>
            <p className="text-xs text-gray-500">Thời gian diễn ra</p>
            <p className="font-semibold text-gray-800">{dateObj.toLocaleDateString('vi-VN')} lúc {String(dateObj.getHours()).padStart(2, '0')}:{String(dateObj.getMinutes()).padStart(2, '0')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Giáo viên đứng lớp</p>
            <p className="font-semibold text-gray-800 text-indigo-600">{data.giao_vien?.ho_ten || 'Chưa chỉ định'}</p>
          </div>
        </div>

        <div className="bg-white p-5 border rounded-xl space-y-3 shadow-sm md:col-span-2">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Nội dung cốt lõi buổi học</h3>
          <p className="text-gray-700 bg-gray-50 p-3 rounded border text-sm min-h-[60px]">
            {data.noi_dung_hoc || 'Chưa thiết lập nội dung tóm tắt cho buổi học này.'}
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg flex items-start gap-3 text-sm">
        <span className="text-lg">💡</span>
        <div>
          <p className="font-semibold">Cấu trúc chuẩn bị cho Phase kế tiếp (Điểm danh & Nhận xét)</p>
          <p className="text-amber-800 mt-0.5">Hệ thống hiện tại hiển thị danh sách học viên thực tế của lớp để sẵn sàng tích hợp logic ghi dữ liệu vào bảng <code className="bg-amber-100 px-1 rounded">DiemDanh</code> và <code className="bg-amber-100 px-1 rounded">NhanXet</code> ở giai đoạn sau.</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Danh sách học viên theo lớp (Giao diện cấu trúc điểm danh)</h2>
        <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="p-4">Học viên</th>
                <th className="p-4">Số điện thoại</th>
                <th className="p-4 text-center">Trạng thái Có mặt</th>
                <th className="p-4 text-center">Vắng mặt</th>
                <th className="p-4">Nhận xét nhanh học tập (Sẽ mở ở Phase sau)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              {data.lop_hoc?.tham_gia?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">Không có học viên nào trong lớp này để hiển thị.</td>
                </tr>
              ) : (
                data.lop_hoc.tham_gia.map((item: any) => (
                  <tr key={item.hoc_vien.ma_hoc_vien} className="hover:bg-gray-50/50">
                    <td className="p-4 font-medium text-gray-900">{item.hoc_vien.ho_ten}</td>
                    <td className="p-4 text-xs">{item.hoc_vien.so_dien_thoai || '—'}</td>
                    <td className="p-4 text-center">
                      <input type="radio" disabled name={`attendance-${item.hoc_vien.ma_hoc_vien}`} className="w-4 h-4 text-indigo-600 accent-indigo-600 cursor-not-allowed" />
                    </td>
                    <td className="p-4 text-center">
                      <input type="radio" disabled name={`attendance-${item.hoc_vien.ma_hoc_vien}`} className="w-4 h-4 text-indigo-600 accent-indigo-600 cursor-not-allowed" />
                    </td>
                    <td className="p-4">
                      <input type="text" disabled placeholder="Tính năng ghi nhận xét sẽ mở ở phase tiếp theo..." className="w-full px-2 py-1 bg-gray-50 border rounded text-xs text-gray-400 cursor-not-allowed" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}