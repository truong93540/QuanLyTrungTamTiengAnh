'use client'
import { useState, useEffect } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaBookOpen, FaEye, FaCheckCircle } from 'react-icons/fa'

interface ChuongTrinhHoc {
    ma_chuong_trinh: number
    ten_chuong_trinh: string
}

interface KhoaHoc {
    ma_khoa_hoc: number
    ten_khoa_hoc: string
    mo_ta: string
    thoi_luong: string
    hoc_phi: number
    trinh_do: string
    trang_thai: string
    ma_chuong_trinh: number
    chuong_trinh?: { ten_chuong_trinh: string } // Dữ liệu JOIN từ backend
}

export default function QuanLyKhoaHocPage() {
    const [data, setData] = useState<KhoaHoc[]>([])
    const [chuongTrinhList, setChuongTrinhList] = useState<ChuongTrinhHoc[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewMode, setIsViewMode] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    // Form States
    const [formData, setFormData] = useState({
        ten_khoa_hoc: '',
        mo_ta: '',
        thoi_luong: '',
        hoc_phi: '',
        trinh_do: '',
        trang_thai: '',
        ma_chuong_trinh: '',
    })
    const [formError, setFormError] = useState('')
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

    // Hàm hiển thị Toast
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    // Fetch dữ liệu Khóa học & Danh sách Chương trình học (để đổ vào dropdown)
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Giả định bạn có 2 API này
                const [resKhoaHoc, resChuongTrinh] = await Promise.all([
                    fetch('/api/tuyen-sinh/khoa-hoc'),
                    fetch('/api/tuyen-sinh/chuong-trinh-hoc')
                ])

                if (resKhoaHoc.ok) setData(await resKhoaHoc.json())
                if (resChuongTrinh.ok) setChuongTrinhList(await resChuongTrinh.json())
            } catch (error) {
                console.error('Lỗi fetch API:', error)
                showToast('Lỗi khi tải dữ liệu từ máy chủ', 'error')
            } finally {
                setIsLoading(false)
            }
        }
        fetchAllData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (formError) setFormError('') // Xóa lỗi khi người dùng bắt đầu gõ
    }

    // --- CÁC HÀM QUẢN LÝ MODAL THÊM/SỬA/XEM ---
    const openAddModal = () => {
        setIsViewMode(false)
        setEditingId(null)
        setFormData({
            ten_khoa_hoc: '', mo_ta: '', thoi_luong: '', hoc_phi: '', trinh_do: '', trang_thai: '', ma_chuong_trinh: ''
        })
        setFormError('')
        setIsModalOpen(true)
    }

    const openEditModal = (row: KhoaHoc) => {
        setIsViewMode(false)
        setEditingId(row.ma_khoa_hoc)
        setFormData({
            ten_khoa_hoc: row.ten_khoa_hoc,
            mo_ta: row.mo_ta,
            thoi_luong: row.thoi_luong,
            hoc_phi: row.hoc_phi.toString(),
            trinh_do: row.trinh_do,
            trang_thai: row.trang_thai || '',
            ma_chuong_trinh: row.ma_chuong_trinh.toString(),
        })
        setFormError('')
        setIsModalOpen(true)
    }

    const openViewModal = (row: KhoaHoc) => {
        setIsViewMode(true)
        setEditingId(row.ma_khoa_hoc)
        setFormData({
            ten_khoa_hoc: row.ten_khoa_hoc,
            mo_ta: row.mo_ta,
            thoi_luong: row.thoi_luong,
            hoc_phi: row.hoc_phi.toString(),
            trinh_do: row.trinh_do,
            trang_thai: row.trang_thai || '',
            ma_chuong_trinh: row.ma_chuong_trinh.toString(),
        })
        setFormError('')
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
    }

    // --- CÁC HÀM QUẢN LÝ MODAL XÓA ---
    const openDeleteModal = (id: number) => {
        setDeletingId(id)
        setIsDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setDeletingId(null)
    }

    const confirmDelete = async () => {
        if (!deletingId) return
        try {
            const response = await fetch(`/api/tuyen-sinh/khoa-hoc?id=${deletingId}`, { method: 'DELETE' })
            if (response.ok) {
                setData(data.filter((item) => item.ma_khoa_hoc !== deletingId))
                showToast('Đã xóa khóa học thành công!', 'success')
            } else {
                showToast('Có lỗi xảy ra khi xóa.', 'error')
            }
        } catch (error) {
            showToast('Không thể kết nối đến máy chủ.', 'error')
        } finally {
            closeDeleteModal()
        }
    }

    // --- HÀM LƯU DỮ LIỆU (POST/PUT) ---
    const handleSaveKhoaHoc = async () => {
        if (!formData.ten_khoa_hoc || !formData.thoi_luong || !formData.hoc_phi || !formData.trinh_do || !formData.ma_chuong_trinh) {
            setFormError('Vui lòng nhập đầy đủ các trường có dấu (*)')
            return
        }
        try {
            const method = editingId ? 'PUT' : 'POST'
            const payload = {
                ...formData,
                ma_khoa_hoc: editingId || undefined,
                hoc_phi: Number(formData.hoc_phi), 
                ma_chuong_trinh: Number(formData.ma_chuong_trinh) 
            }
            const response = await fetch('/api/tuyen-sinh/khoa-hoc', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                const savedData = await response.json()
                if (editingId) {
                    setData(data.map(item => item.ma_khoa_hoc === savedData.ma_khoa_hoc ? savedData : item))
                    showToast('Cập nhật khóa học thành công!', 'success')
                } else {
                    setData([...data, savedData])
                    showToast('Thêm khóa học mới thành công!', 'success')
                }
                closeModal()
            } else {
                showToast(`Lỗi khi ${editingId ? 'cập nhật' : 'thêm'} khóa học. Tên có thể bị trùng.`, 'error')
            }
        } catch (error) {
            showToast('Không thể kết nối đến máy chủ.', 'error')
        }
    }

    // --- TÍNH TOÁN PHÂN TRANG & TÌM KIẾM ---
    const filteredData = data.filter(item => 
        item.ten_khoa_hoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ma_khoa_hoc.toString().includes(searchTerm)
    )
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    return (
        <div className="bg-gray-50 min-h-screen p-6 relative">
            <div className="bg-white rounded-lg shadow-md p-6">
                
                {/* Header Bảng */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-[#1d4ed8] flex items-center gap-3 uppercase">
                        <FaBookOpen className="text-blue-600" />
                        Danh sách Khóa học
                    </h1>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm">
                        <FaPlus /> Thêm Khóa học
                    </button>
                </div>

                {/* Thanh tìm kiếm */}
                <div className="mb-6 w-full md:w-1/2 lg:w-1/3">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><FaSearch /></span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã hoặc tên khóa học..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full border border-gray-400 rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent transition shadow-sm placeholder-gray-500 text-gray-900"
                        />
                    </div>
                </div>

                {/* Bảng Dữ Liệu */}
                <div className="overflow-x-auto rounded-t-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#1d4ed8] text-white uppercase font-semibold text-xs">
                            <tr>
                                <th className="px-4 py-4 text-center">Mã</th>
                                <th className="px-4 py-4 min-w-[200px] text-center">Tên Khóa Học</th>
                                <th className="px-4 py-4 text-center">Thời Lượng</th>
                                <th className="px-4 py-4 text-right">Học Phí</th>
                                <th className="px-4 py-4 text-center">Trình Độ</th>
                                <th className="px-4 py-4 text-center">Trạng Thái</th>
                                <th className="px-4 py-4 text-center w-28">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center py-8 font-medium">Đang tải dữ liệu...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Không tìm thấy khóa học nào.</td></tr>
                            ) : (
                                currentItems.map((row, index) => (
                                    <tr key={row.ma_khoa_hoc} className={`border-b hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-4 py-4 text-center font-bold text-gray-500">{row.ma_khoa_hoc}</td>
                                        <td className="px-4 py-4">
                                            <div className="font-bold text-[#1d4ed8]">{row.ten_khoa_hoc}</div>
                                            <div className="text-xs text-gray-500 mt-1 italic">Chương Trình: {row.chuong_trinh?.ten_chuong_trinh || 'N/A'}</div>
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">{row.thoi_luong}</td>
                                        <td className="px-4 py-4 text-right font-semibold text-orange-600">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.hoc_phi)}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="px-2 py-1 bg-gray-200 rounded text-xs font-semibold">{row.trinh_do}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                                row.trang_thai === 'Đang mở' ? 'bg-green-100 text-green-700' : 
                                                row.trang_thai === 'Đang học' ? 'bg-blue-100 text-blue-700' : 
                                                row.trang_thai === 'Tạm hoãn' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {row.trang_thai || 'Chưa rõ'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openViewModal(row)} className="p-2 text-green-600 bg-green-100 rounded hover:bg-green-200 transition" title="Xem"><FaEye /></button>
                                                <button onClick={() => openEditModal(row)} className="p-2 text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition" title="Sửa"><FaEdit /></button>
                                                <button onClick={() => openDeleteModal(row.ma_khoa_hoc)} className="p-2 text-red-600 bg-red-100 rounded hover:bg-red-200 transition" title="Xóa"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {!isLoading && filteredData.length > 0 && (
                    <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                        <div>
                            Hiển thị <span className="font-bold">{indexOfFirstItem + 1}</span> đến <span className="font-bold">{Math.min(indexOfLastItem, filteredData.length)}</span> trong tổng số <span className="font-bold">{filteredData.length}</span> khóa học
                        </div>
                        <div className="flex gap-1">
                            {/* Nút Trước */}
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                                disabled={currentPage === 1} 
                                className="px-3 py-1.5 border border-gray-300 rounded disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-50 transition bg-white"
                            >
                                Trước
                            </button>

                            {/* Các nút số trang */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1.5 border rounded transition font-medium ${
                                        currentPage === page 
                                            ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]' // Trạng thái đang chọn (Màu xanh)
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' // Trạng thái bình thường
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Nút Sau */}
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                                disabled={currentPage === totalPages} 
                                className="px-3 py-1.5 border border-gray-300 rounded disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-50 transition bg-white"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL THÊM / SỬA / XEM */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-lg">
                            <h2 className="text-xl font-bold text-gray-800">
                                {isViewMode ? 'Chi Tiết Khóa Học' : editingId ? 'Cập Nhật Khóa Học' : 'Thêm Khóa Học Mới'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto">
                            {/* Dòng 1: Tên khóa học */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 ">Tên khóa học <span className="text-red-500">*</span></label>
                                <input type="text" name="ten_khoa_hoc" value={formData.ten_khoa_hoc} onChange={handleChange} disabled={isViewMode} className="w-full border border-gray-400 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100 disabled:opacity-100 disabled:text-gray-900" />
                            </div>

                            {/* Dòng 2: Chương trình học & Thời lượng */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Thuộc chương trình <span className="text-red-500">*</span></label>
                                    <select name="ma_chuong_trinh" value={formData.ma_chuong_trinh} onChange={handleChange} disabled={isViewMode} className="w-full border border-gray-400 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100 disabled:opacity-100 disabled:text-gray-900">
                                        <option value="">-- Chọn chương trình học --</option>
                                        {chuongTrinhList.map(ct => (
                                            <option key={ct.ma_chuong_trinh} value={ct.ma_chuong_trinh}>{ct.ten_chuong_trinh}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Thời lượng <span className="text-red-500">*</span></label>
                                    <input type="text" name="thoi_luong" value={formData.thoi_luong} onChange={handleChange} disabled={isViewMode} className="w-full border border-gray-400 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100 disabled:opacity-100 disabled:text-gray-900" />
                                </div>
                            </div>

                            {/* Dòng 3: Học phí & Trình độ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Học phí (VNĐ) <span className="text-red-500">*</span></label>
                                    <input type="number" name="hoc_phi" placeholder="Nhập số tiền..." value={formData.hoc_phi} onChange={handleChange} disabled={isViewMode} className="w-full border border-gray-400 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100 disabled:opacity-100 disabled:text-gray-900" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Trình độ <span className="text-red-500">*</span></label>
                                        <input type="text" name="trinh_do" placeholder="VD: B1, B2..." value={formData.trinh_do} onChange={handleChange} disabled={isViewMode} className="w-full border border-gray-400 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100 disabled:opacity-100 disabled:text-gray-900" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Trạng thái</label>
                                        <select name="trang_thai" value={formData.trang_thai} onChange={handleChange} disabled={isViewMode} className="w-full border border-gray-400 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100 disabled:opacity-100 disabled:text-gray-900">
                                            <option value="">-- Chọn --</option>
                                            <option value="Đang mở">Đang mở</option>
                                            <option value="Đang học">Đang học</option>
                                            <option value="Tạm hoãn">Tạm hoãn</option>
                                            <option value="Đã kết thúc">Đã kết thúc</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Dòng 4: Mô tả */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Mô tả khóa học <span className="text-red-500">*</span></label>
                                <textarea name="mo_ta" rows={3} value={formData.mo_ta} onChange={handleChange} disabled={isViewMode} className="w-full border border-gray-400 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none disabled:bg-gray-100 disabled:opacity-100 disabled:text-gray-900"></textarea>
                            </div>
                        </div>

                        {/* Footer Modal */}
                    <div className="p-5 border-t bg-gray-50 rounded-b-lg">
                    {formError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm font-normal border border-red-100">{formError}</div>}
                    <div className="flex justify-end gap-3">
                    <button onClick={closeModal} className="px-5 py-2 border border-gray-300 bg-white rounded-md hover:bg-gray-100 font-medium text-gray-800">{isViewMode ? 'Đóng' : 'Hủy bỏ'}</button>
                    {!isViewMode && (
                    <button onClick={handleSaveKhoaHoc} className="flex items-center gap-2 px-5 py-2 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium shadow-sm">
                    < FaSave /> {editingId ? 'Cập nhật' : 'Lưu khóa học'}
                    </button>
                    )}
                    </div>
                    </div>
                    </div>
                </div>
            )}

            {/* MODAL XÁC NHẬN XÓA TÙY CHỈNH */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up">
                        <button onClick={closeDeleteModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mr-4"><span className="text-red-600 font-bold text-2xl">!</span></div>
                            <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa</h3>
                        </div>
                        <p className="text-gray-600 mb-6 ml-16">Bạn có chắc chắn muốn xóa khóa học này? Hành động này sẽ không thể khôi phục lại dữ liệu.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={closeDeleteModal} className="px-5 py-2.5 border rounded-md hover:bg-gray-50 font-medium text-gray-800">Hủy bỏ</button>
                            <button onClick={confirmDelete} className="px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium">Xác nhận xóa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION */}
            {toast && (
            <div className="fixed top-5 right-5 z-[70] animate-fade-in-down">
            <div className={`flex items-center min-w-[300px] p-4 bg-white rounded shadow-lg border-l-4 ${toast.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            {toast.type === 'success' ? <FaCheckCircle className="text-green-500 text-2xl mr-3" /> : <FaTimes className="text-red-500 text-xl mr-3" />}
            <div className="flex-1 text-sm text-gray-700">{toast.message}</div>
            <button onClick={() => setToast(null)} className="ml-4 text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            </div>
            )}
        </div>
    )
}