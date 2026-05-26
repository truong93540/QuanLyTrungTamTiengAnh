'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaEye, FaCheckCircle, FaExclamationTriangle, FaBookOpen, FaListAlt, FaBullseye } from 'react-icons/fa'

interface ChuongTrinhHoc {
    ma_chuong_trinh: number
    ten_chuong_trinh: string
    mo_ta: string | null
    muc_tieu: string | null
}

export default function QuanLyChuongTrinhHocPage() {
    const [data, setData] = useState<ChuongTrinhHoc[]>([])
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
    
    // View Data State
    const [viewData, setViewData] = useState<ChuongTrinhHoc | null>(null)

    // Form States
    const [formData, setFormData] = useState({
        ten_chuong_trinh: '',
        mo_ta: '',
        muc_tieu: ''
    })
    
    // Validation Errors
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    useEffect(() => {
        const fetchChuongTrinhHoc = async () => {
            try {
                const res = await fetch('/api/danh-muc/chuong-trinh-hoc')
                if (res.ok) setData(await res.json())
            } catch (error) {
                showToast('Lỗi khi tải dữ liệu từ máy chủ', 'error')
            } finally {
                setIsLoading(false)
            }
        }
        fetchChuongTrinhHoc()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        
        // Tự động xóa lỗi khi người dùng bắt đầu nhập
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const openAddModal = () => {
        setIsViewMode(false)
        setEditingId(null)
        setFormData({ ten_chuong_trinh: '', mo_ta: '', muc_tieu: '' })
        setFormErrors({})
        setIsModalOpen(true)
    }

    const openEditModal = (row: ChuongTrinhHoc) => {
        setIsViewMode(false)
        setEditingId(row.ma_chuong_trinh)
        setFormData({
            ten_chuong_trinh: row.ten_chuong_trinh,
            mo_ta: row.mo_ta || '',
            muc_tieu: row.muc_tieu || ''
        })
        setFormErrors({})
        setIsModalOpen(true)
    }

    const openViewModal = (row: ChuongTrinhHoc) => {
        setIsViewMode(true)
        setViewData(row)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
        setFormErrors({})
    }

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
            const response = await fetch(`/api/danh-muc/chuong-trinh-hoc?id=${deletingId}`, { method: 'DELETE' })
            if (response.ok) {
                setData(data.filter((item) => item.ma_chuong_trinh !== deletingId))
                showToast('Đã xóa chương trình học thành công!', 'success')
            } else {
                showToast('Có lỗi xảy ra khi xóa. Chương trình có thể đang được sử dụng.', 'error')
            }
        } catch (error) {
            showToast('Không thể kết nối đến máy chủ.', 'error')
        } finally {
            closeDeleteModal()
        }
    }

    const handleSave = async () => {
        const errors: Record<string, string> = {};

        // Validate bắt buộc
        if (!formData.ten_chuong_trinh.trim()) {
            errors.ten_chuong_trinh = 'Vui lòng nhập tên chương trình học';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const method = editingId ? 'PUT' : 'POST'
            const payload = {
                ...formData,
                ma_chuong_trinh: editingId || undefined
            }

            const response = await fetch('/api/danh-muc/chuong-trinh-hoc', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                const savedData = await response.json()
                if (editingId) {
                    setData(data.map(item => item.ma_chuong_trinh === savedData.ma_chuong_trinh ? savedData : item))
                    showToast('Cập nhật thành công!', 'success')
                } else {
                    setData([savedData, ...data])
                    showToast('Thêm mới thành công!', 'success')
                }
                closeModal()
            } else {
                showToast(`Lỗi khi lưu dữ liệu. Vui lòng thử lại.`, 'error')
            }
        } catch (error) {
            showToast('Không thể kết nối đến máy chủ.', 'error')
        }
    }

    // TÌM KIẾM & LỌC DỮ LIỆU
    const filteredData = data.filter(item => 
        item.ten_chuong_trinh.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.ma_chuong_trinh.toString().includes(searchTerm)
    )

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    return (
        <div className="bg-gray-50 min-h-screen p-6 relative">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-7xl mx-auto border border-gray-200">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200 gap-4">
                    <h1 className="text-2xl font-bold text-[#1d4ed8] flex items-center gap-3 uppercase tracking-wide">
                        <FaBookOpen className="text-blue-600" />
                        Quản Lý Chương Trình Học
                    </h1>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm w-full md:w-auto justify-center">
                        <FaPlus /> Thêm Chương Trình
                    </button>
                </div>

                {/* Thanh tìm kiếm */}
                <div className="mb-6 w-full md:max-w-md">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <FaSearch className="text-gray-400 text-sm" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm theo mã hoặc tên chương trình..." 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm focus:border-[#1d4ed8] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-gray-400" 
                        />
                    </div>
                </div>

                {/* Bảng Dữ Liệu */}
                <div className="overflow-x-auto rounded-t-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#1d4ed8] text-white uppercase font-semibold text-xs tracking-wider">
                            <tr>
                                <th className="px-5 py-4 text-center whitespace-nowrap w-24">Mã CT</th>
                                <th className="px-5 py-4 min-w-[250px] whitespace-nowrap">Tên Chương Trình</th>
                                <th className="px-5 py-4 min-w-[300px]">Mục Tiêu Đào Tạo</th>
                                <th className="px-5 py-4 text-center whitespace-nowrap w-36">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center py-8 font-medium">Đang tải dữ liệu...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-500">Không tìm thấy chương trình học nào.</td></tr>
                            ) : (
                                currentItems.map((row, index) => (
                                    <tr key={row.ma_chuong_trinh} className={`border-b hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-5 py-4 text-center font-bold text-gray-500 align-top">{row.ma_chuong_trinh}</td>
                                        <td className="px-5 py-4 align-top">
                                            <div className="font-bold text-[#1d4ed8] text-base">{row.ten_chuong_trinh}</div>
                                        </td>
                                        <td className="px-5 py-4 align-top text-gray-600">
                                            <p className="line-clamp-2">{row.muc_tieu || <span className="italic text-gray-400">Chưa cập nhật mục tiêu</span>}</p>
                                        </td>
                                        <td className="px-5 py-4 align-top">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openViewModal(row)} className="p-2 text-green-600 bg-green-100 rounded hover:bg-green-200 transition" title="Xem chi tiết"><FaEye /></button>
                                                <button onClick={() => openEditModal(row)} className="p-2 text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition" title="Sửa"><FaEdit /></button>
                                                <button onClick={() => openDeleteModal(row.ma_chuong_trinh)} className="p-2 text-red-600 bg-red-100 rounded hover:bg-red-200 transition" title="Xóa"><FaTrash /></button>
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
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-600 gap-4">
                        <div>
                            Hiển thị <span className="font-bold text-gray-800">{indexOfFirstItem + 1}</span> đến <span className="font-bold text-gray-800">{Math.min(indexOfLastItem, filteredData.length)}</span> trong tổng số <span className="font-bold text-gray-800">{filteredData.length}</span> chương trình
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-50 transition bg-white font-medium">Trước</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1.5 border rounded transition font-medium ${
                                        currentPage === page 
                                            ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]' 
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-50 transition bg-white font-medium">Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL VIEW (XEM CHI TIẾT) */}
            {isModalOpen && isViewMode && viewData && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl animate-fade-in-up flex flex-col max-h-[95vh]">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl shrink-0">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2 uppercase tracking-wide">
                                <FaBookOpen /> Chi Tiết Chương Trình Học
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 bg-gray-50/50">
                            
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                <div className="space-y-6 text-sm">
                                    <div>
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-1">Mã Chương Trình</span>
                                        <span className="font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-md">{viewData.ma_chuong_trinh}</span>
                                    </div>

                                    <div>
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-1">Tên Chương Trình</span>
                                        <span className="font-bold text-2xl text-[#1d4ed8]">{viewData.ten_chuong_trinh}</span>
                                    </div>

                                    <div>
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2 flex items-center gap-2"><FaBullseye className="text-red-500"/> Mục tiêu đào tạo</span>
                                        <p className="text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200 leading-relaxed whitespace-pre-line min-h-[80px]">
                                            {viewData.muc_tieu || <span className="italic text-gray-400">Không có mục tiêu đào tạo cụ thể</span>}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2 flex items-center gap-2"><FaListAlt className="text-green-500"/> Mô tả tổng quan</span>
                                        <p className="text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200 leading-relaxed whitespace-pre-line min-h-[80px]">
                                            {viewData.mo_ta || <span className="italic text-gray-400">Không có mô tả</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl flex justify-end shrink-0">
                            <button onClick={closeModal} className="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 font-bold transition shadow-sm text-sm">Đóng Báo Cáo</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL THÊM / SỬA */}
            {isModalOpen && !isViewMode && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-lg shrink-0">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2 uppercase tracking-wide">
                                <FaBookOpen />
                                {editingId ? 'Cập Nhật Chương Trình' : 'Thêm Chương Trình Mới'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên chương trình học <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="ten_chuong_trinh" 
                                    value={formData.ten_chuong_trinh} 
                                    onChange={handleChange} 
                                    placeholder="Ví dụ: Tiếng Anh Giao Tiếp Cơ Bản..."
                                    className={`w-full border rounded-md p-2.5 text-gray-900 font-medium transition outline-none ${formErrors.ten_chuong_trinh ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#1d4ed8]'}`} 
                                />
                                {formErrors.ten_chuong_trinh && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.ten_chuong_trinh}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Mục tiêu đào tạo</label>
                                <textarea 
                                    name="muc_tieu" 
                                    rows={4} 
                                    value={formData.muc_tieu} 
                                    onChange={handleChange} 
                                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] text-gray-900 resize-none outline-none transition" 
                                    placeholder="Nhập mục tiêu học viên đạt được sau khi kết thúc chương trình (VD: Lấy chứng chỉ IELTS 6.5+)..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Mô tả tổng quan</label>
                                <textarea 
                                    name="mo_ta" 
                                    rows={4} 
                                    value={formData.mo_ta} 
                                    onChange={handleChange} 
                                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] text-gray-900 resize-none outline-none transition" 
                                    placeholder="Nhập thông tin mô tả chi tiết, đối tượng phù hợp..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg shrink-0">
                            {Object.keys(formErrors).length > 0 && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm font-medium border border-red-100 flex items-center gap-2">
                                    <FaExclamationTriangle /> Vui lòng kiểm tra lại các trường báo đỏ!
                                </div>
                            )}
                            <div className="flex justify-end gap-3">
                                <button onClick={closeModal} className="px-6 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-100 font-semibold transition shadow-sm">
                                    Hủy bỏ
                                </button>
                                <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-semibold shadow-sm transition">
                                    <FaSave /> {editingId ? 'Cập nhật' : 'Lưu chương trình'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XÓA */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up">
                        <button onClick={closeDeleteModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
                        <div className="flex items-center mb-4 gap-3">
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-red-100 rounded-full"><span className="text-red-600 font-bold text-2xl">!</span></div>
                            <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa</h3>
                        </div>
                        <p className="text-gray-600 mb-6 text-sm">Bạn có chắc chắn muốn xóa chương trình học này? Dữ liệu sẽ không thể khôi phục.</p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={closeDeleteModal} className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors">Hủy bỏ</button>
                            <button onClick={confirmDelete} className="px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium shadow-sm transition-colors">Xác nhận xóa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION */}
            {toast && (
                <div className="fixed top-5 right-5 z-[70] animate-fade-in-down">
                    <div className={`flex items-center min-w-[300px] p-4 bg-white rounded shadow-lg border-l-4 ${toast.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
                        {toast.type === 'success' ? <FaCheckCircle className="text-green-500 text-2xl mr-3" /> : <FaTimes className="text-red-500 text-xl mr-3" />}
                        <div className="flex-1 text-sm text-gray-800 font-medium">{toast.message}</div>
                        <button onClick={() => setToast(null)} className="ml-4 text-gray-400 hover:text-gray-600"><FaTimes /></button>
                    </div>
                </div>
            )}
        </div>
    )
}