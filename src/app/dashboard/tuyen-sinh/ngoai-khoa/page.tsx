'use client'
import { useState, useEffect } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaEye, FaCheckCircle, FaExclamationTriangle, FaWalking, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaUsers } from 'react-icons/fa'

interface GiaoVien {
    ma_giao_vien: number
    ho_ten: string
}

interface PhanCong {
    ma_giao_vien: number
    giao_vien: { ho_ten: string }
}

interface HoatDong {
    ma_hoat_dong_ngoai_khoa: number
    ten_hoat_dong: string
    mo_ta?: string | null
    ngay_to_chuc: string
    dia_diem?: string | null
    chi_phi?: number | null
    phan_cong?: PhanCong[] // Đã sửa tên biến cho khớp schema
}

export default function QuanLyHoatDongNgoaiKhoaPage() {
    const [data, setData] = useState<HoatDong[]>([])
    const [danhSachGiaoVien, setDanhSachGiaoVien] = useState<GiaoVien[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isViewMode, setIsViewMode] = useState(false)
    
    const [formData, setFormData] = useState({
        ten_hoat_dong: '',
        mo_ta: '',
        ngay_to_chuc: '',
        dia_diem: '',
        chi_phi: '',
        danh_sach_giao_vien: [] as number[] 
    })

    const [formError, setFormError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
    
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resHD = await fetch('/api/tuyen-sinh/ngoai-khoa')
                if (resHD.ok) setData(await resHD.json())

                const resGV = await fetch('/api/tuyen-sinh/ngoai-khoa?action=get_teachers')
                if (resGV.ok) setDanhSachGiaoVien(await resGV.json())

            } catch (error) {
                console.error('Lỗi fetch API:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (formError) setFormError('')
    }

    const handleTeacherToggle = (ma_giao_vien: number, isChecked: boolean) => {
        if (isViewMode) return;
        setFormData(prev => {
            const newList = isChecked 
                ? [...prev.danh_sach_giao_vien, ma_giao_vien] 
                : prev.danh_sach_giao_vien.filter(id => id !== ma_giao_vien);
            return { ...prev, danh_sach_giao_vien: newList };
        })
    }

    const fillFormData = (row: HoatDong) => {
        // Đã cập nhật thành row.phan_cong
        const assignedTeachers = row.phan_cong?.map(pc => pc.ma_giao_vien) || []

        setFormData({
            ten_hoat_dong: row.ten_hoat_dong,
            mo_ta: row.mo_ta || '',
            ngay_to_chuc: new Date(row.ngay_to_chuc).toISOString().split('T')[0],
            dia_diem: row.dia_diem || '',
            chi_phi: row.chi_phi !== null && row.chi_phi !== undefined ? row.chi_phi.toString() : '',
            danh_sach_giao_vien: assignedTeachers
        })
    }

    const openAddModal = () => {
        setIsViewMode(false)
        setEditingId(null)
        setFormData({ ten_hoat_dong: '', mo_ta: '', ngay_to_chuc: new Date().toISOString().split('T')[0], dia_diem: '', chi_phi: '', danh_sach_giao_vien: [] })
        setFormError('')
        setIsModalOpen(true)
    }

    const openEditModal = (row: HoatDong) => { 
        fillFormData(row)
        setIsViewMode(false)
        setEditingId(row.ma_hoat_dong_ngoai_khoa)
        setFormError('')
        setIsModalOpen(true)
    }

    const openViewModal = (row: HoatDong) => { 
        fillFormData(row)
        setIsViewMode(true)
        setEditingId(row.ma_hoat_dong_ngoai_khoa)
        setFormError('')
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
        setIsViewMode(false)
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
            const response = await fetch(`/api/tuyen-sinh/ngoai-khoa?id=${deletingId}`, { method: 'DELETE' })
            if (response.ok) {
                setData(data.filter((item) => item.ma_hoat_dong_ngoai_khoa !== deletingId))
                showToast('Đã xóa hoạt động thành công!', 'success')
            } else {
                showToast('Có lỗi xảy ra khi xóa.', 'error')
            }
        } catch (error) {
            showToast('Không thể kết nối đến máy chủ.', 'error')
        } finally {
            closeDeleteModal()
        }
    }

    const handleSave = async () => {
        setFormError('')
        if (!formData.ten_hoat_dong.trim() || !formData.ngay_to_chuc) {
            setFormError('Vui lòng nhập Tên hoạt động và Ngày tổ chức (*)!')
            return
        }

        try {
            const method = editingId ? 'PUT' : 'POST'
            const payload = {
                ...formData,
                ma_hoat_dong_ngoai_khoa: editingId,
                chi_phi: formData.chi_phi ? parseInt(formData.chi_phi) : null
            }

            const response = await fetch('/api/tuyen-sinh/ngoai-khoa', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                const savedData = await response.json()
                if (editingId) {
                    setData(data.map((item) => (item.ma_hoat_dong_ngoai_khoa === savedData.ma_hoat_dong_ngoai_khoa ? savedData : item)))
                } else {
                    setData([savedData, ...data])
                }
                showToast(editingId ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success')
                closeModal()
            } else {
                showToast('Có lỗi xảy ra khi lưu.', 'error')
            }
        } catch (error) {
            showToast('Lỗi kết nối máy chủ.', 'error')
        }
    }

    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) return 'Miễn phí'
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    }

    const filteredData = data.filter(item => 
        item.ten_hoat_dong.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.dia_diem && item.dia_diem.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    return (
        <div className="bg-gray-50 min-h-screen p-6 relative">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-7xl mx-auto border border-gray-200">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200 gap-4">
                    <h1 className="text-2xl font-bold text-[#1d4ed8] flex items-center gap-3 uppercase">
                        <FaWalking className="text-blue-600" /> Quản Lý Hoạt Động Ngoại Khóa
                    </h1>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm w-full md:w-auto justify-center">
                        <FaPlus /> Thêm hoạt động
                    </button>
                </div>

                <div className="mb-6 w-full md:w-1/2 lg:w-1/3">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><FaSearch /></span>
                        <input 
                            type="text" 
                            placeholder="Tìm theo tên hoạt động, địa điểm..." 
                            value={searchTerm} 
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} 
                            className="w-full border border-gray-300 rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] transition shadow-sm text-gray-800" 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-t-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#1d4ed8] text-white uppercase font-semibold text-xs border-b">
                            <tr>
                                <th className="px-4 py-4 text-center">Mã HĐ</th>
                                <th className="px-4 py-4 min-w-[200px]">Tên Hoạt Động</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap">Ngày Tổ Chức</th>
                                <th className="px-4 py-4 min-w-[150px]">Địa Điểm</th>
                                <th className="px-4 py-4 min-w-[200px]">Giáo Viên Tham Gia</th>
                                <th className="px-4 py-4 text-center w-32">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-8 font-medium">Đang tải dữ liệu...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Không tìm thấy hoạt động nào.</td></tr>
                            ) : (
                                currentItems.map((row, index) => (
                                    <tr key={row.ma_hoat_dong_ngoai_khoa} className={`border-b hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-4 py-4 text-center text-gray-600 font-medium">{row.ma_hoat_dong_ngoai_khoa}</td>
                                        <td className="px-4 py-4 font-bold text-[#1d4ed8]">
                                            {row.ten_hoat_dong}
                                            <div className="text-xs text-green-600 font-semibold mt-1">{formatCurrency(row.chi_phi)}</div>
                                        </td>
                                        <td className="px-4 py-4 text-center text-gray-800 font-medium whitespace-nowrap">{new Date(row.ngay_to_chuc).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-4 py-4 text-gray-600">{row.dia_diem || <span className="italic text-gray-400">Chưa cập nhật</span>}</td>
                                        
                                        <td className="px-4 py-4">
                                            {row.phan_cong && row.phan_cong.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {row.phan_cong.map((pc, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium whitespace-nowrap">
                                                            {pc.giao_vien?.ho_ten || `GV ID: ${pc.ma_giao_vien}`}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="italic text-gray-400 text-sm">Chưa phân công</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openViewModal(row)} className="p-2 text-green-600 bg-green-100 rounded hover:bg-green-200 transition" title="Xem chi tiết"><FaEye /></button>
                                                <button onClick={() => openEditModal(row)} className="p-2 text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition" title="Chỉnh sửa"><FaEdit /></button>
                                                <button onClick={() => openDeleteModal(row.ma_hoat_dong_ngoai_khoa)} className="p-2 text-red-600 bg-red-100 rounded hover:bg-red-200 transition" title="Xóa"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && filteredData.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 font-medium text-gray-600 text-sm gap-4">
                        <div>Hiển thị <span className="font-bold text-gray-800">{indexOfFirstItem + 1}</span> đến <span className="font-bold text-gray-800">{Math.min(indexOfLastItem, filteredData.length)}</span> trong tổng số <span className="font-bold text-gray-800">{filteredData.length}</span> hoạt động</div>
                        <div className="flex gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className={`px-3 py-1.5 rounded border ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300 text-gray-700'}`}>Trước</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button key={number} onClick={() => setCurrentPage(number)} className={`px-3 py-1.5 rounded border ${currentPage === number ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]' : 'hover:bg-gray-100 border-gray-300 text-gray-700'}`}>{number}</button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded border ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300 text-gray-700'}`}>Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL THÊM/SỬA/XEM CHI TIẾT */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl animate-fade-in-up flex flex-col border border-gray-200 max-h-[90vh]">
                        
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-lg shrink-0">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2">
                                <FaWalking /> {isViewMode ? 'Chi Tiết Hoạt Động' : editingId ? 'Cập Nhật Hoạt Động' : 'Thêm Hoạt Động Mới'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto flex-1">
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[14px] text-gray-600 mb-1.5 font-medium">Tên hoạt động ngoại khóa <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" name="ten_hoat_dong" value={formData.ten_hoat_dong} onChange={handleChange} 
                                        disabled={isViewMode} placeholder="Ví dụ: Dã ngoại thực tế, CLB Tiếng Anh..."
                                        className={`w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-black text-[15px] focus:ring-2 focus:ring-blue-500 transition ${isViewMode ? 'bg-gray-50 disabled:opacity-100 disabled:text-black font-semibold border-transparent' : ''}`} 
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[14px] text-gray-600 mb-1.5 font-medium flex items-center gap-1"><FaCalendarAlt/> Ngày tổ chức <span className="text-red-500">*</span></label>
                                        <input 
                                            type="date" name="ngay_to_chuc" value={formData.ngay_to_chuc} onChange={handleChange} 
                                            disabled={isViewMode}
                                            className={`w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-black text-[15px] focus:ring-2 focus:ring-blue-500 transition ${isViewMode ? 'bg-gray-50 disabled:opacity-100 disabled:text-black border-transparent' : ''}`} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[14px] text-gray-600 mb-1.5 font-medium flex items-center gap-1"><FaMoneyBillWave/> Chi phí dự kiến (VNĐ)</label>
                                        <input 
                                            type="number" name="chi_phi" value={formData.chi_phi} onChange={handleChange} 
                                            disabled={isViewMode} placeholder="Để trống nếu miễn phí"
                                            className={`w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-black text-[15px] focus:ring-2 focus:ring-blue-500 transition ${isViewMode ? 'bg-gray-50 disabled:opacity-100 disabled:text-black font-bold text-green-600 border-transparent' : ''}`} 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[14px] text-gray-600 mb-1.5 font-medium flex items-center gap-1"><FaMapMarkerAlt/> Địa điểm tổ chức</label>
                                    <input 
                                        type="text" name="dia_diem" value={formData.dia_diem} onChange={handleChange} 
                                        disabled={isViewMode} placeholder="Ví dụ: Công viên Yên Sở..."
                                        className={`w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-black text-[15px] focus:ring-2 focus:ring-blue-500 transition ${isViewMode ? 'bg-gray-50 disabled:opacity-100 disabled:text-black border-transparent' : ''}`} 
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            <div>
                                <label className="block text-[14px] text-gray-700 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <FaUsers className="text-blue-600"/> Phân công giáo viên phụ trách
                                </label>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg max-h-48 overflow-y-auto">
                                    {danhSachGiaoVien.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic text-center">Chưa có dữ liệu giáo viên trong hệ thống.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {danhSachGiaoVien.map(gv => (
                                                <label 
                                                    key={gv.ma_giao_vien} 
                                                    className={`flex items-center gap-3 p-2 rounded-md transition ${isViewMode ? 'cursor-default' : 'cursor-pointer hover:bg-blue-50'} ${formData.danh_sach_giao_vien.includes(gv.ma_giao_vien) ? 'bg-blue-50/50' : ''}`}
                                                >
                                                    <input 
                                                        type="checkbox" 
                                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-100"
                                                        checked={formData.danh_sach_giao_vien.includes(gv.ma_giao_vien)}
                                                        onChange={(e) => handleTeacherToggle(gv.ma_giao_vien, e.target.checked)}
                                                        disabled={isViewMode}
                                                    />
                                                    <span className={`text-sm ${formData.danh_sach_giao_vien.includes(gv.ma_giao_vien) ? 'font-bold text-[#1d4ed8]' : 'text-gray-700'}`}>
                                                        {gv.ho_ten}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            <div>
                                <label className="block text-[14px] text-gray-600 mb-1.5 font-medium">Mô tả chi tiết</label>
                                <textarea 
                                    name="mo_ta" value={formData.mo_ta} onChange={handleChange} 
                                    disabled={isViewMode} rows={3} placeholder="Nhập nội dung, lịch trình hoạt động..."
                                    className={`w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-black text-[15px] focus:ring-2 focus:ring-blue-500 resize-none transition ${isViewMode ? 'bg-gray-50 disabled:opacity-100 disabled:text-black border-transparent' : ''}`}
                                ></textarea>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-5 border-t border-gray-200 bg-white rounded-b-lg flex justify-end gap-3 shrink-0">
                            {formError && <div className="mr-auto text-red-600 font-medium self-center">{formError}</div>}
                            <button onClick={closeModal} className="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 font-semibold transition">
                                Đóng
                            </button>
                            {!isViewMode && (
                                <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-semibold transition shadow-sm">
                                    <FaSave /> {editingId ? 'Lưu cập nhật' : 'Thêm hoạt động'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xóa */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up">
                        <button onClick={closeDeleteModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><FaTimes size={20} /></button>
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mr-4">
                                <FaExclamationTriangle className="text-red-600 text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa</h3>
                        </div>
                        <p className="text-gray-600 mb-6 ml-16 text-base">Bạn có chắc chắn muốn xóa hoạt động ngoại khóa này? Dữ liệu phân công giáo viên liên quan cũng sẽ bị xóa.</p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={closeDeleteModal} className="px-5 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors">Hủy bỏ</button>
                            <button onClick={confirmDelete} className="px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors shadow-sm">Xác nhận xóa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-5 right-5 z-[70] animate-fade-in-down transition-all duration-300">
                    <div className={`flex items-center min-w-[300px] p-4 bg-white rounded shadow-lg border-l-4 ${toast.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
                        <div className="flex-shrink-0 mr-3">
                            {toast.type === 'success' ? <FaCheckCircle className="text-green-500 text-2xl" /> : <div className="bg-red-100 rounded-full p-1"><FaTimes className="text-red-500 text-lg" /></div>}
                        </div>
                        <div className="flex-1 text-gray-800 font-medium">{toast.message}</div>
                        <button onClick={() => setToast(null)} className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"><FaTimes /></button>
                    </div>
                </div>
            )}
        </div>
    )
}