'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaPlus, FaSave, FaSearch, FaTimes, FaTrash, FaUndo } from 'react-icons/fa'

interface GiaoVien {
    ma_giao_vien: number
    ho_ten: string
    ngay_sinh?: string | null
    gioi_tinh?: string | null
    so_dien_thoai?: string | null
    email?: string | null
    dia_chi?: string | null
    ma_chuc_vu: number
    ma_phong_ban: number
    chucVu?: { ten_chuc_vu: string }
    phongBan?: { ten_phong_ban: string }
}

const emptyForm = () => ({
    ma_giao_vien: '',
    ho_ten: '',
    ngay_sinh: '',
    gioi_tinh: '',
    so_dien_thoai: '',
    email: '',
    dia_chi: '',
    ma_chuc_vu: '',
    ma_phong_ban: '',
})

export default function QuanLyGiaoVienPage() {
    const [data, setData] = useState<GiaoVien[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // State Modal & Form
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState(emptyForm())
    const [searchData, setSearchData] = useState({ ma_giao_vien: '', ho_ten: '', so_dien_thoai: '', ma_phong_ban: '' })

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage))

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    const loadDanhSach = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/dao-tao/giao-vien')
            if (response.ok) {
                const result = await response.json()
                setData(Array.isArray(result) ? result : [])
            }
        } catch (error) {
            console.error('Lỗi tải danh sách giáo viên:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadDanhSach()
    }, [])

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchData({ ...searchData, [e.target.name]: e.target.value })
    }

    const handleOpenAddModal = () => {
        setFormData(emptyForm())
        setEditingId(null)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setFormData(emptyForm())
        setEditingId(null)
    }

    const handleSave = async () => {
        if (!formData.ho_ten?.trim()) {
            alert('Vui lòng nhập họ tên giáo viên.')
            return
        }
        if (!formData.ma_chuc_vu || !formData.ma_phong_ban) {
            alert('Vui lòng nhập Mã Chức vụ và Mã Phòng ban.')
            return
        }

        try {
            const method = editingId ? 'PUT' : 'POST'
            const payload: Record<string, unknown> = {
                ho_ten: formData.ho_ten.trim(),
                ngay_sinh: formData.ngay_sinh || null,
                gioi_tinh: formData.gioi_tinh || null,
                so_dien_thoai: formData.so_dien_thoai || null,
                email: formData.email || null,
                dia_chi: formData.dia_chi || null,
                ma_chuc_vu: Number(formData.ma_chuc_vu),
                ma_phong_ban: Number(formData.ma_phong_ban),
            }
            if (editingId) payload.ma_giao_vien = editingId

            const response = await fetch('/api/dao-tao/giao-vien', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const json = await response.json().catch(() => ({}))

            if (response.ok) {
                alert(editingId ? 'Cập nhật giáo viên thành công.' : 'Thêm giáo viên mới thành công.')
                handleCloseModal()
                loadDanhSach()
                setCurrentPage(1)
            } else {
                alert((json as { error?: string }).error || 'Có lỗi khi lưu dữ liệu.')
            }
        } catch (error) {
            console.error(error)
            alert('Không thể kết nối máy chủ.')
        }
    }

    const handleEditClick = (row: GiaoVien) => {
        const formatNgay = (dateStr?: string | null) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : ''

        setFormData({
            ma_giao_vien: row.ma_giao_vien.toString(),
            ho_ten: row.ho_ten,
            ngay_sinh: formatNgay(row.ngay_sinh),
            gioi_tinh: row.gioi_tinh || '',
            so_dien_thoai: row.so_dien_thoai || '',
            email: row.email || '',
            dia_chi: row.dia_chi || '',
            ma_chuc_vu: row.ma_chuc_vu.toString(),
            ma_phong_ban: row.ma_phong_ban.toString(),
        })
        setEditingId(row.ma_giao_vien)
        setIsModalOpen(true)
    }

    const handleDeleteClick = async (id: number) => {
        const ok = window.confirm('Bạn có chắc muốn xóa giáo viên này?')
        if (!ok) return

        try {
            const response = await fetch(`/api/dao-tao/giao-vien?id=${id}`, { method: 'DELETE' })
            const json = await response.json().catch(() => ({}))

            if (response.ok) {
                setData((prev) => prev.filter((item) => item.ma_giao_vien !== id))
                alert('Đã xóa giáo viên.')
            } else {
                alert((json as { error?: string }).error || 'Không xóa được.')
            }
        } catch (error) {
            console.error(error)
            alert('Không thể kết nối máy chủ.')
        }
    }

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchData.ma_giao_vien) params.append('ma_giao_vien', searchData.ma_giao_vien)
            if (searchData.ho_ten) params.append('ho_ten', searchData.ho_ten)
            if (searchData.so_dien_thoai) params.append('so_dien_thoai', searchData.so_dien_thoai)
            if (searchData.ma_phong_ban) params.append('ma_phong_ban', searchData.ma_phong_ban)

            const response = await fetch(`/api/dao-tao/giao-vien?${params.toString()}`)
            if (response.ok) {
                const result = await response.json()
                setData(Array.isArray(result) ? result : [])
                setCurrentPage(1)
            }
        } catch (error) {
            console.error('Lỗi tìm kiếm:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetSearch = () => {
        setSearchData({ ma_giao_vien: '', ho_ten: '', so_dien_thoai: '', ma_phong_ban: '' })
        loadDanhSach()
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm min-h-screen max-w-7xl mx-auto relative">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 uppercase">Quản lý Giáo Viên</h1>
                    <p className="text-gray-500 text-sm mt-1">Danh sách cán bộ giảng dạy tại trung tâm</p>
                </div>
                <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-medium cursor-pointer transition-colors">
                    <FaPlus /> Thêm giáo viên
                </button>
            </div>

            {/* BỘ LỌC TÌM KIẾM */}
            <div className="mb-6 p-4 bg-gray-50 border rounded-lg shadow-sm">
                <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <FaSearch /> Bộ lọc tìm kiếm
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <input
                        type="number"
                        name="ma_giao_vien"
                        value={searchData.ma_giao_vien}
                        onChange={handleSearchChange}
                        placeholder="Mã GV (VD: 1)"
                        className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                        type="text"
                        name="ho_ten"
                        value={searchData.ho_ten}
                        onChange={handleSearchChange}
                        placeholder="Họ Tên..."
                        className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                        type="text"
                        name="so_dien_thoai"
                        value={searchData.so_dien_thoai}
                        onChange={handleSearchChange}
                        placeholder="Số điện thoại..."
                        className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                        type="number"
                        name="ma_phong_ban"
                        value={searchData.ma_phong_ban}
                        onChange={handleSearchChange}
                        placeholder="Mã Phòng Ban..."
                        className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <div className="flex gap-2">
                    <button onClick={handleSearch} className="px-5 py-2 bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-900 transition-colors">Tìm kiếm</button>
                    <button onClick={handleResetSearch} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded hover:bg-gray-100 transition-colors"><FaUndo size={12} /> Xóa lọc</button>
                </div>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500 bg-gray-50">Đang tải dữ liệu...</div>
                ) : (
                    <table className="w-full text-sm text-gray-700 bg-white">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-3 border-b text-center">Mã GV</th>
                                <th className="p-3 border-b text-left">Họ Tên</th>
                                <th className="p-3 border-b text-center">Giới tính</th>
                                <th className="p-3 border-b text-center">SĐT</th>
                                <th className="p-3 border-b text-left">Chức Vụ</th>
                                <th className="p-3 border-b text-left">Phòng Ban</th>
                                <th className="p-3 border-b text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.length === 0 ? (
                                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Chưa có dữ liệu giáo viên.</td></tr>
                            ) : (
                                currentItems.map((row) => (
                                    <tr key={row.ma_giao_vien} className="hover:bg-gray-50">
                                        <td className="p-3 text-center">{row.ma_giao_vien}</td>
                                        <td className="p-3 text-left font-medium text-blue-700">{row.ho_ten}</td>
                                        <td className="p-3 text-center">{row.gioi_tinh || '—'}</td>
                                        <td className="p-3 text-center">{row.so_dien_thoai || '—'}</td>
                                        <td className="p-3 text-left">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                                                {row.chucVu?.ten_chuc_vu || `Mã: ${row.ma_chuc_vu}`}
                                            </span>
                                        </td>
                                        <td className="p-3 text-left">{row.phongBan?.ten_phong_ban || `Mã: ${row.ma_phong_ban}`}</td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleEditClick(row)} className="p-1.5 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded" title="Sửa"><FaEdit /></button>
                                                <button onClick={() => handleDeleteClick(row.ma_giao_vien)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded" title="Xóa"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* PHÂN TRANG */}
            {!isLoading && data.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-gray-600 text-sm">
                    <div>Hiển thị <b>{indexOfFirstItem + 1}</b> – <b>{Math.min(indexOfLastItem, data.length)}</b> / <b>{data.length}</b></div>
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 border rounded hover:bg-gray-50">Trước</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button key={n} onClick={() => paginate(n)} className={`px-3 py-1.5 border rounded ${currentPage === n ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}>{n}</button>
                        ))}
                        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 border rounded hover:bg-gray-50">Sau</button>
                    </div>
                </div>
            )}

            {/* MODAL THÊM/SỬA */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <h2 className="text-xl font-bold">{editingId ? 'Cập nhật Giáo Viên' : 'Thêm Giáo Viên'}</h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500"><FaTimes size={20} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Họ Tên <span className="text-red-500">*</span></label>
                                    <input type="text" name="ho_ten" value={formData.ho_ten} onChange={handleFormChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                                    <input type="date" name="ngay_sinh" value={formData.ngay_sinh} onChange={handleFormChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Giới tính</label>
                                    <select name="gioi_tinh" value={formData.gioi_tinh} onChange={handleFormChange} className="w-full border p-2 rounded outline-none focus:border-blue-500 bg-white">
                                        <option value="">-- Chọn giới tính --</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                                    <input type="text" name="so_dien_thoai" value={formData.so_dien_thoai} onChange={handleFormChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                                    <input type="text" name="dia_chi" value={formData.dia_chi} onChange={handleFormChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mã Chức Vụ <span className="text-red-500">*</span></label>
                                    <input type="number" name="ma_chuc_vu" value={formData.ma_chuc_vu} onChange={handleFormChange} placeholder="Nhập ID Chức vụ" className="w-full border p-2 rounded outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mã Phòng Ban <span className="text-red-500">*</span></label>
                                    <input type="number" name="ma_phong_ban" value={formData.ma_phong_ban} onChange={handleFormChange} placeholder="Nhập ID Phòng ban" className="w-full border p-2 rounded outline-none focus:border-blue-500" />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                            <button onClick={handleCloseModal} className="px-5 py-2.5 border rounded-lg hover:bg-gray-100">Hủy bỏ</button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FaSave /> Lưu dữ liệu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}