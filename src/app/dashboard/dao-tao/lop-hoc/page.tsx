'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaSearch, FaPlus, FaEdit, FaTrash, FaSpinner, 
  FaCalendarAlt, FaDoorOpen, FaBookOpen, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';

interface KhoaHoc {
  ma_khoa_hoc: number;
  ten_khoa_hoc: string;
}

interface PhongHoc {
  ma_phong_hoc: number;
  ten_phong_hoc: string;
}

interface LopHoc {
  ma_lop_hoc: number;
  ten_lop: string;
  si_so_toi_da: number | null;
  ngay_khai_giang: string | null;
  ngay_ket_thuc: string | null;
  ma_phong_hoc: number;
  ma_khoa_hoc: number;
  khoa_hoc: KhoaHoc;
  phong_hoc: PhongHoc;
  tham_gia?: any[];
  phan_cong_giang_day?: any[];
}

export default function LopHocPage() {
  const [lopHocList, setLopHocList] = useState<LopHoc[]>([]);
  const [khoaHocList, setKhoaHocList] = useState<KhoaHoc[]>([]);
  const [phongHocList, setPhongHocList] = useState<PhongHoc[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    ten_lop: '',
    si_so_toi_da: '',
    ngay_khai_giang: '',
    ngay_ket_thuc: '',
    ma_khoa_hoc: '',
    ma_phong_hoc: '',
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLopHoc = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dao-tao/lop-hoc?search=${encodeURIComponent(search)}&page=${page}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setLopHocList(data.items);
        setTotalPages(data.meta.totalPages);
        setTotalItems(data.meta.total);
      } else {
        showToast('Không thể tải danh sách lớp học', 'error');
      }
    } catch (error) {
      showToast('Đã xảy ra lỗi kết nối', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const res = await fetch('/api/dao-tao/lop-hoc?type=metadata');
      if (res.ok) {
        const data = await res.json();
        setKhoaHocList(data.khoaHoc);
        setPhongHocList(data.phongHoc);
      }
    } catch (error) {
      console.error('Lỗi lấy metadata cấu hình', error);
    }
  };

  useEffect(() => {
    fetchLopHoc();
  }, [page]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLopHoc();
  };

  const openCreateModal = () => {
    setModalType('create');
    setFormData({
      ten_lop: '',
      si_so_toi_da: '30',
      ngay_khai_giang: '',
      ngay_ket_thuc: '',
      ma_khoa_hoc: khoaHocList[0]?.ma_khoa_hoc?.toString() || '',
      ma_phong_hoc: phongHocList[0]?.ma_phong_hoc?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (lop: LopHoc) => {
    setModalType('edit');
    setSelectedId(lop.ma_lop_hoc);
    setFormData({
      ten_lop: lop.ten_lop,
      si_so_toi_da: lop.si_so_toi_da?.toString() || '',
      ngay_khai_giang: lop.ngay_khai_giang ? lop.ngay_khai_giang.substring(0, 10) : '',
      ngay_ket_thuc: lop.ngay_ket_thuc ? lop.ngay_ket_thuc.substring(0, 10) : '',
      ma_khoa_hoc: lop.ma_khoa_hoc.toString(),
      ma_phong_hoc: lop.ma_phong_hoc.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ten_lop || !formData.ma_khoa_hoc || !formData.ma_phong_hoc) {
      showToast('Vui lòng điền các thông tin bắt buộc', 'error');
      return;
    }

    try {
      let res;
      if (modalType === 'create') {
        res = await fetch('/api/dao-tao/lop-hoc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('/api/dao-tao/lop-hoc', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedId, ...formData }),
        });
      }

      if (res.ok) {
        showToast(modalType === 'create' ? 'Tạo lớp thành công!' : 'Cập nhật thành công!', 'success');
        setIsModalOpen(false);
        fetchLopHoc();
      } else {
        const err = await res.json();
        showToast(err.message || 'Thao tác thất bại', 'error');
      }
    } catch (error) {
      showToast('Lỗi hệ thống không mong muốn', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn chắc chắn có muốn xóa lớp học này không?')) return;
    try {
      const res = await fetch(`/api/dao-tao/lop-hoc?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Xóa lớp học thành công', 'success');
        fetchLopHoc();
      } else {
        const err = await res.json();
        showToast(err.message || 'Xóa thất bại', 'error');
      }
    } catch (error) {
      showToast('Lỗi hệ thống khi xóa', 'error');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-xl text-white font-medium ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Lớp Học</h1>
          <p className="text-gray-500 text-sm mt-0.5">Danh sách, tạo mới, chỉnh sửa thông tin các lớp học thuộc trung tâm.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 shadow-sm transition-all"
        >
          <FaPlus size={12} />
          <span>Thêm lớp học mới</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center">
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-md">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
              <FaSearch size={13} />
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên lớp học..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>
          <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white text-sm px-4 py-2 rounded-lg transition-all">
            Tìm kiếm
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <FaSpinner className="animate-spin text-blue-600" size={30} />
            <span className="text-sm text-gray-500">Đang đồng bộ dữ liệu...</span>
          </div>
        ) : lopHocList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
            <FaBookOpen size={36} className="text-gray-300" />
            <h3 className="font-semibold text-gray-700">Dữ liệu trống</h3>
            <p className="text-sm text-gray-400 max-w-xs">Không tìm thấy lớp học nào khớp với điều kiện tìm kiếm.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-5">Tên Lớp học</th>
                  <th className="py-3 px-5">Khóa học</th>
                  <th className="py-3 px-5">Phòng học</th>
                  <th className="py-3 px-5">Sĩ số giới hạn</th>
                  <th className="py-3 px-5">Ngày khai giảng</th>
                  <th className="py-3 px-5">Thống kê cơ bản</th>
                  <th className="py-3 px-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {lopHocList.map((lop) => (
                  <tr key={lop.ma_lop_hoc} className="hover:bg-gray-50/70 transition-all">
                    <td className="py-3.5 px-5 font-semibold text-blue-600 hover:underline">
                      <Link href={`/dashboard/dao-tao/lop-hoc/${lop.ma_lop_hoc}`}>{lop.ten_lop}</Link>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="flex items-center gap-1.5"><FaBookOpen className="text-gray-400" size={12} />{lop.khoa_hoc?.ten_khoa_hoc}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="flex items-center gap-1.5"><FaDoorOpen className="text-gray-400" size={12} />{lop.phong_hoc?.ten_phong_hoc}</span>
                    </td>
                    <td className="py-3.5 px-5 font-mono">{lop.si_so_toi_da || 'Vô hạn'}</td>
                    <td className="py-3.5 px-5 text-gray-500">
                      {lop.ngay_khai_giang ? new Date(lop.ngay_khai_giang).toLocaleDateString('vi-VN') : '---'}
                    </td>
                    <td className="py-3.5 px-5 space-x-1.5">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">{lop.tham_gia?.length || 0} Học viên</span>
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-xs font-medium">{lop.phan_cong_giang_day?.length || 0} GV</span>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-1 whitespace-nowrap">
                      <button onClick={() => openEditModal(lop)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded transition-all">
                        <FaEdit size={14} />
                      </button>
                      <button onClick={() => handleDelete(lop.ma_lop_hoc)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition-all">
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && lopHocList.length > 0 && (
          <div className="bg-white px-5 py-4 border-t flex items-center justify-between text-sm text-gray-500">
            <div>Hiển thị <span className="font-semibold text-gray-700">{lopHocList.length}</span> trên tổng số <span className="font-semibold text-gray-700">{totalItems}</span> bản ghi.</div>
            <div className="flex items-center gap-1.5">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-40">
                <FaChevronLeft size={10} />
              </button>
              <span className="px-3 py-1.5 border rounded-lg bg-gray-50 text-gray-700 font-medium">{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-40">
                <FaChevronRight size={10} />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{modalType === 'create' ? 'Tạo Lớp học mới' : 'Chỉnh sửa Lớp học'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên lớp học <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.ten_lop}
                  onChange={(e) => setFormData({ ...formData, ten_lop: e.target.value })}
                  placeholder="Nhập tên lớp học..."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Khóa học <span className="text-red-500">*</span></label>
                  <select
                    value={formData.ma_khoa_hoc}
                    onChange={(e) => setFormData({ ...formData, ma_khoa_hoc: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {khoaHocList.map(k => <option key={k.ma_khoa_hoc} value={k.ma_khoa_hoc}>{k.ten_khoa_hoc}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phòng học <span className="text-red-500">*</span></label>
                  <select
                    value={formData.ma_phong_hoc}
                    onChange={(e) => setFormData({ ...formData, ma_phong_hoc: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {phongHocList.map(p => <option key={p.ma_phong_hoc} value={p.ma_phong_hoc}>{p.ten_phong_hoc}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sĩ số tối đa</label>
                <input
                  type="number"
                  value={formData.si_so_toi_da}
                  onChange={(e) => setFormData({ ...formData, si_so_toi_da: e.target.value })}
                  placeholder="Bỏ trống nếu không giới hạn"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày khai giảng</label>
                  <input
                    type="date"
                    value={formData.ngay_khai_giang}
                    onChange={(e) => setFormData({ ...formData, ngay_khai_giang: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày bế giảng</label>
                  <input
                    type="date"
                    value={formData.ngay_ket_thuc}
                    onChange={(e) => setFormData({ ...formData, ngay_ket_thuc: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end gap-2 -mx-5 -mb-5 bg-gray-50 p-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}