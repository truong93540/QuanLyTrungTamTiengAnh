'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface HocVien {
  ma_hoc_vien: number;
  ho_ten: string;
  so_dien_thoai: string | null;
  email: string | null;
}

interface ThamGiaLop {
  ma_tham_gia_lop: number;
  ma_hoc_vien: number;
  ngay_dang_ky: string;
  trang_thai: string | null;
  hoc_vien: HocVien;
}

export default function LopHocHocVienPage() {
  const params = useParams();
  const router = useRouter();
  const maLopHoc = params.id as string;

  const [danhSachInClass, setDanhSachInClass] = useState<ThamGiaLop[]>([]);
  const [danhSachKhaDung, setDanhSachKhaDung] = useState<HocVien[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInClass, setSearchInClass] = useState<string>('');
  const [searchModalKeyword, setSearchModalKeyword] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchHocVienInClass = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dao-tao/lop-hoc/${maLopHoc}/hoc-vien`);
      const data = await res.json();
      if (data.success) {
        setDanhSachInClass(data.data);
      }
    } catch (e) {
      triggerToast('Không thể tải danh sách học viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchHocVienKhaDung = async (keyword: string = '') => {
    try {
      const res = await fetch(`/api/dao-tao/lop-hoc/${maLopHoc}/hoc-vien?type=available&q=${keyword}`);
      const data = await res.json();
      if (data.success) {
        setDanhSachKhaDung(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (maLopHoc) {
      fetchHocVienInClass();
    }
  }, [maLopHoc]);

  useEffect(() => {
    if (showModal) {
      fetchHocVienKhaDung(searchModalKeyword);
    }
  }, [showModal, searchModalKeyword]);

  const handleAddHocVien = async (maHocVien: number) => {
    try {
      const res = await fetch(`/api/dao-tao/lop-hoc/${maLopHoc}/hoc-vien`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ma_hoc_vien: maHocVien }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Thêm học viên vào lớp thành công');
        fetchHocVienInClass();
        fetchHocVienKhaDung(searchModalKeyword);
      } else {
        triggerToast(data.error || 'Có lỗi xảy ra', 'error');
      }
    } catch (e) {
      triggerToast('Lỗi hệ thống', 'error');
    }
  };

  const handleRemoveHocVien = async (maHocVien: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa học viên này khỏi lớp?')) return;
    try {
      const res = await fetch(`/api/dao-tao/lop-hoc/${maLopHoc}/hoc-vien?maHocVien=${maHocVien}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Xóa học viên thành công');
        fetchHocVienInClass();
      } else {
        triggerToast(data.error || 'Không thể xóa học viên', 'error');
      }
    } catch (e) {
      triggerToast('Lỗi hệ thống', 'error');
    }
  };

  const filteredInClass = danhSachInClass.filter((item) =>
    item.hoc_vien.ho_ten.toLowerCase().includes(searchInClass.toLowerCase()) ||
    (item.hoc_vien.so_dien_thoai && item.hoc_vien.so_dien_thoai.includes(searchInClass))
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý Học viên trong lớp</h1>
          <p className="text-sm text-gray-500">Mã lớp hiện tại: #{maLopHoc}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.back()} className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50">
            Quay lại
          </button>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700">
            Thêm học viên vào lớp
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm nhanh học viên trong lớp (Họ tên, SĐT)..."
          value={searchInClass}
          onChange={(e) => setSearchInClass(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border rounded-md text-sm focus:outline-indigo-600"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-500">Đang tải dữ liệu học viên...</div>
      ) : filteredInClass.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center text-gray-400">
          Chưa có học viên nào tham gia hoặc không tìm thấy kết quả phù hợp.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full bg-white divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="p-4">Họ và tên</th>
                <th className="p-4">Số điện thoại</th>
                <th className="p-4">Email</th>
                <th className="p-4">Ngày tham gia</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInClass.map((item) => (
                <tr key={item.ma_tham_gia_lop} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{item.hoc_vien.ho_ten}</td>
                  <td className="p-4 text-gray-600">{item.hoc_vien.so_dien_thoai || '—'}</td>
                  <td className="p-4 text-gray-600">{item.hoc_vien.email || '—'}</td>
                  <td className="p-4 text-gray-500">{new Date(item.ngay_dang_ky).toLocaleDateString('vi-VN')}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {item.trang_thai || 'Đang học'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleRemoveHocVien(item.ma_hoc_vien)} className="text-red-600 hover:text-red-900 font-medium text-xs">
                      Xóa khỏi lớp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Thêm học viên mới vào lớp</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div className="p-5 border-b bg-gray-50">
              <input
                type="text"
                placeholder="Tìm kiếm học viên trung tâm (Tên hoặc SĐT)..."
                value={searchModalKeyword}
                onChange={(e) => setSearchModalKeyword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:outline-indigo-600"
              />
            </div>
            <div className="p-5 divide-y overflow-y-auto flex-1">
              {danhSachKhaDung.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-6">Không thấy học viên khả dụng hợp lệ.</p>
              ) : (
                danhSachKhaDung.map((hv) => (
                  <div key={hv.ma_hoc_vien} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{hv.ho_ten}</p>
                      <p className="text-xs text-gray-500">{hv.so_dien_thoai || 'Không có SĐT'}</p>
                    </div>
                    <button onClick={() => handleAddHocVien(hv.ma_hoc_vien)} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-semibold">
                      Thêm vào
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}