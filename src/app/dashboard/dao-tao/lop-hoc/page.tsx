'use client';

import React, { useState, useEffect, useCallback } from 'react';

// --- HÀM HELPER PARSE LỊCH HỌC JSON ---
const parseLichHocText = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  const result: any[] = [];
  for (let line of lines) {
    if (!line.trim()) continue;
    const parts = line.split('-');
    if (parts.length === 2) {
      const thu = parseInt(parts[0].toLowerCase().replace('thu', '').trim());
      const ca = parseInt(parts[1].toLowerCase().replace('ca', '').trim());
      if (!isNaN(thu) && !isNaN(ca)) result.push({ thu, ca });
    }
  }
  return result.length > 0 ? result : null;
};

const formatLichHocText = (json: any) => {
  if (!json || !Array.isArray(json)) return '';
  return json.map((item: any) => `thu ${item.thu} - ca ${item.ca}`).join('\n');
};

type MetaData = { khoaHocs: any[], phongHocs: any[], giaoViens: any[], hocViens: any[] };

export default function QuanLyLopHocPage() {
  const [lops, setLops] = useState<any[]>([]);
  const [meta, setMeta] = useState<MetaData>({ khoaHocs: [], phongHocs: [], giaoViens: [], hocViens: [] });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formLop, setFormLop] = useState<any>({});
  
  const [detailLop, setDetailLop] = useState<any>(null);
  const [detailTab, setDetailTab] = useState(1);

  // Nested Modal Buổi Học
  const [selectedBuoiHoc, setSelectedBuoiHoc] = useState<any>(null);
  const [buoiHocTab, setBuoiHocTab] = useState<'diemdanh'|'kiemtra'|'nhanxet'>('diemdanh');
  
  // Modals con tạo mới
  const [isTaoBuoiHocOpen, setIsTaoBuoiHocOpen] = useState(false);

  const fetchMeta = async () => {
    const res = await fetch('/api/dao-tao/lop-hoc?meta=true').then(r => r.json());
    if (res.success) setMeta(res.data);
  };

  const fetchLopHocs = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/dao-tao/lop-hoc?page=${page}&search=${search}`).then(r => r.json());
    if (res.success) { setLops(res.data.items); setTotalPages(res.data.totalPages); }
    setLoading(false);
  }, [page, search]);

  const loadDetail = async (ma_lop_hoc: number) => {
    const res = await fetch(`/api/dao-tao/lop-hoc?ma_lop_hoc=${ma_lop_hoc}`).then(r => r.json());
    if (res.success) setDetailLop(res.data);
  };

  useEffect(() => { fetchMeta(); }, []);
  useEffect(() => { fetchLopHocs(); }, [fetchLopHocs]);

  const handleSaveLop = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = formLop.ma_lop_hoc ? 'UPDATE_LOP_HOC' : 'CREATE_LOP_HOC';
    const method = formLop.ma_lop_hoc ? 'PUT' : 'POST';
    
    const payload = { ...formLop, lich_hoc: parseLichHocText(formLop.lich_hoc_text) };

    const res = await fetch('/api/dao-tao/lop-hoc', {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    }).then(r => r.json());

    if (res.success) {
      alert(res.message); setIsFormOpen(false); fetchLopHocs();
    } else alert(res.error || res.message);
  };

  const handleDeleteLop = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa lớp học này?')) return;
    const res = await fetch(`/api/dao-tao/lop-hoc?action=DELETE_LOP_HOC&ma_lop_hoc=${id}`, { method: 'DELETE' }).then(r => r.json());
    if (res.success) { alert(res.message); fetchLopHocs(); } else alert(res.message);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <h1 className="text-2xl font-bold">Hệ Thống Lớp Học</h1>
          <button onClick={() => { setFormLop({}); setIsFormOpen(true); }} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">+ Tạo Lớp Mới</button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 border-b font-bold text-slate-600">
              <tr>
                <th className="p-4">Mã</th><th className="p-4">Tên Lớp</th><th className="p-4">Khóa Học</th><th className="p-4">Sĩ Số</th><th className="p-4">Khai Giảng</th><th className="p-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {lops.map(l => (
                <tr key={l.ma_lop_hoc} className="border-b hover:bg-slate-50">
                  <td className="p-4 text-slate-400 font-mono">{l.ma_lop_hoc}</td>
                  <td className="p-4 font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => { setDetailTab(1); loadDetail(l.ma_lop_hoc); }}>{l.ten_lop}</td>
                  <td className="p-4 font-medium">{l.khoa_hoc?.ten_khoa_hoc || <span className="text-rose-500 italic">Chưa liên kết</span>}</td>
                  <td className="p-4">{l._count.tham_gia} / {l.si_so_toi_da || '∞'}</td>
                  <td className="p-4">{l.ngay_khai_giang ? new Date(l.ngay_khai_giang).toLocaleDateString('vi-VN') : '—'}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => { setFormLop({...l, lich_hoc_text: formatLichHocText(l.lich_hoc)}); setIsFormOpen(true); }} className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded">Sửa</button>
                    <button onClick={() => handleDeleteLop(l.ma_lop_hoc)} className="text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 flex justify-between text-sm bg-slate-50 border-t">
            <span className="font-semibold text-slate-500">Trang {page} / {totalPages}</span>
            <div className="gap-2 flex">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded bg-white">Trước</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded bg-white">Sau</button>
            </div>
          </div>
        </div>

        {/* MODAL FORM TẠO/SỬA LỚP */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col">
              <div className="p-4 border-b font-bold flex justify-between bg-slate-50">
                <h2>{formLop.ma_lop_hoc ? 'Cập Nhật Lớp Học' : 'Tạo Mới Lớp Học'}</h2>
                <button onClick={() => setIsFormOpen(false)} className="text-slate-400 font-bold text-xl">×</button>
              </div>
              <form onSubmit={handleSaveLop} className="p-5 grid grid-cols-2 gap-5 overflow-y-auto max-h-[80vh]">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700">Tên Lớp *</label>
                  <input required value={formLop.ten_lop || ''} onChange={e => setFormLop({...formLop, ten_lop: e.target.value})} className="w-full border p-2 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Khóa Học</label>
                  <select value={formLop.ma_khoa_hoc || ''} onChange={e => setFormLop({...formLop, ma_khoa_hoc: e.target.value})} className="w-full border p-2 rounded-lg text-sm mt-1">
                    <option value="">-- Chọn sau hoặc để trống --</option>
                    {meta.khoaHocs.map(k => <option key={k.ma_khoa_hoc} value={k.ma_khoa_hoc}>{k.ten_khoa_hoc}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Phòng Học *</label>
                  <select required value={formLop.ma_phong_hoc || ''} onChange={e => setFormLop({...formLop, ma_phong_hoc: e.target.value})} className="w-full border p-2 rounded-lg text-sm mt-1">
                    <option value="">-- Chọn --</option>
                    {meta.phongHocs.map(p => <option key={p.ma_phong_hoc} value={p.ma_phong_hoc}>{p.ten_phong_hoc} (Sức chứa: {p.suc_chua})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Ngày Khai Giảng</label>
                  <input type="date" value={formLop.ngay_khai_giang ? formLop.ngay_khai_giang.substring(0,10) : ''} onChange={e => setFormLop({...formLop, ngay_khai_giang: e.target.value})} className="w-full border p-2 rounded-lg text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Ngày Kết Thúc</label>
                  <input type="date" value={formLop.ngay_ket_thuc ? formLop.ngay_ket_thuc.substring(0,10) : ''} onChange={e => setFormLop({...formLop, ngay_ket_thuc: e.target.value})} className="w-full border p-2 rounded-lg text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Sĩ số tối đa</label>
                  <input type="number" placeholder="Bỏ trống nếu không giới hạn" value={formLop.si_so_toi_da || ''} onChange={e => setFormLop({...formLop, si_so_toi_da: e.target.value})} className="w-full border p-2 rounded-lg text-sm mt-1" />
                </div>
                
                <div className="col-span-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                  <label className="text-xs font-bold text-blue-800">Lịch Học Định Kỳ</label>
                  <textarea rows={3} placeholder="Ví dụ:&10;thu 2 - ca 1&10;thu 4 - ca 2" value={formLop.lich_hoc_text || ''} onChange={e => setFormLop({...formLop, lich_hoc_text: e.target.value})} className="w-full border border-blue-200 p-2 rounded-lg text-sm mt-1 font-mono focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="col-span-2 flex justify-end gap-3 pt-4 border-t mt-2">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2 border rounded-lg font-bold text-slate-600">Hủy</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold">Lưu Thông Tin</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CHI TIẾT LỚP */}
        {detailLop && (
          <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800">Chi Tiết Lớp: <span className="text-blue-600">{detailLop.ten_lop}</span></h2>
                <button onClick={() => setDetailLop(null)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-200 text-slate-500 font-bold hover:bg-slate-300">×</button>
              </div>
              
              <div className="flex border-b text-sm font-bold bg-white">
                {[1, 2, 3, 4].map(tab => (
                  <button key={tab} onClick={() => setDetailTab(tab)} className={`px-6 py-3 border-b-2 transition ${detailTab === tab ? 'border-blue-600 text-blue-700 bg-blue-50/30' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}>
                    {tab === 1 ? '1. Thông Tin & Phân Công' : tab === 2 ? '2. Quản Lý Buổi Học' : tab === 3 ? '3. Chi Tiết Khóa Học' : '4. Kế Hoạch Giảng Dạy'}
                  </button>
                ))}
              </div>

              <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50">
                {detailTab === 1 && (
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-blue-800 border-b pb-2 mb-3">Thông Số Lớp Học</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-700">
                        <div><span className="block text-xs text-slate-400">Khóa học</span><strong className="text-slate-900">{detailLop.khoa_hoc?.ten_khoa_hoc || 'Chưa liên kết'}</strong></div>
                        <div><span className="block text-xs text-slate-400">Phòng học</span><strong className="text-slate-900">{detailLop.phong_hoc?.ten_phong_hoc}</strong></div>
                        <div><span className="block text-xs text-slate-400">Thời gian dự kiến</span><strong className="text-slate-900">{detailLop.ngay_khai_giang?new Date(detailLop.ngay_khai_giang).toLocaleDateString('vi-VN'):'--'} → {detailLop.ngay_ket_thuc?new Date(detailLop.ngay_ket_thuc).toLocaleDateString('vi-VN'):'--'}</strong></div>
                        <div><span className="block text-xs text-slate-400">Sĩ số</span><strong className="text-slate-900">{detailLop.tham_gia.length} / {detailLop.si_so_toi_da || 'Không giới hạn'}</strong></div>
                        <div className="col-span-4 bg-slate-50 p-3 rounded-lg border">
                          <span className="block text-xs text-slate-500 font-bold mb-1 uppercase tracking-wide">Lịch Học Định Kỳ</span>
                          {detailLop.lich_hoc && Array.isArray(detailLop.lich_hoc) && detailLop.lich_hoc.length > 0 ? (
                            <div className="flex gap-2">
                              {detailLop.lich_hoc.map((lh:any, idx:number) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 font-mono text-xs px-2 py-1 rounded">Thứ {lh.thu} - Ca {lh.ca}</span>
                              ))}
                            </div>
                          ) : <span className="text-slate-400 italic">Chưa thiết lập lịch học định kỳ</span>}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 border rounded-xl shadow-sm">
                        <h3 className="font-bold text-slate-800 border-b pb-2 mb-3 flex items-center justify-between">Giáo Viên Phụ Trách</h3>
                        <div className="flex gap-2 mb-4">
                          <select id="sel-gv" className="border p-2 text-sm rounded-lg flex-1 bg-slate-50">
                            <option value="">Chọn giáo viên thêm vào lớp...</option>
                            {meta.giaoViens.filter(gv => !detailLop.phan_cong_giang_day.find((p:any) => p.ma_giao_vien === gv.ma_giao_vien)).map(g => (
                              <option key={g.ma_giao_vien} value={g.ma_giao_vien}>{g.ho_ten}</option>
                            ))}
                          </select>
                          <button onClick={() => {
                            const val = (document.getElementById('sel-gv') as HTMLSelectElement).value;
                            if(val) fetch('/api/dao-tao/lop-hoc', { method: 'POST', body: JSON.stringify({ action: 'ASSIGN_GIAO_VIEN', payload: { ma_lop_hoc: detailLop.ma_lop_hoc, ma_giao_vien: Number(val) } }) }).then(() => loadDetail(detailLop.ma_lop_hoc));
                          }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">Phân Công</button>
                        </div>
                        <ul className="space-y-2 text-sm">
                          {detailLop.phan_cong_giang_day.map((p:any) => (
                            <li key={p.ma_giao_vien} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                              <span className="font-bold text-slate-700">{p.giao_vien?.ho_ten}</span>
                              <button onClick={() => fetch(`/api/dao-tao/lop-hoc?action=REMOVE_GIAO_VIEN&ma_lop_hoc=${detailLop.ma_lop_hoc}&ma_giao_vien=${p.ma_giao_vien}`, { method: 'DELETE' }).then(()=>loadDetail(detailLop.ma_lop_hoc))} className="text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded text-xs">Gỡ</button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-4 border rounded-xl shadow-sm">
                        <h3 className="font-bold text-slate-800 border-b pb-2 mb-3">Danh Sách Học Viên <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-sm">{detailLop.tham_gia.length}</span></h3>
                        <div className="flex gap-2 mb-4">
                          <select id="sel-hv" className="border p-2 text-sm rounded-lg flex-1 bg-slate-50">
                            <option value="">Chọn học viên...</option>
                            {meta.hocViens.filter(hv => !detailLop.tham_gia.find((t:any) => t.ma_hoc_vien === hv.ma_hoc_vien)).map(h => (
                              <option key={h.ma_hoc_vien} value={h.ma_hoc_vien}>{h.ho_ten} - {h.so_dien_thoai} ({h.trang_thai})</option>
                            ))}
                          </select>
                          <button onClick={() => {
                            const val = (document.getElementById('sel-hv') as HTMLSelectElement).value;
                            if(val) fetch('/api/dao-tao/lop-hoc', { method: 'POST', body: JSON.stringify({ action: 'ADD_HOC_VIEN', payload: { ma_lop_hoc: detailLop.ma_lop_hoc, ma_hoc_vien: Number(val) } }) }).then(() => loadDetail(detailLop.ma_lop_hoc));
                          }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">Ghi Danh</button>
                        </div>
                        <ul className="space-y-2 text-sm max-h-64 overflow-y-auto pr-2">
                          {detailLop.tham_gia.map((t:any) => {
                            const biViPham = t.hoc_vien?.cam_ket?.some((c: any) => c.ma_khoa_hoc === detailLop.ma_khoa_hoc && c.bi_vi_pham === true);
                            const laNghiHoc = t.hoc_vien?.trang_thai === 'Nghỉ học';
                            return (
                              <li key={t.ma_hoc_vien} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border">
                                <span className={`font-medium ${biViPham || laNghiHoc ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                  {t.hoc_vien?.ho_ten} 
                                  {laNghiHoc && <span className="ml-2 text-xs bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">Nghỉ học</span>}
                                  {biViPham && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Vi phạm CK</span>}
                                </span>
                                <button onClick={() => fetch(`/api/dao-tao/lop-hoc?action=REMOVE_HOC_VIEN&ma_lop_hoc=${detailLop.ma_lop_hoc}&ma_hoc_vien=${t.ma_hoc_vien}`, { method: 'DELETE' }).then(()=>loadDetail(detailLop.ma_lop_hoc))} className="text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded text-xs">Loại</button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {detailTab === 2 && (
                  <div>
                     <div className="flex justify-between items-center mb-5 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div>
                          <h3 className="font-bold text-lg text-slate-800">Lịch Trình Buổi Học</h3>
                          <p className="text-xs text-slate-500">Quản lý các buổi dạy, điểm danh và bài kiểm tra</p>
                        </div>
                        <button onClick={() => setIsTaoBuoiHocOpen(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-bold shadow-sm">+ Tạo Buổi Học Mới</button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {detailLop.buoi_hoc.map((bh:any) => (
                         <div key={bh.ma_buoi_hoc} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer border-l-4 border-l-blue-500 transition-all" onClick={() => setSelectedBuoiHoc(bh)}>
                           <p className="font-bold text-blue-800 text-lg">{new Date(bh.ngay_hoc).toLocaleDateString('vi-VN')}</p>
                           <p className="text-sm text-slate-600 mt-1 line-clamp-2 min-h-[40px]">{bh.noi_dung_hoc || 'Chưa có nội dung'}</p>
                           <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-50 p-1.5 rounded">GV: {bh.giao_vien?.ho_ten}</p>
                           <div className="mt-3 pt-3 border-t border-slate-100 text-center text-xs font-bold text-blue-600 bg-blue-50/50 py-1.5 rounded">MỞ QUẢN LÝ CHI TIẾT</div>
                         </div>
                       ))}
                     </div>
                  </div>
                )}

                {/* TAB 3: CHI TIẾT KHÓA HỌC (Đã bổ sung hoàn chỉnh logic đề xuất) */}
                {detailTab === 3 && (
                  <ChiTietKhoaHocTab 
                    detailLop={detailLop} 
                    meta={meta} 
                    reloadLop={() => loadDetail(detailLop.ma_lop_hoc)} 
                  />
                )}

                {detailTab === 4 && <KeHoachGiangDayTab maKhoaHoc={detailLop.ma_khoa_hoc} giaoViens={meta.giaoViens} dsGvPhanCong={detailLop.phan_cong_giang_day} />}
              </div>
            </div>
          </div>
        )}

        {/* MODAL TẠO BUỔI HỌC */}
        {isTaoBuoiHocOpen && (
           <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4">
             <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b font-bold bg-slate-50 flex justify-between">
                  <h3>Tạo Buổi Học Mới</h3>
                  <button onClick={() => setIsTaoBuoiHocOpen(false)} className="text-slate-400 font-bold">×</button>
                </div>
                <form className="p-5 space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  const payload = { 
                    ngay_hoc: (e.target as any).ngay_hoc.value, 
                    noi_dung_hoc: (e.target as any).noi_dung_hoc.value, 
                    ma_lop_hoc: detailLop.ma_lop_hoc, 
                    ma_giao_vien: Number((e.target as any).ma_giao_vien.value) 
                  };
                  const res = await fetch('/api/dao-tao/lop-hoc', { method: 'POST', body: JSON.stringify({ action: 'CREATE_BUOI_HOC', payload }) }).then(r=>r.json());
                  if(res.success) { setIsTaoBuoiHocOpen(false); loadDetail(detailLop.ma_lop_hoc); } else alert(res.message);
                }}>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Ngày học *</label>
                    <input type="date" name="ngay_hoc" required className="w-full border p-2 rounded-lg mt-1 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Giáo viên phụ trách *</label>
                    <select name="ma_giao_vien" required className="w-full border p-2 rounded-lg mt-1 text-sm bg-slate-50">
                      {detailLop.phan_cong_giang_day.map((p:any) => <option key={p.ma_giao_vien} value={p.ma_giao_vien}>{p.giao_vien.ho_ten}</option>)}
                      {detailLop.phan_cong_giang_day.length === 0 && <option value="">(Vui lòng phân công GV trước)</option>}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Nội dung / Chủ đề buổi học</label>
                    <textarea name="noi_dung_hoc" rows={3} className="w-full border p-2 rounded-lg mt-1 text-sm" placeholder="Nhập nội dung..."></textarea>
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsTaoBuoiHocOpen(false)} className="px-4 py-2 border rounded-lg text-sm font-bold">Hủy</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Tạo Buổi Học</button>
                  </div>
                </form>
             </div>
           </div>
        )}

        {/* NESTED MODAL QUẢN LÝ BUỔI HỌC */}
        {selectedBuoiHoc && (
          <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[60] p-4">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-700">
               <div className="p-4 flex justify-between items-center bg-blue-900 text-white">
                 <div>
                   <h2 className="font-bold text-lg">Quản Lý Buổi Học: {new Date(selectedBuoiHoc.ngay_hoc).toLocaleDateString('vi-VN')}</h2>
                   <p className="text-xs text-blue-200 mt-0.5">Nội dung: {selectedBuoiHoc.noi_dung_hoc}</p>
                 </div>
                 <button onClick={() => setSelectedBuoiHoc(null)} className="font-bold text-2xl hover:text-rose-400 transition">×</button>
               </div>
               
               <div className="flex text-sm font-bold bg-slate-100 border-b border-slate-200">
                 <button onClick={()=>setBuoiHocTab('diemdanh')} className={`flex-1 py-3.5 transition ${buoiHocTab==='diemdanh'?'bg-white text-blue-700 border-b-2 border-blue-600':'text-slate-500 hover:bg-slate-50'}`}>ĐIỂM DANH</button>
                 <button onClick={()=>setBuoiHocTab('kiemtra')} className={`flex-1 py-3.5 transition ${buoiHocTab==='kiemtra'?'bg-white text-blue-700 border-b-2 border-blue-600':'text-slate-500 hover:bg-slate-50'}`}>BÀI KIỂM TRA</button>
                 <button onClick={()=>setBuoiHocTab('nhanxet')} className={`flex-1 py-3.5 transition ${buoiHocTab==='nhanxet'?'bg-white text-blue-700 border-b-2 border-blue-600':'text-slate-500 hover:bg-slate-50'}`}>NHẬN XÉT</button>
               </div>

               <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
                  {buoiHocTab === 'diemdanh' && <DiemDanhTab maLop={detailLop.ma_lop_hoc} maBuoiHoc={selectedBuoiHoc.ma_buoi_hoc} maKhoaHoc={detailLop.ma_khoa_hoc} />}
                  {buoiHocTab === 'kiemtra' && <KiemTraTab maLop={detailLop.ma_lop_hoc} dsHocVien={detailLop.tham_gia} listBkt={detailLop.bai_kiem_tra} reloadLop={() => loadDetail(detailLop.ma_lop_hoc)} maKhoaHoc={detailLop.ma_khoa_hoc} />}
                  {buoiHocTab === 'nhanxet' && <NhanXetTab maBuoiHoc={selectedBuoiHoc.ma_buoi_hoc} dsHocVien={detailLop.tham_gia} maKhoaHoc={detailLop.ma_khoa_hoc} />}
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= SUB COMPONENTS TÁCH RỜI =================

// 1. Component Tab Chi Tiết Khóa Học (Giải quyết yêu cầu số 1)
const ChiTietKhoaHocTab = ({ detailLop, meta, reloadLop }: { detailLop: any, meta: MetaData, reloadLop: () => void }) => {
  const [selectedKhoaHoc, setSelectedKhoaHoc] = useState<number | ''>('');
  const hasKhoaHoc = !!detailLop.ma_khoa_hoc;

  const handleLinkKhoaHoc = async () => {
    if (!selectedKhoaHoc) return alert('Vui lòng chọn khóa học liên kết!');
    
    const confirmAction = confirm('Xác nhận liên kết khóa học này vào lớp hiện tại? LƯU Ý: Một khi đã nhập khóa học vào lớp này sẽ không thể sửa đổi!');
    if (!confirmAction) return;

    const res = await fetch('/api/dao-tao/lop-hoc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE_KHOA_HOC_LIEN_KET',
        payload: { ma_lop_hoc: detailLop.ma_lop_hoc, ma_khoa_hoc: Number(selectedKhoaHoc) }
      })
    }).then(r => r.json());

    if (res.success) {
      alert(res.message);
      reloadLop();
    } else {
      alert(res.error || res.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="border-b pb-3">
        <h3 className="font-bold text-lg text-slate-800">Thông Tin Khóa Học Đang Liên Kết</h3>
        <p className="text-xs text-slate-500">Mỗi lớp chỉ được quyền sở hữu duy nhất một khóa học chạy xuyên suốt.</p>
      </div>

      {hasKhoaHoc ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2">
          <p className="text-sm font-semibold text-emerald-800">✓ Lớp đang liên kết với Khóa Học:</p>
          <p className="text-xl font-bold text-slate-900">{detailLop.khoa_hoc?.ten_khoa_hoc}</p>
          <p className="text-xs text-slate-500">Mã định danh khóa học: {detailLop.ma_khoa_hoc}</p>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 italic">
          Lớp học này hiện tại chưa được gán liên kết cụ thể với bất kỳ khóa học nào trong hệ thống.
        </div>
      )}

      <div className="pt-4 border-t space-y-3">
        <label className="block text-sm font-bold text-slate-700">Thiết lập/Liên kết Khóa Học Mới</label>
        <div className="flex gap-3 max-w-xl">
          <select 
            disabled={hasKhoaHoc}
            value={hasKhoaHoc ? detailLop.ma_khoa_hoc : selectedKhoaHoc}
            onChange={e => setSelectedKhoaHoc(e.target.value ? Number(e.target.value) : '')}
            className="border p-2.5 text-sm rounded-lg flex-1 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            {hasKhoaHoc ? (
              <option value={detailLop.ma_khoa_hoc}>{detailLop.khoa_hoc?.ten_khoa_hoc}</option>
            ) : (
              <>
                <option value="">-- Chọn Khóa Học Muốn Gán --</option>
                {meta.khoaHocs.map(k => (
                  <option key={k.ma_khoa_hoc} value={k.ma_khoa_hoc}>{k.ten_khoa_hoc}</option>
                ))}
              </>
            )}
          </select>
          <button 
            disabled={hasKhoaHoc}
            onClick={handleLinkKhoaHoc}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition"
          >
            Thêm Khóa Học
          </button>
        </div>
        {hasKhoaHoc && (
          <p className="text-xs text-rose-500 italic font-medium">
            * Nút thêm đã bị vô hiệu hóa vì lớp học này đã cố định khóa học.
          </p>
        )}
      </div>
    </div>
  );
};

// 2. Tab Quản Lý Điểm Kiểm Tra (Giải quyết yêu cầu số 2)
const KiemTraTab = ({ maLop, dsHocVien, listBkt, reloadLop, maKhoaHoc }: { maLop:number, dsHocVien:any[], listBkt:any[], reloadLop: () => void, maKhoaHoc: number }) => {
  const [selectedBkt, setSelectedBkt] = useState<number|''>('');
  const [ketQuaList, setKetQuaList] = useState<any[]>([]);
  const [isTaoBkt, setIsTaoBkt] = useState(false);

  useEffect(() => {
    if (selectedBkt) {
      fetch(`/api/dao-tao/lop-hoc?ma_bai_kiem_tra=${selectedBkt}`).then(r=>r.json()).then(res => setKetQuaList(res.data || []));
    } else {
      setKetQuaList([]);
    }
  }, [selectedBkt]);

  const handleSaveKetQua = async (ma_hoc_vien: number) => {
    const diem_so = (document.getElementById(`diem_${ma_hoc_vien}`) as HTMLInputElement).value;
    const nhan_xet = (document.getElementById(`nx_kt_${ma_hoc_vien}`) as HTMLInputElement).value;
    if(!diem_so) return alert('Vui lòng nhập điểm số hợp lệ');

    const res = await fetch('/api/dao-tao/lop-hoc', { method: 'POST', body: JSON.stringify({ action: 'UPSERT_KET_QUA_KT', payload: { ma_bai_kiem_tra: Number(selectedBkt), ma_hoc_vien, diem_so: Number(diem_so), nhan_xet } }) }).then(r=>r.json());
    if (res.success) {
      alert('Đã cập nhật điểm học viên!');
      fetch(`/api/dao-tao/lop-hoc?ma_bai_kiem_tra=${selectedBkt}`).then(r=>r.json()).then(res => setKetQuaList(res.data || []));
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
        <div className="flex-1 flex gap-3 items-center">
          <label className="font-bold text-sm">Chọn Bài Kiểm Tra:</label>
          <select value={selectedBkt} onChange={e => setSelectedBkt(e.target.value ? Number(e.target.value) : '')} className="border p-2 rounded-lg text-sm bg-slate-50 min-w-[300px]">
            <option value="">-- Danh sách các bài test của lớp --</option>
            {listBkt.map(b => <option key={b.ma_bai_kiem_tra} value={b.ma_bai_kiem_tra}>{b.ten_bai_kiem_tra} ({new Date(b.ngay_kiem_tra).toLocaleDateString('vi-VN')})</option>)}
          </select>
        </div>
        <button onClick={() => setIsTaoBkt(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm">+ Tạo Bài Test Mới</button>
      </div>

      {selectedBkt && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 font-bold border-b text-slate-700"><tr><th className="p-4 w-1/4">Học Viên</th><th className="p-4 w-1/4">Điểm Số</th><th className="p-4">Nhận xét</th><th className="p-4 w-24">Thao tác</th></tr></thead>
            <tbody>
              {dsHocVien.map(hv => {
                const kq = ketQuaList.find(k => k.ma_hoc_vien === hv.ma_hoc_vien);
                const biViPham = hv.hoc_vien?.cam_ket?.some((c: any) => c.ma_khoa_hoc === maKhoaHoc && c.bi_vi_pham === true);
                const laNghiHoc = hv.hoc_vien?.trang_thai === 'Nghỉ học';
                const biKhoa = biViPham || laNghiHoc;

                return (
                  <tr key={hv.ma_hoc_vien} className={`border-b hover:bg-slate-50 ${biKhoa ? 'bg-slate-100/60' : ''}`}>
                    <td className="p-4 font-medium">
                      <span className={biKhoa ? 'text-slate-400 line-through' : ''}>{hv.hoc_vien.ho_ten}</span>
                      {laNghiHoc && <p className="text-[11px] text-rose-600 font-bold">Đã nghỉ học</p>}
                      {biViPham && <p className="text-[11px] text-amber-600 font-bold">Vi phạm cam kết</p>}
                    </td>
                    <td className="p-4">
                      <input type="number" disabled={biKhoa} id={`diem_${hv.ma_hoc_vien}`} defaultValue={kq?.diem_so || ''} step="0.1" min="0" max="10" className="border w-24 p-2 rounded-lg bg-white disabled:bg-slate-200" placeholder="0 - 10" />
                    </td>
                    <td className="p-4">
                      <input type="text" disabled={biKhoa} id={`nx_kt_${hv.ma_hoc_vien}`} defaultValue={kq?.nhan_xet || ''} className="border w-full p-2 rounded-lg bg-white disabled:bg-slate-200" placeholder={biKhoa ? "Bị chặn do nghỉ học hoặc vi phạm cam kết" : "Ghi chú đánh giá bài làm..."} />
                    </td>
                    <td className="p-4">
                      <button disabled={biKhoa} onClick={() => handleSaveKetQua(hv.ma_hoc_vien)} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-3 py-1.5 rounded-lg text-xs font-bold w-full shadow-sm">Lưu</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {!selectedBkt && <div className="text-center p-12 border rounded-xl bg-slate-50/50 border-dashed text-slate-400 font-medium">Vui lòng chọn hoặc tạo bài kiểm tra để nhập điểm.</div>}

      {isTaoBkt && (
        <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4">
          <form className="bg-white p-5 rounded-xl shadow-xl w-full max-w-sm" onSubmit={async (e) => {
            e.preventDefault();
            const res = await fetch('/api/dao-tao/lop-hoc', { method: 'POST', body: JSON.stringify({ action: 'CREATE_BAI_KIEM_TRA', payload: { ten_bai_kiem_tra: (e.target as any).ten.value, ngay_kiem_tra: (e.target as any).ngay.value, ma_lop_hoc: maLop } }) }).then(r=>r.json());
            if(res.success) { setIsTaoBkt(false); reloadLop(); } else alert(res.message);
          }}>
            <h3 className="font-bold border-b pb-2 mb-4">Tạo Bài Kiểm Tra (Trực thuộc Lớp)</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-bold text-slate-700">Tên Bài Kiểm Tra</label><input required name="ten" className="w-full border p-2 rounded-lg text-sm mt-1" placeholder="Ví dụ: Kiểm tra 15p" /></div>
              <div><label className="text-xs font-bold text-slate-700">Ngày diễn ra</label><input required type="date" name="ngay" className="w-full border p-2 rounded-lg text-sm mt-1" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={()=>setIsTaoBkt(false)} className="px-4 py-2 border rounded-lg text-sm font-bold">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">Tạo Mới</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// 3. Component Tab Điểm Danh (Giải quyết yêu cầu số 2)
const DiemDanhTab = ({ maLop, maBuoiHoc, maKhoaHoc }: { maLop:number, maBuoiHoc:number, maKhoaHoc: number }) => {
  const [ds, setDs] = useState<any[]>([]);
  useEffect(() => { 
    fetch(`/api/dao-tao/lop-hoc?ma_lop_hoc=${maLop}&ma_buoi_hoc=${maBuoiHoc}`).then(r=>r.json()).then(res => setDs(res.data || [])); 
  }, [maLop, maBuoiHoc]);

  const updateDiemDanh = async (ma_hoc_vien: number, trang_thai: string, ghi_chu: string) => {
    await fetch('/api/dao-tao/lop-hoc', { method: 'POST', body: JSON.stringify({ action: 'UPSERT_DIEM_DANH', payload: { ma_buoi_hoc: maBuoiHoc, ma_hoc_vien, trang_thai, ghi_chu } }) });
    setDs(ds.map(d => d.ma_hoc_vien === ma_hoc_vien ? {...d, trang_thai, ghi_chu} : d));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 font-bold border-b text-slate-700"><tr><th className="p-4 w-1/4">Học Viên</th><th className="p-4 w-1/4">Trạng thái</th><th className="p-4">Ghi chú</th></tr></thead>
        <tbody>
          {ds.map(d => {
            const biViPham = d.cam_ket?.some((c: any) => c.ma_khoa_hoc === maKhoaHoc && c.bi_vi_pham === true);
            const laNghiHoc = d.trang_thai_hv === 'Nghỉ học' || d.trang_thai === 'Nghỉ học';
            const biKhoa = biViPham || laNghiHoc;

            return (
              <tr key={d.ma_hoc_vien} className={`border-b hover:bg-slate-50 ${biKhoa ? 'bg-slate-100/60' : ''}`}>
                <td className="p-4 font-medium">
                  <span className={biKhoa ? 'text-slate-400 line-through' : ''}>{d.ho_ten}</span>
                  {laNghiHoc && <span className="ml-2 text-xs text-rose-600 font-bold">(Nghỉ học)</span>}
                  {biViPham && <span className="ml-2 text-xs text-amber-600 font-bold">(Vi phạm CK)</span>}
                </td>
                <td className="p-4">
                  <select disabled={biKhoa} value={biKhoa ? "Vắng không phép" : d.trang_thai} onChange={(e) => updateDiemDanh(d.ma_hoc_vien, e.target.value, d.ghi_chu)} className={`border p-2 rounded-lg text-sm w-full font-semibold ${d.trang_thai === 'Có mặt' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50'}`}>
                    <option value="Chưa điểm danh">Chưa điểm danh</option>
                    <option value="Có mặt">Có mặt</option>
                    <option value="Vắng phép">Vắng phép</option>
                    <option value="Vắng không phép">Vắng không phép</option>
                    <option value="Đi muộn">Đi muộn</option>
                  </select>
                </td>
                <td className="p-4">
                  <input type="text" disabled={biKhoa} value={biKhoa ? "Học viên dừng học / vi phạm" : (d.ghi_chu||'')} onBlur={(e) => updateDiemDanh(d.ma_hoc_vien, d.trang_thai, e.target.value)} onChange={(e) => setDs(ds.map(item => item.ma_hoc_vien===d.ma_hoc_vien?{...item, ghi_chu:e.target.value}:item))} className="border w-full p-2 rounded-lg bg-white disabled:bg-slate-200" placeholder="Ghi chú thêm..."/>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// 4. Component Tab Nhận Xét (Giải quyết hoàn hảo yêu cầu số 2 & số 3)
const NhanXetTab = ({ maBuoiHoc, dsHocVien, maKhoaHoc }: { maBuoiHoc:number, dsHocVien:any[], maKhoaHoc: number }) => {
  const [dbNhanXet, setDbNhanXet] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Đồng bộ nạp dữ liệu nhận xét cũ từ CSDL về máy khách khi mở Tab hoặc đổi Buổi học
  const fetchSavedNhanXet = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/dao-tao/lop-hoc?ma_buoi_hoc_nx=${maBuoiHoc}`).then(r => r.json());
    if (res.success) {
      setDbNhanXet(res.data || []);
    }
    setLoading(false);
  }, [maBuoiHoc]);

  useEffect(() => {
    fetchSavedNhanXet();
  }, [fetchSavedNhanXet]);

  const saveNx = async (ma_hoc_vien: number, da_lam_bt: boolean, nd: string) => {
    const res = await fetch('/api/dao-tao/lop-hoc', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPSERT_NHAN_XET', payload: { ma_buoi_hoc: maBuoiHoc, ma_hoc_vien, da_lam_bai_tap: da_lam_bt, noi_dung_nhan_xet: nd } }) 
    }).then(r => r.json());
    
    if (res.success) {
      fetchSavedNhanXet(); // Cập nhật lại state cục bộ sau khi lưu
    }
  };

  if (loading) {
    return <div className="text-center p-6 text-sm text-slate-500 font-medium">Đang đồng bộ dữ liệu đánh giá từ server...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 font-bold border-b text-slate-700"><tr><th className="p-4 w-1/4">Học Viên</th><th className="p-4 text-center w-24">Đã làm BT</th><th className="p-4">Nhận xét chi tiết</th><th className="p-4 w-20">Lưu</th></tr></thead>
        <tbody>
          {dsHocVien.map(t => {
            const biViPham = t.hoc_vien?.cam_ket?.some((c: any) => c.ma_khoa_hoc === maKhoaHoc && c.bi_vi_pham === true);
            const laNghiHoc = t.hoc_vien?.trang_thai === 'Nghỉ học';
            const biKhoa = biViPham || laNghiHoc;

            // Tìm nhận xét tương ứng của học viên này trong CSDL đã fetch về
            const currentRecord = dbNhanXet.find(nx => nx.ma_hoc_vien === t.ma_hoc_vien);

            return (
              <tr key={t.ma_hoc_vien} className={`border-b hover:bg-slate-50 ${biKhoa ? 'bg-slate-100/60' : ''}`}>
                <td className="p-4 font-medium">
                  <span className={biKhoa ? 'text-slate-400 line-through' : ''}>{t.hoc_vien.ho_ten}</span>
                  {laNghiHoc && <p className="text-[11px] text-rose-600 font-bold">Đã nghỉ học</p>}
                  {biViPham && <p className="text-[11px] text-amber-600 font-bold">Vi phạm cam kết</p>}
                </td>
                <td className="p-4 text-center">
                  <input 
                    type="checkbox" 
                    disabled={biKhoa}
                    id={`bt_${t.ma_hoc_vien}`} 
                    key={`bt_key_${currentRecord?.da_lam_bai_tap}`}
                    defaultChecked={currentRecord?.da_lam_bai_tap || false}
                    className="w-5 h-5 text-blue-600 rounded disabled:opacity-50" 
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="text" 
                    disabled={biKhoa}
                    id={`nx_${t.ma_hoc_vien}`} 
                    defaultValue={currentRecord?.noi_dung_nhan_xet || ''}
                    className="border w-full p-2 rounded-lg bg-white disabled:bg-slate-200" 
                    placeholder={biKhoa ? "Không thể nhận xét học viên này" : "Ghi chú đánh giá thái độ học tập..."}
                  />
                </td>
                <td className="p-4">
                  <button 
                    disabled={biKhoa}
                    onClick={() => {
                      const checked = (document.getElementById(`bt_${t.ma_hoc_vien}`) as HTMLInputElement).checked;
                      const val = (document.getElementById(`nx_${t.ma_hoc_vien}`) as HTMLInputElement).value;
                      saveNx(t.ma_hoc_vien, checked, val); 
                      alert('Đã cập nhật nhận xét học viên thành công!');
                    }} 
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-3 py-1.5 rounded-lg text-xs font-bold w-full shadow-sm"
                  >
                    Lưu
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Component Kế Hoạch Giảng Dạy giữ nguyên logic gốc của bạn
const KeHoachGiangDayTab = ({ maKhoaHoc, giaoViens, dsGvPhanCong }: { maKhoaHoc:number, giaoViens:any[], dsGvPhanCong:any[] }) => {
  const [kh, setKh] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabTao, setTabTao] = useState<'mau'|'thucong'>('mau');
  const [khMau, setKhMau] = useState<any[]>([]);

  const fetchKh = useCallback(async () => {
    if (!maKhoaHoc) return;
    const res = await fetch(`/api/dao-tao/lop-hoc?ke_hoach_giang_day=${maKhoaHoc}`).then(r=>r.json());
    if (res.success) setKh(res.data);
  }, [maKhoaHoc]);

  const fetchKhMau = async () => {
    const res = await fetch('/api/dao-tao/lop-hoc?khgd_mau=true').then(r=>r.json());
    if(res.success) setKhMau(res.data);
  };

  useEffect(() => { fetchKh(); }, [fetchKh]);

  const handleCreateKh = async (payload: any) => {
    const res = await fetch('/api/dao-tao/lop-hoc', { method: 'POST', body: JSON.stringify({ action: 'CREATE_KE_HOACH', payload: { ...payload, ma_khoa_hoc: maKhoaHoc } }) }).then(r=>r.json());
    if(res.success) { setIsModalOpen(false); fetchKh(); } else alert(res.message);
  };

  const delKh = async (id: number) => {
    if(!confirm('Xóa kế hoạch này?')) return;
    await fetch(`/api/dao-tao/lop-hoc?action=DELETE_KE_HOACH&ma_ke_hoach_giang_day=${id}`, { method: 'DELETE' });
    fetchKh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
           <h3 className="font-bold text-lg text-slate-800">Kế Hoạch Giảng Dạy Khóa Học</h3>
           <p className="text-xs text-slate-500">Giáo án phân bổ cho toàn bộ khóa học liên kết với lớp này.</p>
        </div>
        <button disabled={!maKhoaHoc} onClick={() => {setIsModalOpen(true); fetchKhMau();}} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">+ Thêm Kế Hoạch</button>
      </div>

      <div className="grid gap-3">
        {kh.length === 0 && <div className="text-center p-10 bg-white rounded-xl border border-dashed text-slate-400">Chưa thiết lập kế hoạch giảng dạy cho khóa này hoặc lớp chưa gán khóa học.</div>}
        {kh.map(k => (
          <div key={k.ma_ke_hoach_giang_day} className="border border-slate-200 p-4 rounded-xl bg-white flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-slate-800 text-base">{k.noi_dung}</p>
              <div className="text-xs text-slate-500 mt-1 flex gap-4">
                 <span className="bg-slate-50 px-2 py-0.5 rounded border">GV Chuẩn Bị: <b className="text-blue-700">{k.giao_vien?.ho_ten}</b></span>
                 <span>Lịch học: <b>{k.lich_day}</b></span>
                 <span>Thời gian: <b>{k.thoi_gian}</b></span>
              </div>
            </div>
            <button onClick={() => delKh(k.ma_ke_hoach_giang_day)} className="text-rose-500 font-bold text-xs bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition border border-rose-100">Xóa</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col h-[70vh]">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-lg">Tạo Kế Hoạch Giảng Dạy Mới</h3>
              <button onClick={()=>setIsModalOpen(false)} className="text-slate-400 font-bold text-xl">×</button>
            </div>
            
            <div className="flex border-b text-sm font-bold">
              <button onClick={()=>setTabTao('mau')} className={`flex-1 py-3 ${tabTao==='mau'?'text-blue-700 border-b-2 border-blue-600 bg-blue-50/50':'text-slate-500'}`}>1. Chọn KHGD đã có</button>
              <button onClick={()=>setTabTao('thucong')} className={`flex-1 py-3 ${tabTao==='thucong'?'text-blue-700 border-b-2 border-blue-600 bg-blue-50/50':'text-slate-500'}`}>2. Tạo mới thủ công</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-slate-50">
              {tabTao === 'mau' && (
                <div className="space-y-3">
                  {khMau.map(m => (
                    <div key={m.ma_ke_hoach_giang_day} className="bg-white border p-3 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm text-slate-800">{m.noi_dung}</p>
                        <p className="text-xs text-slate-400 mt-1">Từ Khóa: {m.khoa_hoc?.ten_khoa_hoc}</p>
                      </div>
                      <button onClick={() => handleCreateKh({ noi_dung: m.noi_dung, lich_day: m.lich_day, thoi_gian: m.thoi_gian, ma_giao_vien: dsGvPhanCong[0]?.ma_giao_vien || giaoViens[0]?.ma_giao_vien })} className="text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg text-xs border border-blue-100">Áp dụng</button>
                    </div>
                  ))}
                </div>
              )}
              {tabTao === 'thucong' && (
                <form className="bg-white p-5 rounded-xl border space-y-4 shadow-sm" onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateKh({
                    noi_dung: (e.target as any).nd.value, lich_day: (e.target as any).ld.value,
                    thoi_gian: (e.target as any).tg.value, ma_giao_vien: Number((e.target as any).gv.value)
                  });
                }}>
                  <div><label className="text-xs font-bold text-slate-700">Giáo Viên Lên Giáo Án *</label>
                    <select required name="gv" className="w-full border p-2 rounded-lg text-sm mt-1 bg-slate-50">
                      {giaoViens.map(g => <option key={g.ma_giao_vien} value={g.ma_giao_vien}>{g.ho_ten}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-bold text-slate-700">Nội dung Kế hoạch *</label><textarea required name="nd" rows={3} className="w-full border p-2 rounded-lg text-sm mt-1" placeholder="Ví dụ: Ôn tập Unit 1-3..."></textarea></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-slate-700">Lịch Dạy (Chủ đề)</label><input name="ld" className="w-full border p-2 rounded-lg text-sm mt-1" placeholder="Ví dụ: Buổi 1, Tuần 1" /></div>
                    <div><label className="text-xs font-bold text-slate-700">Thời gian (Phút/Giờ)</label><input name="tg" className="w-full border p-2 rounded-lg text-sm mt-1" placeholder="Ví dụ: 90 phút" /></div>
                  </div>
                  <div className="flex justify-end pt-2"><button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold">Thêm Kế Hoạch</button></div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};