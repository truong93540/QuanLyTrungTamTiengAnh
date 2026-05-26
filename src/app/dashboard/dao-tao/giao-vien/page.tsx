'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface ChucVu { ma_chuc_vu: number; ten_chuc_vu: string; }
interface PhongBan { ma_phong_ban: number; ten_phong_ban: string; }
interface LopHoc { ma_lop_hoc: number; ten_lop: string; }
interface BangCap { ma_bang_cap: number; ten_bang_cap: string; }

interface GiaoVien {
  ma_giao_vien: number;
  ho_ten: string;
  ngay_sinh?: string;
  gioi_tinh?: string;
  so_dien_thoai?: string;
  email?: string;
  dia_chi?: string;
  ma_chuc_vu: number;
  ma_phong_ban: number;
  chuc_vu: ChucVu;
  phong_ban: PhongBan;
  tai_khoan?: { ten_dang_nhap: string; trang_thai: string };
  hop_dong?: any[];
  ho_so_bang?: any[];
  phan_cong_giang_day?: any[];
}

export default function QuanLyGiaoVienPage() {
  // States quản lý dữ liệu danh sách & phân trang
  const [giaoViens, setGiaoViens] = useState<GiaoVien[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // States quản lý bộ lọc tìm kiếm
  const [search, setSearch] = useState('');
  const [filterChucVu, setFilterChucVu] = useState('');
  const [filterPhongBan, setFilterPhongBan] = useState('');

  // States danh mục bổ trợ (Metadata)
  const [metadata, setMetadata] = useState<{ chucVus: ChucVu[]; phongBans: PhongBan[]; lopHocs: LopHoc[]; bangCaps: BangCap[] }>({
    chucVus: [], phongBans: [], lopHocs: [], bangCaps: []
  });

  // States điều khiển Modal Form & Chi tiết
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<GiaoVien | null>(null);

  // States lưu giá trị Form nhập liệu độc lập
  const [formValues, setFormValues] = useState({
    ho_ten: '', ngay_sinh: '', gioi_tinh: 'Nam', so_dien_thoai: '', email: '', dia_chi: '',
    ma_chuc_vu: '', ma_phong_ban: '',
    tai_khoan_user: '', tai_khoan_pass: '',
    ma_bang_cap: '', noi_cap: '', ngay_cap: '',
    so_hop_dong: '', luong_co_ban: '', ten_cong_viec: '',
    selected_lops: [] as number[]
  });

  // Fetch dữ liệu danh sách giáo viên
  const fetchGiaoViens = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dao-tao/giao-vien?page=${page}&search=${search}&ma_chuc_vu=${filterChucVu}&ma_phong_ban=${filterPhongBan}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGiaoViens(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      alert(err.message || 'Không thể tải danh sách giáo viên');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterChucVu, filterPhongBan]);

  // Fetch dữ liệu Metadata danh mục
  const fetchMetadata = async () => {
    try {
      const res = await fetch('/api/dao-tao/giao-vien?meta=true');
      const data = await res.json();
      if (res.ok) setMetadata(data);
    } catch (err) {
      console.error('Lỗi lấy danh mục metadata:', err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchGiaoViens();
  }, [fetchGiaoViens]);

  // Mở modal tạo mới hoặc cập nhật thông tin
  const openFormModal = (teacher: GiaoVien | null = null) => {
    if (teacher) {
      setSelectedTeacher(teacher);
      setFormValues({
        ho_ten: teacher.ho_ten,
        ngay_sinh: teacher.ngay_sinh ? teacher.ngay_sinh.substring(0, 10) : '',
        gioi_tinh: teacher.gioi_tinh || 'Nam',
        so_dien_thoai: teacher.so_dien_thoai || '',
        email: teacher.email || '',
        dia_chi: teacher.dia_chi || '',
        ma_chuc_vu: String(teacher.ma_chuc_vu),
        ma_phong_ban: String(teacher.ma_phong_ban),
        tai_khoan_user: teacher.tai_khoan?.ten_dang_nhap || '',
        tai_khoan_pass: '',
        ma_bang_cap: String(teacher.ho_so_bang?.[0]?.ma_bang_cap || ''),
        noi_cap: teacher.ho_so_bang?.[0]?.noi_cap || '',
        ngay_cap: teacher.ho_so_bang?.[0]?.ngay_cap ? teacher.ho_so_bang[0].ngay_cap.substring(0, 10) : '',
        so_hop_dong: teacher.hop_dong?.[0]?.so_hop_dong || '',
        luong_co_ban: String(teacher.hop_dong?.[0]?.luong_co_ban || ''),
        ten_cong_viec: teacher.hop_dong?.[0]?.ten_cong_viec || '',
        selected_lops: teacher.phan_cong_giang_day?.map((p: any) => p.ma_lop_hoc) || []
      });
    } else {
      setSelectedTeacher(null);
      setFormValues({
        ho_ten: '', ngay_sinh: '', gioi_tinh: 'Nam', so_dien_thoai: '', email: '', dia_chi: '',
        ma_chuc_vu: metadata.chucVus[0]?.ma_chuc_vu ? String(metadata.chucVus[0].ma_chuc_vu) : '',
        ma_phong_ban: metadata.phongBans[0]?.ma_phong_ban ? String(metadata.phongBans[0].ma_phong_ban) : '',
        tai_khoan_user: '', tai_khoan_pass: '',
        ma_bang_cap: '', noi_cap: '', ngay_cap: '',
        so_hop_dong: '', luong_co_ban: '', ten_cong_viec: '',
        selected_lops: []
      });
    }
    setIsModalOpen(true);
  };

  // Mở modal xem thông tin chi tiết
  const openDetailModal = async (id: number) => {
    try {
      const res = await fetch(`/api/dao-tao/giao-vien?id=${id}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedTeacher(data);
        setIsDetailOpen(true);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Không thể tải chi tiết giáo viên');
    }
  };

  // Xử lý Xóa giáo viên
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa giáo viên này cùng toàn bộ thông tin tài khoản, hợp đồng, bằng cấp liên quan?')) return;
    try {
      const res = await fetch(`/api/dao-tao/giao-vien?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert(data.message);
      fetchGiaoViens();
    } catch (err: any) {
      alert(err.message || 'Xóa thất bại');
    }
  };

  // Xử lý nộp dữ liệu Form (Submit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.ho_ten || !formValues.ma_chuc_vu || !formValues.ma_phong_ban) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Đóng gói cấu trúc dữ liệu gửi lên API khớp với GiaoVienInput
    const payload: any = {
      ho_ten: formValues.ho_ten,
      ngay_sinh: formValues.ngay_sinh || null,
      gioi_tinh: formValues.gioi_tinh,
      so_dien_thoai: formValues.so_dien_thoai || null,
      email: formValues.email || null,
      dia_chi: formValues.dia_chi || null,
      ma_chuc_vu: Number(formValues.ma_chuc_vu),
      ma_phong_ban: Number(formValues.ma_phong_ban),
      ma_lop_hocs: formValues.selected_lops
    };

    if (formValues.tai_khoan_user) {
      payload.tai_khoan = {
        ten_dang_nhap: formValues.tai_khoan_user,
        mat_khau: formValues.tai_khoan_pass || '123456@', // Mật khẩu mặc định nếu bỏ trống lúc tạo
        trang_thai: 'KICH_HOAT'
      };
    }

    if (formValues.ma_bang_cap) {
      payload.ho_so_bang = [{
        ma_bang_cap: Number(formValues.ma_bang_cap),
        ngay_cap: formValues.ngay_cap || null,
        noi_cap: formValues.noi_cap || null
      }];
    }

    if (formValues.so_hop_dong) {
      payload.hop_dong = [{
        so_hop_dong: formValues.so_hop_dong,
        luong_co_ban: formValues.luong_co_ban ? Number(formValues.luong_co_ban) : null,
        ten_cong_viec: formValues.ten_cong_viec || null
      }];
    }

    try {
      const url = selectedTeacher ? `/api/dao-tao/giao-vien?id=${selectedTeacher.ma_giao_vien}` : '/api/dao-tao/giao-vien';
      const method = selectedTeacher ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(data.message);
      setIsModalOpen(false);
      fetchGiaoViens();
    } catch (err: any) {
      alert(err.message || 'Lỗi xử lý gửi thông tin');
    }
  };

  const toggleClassSelection = (lopId: number) => {
    setFormValues(prev => ({
      ...prev,
      selected_lops: prev.selected_lops.includes(lopId)
        ? prev.selected_lops.filter(id => id !== lopId)
        : [...prev.selected_lops, lopId]
    }));
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 antialiased font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Tiêu đề & Nút Thêm mới */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hệ Thống Quản Lý Giáo Viên</h1>
            <p className="text-sm text-slate-500 mt-0.5">Quản lý thông tin hồ sơ, tài khoản, hợp đồng và lịch phân công giảng dạy.</p>
          </div>
          <button onClick={() => openFormModal(null)} className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            Thêm Giáo Viên Mới
          </button>
        </div>

        {/* Thanh bộ lọc dữ liệu và tìm kiếm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="relative">
            <input type="text" placeholder="Tìm tên, số điện thoại, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-3 pr-3 py-2 text-sm bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <select value={filterChucVu} onChange={(e) => setFilterChucVu(e.target.value)} className="w-full px-3 py-2 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
            <option value="">-- Tất cả Chức vụ --</option>
            {metadata.chucVus.map(c => <option key={c.ma_chuc_vu} value={c.ma_chuc_vu}>{c.ten_chuc_vu}</option>)}
          </select>
          <select value={filterPhongBan} onChange={(e) => setFilterPhongBan(e.target.value)} className="w-full px-3 py-2 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
            <option value="">-- Tất cả Phòng ban --</option>
            {metadata.phongBans.map(p => <option key={p.ma_phong_ban} value={p.ma_phong_ban}>{p.ten_phong_ban}</option>)}
          </select>
          <button onClick={() => { setPage(1); fetchGiaoViens(); }} className="w-full py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-sm transition-all">Lọc Dữ Liệu</button>
        </div>

        {/* Bảng Hiển Thị Danh Sách Giáo Viên */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Mã GV</th>
                  <th className="px-5 py-3.5">Họ và Tên</th>
                  <th className="px-5 py-3.5">Liên hệ</th>
                  <th className="px-5 py-3.5">Chức vụ / Phòng ban</th>
                  <th className="px-5 py-3.5">Tài khoản liên kết</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-10 text-slate-400 font-medium animate-pulse">Đang tải dữ liệu...</td></tr>
                ) : giaoViens.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-slate-400 italic">Không tìm thấy giáo viên nào phù hợp</td></tr>
                ) : (
                  giaoViens.map((gv) => (
                    <tr key={gv.ma_giao_vien} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-400">#{gv.ma_giao_vien}</td>
                      <td className="px-5 py-4 font-bold text-blue-600 cursor-pointer hover:text-blue-700 hover:underline transition-colors" onClick={() => openDetailModal(gv.ma_giao_vien)}>{gv.ho_ten}</td>
                      <td className="px-5 py-4 space-y-0.5">
                        <p className="text-slate-900 font-medium">{gv.email || '—'}</p>
                        <p className="text-xs text-slate-400 font-mono">{gv.so_dien_thoai || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-semibold border border-green-100">{gv.chuc_vu?.ten_chuc_vu}</span>
                          <span className="inline-flex items-center px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-semibold border border-purple-100">{gv.phong_ban?.ten_phong_ban}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {gv.tai_khoan ? (
                          <span className="inline-block items-center font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200">{gv.tai_khoan.ten_dang_nhap}</span>
                        ) : (
                          <span className="inline-block items-center text-rose-500 font-medium text-xs bg-rose-50 px-2 py-0.5 rounded border border-rose-100">Chưa cấp</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openFormModal(gv)} className="text-amber-600 hover:text-amber-700 font-bold text-xs bg-amber-50 hover:bg-amber-100/70 border border-amber-200 px-2.5 py-1 rounded-md transition-all">Sửa</button>
                          <button onClick={() => handleDelete(gv.ma_giao_vien)} className="text-rose-600 hover:text-rose-700 font-bold text-xs bg-rose-50 hover:bg-rose-100/70 border border-rose-200 px-2.5 py-1 rounded-md transition-all">Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Điều khiển phân trang */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-5 py-4 bg-slate-50/50 border-t border-slate-100 text-slate-500 text-sm">
            <p className="font-medium text-slate-600">Tổng số giáo viên: <span className="font-bold text-slate-900">{total}</span> nhân sự</p>
            <div className="flex items-center gap-1.5">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 shadow-sm disabled:opacity-40 disabled:hover:bg-white transition-all">Trước</button>
              <span className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">Trang {page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 shadow-sm disabled:opacity-40 disabled:hover:bg-white transition-all">Sau</button>
            </div>
          </div>
        </div>

        {/* MODAL DIALOG: THÊM / CẬP NHẬT GIÁO VIÊN */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
              
              {/* Header Modal */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-lg font-bold text-slate-900">{selectedTeacher ? 'Cập Nhật Thông Tin Giáo Viên' : 'Thêm Mới Giáo Viên'}</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xl transition-all">×</button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                {/* Thông tin cá nhân cơ bản */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50/50 px-2.5 py-1 rounded inline-block">1. Thông tin cá nhân cơ bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Họ và Tên <span className="text-rose-500">*</span></label>
                      <input type="text" required value={formValues.ho_ten} onChange={e => setFormValues({...formValues, ho_ten: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Ngày Sinh</label>
                      <input type="date" value={formValues.ngay_sinh} onChange={e => setFormValues({...formValues, ngay_sinh: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Giới Tính</label>
                      <select value={formValues.gioi_tinh || 'Nam'} onChange={e => setFormValues({...formValues, gioi_tinh: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Số Điện Thoại</label>
                      <input type="text" value={formValues.so_dien_thoai} onChange={e => setFormValues({...formValues, so_dien_thoai: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Email (Unique) <span className="text-rose-500">*</span></label>
                      <input type="email" required value={formValues.email} onChange={e => setFormValues({...formValues, email: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Địa Chỉ</label>
                      <input type="text" value={formValues.dia_chi} onChange={e => setFormValues({...formValues, dia_chi: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                </div>

                {/* Phân công Đơn vị chức vụ */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50/50 px-2.5 py-1 rounded inline-block">2. Phân công Đơn vị & Chức vụ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Chức Vụ Hệ Thống <span className="text-rose-500">*</span></label>
                      <select required value={formValues.ma_chuc_vu} onChange={e => setFormValues({...formValues, ma_chuc_vu: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        {metadata.chucVus.map(c => <option key={c.ma_chuc_vu} value={c.ma_chuc_vu}>{c.ten_chuc_vu}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Phòng Ban Đơn Vị <span className="text-rose-500">*</span></label>
                      <select required value={formValues.ma_phong_ban} onChange={e => setFormValues({...formValues, ma_phong_ban: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        {metadata.phongBans.map(p => <option key={p.ma_phong_ban} value={p.ma_phong_ban}>{p.ten_phong_ban}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tích hợp thông tin Tạo Tài Khoản */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-50/50 px-2.5 py-1 rounded inline-block">3. Cấp Tài Khoản Hệ Thống (Quan hệ TaiKhoan)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Tên đăng nhập</label>
                      <input type="text" value={formValues.tai_khoan_user} onChange={e => setFormValues({...formValues, tai_khoan_user: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Bỏ trống nếu không cấp tài khoản" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Mật khẩu mới</label>
                      <input type="password" value={formValues.tai_khoan_pass} onChange={e => setFormValues({...formValues, tai_khoan_pass: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder={selectedTeacher ? "Nhập nếu muốn đổi mật khẩu" : "Mặc định: 123456@"} />
                    </div>
                  </div>
                </div>

                {/* Tích hợp Hợp đồng & Bằng cấp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50/50 px-2.5 py-1 rounded inline-block">4. Hợp Đồng Lao Động đầu tiên</h3>
                    <div className="space-y-2">
                      <input type="text" placeholder="Số hợp đồng (Vd: HD-2026-001)" value={formValues.so_hop_dong} onChange={e => setFormValues({...formValues, so_hop_dong: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                      <input type="number" placeholder="Lương cơ bản (VND)" value={formValues.luong_co_ban} onChange={e => setFormValues({...formValues, luong_co_ban: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                      <input type="text" placeholder="Tên công việc chính đảm nhận" value={formValues.ten_cong_viec} onChange={e => setFormValues({...formValues, ten_cong_viec: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-cyan-600 uppercase tracking-wider bg-cyan-50/50 px-2.5 py-1 rounded inline-block">5. Hồ Sơ Bằng Cấp chính</h3>
                    <div className="space-y-2">
                      <select value={formValues.ma_bang_cap} onChange={e => setFormValues({...formValues, ma_bang_cap: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        <option value="">-- Chọn loại Bằng cấp --</option>
                        {metadata.bangCaps.map(b => <option key={b.ma_bang_cap} value={b.ma_bang_cap}>{b.ten_bang_cap}</option>)}
                      </select>
                      <input type="text" placeholder="Nơi cấp bằng" value={formValues.noi_cap} onChange={e => setFormValues({...formValues, noi_cap: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                      <input type="date" title="Ngày cấp bằng" value={formValues.ngay_cap} onChange={e => setFormValues({...formValues, ngay_cap: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                </div>

                {/* Phân công phụ trách giảng dạy các Lớp học */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50/50 px-2.5 py-1 rounded inline-block">6. Phân Công Giảng Dạy Lớp Học (N-N)</h3>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto border border-slate-200 p-3 bg-slate-50 rounded-xl">
                    {metadata.lopHocs.map(l => {
                      const isChecked = formValues.selected_lops.includes(l.ma_lop_hoc);
                      return (
                        <button key={l.ma_lop_hoc} type="button" onClick={() => toggleClassSelection(l.ma_lop_hoc)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${isChecked ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                          {isChecked ? '✓ ' : '+ '} {l.ten_lop}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nút bấm điều phối form */}
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 sticky bottom-0 bg-white z-10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 text-sm font-semibold rounded-lg text-slate-600 bg-white hover:bg-slate-50 shadow-sm transition-all">Hủy</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-semibold rounded-lg text-white shadow-sm transition-all">Lưu lại</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DIALOG: XEM CHI TIẾT GIÁO VIÊN */}
        {isDetailOpen && selectedTeacher && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto flex flex-col space-y-5">
              
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedTeacher.ho_ten}</h2>
                  <p className="text-xs font-mono font-semibold text-slate-400 mt-0.5">Mã Số Giáo Viên: #{selectedTeacher.ma_giao_vien}</p>
                </div>
                <button onClick={() => setIsDetailOpen(false)} className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xl transition-all">×</button>
              </div>

              <div className="space-y-5 text-sm text-slate-600 flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
                  <p className="flex justify-between sm:justify-start gap-2"><b>Giới tính:</b> <span className="text-slate-900">{selectedTeacher.gioi_tinh || '—'}</span></p>
                  <p className="flex justify-between sm:justify-start gap-2"><b>Ngày sinh:</b> <span className="text-slate-900">{selectedTeacher.ngay_sinh ? new Date(selectedTeacher.ngay_sinh).toLocaleDateString('vi-VN') : '—'}</span></p>
                  <p className="flex justify-between sm:justify-start gap-2"><b>Số điện thoại:</b> <span className="text-slate-900 font-mono">{selectedTeacher.so_dien_thoai || '—'}</span></p>
                  <p className="flex justify-between sm:justify-start gap-2"><b>Email:</b> <span className="text-slate-900 font-medium">{selectedTeacher.email || '—'}</span></p>
                  <p className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-0.5 sm:gap-2 border-t border-slate-200/50 pt-2 mt-1"><b>Địa chỉ cư trú:</b> <span className="text-slate-900">{selectedTeacher.dia_chi || '—'}</span></p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1 bg-slate-50/50 border border-slate-100 p-3 rounded-lg">
                    <h4 className="font-bold text-slate-400 uppercase text-xxs tracking-wider">Chức vụ & Phòng ban</h4>
                    <p className="text-slate-700">Phòng: <span className="font-semibold text-slate-900">{selectedTeacher.phong_ban?.ten_phong_ban}</span></p>
                    <p className="text-slate-700">Chức vụ: <span className="font-semibold text-slate-900">{selectedTeacher.chuc_vu?.ten_chuc_vu}</span></p>
                  </div>
                  <div className="space-y-1 bg-slate-50/50 border border-slate-100 p-3 rounded-lg">
                    <h4 className="font-bold text-slate-400 uppercase text-xxs tracking-wider">Tài khoản truy cập</h4>
                    <p className="text-slate-700">Username: <span className="font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-xs">{selectedTeacher.tai_khoan?.ten_dang_nhap || 'Chưa cấp'}</span></p>
                    <p className="text-slate-700">Trạng thái: <span className="font-medium text-slate-900">{selectedTeacher.tai_khoan?.trang_thai || '—'}</span></p>
                  </div>
                </div>

                {/* Hiển thị chi tiết danh sách bằng cấp */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wide">Hồ Sơ Bằng Cấp Nhân Sự</h4>
                  {selectedTeacher.ho_so_bang && selectedTeacher.ho_so_bang.length > 0 ? (
                    <div className="space-y-2">
                      {selectedTeacher.ho_so_bang.map((b: any, idx: number) => (
                        <div key={idx} className="border-l-4 border-blue-500 pl-3 py-2 bg-blue-50/30 rounded-r-xl border border-slate-100 border-l-0">
                          <p className="font-bold text-slate-900">{b.bang_cap?.ten_bang_cap}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Nơi cấp: <span className="font-medium text-slate-700">{b.noi_cap || 'Không ghi nhận'}</span> | Ngày cấp: <span className="font-medium text-slate-700">{b.ngay_cap ? new Date(b.ngay_cap).toLocaleDateString('vi-VN') : '—'}</span></p>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs italic text-slate-400 pl-1">Chưa bổ sung thông tin hồ sơ bằng cấp chuyên môn</p>}
                </div>

                {/* Hiển thị chi tiết danh sách hợp đồng */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wide">Hợp Đồng Lao Động Hiện Hành</h4>
                  {selectedTeacher.hop_dong && selectedTeacher.hop_dong.length > 0 ? (
                    <div className="space-y-2">
                      {selectedTeacher.hop_dong.map((h: any, idx: number) => (
                        <div key={idx} className="border-l-4 border-emerald-500 pl-3 py-2.5 bg-emerald-50/30 rounded-r-xl border border-slate-100 border-l-0 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                          <p className="font-bold text-slate-900 sm:col-span-2 text-sm mb-0.5">Số HĐ: {h.so_hop_dong}</p>
                          <p className="text-slate-600"><b>Công việc:</b> <span className="text-slate-800 font-medium">{h.ten_cong_viec || '—'}</span></p>
                          <p className="text-slate-600"><b>Lương cơ bản:</b> <span className="text-emerald-700 font-bold">{h.luong_co_ban ? Number(h.luong_co_ban).toLocaleString('vi-VN') + ' VND' : '—'}</span></p>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs italic text-slate-400 pl-1">Chưa thiết lập dữ liệu hợp đồng lao động ký kết</p>}
                </div>

                {/* Hiển thị danh sách lớp phụ trách */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wide">Danh Sách Lớp Phụ Trách Giảng Dạy</h4>
                  <div className="flex flex-wrap gap-1.5 pl-0.5">
                    {selectedTeacher.phan_cong_giang_day && selectedTeacher.phan_cong_giang_day.length > 0 ? (
                      selectedTeacher.phan_cong_giang_day.map((p: any, idx: number) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
                          {p.lop_hoc?.ten_lop}
                        </span>
                      ))
                    ) : <p className="text-xs italic text-slate-400">Giáo viên chưa được phân công quản lý hoặc giảng dạy lớp nào</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button onClick={() => setIsDetailOpen(false)} className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 shadow-sm transition-all">Đóng cửa sổ</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}