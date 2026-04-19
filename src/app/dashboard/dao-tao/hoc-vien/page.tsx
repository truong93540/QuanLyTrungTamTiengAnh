'use client'

import { useState, useEffect } from 'react'
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaSave, FaUserGraduate } from 'react-icons/fa'

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
        trang_thai: 'Đang học',
    })

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/dao-tao/hoc-vien')
            const result = await res.json()
            if (Array.isArray(result)) setData(result)
        } catch (error) {
            console.error(error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const filteredData = data.filter(
        (hv) =>
            hv.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (hv.so_dien_thoai && hv.so_dien_thoai.includes(searchTerm)),
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const method = editingId ? 'PUT' : 'POST'
        const body = editingId ? { ...formData, ma_hoc_vien: editingId } : formData

        const res = await fetch('/api/dao-tao/hoc-vien', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        if (res.ok) {
            alert('Lưu hồ sơ thành công!')
            setIsFormOpen(false)
            setEditingId(null)
            setFormData({
                ho_ten: '',
                ngay_sinh: '',
                gioi_tinh: 'Nam',
                so_dien_thoai: '',
                email: '',
                dia_chi: '',
                trang_thai: 'Đang học',
            })
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
            trang_thai: hv.trang_thai || 'Đang học',
        })
        setEditingId(hv.ma_hoc_vien)
        setIsFormOpen(true)
    }

    return (
        <div className="p-6 bg-white min-h-screen text-slate-900">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b-2 border-slate-100 pb-4">
                <h1 className="text-3xl font-extrabold text-blue-900 flex items-center gap-3">
                    <FaUserGraduate className="text-blue-700" /> QUẢN LÝ HỒ SƠ HỌC VIÊN
                </h1>
                <button
                    onClick={() => {
                        setIsFormOpen(true)
                        setEditingId(null)
                    }}
                    className="bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-800 shadow-md transition font-bold">
                    <FaUserPlus /> Thêm học viên
                </button>
            </div>

            {/* Tìm kiếm */}
            <div className="mb-6 relative max-w-md">
                <FaSearch className="absolute left-3 top-3 text-slate-500" />
                <input
                    type="text"
                    placeholder="Tìm theo tên hoặc số điện thoại..."
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Form Thêm/Sửa */}
            {isFormOpen && (
                <div className="mb-8 p-6 bg-slate-50 border-2 border-slate-300 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold mb-6 text-blue-900 border-b-2 border-slate-200 pb-2">
                        {editingId ? 'Cập nhật thông tin học viên' : 'Đăng ký hồ sơ học viên mới'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-black mb-1">
                                Họ và tên *
                            </label>
                            <input
                                required
                                className="w-full p-2.5 border-2 border-slate-300 rounded text-black font-medium"
                                value={formData.ho_ten}
                                onChange={(e) =>
                                    setFormData({ ...formData, ho_ten: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black mb-1">
                                Ngày sinh *
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full p-2.5 border-2 border-slate-300 rounded text-black font-medium"
                                value={formData.ngay_sinh}
                                onChange={(e) =>
                                    setFormData({ ...formData, ngay_sinh: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black mb-1">
                                Giới tính
                            </label>
                            <select
                                className="w-full p-2.5 border-2 border-slate-300 rounded text-black font-medium"
                                value={formData.gioi_tinh}
                                onChange={(e) =>
                                    setFormData({ ...formData, gioi_tinh: e.target.value })
                                }>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black mb-1">
                                Số điện thoại
                            </label>
                            <input
                                className="w-full p-2.5 border-2 border-slate-300 rounded text-black font-medium"
                                value={formData.so_dien_thoai}
                                onChange={(e) =>
                                    setFormData({ ...formData, so_dien_thoai: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full p-2.5 border-2 border-slate-300 rounded text-black font-medium"
                                placeholder="ví dụ: nguyenvan@email.com"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-black mb-1">
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                className="w-full p-2.5 border-2 border-slate-300 rounded text-black font-medium"
                                placeholder="Nhập địa chỉ chi tiết..."
                                value={formData.dia_chi}
                                onChange={(e) =>
                                    setFormData({ ...formData, dia_chi: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black mb-1">
                                Trạng thái
                            </label>
                            <select
                                className="w-full p-2.5 border-2 border-slate-300 rounded bg-white text-black font-bold"
                                value={formData.trang_thai}
                                onChange={(e) =>
                                    setFormData({ ...formData, trang_thai: e.target.value })
                                }>
                                <option value="Đang học">Đang học</option>
                                <option value="Bảo lưu">Bảo lưu</option>
                                <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                                <option value="Nghỉ học">Nghỉ học</option>
                            </select>
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-3 mt-4 border-t-2 border-slate-200 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="px-6 py-2 bg-slate-300 text-black font-bold rounded-lg hover:bg-slate-400 transition">
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-2 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 flex items-center gap-2 shadow-md transition">
                                <FaSave /> Lưu hồ sơ
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Bảng Danh Sách */}
            <div className="overflow-x-auto rounded-xl border-2 border-slate-300 shadow-md">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-blue-600 text-white font-bold uppercase">
                        <tr>
                            <th className="p-4 border-r border-slate-700 text-center">Mã HV</th>
                            <th className="p-4 border-r border-slate-700">Họ và tên</th>
                            <th className="p-4 border-r border-slate-700">Ngày sinh</th>
                            <th className="p-4 border-r border-slate-700 text-center">G.Tính</th>
                            <th className="p-4 border-r border-slate-700">Liên hệ & Địa chỉ</th>
                            <th className="p-4 border-r border-slate-700 text-center">Trạng thái</th>
                            <th className="p-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="text-center p-10 font-bold text-xl text-slate-600">
                                    Đang tải hồ sơ...
                                </td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center p-10 text-slate-500 font-bold">
                                    Chưa có dữ liệu học viên.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((hv) => (
                                <tr
                                    key={hv.ma_hoc_vien}
                                    className="border-b-2 border-slate-200 hover:bg-slate-50 transition">
                                    <td className="p-4 border-r border-slate-200 text-center font-bold text-slate-600">
                                        {hv.ma_hoc_vien}
                                    </td>
                                    <td className="p-4 border-r border-slate-200 font-black text-slate-900">
                                        {hv.ho_ten}
                                    </td>
                                    <td className="p-4 border-r border-slate-200 font-medium">
                                        {new Date(hv.ngay_sinh).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4 border-r border-slate-200 text-center font-bold">
                                        {hv.gioi_tinh || '-'}
                                    </td>
                                    <td className="p-4 border-r border-slate-200">
                                        <div className="text-blue-800 font-black">
                                            {hv.so_dien_thoai || 'Chưa có SĐT'}
                                        </div>
                                        <div className="text-xs text-slate-700 font-bold mb-1">
                                            {hv.email}
                                        </div>
                                        <div className="text-xs text-slate-900 bg-slate-100 p-1 rounded italic">
                                            {hv.dia_chi || 'Chưa cập nhật địa chỉ'}
                                        </div>
                                    </td>
                                    <td className="p-4 border-r border-slate-200 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-black shadow-sm inline-block ${
                                                hv.trang_thai === 'Đang học'
                                                    ? 'bg-green-200 text-green-900'
                                                    : hv.trang_thai === 'Bảo lưu'
                                                      ? 'bg-yellow-200 text-yellow-900'
                                                      : 'bg-red-100 text-red-900'
                                            }`}>
                                            {hv.trang_thai || 'Chưa rõ'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => handleEdit(hv)}
                                                className="p-2.5 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-lg shadow-sm transition"
                                                title="Chỉnh sửa">
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Xóa hồ sơ học viên này?')) {
                                                        try {
                                                            const res = await fetch(`/api/dao-tao/hoc-vien?id=${hv.ma_hoc_vien}`, { method: 'DELETE' });
                                                            
                                                            // Kiểm tra xem backend trả về thành công (status 200) hay lỗi (status 400, 500)
                                                            if (res.ok) {
                                                                alert('Xóa hồ sơ thành công!');
                                                                fetchData(); // Chỉ gọi lại data khi xóa thực sự thành công
                                                            } else {
                                                                // Đọc thông báo lỗi từ backend trả về
                                                                const errorData = await res.json();
                                                                alert(`Lỗi: ${errorData.error || 'Không thể xóa vì dữ liệu đang được sử dụng ở nơi khác!'}`);
                                                            }
                                                        } catch (error) {
                                                            alert('Có lỗi xảy ra khi kết nối đến máy chủ.');
                                                        }
                                                    }
                                                }}
                                                className="p-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg shadow-sm transition"
                                                title="Xóa hồ sơ">
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}