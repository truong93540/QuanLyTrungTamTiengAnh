'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface GiaoVien {
  ma_giao_vien: number;
  ho_ten: string;
}

interface BuoiHoc {
  ma_buoi_hoc: number;
  ngay_hoc: string;
  noi_dung_hoc: string | null;
  ma_giao_vien: number;
  giao_vien: GiaoVien;
}

export default function LopHocBuoiHocPage() {
  const params = useParams();
  const router = useRouter();
  const maLopHoc = params.id as string;

  const [danhSachBuoiHoc, setDanhSachBuoiHoc] = useState<BuoiHoc[]>([]);
  const [danhSachGiaoVien, setDanhSachGiaoVien] = useState<GiaoVien[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [currentBuoiHocId, setCurrentBuoiHocId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    ngay_hoc: '',
    gio_hoc: '08:00',
    noi_dung_hoc: '',
    ma_giao_vien: '',
  });

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBuoiHoc = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dao-tao/buoi-hoc?maLopHoc=${maLopHoc}`);
      const data = await res.json();
      if (data.success) setDanhSachBuoiHoc(data.data);
    } catch (e) {
      triggerToast('Lỗi khi tải danh sách buổi học', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchGiaoVien = async () => {
    try {
      const res = await fetch('/api/dao-tao/buoi-hoc?action=getGiaoVien');
      const data = await res.json();
      if (data.success) setDanhSachGiaoVien(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (maLopHoc) {
      fetchBuoiHoc();
      fetchGiaoVien();
    }
  }, [maLopHoc]);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentBuoiHocId(null);
    setFormData({ ngay_hoc: '', gio_hoc: '08:00', noi_dung_hoc: '', ma_giao_vien: danhSachGiaoVien[0]?.ma_giao_vien.toString() || '' });
    setShowModal(true);
  };

  const openEditModal = (bh: BuoiHoc) => {
    setIsEditing(true);
    setCurrentBuoiHocId(bh.ma_buoi_hoc);
    const dateObj = new Date(bh.ngay_hoc);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const min = String(dateObj.getMinutes()).padStart(2, '0');

    setFormData({
      ngay_hoc: `${yyyy}-${mm}-${dd}`,
      gio_hoc: `${hh}:${min}`,
      noi_dung_hoc: bh.noi_dung_hoc || '',
      ma_giao_vien: bh.ma_giao_vien.toString(),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const combineDateTime = new Date(`${formData.ngay_hoc}T${formData.gio_hoc}`);

    if (isNaN(combineDateTime.getTime())) {
      triggerToast('Ngày hoặc giờ không hợp lệ', 'error');
      return;
    }

    const payload = {
      ngay_hoc: combineDateTime.toISOString(),
      noi_dung_hoc: formData.noi_dung_hoc,
      ma_giao_vien: formData.ma_giao_vien,
      ma_lop_hoc: maLopHoc,
    };

    try {
      let res;
      if (isEditing && currentBuoiHocId) {
        res = await fetch('/api/dao-tao/buoi-hoc', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, ma_buoi_hoc: currentBuoiHocId }),
        });
      } else {
        res = await fetch('/api/dao-tao/buoi-hoc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        triggerToast(isEditing ? 'Cập nhật thành công' : 'Thêm buổi học thành công');
        setShowModal(false);
        fetchBuoiHoc();
      } else {
        triggerToast(data.error || 'Thao tác thất bại', 'error');
      }
    } catch (err) {
      triggerToast('Lỗi máy chủ', 'error');
    }
  };

  const handleDelete = async (maBuoiHoc: number) => {
    if (!confirm('Bạn thực sự muốn xóa buổi học này?')) return;
    try {
      const res = await fetch(`/api/dao-tao/buoi-hoc?maBuoiHoc=${maBuoiHoc}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        triggerToast('Xóa buổi học thành công');
        fetchBuoiHoc();
      } else {
        triggerToast(data.error || 'Lỗi khi xóa', 'error');
      }
    } catch (e) {
      triggerToast('Lỗi máy chủ', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch và danh sách Buổi học</h1>
          <p className="text-sm text-gray-500">Thiết lập thời gian biểu, nội dung chi tiết buổi giảng dạy</p>
        </div>
        <button onClick={openCreateModal} className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700">
          Thêm buổi học mới
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Đang tải cấu trúc buổi học...</div>
      ) : danhSachBuoiHoc.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center text-gray-400">
          Lớp học chưa được cấu hình buổi giảng dạy nào. Vui lòng thêm buổi học đầu tiên.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full bg-white divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="p-4">Ngày học</th>
                <th className="p-4">Giờ học</th>
                <th className="p-4">Nội dung / Tên buổi học</th>
                <th className="p-4">Giáo viên phụ trách</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {danhSachBuoiHoc.map((bh) => {
                const dateObj = new Date(bh.ngay_hoc);
                return (
                  <tr key={bh.ma_buoi_hoc} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{dateObj.toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 text-gray-600">
                      {String(dateObj.getHours()).padStart(2, '0')}:{String(dateObj.getMinutes()).padStart(2, '0')}
                    </td>
                    <td className="p-4 text-gray-700 max-w-xs truncate">{bh.noi_dung_hoc || '—'}</td>
                    <td className="p-4 text-indigo-600 font-medium">{bh.giao_vien?.ho_ten}</td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => router.push(`/dashboard/dao-tao/lop-hoc/${maLopHoc}/buoi-hoc/${bh.ma_buoi_hoc}`)} className="text-indigo-600 hover:text-indigo-900 font-medium text-xs">
                        Xem Chi Tiết
                      </button>
                      <button onClick={() => openEditModal(bh)} className="text-amber-600 hover:text-amber-900 font-medium text-xs">
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(bh.ma_buoi_hoc)} className="text-rose-600 hover:text-rose-900 font-medium text-xs">
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{isEditing ? 'Cập nhật thông tin buổi học' : 'Tạo buổi học giảng dạy mới'}</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Ngày học</label>
                <input type="date" required value={formData.ngay_hoc} onChange={(e) => setFormData({ ...formData, ngay_hoc: e.target.value })} className="w-full px-3 py-2 border rounded focus:outline-indigo-600 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Giờ bắt đầu học</label>
                <input type="time" required value={formData.gio_hoc} onChange={(e) => setFormData({ ...formData, gio_hoc: e.target.value })} className="w-full px-3 py-2 border rounded focus:outline-indigo-600 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Giáo viên giảng dạy</label>
                <select required value={formData.ma_giao_vien} onChange={(e) => setFormData({ ...formData, ma_giao_vien: e.target.value })} className="w-full px-3 py-2 border rounded focus:outline-indigo-600 text-sm bg-white">
                  <option value="">-- Chọn giáo viên --</option>
                  {danhSachGiaoVien.map((gv) => (
                    <option key={gv.ma_giao_vien} value={gv.ma_giao_vien}>{gv.ho_ten}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nội dung / Ghi chú buổi học</label>
                <textarea rows={3} value={formData.noi_dung_hoc} onChange={(e) => setFormData({ ...formData, noi_dung_hoc: e.target.value })} className="w-full px-3 py-2 border rounded focus:outline-indigo-600 text-sm" placeholder="Ví dụ: Luyện đề Cam 14 Test 2, Reading section..." />
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border rounded hover:bg-gray-100">Hủy</button>
              <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 font-medium">Lưu lại</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}