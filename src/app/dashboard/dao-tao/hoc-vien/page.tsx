'use client'

import { useState, useEffect } from 'react'
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaSave, FaUserGraduate, FaTimes, FaMoneyBillWave } from 'react-icons/fa'

interface HocVien {
    ma_hoc_vien: number
    ho_ten: string
    ngay_sinh: string
    gioi_tinh: string
    so_dien_thoai: string
    email: string
    dia_chi: string
    trang_thai: string
}

interface NhanSu {
    ma_nhan_su: number
    ho_ten: string
}

export default function HoSoHocVienPage() {
    const [data, setData] = useState<HocVien[]>([])
    const [nhanSuList, setNhanSuList] = useState<NhanSu[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    
    // State quản lý Modals
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete' | null>(null)
    const [selectedHocVien, setSelectedHocVien] = useState<HocVien | null>(null)

    // Form Học Viên
    const [formData, setFormData] = useState({
        ho_ten: '',
        ngay_sinh: '',
        gioi_tinh: 'Nam',
        so_dien_thoai: '',
        email: '',
        dia_chi: '',
        trang_thai: 'Đang học',
    })

    // Form Mini Phiếu Thu
    const [isCreateReceipt, setIsCreateReceipt] = useState(false)
    const [receiptData, setReceiptData] = useState({
        so_tien: '',
        noi_dung: 'Thu học phí đăng ký mới',
        ma_nhan_su: '',
    })

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [resHV, resNS] = await Promise.all([
                fetch('/api/dao-tao/hoc-vien'),
                fetch('/api/dao-tao/nhan-su') // Giả định endpoint nhân sự của bạn
            ])
            const resultHV = await resHV.json()
            const resultNS = await resNS.json()
            if (Array.isArray(resultHV)) setData(resultHV)
            if (Array.isArray(resultNS)) setNhanSuList(resultNS)
        } catch (error) {
            console.error(error)
        }
        setIsLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const handleOpenAdd = () => {
        setFormData({ ho_ten: '', ngay_sinh: '', gioi_tinh: 'Nam', so_dien_thoai: '', email: '', dia_chi: '', trang_thai: 'Đang học' })
        setIsCreateReceipt(false)
        setReceiptData({ so_tien: '', noi_dung: 'Thu học phí đăng ký mới', ma_nhan_su: '' })
        setModalMode('add')
    }

    const handleOpenEdit = (hv: HocVien) => {
        setFormData({
            ho_ten: hv.ho_ten,
            ngay_sinh: hv.ngay_sinh.split('T')[0],
            gioi_tinh: hv.gioi_tinh || 'Nam',
            so_dien_thoai: hv.so_dien_thoai || '',
            email: hv.email || '',
            dia_chi: hv.dia_chi || '',
            trang_thai: hv.trang_thai || 'Đang học',
        })
        setSelectedHocVien(hv)
        setModalMode('edit')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            // 1. Tạo hoặc cập nhật Học viên
            const method = modalMode === 'edit' ? 'PUT' : 'POST'
            const body = modalMode === 'edit' ? { ...formData, ma_hoc_vien: selectedHocVien?.ma_hoc_vien } : formData

            const resHV = await fetch('/api/dao-tao/hoc-vien', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const newHV = await resHV.json()

            if (!resHV.ok) throw new Error(newHV.error || 'Lỗi khi lưu học viên')

            // 2. Nếu là thêm mới và có tích chọn tạo phiếu thu
            if (modalMode === 'add' && isCreateReceipt) {
                if (!receiptData.so_tien || !receiptData.ma_nhan_su) {
                    alert('Học viên đã tạo nhưng thông tin phiếu thu chưa đủ!')
                } else {
                    const resPT = await fetch('/api/tai-chinh/phieu-thu', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...receiptData,
                            ma_hoc_vien: newHV.ma_hoc_vien, // Lấy ID vừa tạo
                            ngay_thu: new Date().toISOString()
                        }),
                    })
                    if (!resPT.ok) alert('Học viên đã tạo nhưng không thể tạo phiếu thu kèm theo.')
                }
            }

            alert('Thao tác thành công!')
            setModalMode(null)
            fetchData()
        } catch (error: any) {
            alert(error.message)
        }
    }

    const handleDelete = async () => {
        if (!selectedHocVien) return
        const res = await fetch(`/api/dao-tao/hoc-vien?id=${selectedHocVien.ma_hoc_vien}`, { method: 'DELETE' })
        const result = await res.json()
        if (res.ok) {
            alert('Xóa thành công!')
            setModalMode(null)
            fetchData()
        } else {
            alert(`Lỗi: ${result.error}`)
        }
    }

    const filteredData = data.filter(hv => 
        hv.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) || 
        hv.so_dien_thoai?.includes(searchTerm)
    )

    return (
        <div className="p-6 bg-slate-50 min-h-screen text-slate-900">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-black text-blue-900 flex items-center gap-3">
                    <FaUserGraduate className="text-blue-600" /> QUẢN LÝ HỒ SƠ HỌC VIÊN
                </h1>
                <button onClick={handleOpenAdd} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md transition font-bold">
                    <FaUserPlus /> Thêm học viên mới
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 relative max-w-md">
                <FaSearch className="absolute left-3 top-3 text-slate-400" />
                <input
                    type="text"
                    placeholder="Tìm theo tên hoặc số điện thoại..."
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none font-bold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-blue-600 text-white text-sm uppercase">
                        <tr>
                            <th className="p-4">Mã HV</th>
                            <th className="p-4">Họ và tên</th>
                            <th className="p-4">Giới tính</th>
                            <th className="p-4">Liên hệ / Địa chỉ</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan={6} className="p-10 text-center font-bold">Đang tải...</td></tr>
                        ) : filteredData.map(hv => (
                            <tr key={hv.ma_hoc_vien} className="hover:bg-blue-50/50 transition">
                                <td className="p-4 font-bold text-slate-500">#{hv.ma_hoc_vien}</td>
                                <td className="p-4 font-black">{hv.ho_ten}</td>
                                <td className="p-4 font-bold">{hv.gioi_tinh}</td>
                                <td className="p-4 text-sm">
                                    <div className="font-bold text-blue-600">{hv.so_dien_thoai}</div>
                                    <div className="text-slate-500 italic">{hv.dia_chi}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black ${hv.trang_thai === 'Đang học' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {hv.trang_thai}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => handleOpenEdit(hv)} className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition"><FaEdit /></button>
                                        <button onClick={() => { setSelectedHocVien(hv); setModalMode('delete'); }} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL THÊM / SỬA */}
            {(modalMode === 'add' || modalMode === 'edit') && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-black text-blue-900 uppercase">
                                {modalMode === 'add' ? 'Đăng ký học viên mới' : 'Cập nhật thông tin học viên'}
                            </h2>
                            <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Phần thông tin học viên */}
                                <div className="space-y-4">
                                    <h3 className="font-black text-slate-400 text-xs uppercase tracking-widest border-b pb-2">Thông tin cá nhân</h3>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Họ và tên *</label>
                                        <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold" 
                                            value={formData.ho_ten} onChange={e => setFormData({...formData, ho_ten: e.target.value})} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Ngày sinh</label>
                                            <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold" 
                                                value={formData.ngay_sinh} onChange={e => setFormData({...formData, ngay_sinh: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Giới tính</label>
                                            <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold" 
                                                value={formData.gioi_tinh} onChange={e => setFormData({...formData, gioi_tinh: e.target.value})}>
                                                <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Số điện thoại</label>
                                        <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold" 
                                            value={formData.so_dien_thoai} onChange={e => setFormData({...formData, so_dien_thoai: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Địa chỉ</label>
                                        <textarea className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold" rows={2}
                                            value={formData.dia_chi} onChange={e => setFormData({...formData, dia_chi: e.target.value})} />
                                    </div>
                                </div>

                                {/* Phần trạng thái & Mini Phiếu thu */}
                                <div className="space-y-4">
                                    <h3 className="font-black text-slate-400 text-xs uppercase tracking-widest border-b pb-2">Học tập & Tài chính</h3>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Trạng thái hồ sơ</label>
                                        <select className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-lg font-black text-blue-700" 
                                            value={formData.trang_thai} onChange={e => setFormData({...formData, trang_thai: e.target.value})}>
                                            <option value="Đang học">Đang học</option><option value="Bảo lưu">Bảo lưu</option><option value="Nghỉ học">Nghỉ học</option>
                                        </select>
                                    </div>

                                    {/* Mini Phiếu Thu - Chỉ hiện khi Thêm mới */}
                                    {modalMode === 'add' && (
                                        <div className={`mt-6 p-4 rounded-xl border-2 transition-all ${isCreateReceipt ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}`}>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" className="w-5 h-5 accent-green-600" checked={isCreateReceipt} onChange={e => setIsCreateReceipt(e.target.checked)} />
                                                <span className="font-black flex items-center gap-2">
                                                    <h1 /> Lập phiếu thu học phí
                                                </span>
                                            </label>

                                            {isCreateReceipt && (
                                                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                                                    <div>
                                                        <label className="block text-xs font-black uppercase mb-1">Số tiền thu (VNĐ) *</label>
                                                        <input type="number" className="w-full p-2 border border-green-200 rounded font-black text-green-700"
                                                            value={receiptData.so_tien} onChange={e => setReceiptData({...receiptData, so_tien: e.target.value})} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-black uppercase mb-1">Nhân sự lập phiếu *</label>
                                                        <select className="w-full p-2 border border-green-200 rounded font-bold"
                                                            value={receiptData.ma_nhan_su} onChange={e => setReceiptData({...receiptData, ma_nhan_su: e.target.value})}>
                                                            <option value="">-- Chọn nhân sự --</option>
                                                            {nhanSuList.map(ns => <option key={ns.ma_nhan_su} value={ns.ma_nhan_su}>{ns.ho_ten}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-black uppercase mb-1">Ghi chú phiếu thu</label>
                                                        <input className="w-full p-2 border border-green-200 rounded text-sm italic"
                                                            value={receiptData.noi_dung} onChange={e => setReceiptData({...receiptData, noi_dung: e.target.value})} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 pt-6 border-t">
                                <button type="button" onClick={() => setModalMode(null)} className="px-6 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition">Hủy bỏ</button>
                                <button type="submit" className="px-10 py-2.5 bg-blue-600 text-white font-black rounded-lg hover:bg-blue-700 shadow-lg flex items-center gap-2 transition">
                                    <FaSave /> {modalMode === 'add' ? 'XÁC NHẬN ĐĂNG KÝ' : 'LƯU THAY ĐỔI'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL XÓA */}
            {modalMode === 'delete' && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaTrash size={40} />
                        </div>
                        <h2 className="text-xl font-black mb-2">Xác nhận xóa?</h2>
                        <p className="text-slate-500 mb-6 font-medium">Hành động này không thể hoàn tác. Hồ sơ học viên <span className="font-bold text-slate-900">{selectedHocVien?.ho_ten}</span> sẽ bị xóa vĩnh viễn.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setModalMode(null)} className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Hủy</button>
                            <button onClick={handleDelete} className="flex-1 py-3 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-lg">Xóa ngay</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}