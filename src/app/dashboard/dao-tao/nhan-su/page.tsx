'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaPlus, FaSave, FaSearch, FaTimes, FaTrash, FaUndo } from 'react-icons/fa'

interface ChucVuOpt {
    ma_chuc_vu: number
    ten_chuc_vu: string
}

interface PhongBanOpt {
    ma_phong_ban: number
    ten_phong_ban: string
}

interface NhanSu {
    ma_nhan_su: number
    ho_ten: string
    ngay_sinh?: string | null
    gioi_tinh?: string | null
    so_dien_thoai?: string | null
    dia_chi?: string | null
    email?: string | null
    ma_chuc_vu: number
    ma_phong_ban: number
    chucVu: ChucVuOpt
    phongBan: PhongBanOpt
    taiKhoan?: { ten_dang_nhap: string } | null
}

const emptyForm = () => ({
    ma_nhan_su: '',
    ho_ten: '',
    ngay_sinh: '',
    gioi_tinh: '',
    so_dien_thoai: '',
    email: '',
    dia_chi: '',
    ma_chuc_vu: '',
    ma_phong_ban: '',
})

export default function QuanLyNhanSuPage() {
    const [data, setData] = useState<NhanSu[]>([])
    const [chucVuList, setChucVuList] = useState<ChucVuOpt[]>([])
    const [phongBanList, setPhongBanList] = useState<PhongBanOpt[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    // Quản lý Modal & Form
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState(emptyForm())
    const [searchData, setSearchData] = useState(emptyForm())

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage))

    const loadDanhMuc = async () => {
        try {
            const [cvRes, pbRes] = await Promise.all([
                fetch('/api/danh-muc/chuc-vu'),
                fetch('/api/danh-muc/phong-ban'),
            ])
            if (cvRes.ok) {
                const cv = await cvRes.json()
                setChucVuList(Array.isArray(cv) ? cv : [])
            }
            if (pbRes.ok) {
                const pb = await pbRes.json()
                setPhongBanList(Array.isArray(pb) ? pb : [])
            }
        } catch (e) {
            console.error('Lỗi tải danh mục:', e)
        }
    }

    const loadDanhSach = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/nhan-su')
            if (response.ok) {
                const result = await response.json()
                setData(Array.isArray(result) ? result : [])
            }
        } catch (error) {
            console.error('Lỗi tải nhân sự:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadDanhMuc()
        loadDanhSach()
    }, [])

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            alert('Vui lòng nhập họ tên.')
            return
        }
        if (!formData.ma_chuc_vu || !formData.ma_phong_ban) {
            alert('Vui lòng chọn chức vụ và phòng ban.')
            return
        }

        try {
            const method = editingId ? 'PUT' : 'POST'
            const payload: Record<string, unknown> = {
                ho_ten: formData.ho_ten.trim(),
                ngay_sinh: formData.ngay_sinh || null,
                gioi_tinh: formData.gioi_tinh || null,
                so_dien_thoai: formData.so_dien_thoai || null,
                email: formData.email?.trim() || null,
                dia_chi: formData.dia_chi || null,
                ma_chuc_vu: Number(formData.ma_chuc_vu),
                ma_phong_ban: Number(formData.ma_phong_ban),
            }
            if (editingId) {
                payload.ma_nhan_su = editingId
            }

            const response = await fetch('/api/admin/nhan-su', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const json = await response.json().catch(() => ({}))

            if (response.ok) {
                const saved = json as NhanSu
                if (editingId) {
                    setData((prev) => prev.map((r) => (r.ma_nhan_su === saved.ma_nhan_su ? saved : r)))
                    alert('Cập nhật nhân sự thành công.')
                } else {
                    setData((prev) => [...prev, saved])
                    alert('Thêm nhân sự thành công.')
                }
                handleCloseModal() // Đóng modal sau khi lưu
                setCurrentPage(1)
            } else {
                alert((json as { error?: string; message?: string }).error || (json as { message?: string }).message || 'Lỗi khi lưu.')
            }
        } catch (error) {
            console.error(error)
            alert('Không thể kết nối máy chủ.')
        }
    }

    const handleEditClick = (row: NhanSu) => {
        const formattedDate = row.ngay_sinh ? new Date(row.ngay_sinh).toISOString().split('T')[0] : ''
        setFormData({
            ma_nhan_su: row.ma_nhan_su.toString(),
            ho_ten: row.ho_ten,
            ngay_sinh: formattedDate,
            gioi_tinh: row.gioi_tinh || '',
            so_dien_thoai: row.so_dien_thoai || '',
            email: row.email || '',
            dia_chi: row.dia_chi || '',
            ma_chuc_vu: row.ma_chuc_vu.toString(),
            ma_phong_ban: row.ma_phong_ban.toString(),
        })
        setEditingId(row.ma_nhan_su)
        setIsModalOpen(true)
    }

    const handleDeleteClick = async (id: number) => {
        const ok = window.confirm('Xóa nhân sự này? Chỉ thực hiện khi chưa phát sinh phiếu thu, tài khoản, v.v.')
        if (!ok) return
        try {
            const response = await fetch(`/api/admin/nhan-su?id=${id}`, { method: 'DELETE' })
            const json = await response.json().catch(() => ({}))
            if (response.ok) {
                setData((prev) => prev.filter((r) => r.ma_nhan_su !== id))
                alert('Đã xóa.')
            } else {
                alert((json as { error?: string }).error || 'Không xóa được.')
            }
        } catch (e) {
            console.error(e)
            alert('Lỗi kết nối.')
        }
    }

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchData.ma_nhan_su) params.append('ma_nhan_su', searchData.ma_nhan_su)
            if (searchData.ho_ten) params.append('ho_ten', searchData.ho_ten)
            if (searchData.email) params.append('email', searchData.email)
            if (searchData.so_dien_thoai) params.append('so_dien_thoai', searchData.so_dien_thoai)
            if (searchData.gioi_tinh) params.append('gioi_tinh', searchData.gioi_tinh)
            if (searchData.ma_phong_ban) params.append('ma_phong_ban', searchData.ma_phong_ban)
            if (searchData.ma_chuc_vu) params.append('ma_chuc_vu', searchData.ma_chuc_vu)

            const response = await fetch(`/api/admin/nhan-su?${params.toString()}`)
            if (response.ok) {
                const result = await response.json()
                setData(Array.isArray(result) ? result : [])
                setCurrentPage(1)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetSearch = () => {
        setSearchData(emptyForm())
        loadDanhSach()
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm min-h-screen max-w-7xl mx-auto relative">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800 uppercase">Quản lý nhân sự</h1>
                <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-medium cursor-pointer transition-colors">
                    <FaPlus /> Thêm nhân sự
                </button>
            </div>

            {/* BỘ LỌC TÌM KIẾM */}
            <div className="mb-6 p-4 bg-gray-50 border rounded-lg shadow-sm">
                <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <FaSearch /> Bộ lọc tìm kiếm
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <input
                            type="text"
                            name="ho_ten"
                            value={searchData.ho_ten}
                            onChange={handleSearchChange}
                            placeholder="Tên nhân viên..."
                            className="w-full border border-gray-300 rounded p-2 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            name="ma_nhan_su"
                            value={searchData.ma_nhan_su}
                            onChange={handleSearchChange}
                            placeholder="Mã nhân viên..."
                            className="w-full border border-gray-300 rounded p-2 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <select
                            name="ma_chuc_vu"
                            value={searchData.ma_chuc_vu}
                            onChange={handleSearchChange}
                            className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none">
                            <option value="">— Chức vụ —</option>
                            {chucVuList.map((cv) => (
                                <option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>
                                    {cv.ten_chuc_vu}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            name="ma_phong_ban"
                            value={searchData.ma_phong_ban}
                            onChange={handleSearchChange}
                            className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none">
                            <option value="">— Phòng ban —</option>
                            {phongBanList.map((pb) => (
                                <option key={pb.ma_phong_ban} value={pb.ma_phong_ban}>
                                    {pb.ten_phong_ban}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 cursor-pointer transition-colors">
                        Tìm kiếm
                    </button>
                    <button
                        type="button"
                        onClick={handleResetSearch}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-100 cursor-pointer transition-colors">
                        <FaUndo size={12} /> Xóa lọc
                    </button>
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
                                <th className="p-3 border-b w-14 text-center">Mã</th>
                                <th className="p-3 border-b text-left">Họ tên</th>
                                <th className="p-3 border-b w-28 text-center">Ngày sinh</th>
                                <th className="p-3 border-b w-16 text-center">GT</th>
                                <th className="p-3 border-b text-left">Điện thoại</th>
                                <th className="p-3 border-b text-left hidden md:table-cell">Email</th>
                                <th className="p-3 border-b text-left">Chức vụ</th>
                                <th className="p-3 border-b text-left">Phòng ban</th>
                                <th className="p-3 border-b text-center w-24">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-gray-500">
                                        Không có dữ liệu.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((row) => (
                                    <tr key={row.ma_nhan_su} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 text-center text-gray-500">{row.ma_nhan_su}</td>
                                        <td className="p-3 text-left font-medium text-blue-700">{row.ho_ten}</td>
                                        <td className="p-3 text-center">
                                            {row.ngay_sinh ? new Date(row.ngay_sinh).toLocaleDateString('vi-VN') : '—'}
                                        </td>
                                        <td className="p-3 text-center">{row.gioi_tinh || '—'}</td>
                                        <td className="p-3 text-left">{row.so_dien_thoai || '—'}</td>
                                        <td className="p-3 text-left text-xs hidden md:table-cell text-gray-500">{row.email || '—'}</td>
                                        <td className="p-3 text-left">
                                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                                {row.chucVu?.ten_chuc_vu ?? '—'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-left">{row.phongBan?.ten_phong_ban ?? '—'}</td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditClick(row)}
                                                    className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded cursor-pointer transition-colors"
                                                    title="Sửa">
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(row.ma_nhan_su)}
                                                    className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded cursor-pointer transition-colors"
                                                    title="Xóa">
                                                    <FaTrash />
                                                </button>
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
                    <div>
                        Hiển thị <b>{indexOfFirstItem + 1}</b> – <b>{Math.min(indexOfLastItem, data.length)}</b> trong tổng số <b>{data.length}</b>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className={`px-3 py-1.5 rounded border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-100 cursor-pointer bg-white'}`}>
                            Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                type="button"
                                onClick={() => setCurrentPage(n)}
                                className={`px-3 py-1.5 rounded border ${currentPage === n ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100 cursor-pointer bg-white'}`}>
                                {n}
                            </button>
                        ))}
                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className={`px-3 py-1.5 rounded border ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-100 cursor-pointer bg-white'}`}>
                            Sau
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL THÊM / SỬA NHÂN SỰ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                        {/* Header Modal */}
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingId ? 'Cập nhật thông tin nhân sự' : 'Thêm mới nhân sự'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Body Modal (Scrollable) */}
                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {editingId && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã nhân sự</label>
                                        <input
                                            type="text"
                                            value={formData.ma_nhan_su}
                                            disabled
                                            className="w-full border border-gray-200 rounded p-2.5 bg-gray-100 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ho_ten"
                                        value={formData.ho_ten}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                                    <input
                                        type="date"
                                        name="ngay_sinh"
                                        value={formData.ngay_sinh}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                    <select
                                        name="gioi_tinh"
                                        value={formData.gioi_tinh}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded p-2.5 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-gray-800">
                                        <option value="">— Chọn —</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                    <input
                                        type="text"
                                        name="so_dien_thoai"
                                        value={formData.so_dien_thoai}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Chức vụ <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="ma_chuc_vu"
                                        value={formData.ma_chuc_vu}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded p-2.5 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-gray-800">
                                        <option value="">— Chọn chức vụ —</option>
                                        {chucVuList.map((cv) => (
                                            <option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>
                                                {cv.ten_chuc_vu}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phòng ban <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="ma_phong_ban"
                                        value={formData.ma_phong_ban}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded p-2.5 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-gray-800">
                                        <option value="">— Chọn phòng ban —</option>
                                        {phongBanList.map((pb) => (
                                            <option key={pb.ma_phong_ban} value={pb.ma_phong_ban}>
                                                {pb.ten_phong_ban}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                    <textarea
                                        name="dia_chi"
                                        value={formData.dia_chi}
                                        onChange={handleFormChange}
                                        rows={2}
                                        className="w-full border border-gray-300 rounded p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-gray-800"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium cursor-pointer transition-colors">
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer shadow-sm transition-colors">
                                <FaSave /> {editingId ? 'Lưu cập nhật' : 'Lưu nhân sự'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}