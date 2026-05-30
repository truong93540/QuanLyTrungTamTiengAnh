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
  const [giaoViens, setGiaoViens] = useState<GiaoVien[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [filterChucVu, setFilterChucVu] = useState('');
  const [filterPhongBan, setFilterPhongBan] = useState('');

  const [metadata, setMetadata] = useState<{ chucVus: ChucVu[]; phongBans: PhongBan[]; lopHocs: LopHoc[]; bangCaps: BangCap[] }>({
    chucVus: [],
    phongBans: [],
    lopHocs: [],
    bangCaps: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    ho_ten: '',
    ngay_sinh: '',
    gioi_tinh: 'Nam',
    so_dien_thoai: '',
    email: '',
    dia_chi: '',
    ma_chuc_vu: '',
    ma_phong_ban: '',
    tai_khoan: { ten_dang_nhap: '', mat_khau: '', trang_thai: 'KICH_HOAT' },
    ho_so_bang: [] as Array<{ ma_bang_cap: number | string; ten_bang_cap_moi?: string; ngay_cap: string; noi_cap: string; isNewMode?: boolean }>,
    hop_dong: [] as Array<{ so_hop_dong: string; ngay_ky: string; ten_cong_viec: string; tg_thu_viec: string; dong_bao_hiem: boolean; luong_co_ban: string; chi_tiet_phu_cap_text: string; tg_het_hop_dong: string }>,
  });

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  const fetchGiaoViens = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(filterChucVu && { ma_chuc_vu: filterChucVu }),
        ...(filterPhongBan && { ma_phong_ban: filterPhongBan }),
      });
      const res = await fetch(`/api/dao-tao/giao-vien?${query}`);
      const data = await res.json();
      setGiaoViens(data.items || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Lỗi tải danh sách giáo viên:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterChucVu, filterPhongBan]);

  useEffect(() => {
    fetchGiaoViens();
  }, [fetchGiaoViens]);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const res = await fetch('/api/dao-tao/giao-vien?meta=true');
        const data = await res.json();
        setMetadata(data);
      } catch (error) {
        console.error('Lỗi tải danh mục bổ trợ:', error);
      }
    }
    fetchMetadata();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setFormData({
      ho_ten: '',
      ngay_sinh: '',
      gioi_tinh: 'Nam',
      so_dien_thoai: '',
      email: '',
      dia_chi: '',
      ma_chuc_vu: metadata.chucVus[0]?.ma_chuc_vu?.toString() || '',
      ma_phong_ban: metadata.phongBans[0]?.ma_phong_ban?.toString() || '',
      tai_khoan: { ten_dang_nhap: '', mat_khau: '', trang_thai: 'KICH_HOAT' },
      ho_so_bang: [],
      hop_dong: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (id: number) => {
    setModalMode('edit');
    setEditingId(id);
    try {
      const res = await fetch(`/api/dao-tao/giao-vien?id=${id}`);
      const t = await res.json();
      if (t) {
        setFormData({
          ho_ten: t.ho_ten || '',
          ngay_sinh: t.ngay_sinh ? new Date(t.ngay_sinh).toISOString().split('T')[0] : '',
          gioi_tinh: t.gioi_tinh || 'Nam',
          so_dien_thoai: t.so_dien_thoai || '',
          email: t.email || '',
          dia_chi: t.dia_chi || '',
          ma_chuc_vu: t.ma_chuc_vu?.toString() || '',
          ma_phong_ban: t.ma_phong_ban?.toString() || '',
          tai_khoan: {
            ten_dang_nhap: t.tai_khoan?.ten_dang_nhap || '',
            mat_khau: '', 
            trang_thai: t.tai_khoan?.trang_thai || 'KICH_HOAT',
          },
          ho_so_bang: (t.ho_so_bang || []).map((b: any) => ({
            ma_bang_cap: b.ma_bang_cap,
            ngay_cap: b.ngay_cap ? new Date(b.ngay_cap).toISOString().split('T')[0] : '',
            noi_cap: b.noi_cap || '',
            isNewMode: false
          })),
          hop_dong: (t.hop_dong || []).map((hd: any) => {
            let pText = '';
            if (hd.chi_tiet_phu_cap && Array.isArray(hd.chi_tiet_phu_cap)) {
              pText = hd.chi_tiet_phu_cap.map((p: any) => `${p.ten}:${p.soTien}`).join(', ');
            }
            return {
              so_hop_dong: hd.so_hop_dong || '',
              ngay_ky: hd.ngay_ky ? new Date(hd.ngay_ky).toISOString().split('T')[0] : '',
              ten_cong_viec: hd.ten_cong_viec || '',
              tg_thu_viec: hd.tg_thu_viec || '',
              dong_bao_hiem: hd.dong_bao_hiem || false,
              luong_co_ban: hd.luong_co_ban?.toString() || '0',
              chi_tiet_phu_cap_text: pText,
              tg_het_hop_dong: hd.tg_het_hop_dong ? new Date(hd.tg_het_hop_dong).toISOString().split('T')[0] : '',
            };
          }),
        });
        setIsModalOpen(true);
      }
    } catch (error) {
      alert('Lỗi khi tải chi tiết thông tin sửa đổi');
    }
  };

  const handleOpenDetail = async (id: number) => {
    try {
      const res = await fetch(`/api/dao-tao/giao-vien?id=${id}`);
      const data = await res.json();
      setSelectedTeacher(data);
      setIsDetailOpen(true);
    } catch (e) {
      alert('Không lấy được hồ sơ chi tiết giáo viên');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn thực sự muốn xóa vĩnh viễn giáo viên này và các hồ sơ liên quan chứ?')) {
      try {
        const res = await fetch(`/api/dao-tao/giao-vien?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Xóa giáo viên thành công');
          fetchGiaoViens();
        } else {
          const err = await res.json();
          alert(err.error || 'Lỗi xảy ra khi xóa dữ liệu');
        }
      } catch (error) {
        alert('Lỗi kết nối đến máy chủ');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = modalMode === 'add' ? '/api/dao-tao/giao-vien' : `/api/dao-tao/giao-vien?id=${editingId}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(modalMode === 'add' ? 'Thêm mới thành công!' : 'Cập nhật thành công!');
        setIsModalOpen(false);
        fetchGiaoViens();
        const metaRes = await fetch('/api/dao-tao/giao-vien?meta=true');
        const metaData = await metaRes.json();
        setMetadata(metaData);
      } else {
        const err = await res.json();
        alert(err.error || 'Lỗi xử lý dữ liệu');
      }
    } catch (error) {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const addBangRow = () => {
    setFormData({
      ...formData,
      ho_so_bang: [...formData.ho_so_bang, { ma_bang_cap: metadata.bangCaps[0]?.ma_bang_cap || '', ten_bang_cap_moi: '', ngay_cap: '', noi_cap: '', isNewMode: false }],
    });
  };

  const removeBangRow = (index: number) => {
    const updated = [...formData.ho_so_bang];
    updated.splice(index, 1);
    setFormData({ ...formData, ho_so_bang: updated });
  };

  const updateBangRow = (index: number, fields: any) => {
    const updated = [...formData.ho_so_bang];
    updated[index] = { ...updated[index], ...fields };
    setFormData({ ...formData, ho_so_bang: updated });
  };

  const addHopDongRow = () => {
    setFormData({
      ...formData,
      hop_dong: [...formData.hop_dong, { so_hop_dong: '', ngay_ky: '', ten_cong_viec: '', tg_thu_viec: '', dong_bao_hiem: false, luong_co_ban: '0', chi_tiet_phu_cap_text: '', tg_het_hop_dong: '' }],
    });
  };

  const removeHopDongRow = (index: number) => {
    const updated = [...formData.hop_dong];
    updated.splice(index, 1);
    setFormData({ ...formData, hop_dong: updated });
  };

  const updateHopDongRow = (index: number, fields: any) => {
    const updated = [...formData.hop_dong];
    updated[index] = { ...updated[index], ...fields };
    setFormData({ ...formData, hop_dong: updated });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* TIÊU ĐỀ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">HỆ THỐNG QUẢN LÝ GIÁO VIÊN</h1>
          <p className="text-black text-slate-500">Quản lý thông tin hồ sơ, bằng cấp chuyên môn và hợp đồng lao động của cán bộ giảng dạy.</p>
        </div>
        <button onClick={openAddModal} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-black rounded-xl shadow-sm transition flex items-center gap-2 self-start md:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Thêm Giáo Viên Mới
        </button>
      </div>

      {/* THANH BỘ LỌC TÌM KIẾM */}
      <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <input type="text" placeholder="Tìm tên, số điện thoại hoặc email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-black focus:outline-none focus:border-indigo-500" />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <select value={filterChucVu} onChange={(e) => { setFilterChucVu(e.target.value); setPage(1); }} className="px-3 py-2 border border-slate-200 rounded-xl text-black bg-white focus:outline-none focus:border-indigo-500">
          <option value="">-- Tất cả chức vụ --</option>
          {metadata.chucVus.map((c) => <option key={c.ma_chuc_vu} value={c.ma_chuc_vu}>{c.ten_chuc_vu}</option>)}
        </select>
        <select value={filterPhongBan} onChange={(e) => { setFilterPhongBan(e.target.value); setPage(1); }} className="px-3 py-2 border border-slate-200 rounded-xl text-black bg-white focus:outline-none focus:border-indigo-500">
          <option value="">-- Tất cả phòng ban --</option>
          {metadata.phongBans.map((p) => <option key={p.ma_phong_ban} value={p.ma_phong_ban}>{p.ten_phong_ban}</option>)}
        </select>
      </div>

      {/* BẢNG DANH SÁCH GIÁO VIÊN */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Đang truy vấn dữ liệu giáo viên...</div>
        ) : giaoViens.length === 0 ? (
          <div className="p-12 text-center text-slate-400 italic">Không tìm thấy giáo viên nào phù hợp điều kiện lọc.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">ID</th>
                  <th className="p-4">Họ và Tên</th>
                  <th className="p-4">Thông tin liên lạc</th>
                  <th className="p-4">Đơn vị / Chức vụ</th>
                  <th className="p-4">Tài khoản</th>
                  <th className="p-4 text-center w-32">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-black text-slate-700">
                {giaoViens.map((gv) => (
                  <tr key={gv.ma_giao_vien} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono text-xs font-bold text-slate-400 text-center">{gv.ma_giao_vien}</td>
                    <td className="p-4 font-bold text-slate-900">
                      <button onClick={() => handleOpenDetail(gv.ma_giao_vien)} className="hover:text-indigo-600 text-left transition">{gv.ho_ten}</button>
                      <span className="block text-xs font-normal text-slate-400">{gv.gioi_tinh || '—'} {gv.ngay_sinh ? `• ${new Date(gv.ngay_sinh).toLocaleDateString('vi-VN')}` : ''}</span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25V16.14a2.25 2.25 0 00-1.565-2.144l-3.385-.967a2.25 2.25 0 00-2.406.417l-1.397 1.397a15.351 15.351 0 01-6.155-6.155l1.397-1.397a2.25 2.25 0 00.417-2.406L11.83 4.7a2.25 2.25 0 00-2.143-1.565H5.25A2.25 2.25 0 003 5.25v1.5z" /></svg>
                        {gv.so_dien_thoai || 'Chưa có SĐT'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615m19.5 0v-.243a2.25 2.25 0 00-1.07-1.916l-7.5-4.615a2.25 2.25 0 00-2.36 0l-7.5 4.615" /></svg>
                        {gv.email || 'Chưa bổ sung'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 mb-1">{gv.phong_ban?.ten_phong_ban}</span>
                      <div className="text-xs text-slate-500 font-semibold">{gv.chuc_vu?.ten_chuc_vu}</div>
                    </td>
                    <td className="p-4">
                      {gv.tai_khoan?.ten_dang_nhap ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded border text-slate-700">{gv.tai_khoan.ten_dang_nhap}</span>
                          <span className={`w-2 h-2 rounded-full ${gv.tai_khoan.trang_thai === 'KICH_HOAT' ? 'bg-emerald-500' : 'bg-rose-400'}`} title={gv.tai_khoan.trang_thai || 'Mặc định'} />
                        </div>
                      ) : <span className="text-xs text-slate-400 italic">Chưa cấp</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEditModal(gv.ma_giao_vien)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition" title="Chỉnh sửa"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                        <button onClick={() => handleDelete(gv.ma_giao_vien)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-rose-600 transition" title="Xóa bỏ"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PHÂN TRANG */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between bg-slate-50 text-xs font-semibold text-slate-600">
            <div>Hiển thị trang {page}/{totalPages} (Tổng số {total} hồ sơ)</div>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-100 transition">Trước</button>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-100 transition">Sau</button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL CẬP NHẬT / THÊM MỚI HỒ SƠ GIÁO VIÊN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl border flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">{modalMode === 'add' ? 'Thêm Mới Hồ Sơ Giáo Viên' : 'Chỉnh Sửa Hồ Sơ Giáo Viên'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* PHẦN 1: THÔNG TIN CÁ NHÂN */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b pb-1">1. Thông tin cá nhân cơ bản</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Họ và tên *</label>
                    <input type="text" required value={formData.ho_ten} onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Ngày sinh</label>
                    <input type="date" value={formData.ngay_sinh} onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Giới tính</label>
                    <select value={formData.gioi_tinh || 'Nam'} onChange={(e) => setFormData({ ...formData, gioi_tinh: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-black bg-white">
                      <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Số điện thoại</label>
                    <input type="text" value={formData.so_dien_thoai} onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Địa chỉ cư trú</label>
                    <input type="text" value={formData.dia_chi} onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Chức vụ phụ trách *</label>
                    <select required value={formData.ma_chuc_vu} onChange={(e) => setFormData({ ...formData, ma_chuc_vu: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-black bg-white">
                      {metadata.chucVus.map((c) => <option key={c.ma_chuc_vu} value={c.ma_chuc_vu}>{c.ten_chuc_vu}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Phòng ban nhân sự *</label>
                    <select required value={formData.ma_phong_ban} onChange={(e) => setFormData({ ...formData, ma_phong_ban: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-black bg-white">
                      {metadata.phongBans.map((p) => <option key={p.ma_phong_ban} value={p.ma_phong_ban}>{p.ten_phong_ban}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* PHẦN 2: TÀI KHOẢN TRUY CẬP */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b pb-1">2. Tài khoản truy cập hệ thống</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Tên đăng nhập</label>
                    <input type="text" value={formData.tai_khoan.ten_dang_nhap} onChange={(e) => setFormData({ ...formData, tai_khoan: { ...formData.tai_khoan, ten_dang_nhap: e.target.value } })} className="w-full px-3 py-2 border rounded-xl text-black bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">{modalMode === 'add' ? 'Mật khẩu khởi tạo' : 'Mật khẩu (Gõ nếu muốn đổi)'}</label>
                    <input type="password" value={formData.tai_khoan.mat_khau} onChange={(e) => setFormData({ ...formData, tai_khoan: { ...formData.tai_khoan, mat_khau: e.target.value } })} className="w-full px-3 py-2 border rounded-xl text-black bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Trạng thái tài khoản</label>
                    <select value={formData.tai_khoan.trang_thai} onChange={(e) => setFormData({ ...formData, tai_khoan: { ...formData.tai_khoan, trang_thai: e.target.value } })} className="w-full px-3 py-2 border rounded-xl text-black bg-white">
                      <option value="KICH_HOAT">Kích hoạt sử dụng</option><option value="KHOA">Khóa truy cập</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PHẦN 3: HỒ SƠ BẰNG CẤP */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">3. Hồ sơ văn bằng / Chứng chỉ chuyên môn</h3>
                  <button type="button" onClick={addBangRow} className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Thêm bằng cấp
                  </button>
                </div>

                {formData.ho_so_bang.length === 0 ? (
                  <p className="text-xs italic text-slate-400">Chưa thiết lập danh sách văn bằng chứng chỉ cho giáo viên này.</p>
                ) : (
                  <div className="space-y-3">
                    {formData.ho_so_bang.map((b, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-xl bg-slate-50/50 relative items-end">
                        <div className="md:col-span-1">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-600">Loại văn bằng *</label>
                            <button
                              type="button"
                              onClick={() => {
                                const nextMode = !b.isNewMode;
                                updateBangRow(idx, { 
                                  isNewMode: nextMode,
                                  ma_bang_cap: nextMode ? 'NEW' : (metadata.bangCaps[0]?.ma_bang_cap || ''),
                                  ten_bang_cap_moi: ''
                                });
                              }}
                              className="text-[10px] font-bold text-indigo-600 hover:underline"
                            >
                              {b.isNewMode ? '[Chọn sẵn]' : '[Tạo danh mục mới]'}
                            </button>
                          </div>
                          
                          {b.isNewMode ? (
                            <input
                              type="text"
                              required
                              placeholder="Nhập tên bằng mới..."
                              value={b.ten_bang_cap_moi || ''}
                              onChange={(e) => updateBangRow(idx, { ten_bang_cap_moi: e.target.value })}
                              className="w-full px-3 py-1.5 border rounded-xl text-black bg-white border-indigo-300 focus:border-indigo-500 focus:outline-none"
                            />
                          ) : (
                            <select
                              required
                              value={b.ma_bang_cap}
                              onChange={(e) => updateBangRow(idx, { ma_bang_cap: Number(e.target.value) })}
                              className="w-full px-3 py-1.5 border rounded-xl text-black bg-white"
                            >
                              {metadata.bangCaps.map((bc) => (
                                <option key={bc.ma_bang_cap} value={bc.ma_bang_cap}>{bc.ten_bang_cap}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1 text-slate-600">Ngày cấp</label>
                          <input type="date" value={b.ngay_cap} onChange={(e) => updateBangRow(idx, { ngay_cap: e.target.value })} className="w-full px-3 py-1.5 border rounded-xl text-black bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-slate-600">Nơi cấp / Trường cấp</label>
                          <input type="text" value={b.noi_cap} onChange={(e) => updateBangRow(idx, { noi_cap: e.target.value })} className="w-full px-3 py-1.5 border rounded-xl text-black bg-white" />
                        </div>
                        <div className="flex items-center justify-end">
                          <button type="button" onClick={() => removeBangRow(idx)} className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1 w-full md:w-auto justify-center">
                            Xóa dòng
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PHẦN 4: HỢP ĐỒNG LAO ĐỘNG */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">4. Lịch sử hợp đồng lao động</h3>
                  <button type="button" onClick={addHopDongRow} className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Ký hợp đồng
                  </button>
                </div>

                {formData.hop_dong.length === 0 ? (
                  <p className="text-xs italic text-slate-400">Giáo viên hiện tại chưa khởi tạo văn bản hợp đồng lao động nào.</p>
                ) : (
                  <div className="space-y-4">
                    {formData.hop_dong.map((hd, idx) => (
                      <div key={idx} className="p-4 border rounded-xl bg-slate-50/50 grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                        <div>
                          <label className="block text-xs font-bold mb-1 text-slate-600">Số hợp đồng *</label>
                          <input type="text" required value={hd.so_hop_dong} onChange={(e) => updateHopDongRow(idx, { so_hop_dong: e.target.value })} className="w-full px-3 py-1.5 border rounded-xl text-black bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-slate-600">Ngày ký</label>
                          <input type="date" value={hd.ngay_ky} onChange={(e) => updateHopDongRow(idx, { ngay_ky: e.target.value })} className="w-full px-3 py-1.5 border rounded-xl text-black bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-slate-600">Vị trí công việc</label>
                          <input type="text" value={hd.ten_cong_viec} onChange={(e) => updateHopDongRow(idx, { ten_cong_viec: e.target.value })} className="w-full px-3 py-1.5 border rounded-xl text-black bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-slate-600">Thời gian thử việc</label>
                          <input type="text" placeholder="Ví dụ: 2 tháng" value={hd.tg_thu_viec} onChange={(e) => updateHopDongRow(idx, { tg_thu_viec: e.target.value })} className="w-full px-3 py-1.5 border rounded-xl text-black bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-slate-600">Lương cơ bản (VNĐ) *</label>
                          <input type="number" required value={hd.luong_co_ban} onChange={(e) => updateHopDongRow(idx, { luong_co_ban: e.target.value })} className="w-full px-3 py-1.5 border rounded-xl text-black bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-slate-600">Ngày hết hợp đồng</label>
                          <input type="date" value={hd.tg_het_hop_dong} onChange={(e) => updateHopDongRow(idx, { tg_het_hop_dong: e.target.value })} className="w-full px-3 py-1.5 border rounded-xl text-black bg-white" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold mb-1 text-slate-600">Danh mục phụ cấp (Định dạng tên:Số_Tiền, cách nhau bằng dấu phẩy)</label>
                          <input type="text" placeholder="Ăn trưa:500000, Xăng xe:200000" value={hd.chi_tiet_phu_cap_text} onChange={(e) => updateHopDongRow(idx, { chi_tiet_phu_cap_text: e.target.value })} className="w-full px-3 py-1.5 border rounded-xl text-black bg-white" />
                        </div>
                        <div className="md:col-span-4 flex items-center justify-between pt-2 border-t">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                            <input type="checkbox" checked={hd.dong_bao_hiem} onChange={(e) => updateHopDongRow(idx, { dong_bao_hiem: e.target.checked })} className="rounded text-indigo-600 w-4 h-4" />
                            Có tham gia đóng Bảo hiểm xã hội
                          </label>
                          <button type="button" onClick={() => removeHopDongRow(idx)} className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1">Xóa dòng</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER ACTION */}
              <div className="pt-4 border-t flex justify-end gap-2 bg-slate-50 -mx-6 -mb-6 p-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl text-black font-semibold text-slate-600 bg-white hover:bg-slate-50 transition">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-black font-semibold rounded-xl shadow-sm transition">Lưu Thông Tin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT HỒ SƠ GIÁO VIÊN (ĐÃ MỞ RỘNG HIỂN THỊ HỢP ĐỒNG LAO ĐỘNG) */}
      {isDetailOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-xl border flex flex-col">
            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
              <h2 className="text-black font-black text-slate-900 uppercase tracking-wide">Hồ sơ chi tiết giáo viên</h2>
              <button onClick={() => setIsDetailOpen(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 text-black text-slate-700">
              {/* THÔNG TIN CHUNG */}
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base flex-shrink-0">{selectedTeacher.ho_ten?.charAt(0).toUpperCase()}</div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{selectedTeacher.ho_ten}</h3>
                  <p className="text-xs text-indigo-700 font-semibold">{selectedTeacher.chuc_vu?.ten_chuc_vu} — {selectedTeacher.phong_ban?.ten_phong_ban}</p>
                </div>
              </div>

              {/* THÔNG TIN LIÊN HỆ */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border">
                <div><span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Ngày sinh</span><p className="font-medium text-slate-800">{selectedTeacher.ngay_sinh ? new Date(selectedTeacher.ngay_sinh).toLocaleDateString('vi-VN') : '—'}</p></div>
                <div><span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Giới tính</span><p className="font-medium text-slate-800">{selectedTeacher.gioi_tinh || '—'}</p></div>
                <div><span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Số điện thoại</span><p className="font-mono font-medium text-slate-800">{selectedTeacher.so_dien_thoai || '—'}</p></div>
                <div><span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Email liên hệ</span><p className="font-medium text-slate-800">{selectedTeacher.email || '—'}</p></div>
                <div className="col-span-2"><span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Địa chỉ cư trú</span><p className="font-medium text-slate-800">{selectedTeacher.dia_chi || '—'}</p></div>
              </div>

              {/* LỚP PHỤ TRÁCH */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wide border-b pb-1">Lớp Phụ Trách Giảng Dạy</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTeacher.phan_cong_giang_day && selectedTeacher.phan_cong_giang_day.length > 0 ? (
                    selectedTeacher.phan_cong_giang_day.map((p: any, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded text-xs font-semibold">{p.lop_hoc?.ten_lop}</span>
                    ))
                  ) : <p className="text-xs italic text-slate-400">Chưa được phân công giảng dạy lớp nào.</p>}
                </div>
              </div>

              {/* VĂN BẰNG CHỨNG CHỈ */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wide border-b pb-1">Văn bằng chứng chỉ chuyên môn</h4>
                {selectedTeacher.ho_so_bang && selectedTeacher.ho_so_bang.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedTeacher.ho_so_bang.map((b: any, index: number) => (
                      <div key={index} className="p-2.5 bg-white border rounded-xl text-xs flex flex-col justify-between shadow-xs">
                        <div>
                          <p className="font-bold text-slate-900 text-black mb-0.5">{b.bang_cap?.ten_bang_cap}</p>
                          <p className="text-slate-500 font-medium">Nơi cấp: {b.noi_cap || '—'}</p>
                        </div>
                        <p className="text-slate-400 font-mono text-[10px] mt-2 border-t pt-1 text-right">Cấp ngày: {b.ngay_cap ? new Date(b.ngay_cap).toLocaleDateString('vi-VN') : '—'}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs italic text-slate-400">Chưa bổ sung thông tin hồ sơ bằng cấp.</p>}
              </div>

              {/* PHẦN ĐƯỢC MỞ RỘNG: HỢP ĐỒNG LAO ĐỘNG */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wide border-b pb-1">Lịch sử hợp đồng lao động</h4>
                {selectedTeacher.hop_dong && selectedTeacher.hop_dong.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTeacher.hop_dong.map((hd: any, index: number) => (
                      <div key={index} className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-1.5">
                          <div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-mono">{hd.so_hop_dong}</span>
                            <span className="text-black font-bold text-slate-800 ml-2">{hd.ten_cong_viec || 'Chưa phân công vị trí'}</span>
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            Ký ngày: <span className="text-slate-700 font-mono">{hd.ngay_ky ? new Date(hd.ngay_ky).toLocaleDateString('vi-VN') : '—'}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 block font-medium">Lương cơ bản:</span>
                            <span className="font-bold text-emerald-600 text-black">
                              {hd.luong_co_ban ? Number(hd.luong_co_ban).toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Thử việc:</span>
                            <span className="font-semibold text-slate-700">{hd.tg_thu_viec || '—'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Hạn hợp đồng:</span>
                            <span className="font-semibold text-slate-700 font-mono">
                              {hd.tg_het_hop_dong ? new Date(hd.tg_het_hop_dong).toLocaleDateString('vi-VN') : 'Vô thời hạn'}
                            </span>
                          </div>
                          <div className="col-span-2 sm:col-span-3 bg-slate-50 p-2 rounded-lg border border-dashed">
                            <span className="text-slate-400 block font-bold text-[10px] uppercase tracking-wide mb-1">Chi tiết danh mục phụ cấp:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {hd.chi_tiet_phu_cap && Array.isArray(hd.chi_tiet_phu_cap) && hd.chi_tiet_phu_cap.length > 0 ? (
                                hd.chi_tiet_phu_cap.map((p: any, pIdx: number) => (
                                  <span key={pIdx} className="inline-flex items-center px-2 py-0.5 bg-slate-200/60 text-slate-700 rounded text-[11px] font-medium border">
                                    {p.ten}: <strong className="text-slate-900 ml-1">{Number(p.soTien).toLocaleString('vi-VN')}đ</strong>
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">Không có phụ cấp thỏa thuận.</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1 text-xs">
                          <span className={`w-2 h-2 rounded-full ${hd.dong_bao_hiem ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                          <span className="text-slate-500 font-medium">
                            {hd.dong_bao_hiem ? 'Có đóng bảo hiểm xã hội (BHXH)' : 'Không đóng bảo hiểm xã hội'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs italic text-slate-400">Không tìm thấy thông tin hoặc lịch sử hợp đồng lao động nào.</p>}
              </div>
            </div>

            {/* BOX FOOTER */}
            <div className="flex justify-end pt-3 border-t border-slate-100 bg-slate-50 p-4">
              <button onClick={() => setIsDetailOpen(false)} className="px-4 py-2 bg-slate-900 text-white text-black font-semibold rounded-xl hover:bg-slate-800 transition">Đóng hồ sơ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}