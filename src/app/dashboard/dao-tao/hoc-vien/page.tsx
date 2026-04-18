// File: src/app/dashboard/dao-tao/hoc-vien/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaSave, FaTimes, FaUserGraduate } from 'react-icons/fa'

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

export default function HoSoHocVienPage() {
    const [data, setData] = useState<HocVien[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)

    const [formData, setFormData] = useState({
        ho_ten: '',
        ngay_sinh: '',
        gioi_tinh: 'Nam',
        so_dien_thoai: '',
        email: '',
        dia_chi: '',
        trang_thai: 'Đang học'
    })

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/hoc-vien')
            const result = await res.json()
            if (Array.isArray(result)) setData(result)
        } catch (error) { console.error(error) }
        setIsLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const filteredData = data.filter(hv => 
        hv.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hv.so_dien_thoai && hv.so_dien_thoai.includes(searchTerm))
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const method = editingId ? 'PUT' : 'POST'
        const body = editingId ? { ...formData, ma_hoc_vien: editingId } : formData

        const res = await fetch('/api/hoc-vien', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        if (res.ok) {
            alert('Lưu hồ sơ thành công!')
            setIsFormOpen(false)
            setEditingId(null)
            setFormData({ ho_ten: '', ngay_sinh: '', gioi_tinh: 'Nam', so_dien_thoai: '', email: '', dia_chi: '', trang_thai: 'Đang học' })
            fetchData()
        }
    }

    const handleEdit = (hv: HocVien) => {
        setFormData({
            ho_ten: hv.ho_ten,
            ngay_sinh: hv.ngay_sinh.split('T')[0],
            gioi_tinh: hv.gioi_tinh || 'Nam',
            so_dien_thoai: hv.so_dien_thoai || '',
            email: hv.email || '',
            dia_chi: hv.dia_chi || '',
            trang_thai: hv.trang_thai || 'Đang học'
        })
        setEditingId(hv.ma_hoc_vien)
        setIsFormOpen(true)
    }

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                    <FaUserGraduate className="text-blue-600" /> QUẢN LÝ HỒ SƠ HỌC VIÊN
                </h1>
                <button 
                    onClick={() => { setIsFormOpen(true); setEditingId(null); }}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg transition"
                >
                    <FaUserPlus /> Thêm học viên
                </button>
            </div>

            {/* Tìm kiếm */}
            <div className="mb-6 relative max-w-md">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Tìm theo tên hoặc số điện thoại..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Form Thêm/Sửa */}
            {isFormOpen && (
                <div className="mb-8 p-6 bg-gray-50 border-2 border-blue-100 rounded-2xl shadow-inner">
                    <h2 className="text-lg font-bold mb-4 text-blue-800 underline">
                        {editingId ? 'Cập nhật thông tin học viên' : 'Đăng ký hồ sơ học viên mới'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Họ và tên *</label>
                            <input required className="w-full p-2 border rounded" value={formData.ho_ten} onChange={e => setFormData({...formData, ho_ten: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Ngày sinh *</label>
                            <input type="date" required className="w-full p-2 border rounded" value={formData.ngay_sinh} onChange={e => setFormData({...formData, ngay_sinh: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Giới tính</label>
                            <select className="w-full p-2 border rounded" value={formData.gioi_tinh} onChange={e => setFormData({...formData, gioi_tinh: e.target.value})}>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Số điện thoại</label>
                            <input className="w-full p-2 border rounded" value={formData.so_dien_thoai} onChange={e => setFormData({...formData, so_dien_thoai: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                            <input 
                                type="email" 
                                className="w-full p-2 border rounded" 
                                placeholder="ví dụ: nguyenvan@email.com"
                                value={formData.email} 
                                onChange={e => setFormData({...formData, email: e.target.value})} 
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Địa chỉ</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border rounded" 
                                placeholder="Nhập địa chỉ chi tiết..."
                                value={formData.dia_chi} 
                                onChange={e => setFormData({...formData, dia_chi: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Trạng thái</label>
                            <select className="w-full p-2 border rounded bg-yellow-50 font-bold" value={formData.trang_thai} onChange={e => setFormData({...formData, trang_thai: e.target.value})}>
                                <option value="Đang học">Đang học</option>
                                <option value="Bảo lưu">Bảo lưu</option>
                                <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                                <option value="Nghỉ học">Nghỉ học</option>
                            </select>
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-3 mt-4 border-t pt-4">
                            <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Hủy bỏ</button>
                            <button type="submit" className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                                <FaSave /> Lưu hồ sơ
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Bảng Danh Sách */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-blue-50 text-blue-900 font-bold uppercase">
                        <tr>
                            <th className="p-4">Mã HV</th>
                            <th className="p-4">Họ và tên</th>
                            <th className="p-4">Ngày sinh</th>
                            <th className="p-4">Liên hệ</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={6} className="text-center p-10">Đang tải hồ sơ...</td></tr>
                        ) : filteredData.length === 0 ? (
                            <tr><td colSpan={6} className="text-center p-10 text-gray-500">Chưa có dữ liệu học viên.</td></tr>
                        ) : filteredData.map((hv) => (
                            <tr key={hv.ma_hoc_vien} className="border-b hover:bg-blue-50/30 transition">
                                <td className="p-4 text-gray-500">HV-{hv.ma_hoc_vien}</td>
                                <td className="p-4 font-bold text-gray-800">{hv.ho_ten}</td>
                                <td className="p-4">{new Date(hv.ngay_sinh).toLocaleDateString('vi-VN')}</td>
                                <td className="p-4">
                                    <div className="text-blue-600 font-medium">{hv.so_dien_thoai || 'Trống'}</div>
                                    <div className="text-xs text-gray-400">{hv.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        hv.trang_thai === 'Đang học' ? 'bg-green-100 text-green-700' :
                                        hv.trang_thai === 'Bảo lưu' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {hv.trang_thai || 'Chưa rõ'}
                                    </span>
                                </td>
                                <td className="p-4 flex justify-center gap-2">
                                    <button onClick={() => handleEdit(hv)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><FaEdit /></button>
                                    <button onClick={async () => {
                                        if (confirm('Xóa hồ sơ học viên này?')) {
                                            await fetch(`/api/hoc-vien?id=${hv.ma_hoc_vien}`, { method: 'DELETE' })
                                            fetchData()
                                        }
                                    }} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}