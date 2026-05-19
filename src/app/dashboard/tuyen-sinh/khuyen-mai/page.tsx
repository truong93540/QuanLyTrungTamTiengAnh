'use client'
import { useState, useEffect } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaGift, FaEye, FaCheckCircle, FaFilter, FaChevronDown, FaExclamationTriangle } from 'react-icons/fa'

interface ChuongTrinhKhuyenMai {
    ma_khuyen_mai: number
    ten_chuong_trinh: string
    mo_ta: string
    phan_tram_giam: number
    ngay_bat_dau: string
    ngay_ket_thuc: string | null
}

export default function QuanLyKhuyenMaiPage() {
    const [data, setData] = useState<ChuongTrinhKhuyenMai[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
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
        ten_chuong_trinh: '',
        mo_ta: '',
        phan_tram_giam: '',
        ngay_bat_dau: '',
        ngay_ket_thuc: '',
    })
    
    // State lưu trữ lỗi cho từng trường dữ liệu
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
    
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const formatDateForInput = (isoString: string | null) => {
        if (!isoString) return ''
        return new Date(isoString).toISOString().split('T')[0]
    }
    
    const getTrangThai = (start: string, end: string | null) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);

        const endDate = end ? new Date(end) : null;
        if (endDate) {
            endDate.setHours(23, 59, 59, 999);
        }
        if (today.getTime() < startDate.getTime()) {
            return { text: 'Sắp tới', style: 'bg-yellow-100 text-yellow-700' };
        }
        
        if (endDate && today.getTime() > endDate.getTime()) {
            return { text: 'Đã kết thúc', style: 'bg-gray-200 text-gray-600' };
        }
        
        return { text: 'Đang diễn ra', style: 'bg-green-100 text-green-700' };
    }

    useEffect(() => {
        const fetchKhuyenMai = async () => {
            try {
                const res = await fetch('/api/tuyen-sinh/khuyen-mai')
                if (res.ok) setData(await res.json())
            } catch (error) {
                console.error('Lỗi fetch API:', error)
                showToast('Lỗi khi tải dữ liệu từ máy chủ', 'error')
            } finally {
                setIsLoading(false)
            }
        }
        fetchKhuyenMai()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        
        // Tự động xóa lỗi khi người dùng bắt đầu nhập lại
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const openAddModal = () => {
        setIsViewMode(false)
        setEditingId(null)
        setFormData({ ten_chuong_trinh: '', mo_ta: '', phan_tram_giam: '', ngay_bat_dau: '', ngay_ket_thuc: '' })
        setFormErrors({}) // Xóa lỗi cũ khi mở modal
        setIsModalOpen(true)
    }

    const openEditModal = (row: ChuongTrinhKhuyenMai) => {
        setIsViewMode(false)
        setEditingId(row.ma_khuyen_mai)
        setFormData({
            ten_chuong_trinh: row.ten_chuong_trinh,
            mo_ta: row.mo_ta || '',
            phan_tram_giam: row.phan_tram_giam?.toString() || '',
            ngay_bat_dau: formatDateForInput(row.ngay_bat_dau),
            ngay_ket_thuc: formatDateForInput(row.ngay_ket_thuc),
        })
        setFormErrors({}) // Xóa lỗi cũ khi mở modal
        setIsModalOpen(true)
    }

    const openViewModal = (row: ChuongTrinhKhuyenMai) => {
        setIsViewMode(true)
        setEditingId(row.ma_khuyen_mai)
        setFormData({
            ten_chuong_trinh: row.ten_chuong_trinh,
            mo_ta: row.mo_ta || '',
            phan_tram_giam: row.phan_tram_giam?.toString() || '',
            ngay_bat_dau: formatDateForInput(row.ngay_bat_dau),
            ngay_ket_thuc: formatDateForInput(row.ngay_ket_thuc),
        })
        setFormErrors({})
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setFormErrors({})
    }
    
    const openDeleteModal = (id: number) => {
        setDeletingId(id)
        setIsDeleteModalOpen(true)
    }
    const closeDeleteModal = () => setIsDeleteModalOpen(false)

    const confirmDelete = async () => {
        if (!deletingId) return
        try {
            const response = await fetch(`/api/tuyen-sinh/khuyen-mai?id=${deletingId}`, { method: 'DELETE' })
            if (response.ok) {
                setData(data.filter((item) => item.ma_khuyen_mai !== deletingId))
                showToast('Đã xóa chương trình khuyến mãi!', 'success')
            } else {
                showToast('Có lỗi xảy ra khi xóa.', 'error')
            }
        } catch (error) {
            showToast('Không thể kết nối đến máy chủ.', 'error')
        } finally {
            closeDeleteModal()
        }
    }

    // Hàm bắt lỗi ngày tháng hợp lệ
    const isValidDateInput = (dateString: string) => {
        const dateObj = new Date(dateString);
        return dateObj instanceof Date && !isNaN(dateObj.getTime());
    }

    const handleSave = async () => {
        const errors: Record<string, string> = {};

        // 1. Kiểm tra Tên chương trình
        if (!formData.ten_chuong_trinh.trim()) {
            errors.ten_chuong_trinh = 'Vui lòng nhập tên chương trình khuyến mãi';
        }

        // 2. Kiểm tra Phần trăm giảm
        if (!formData.phan_tram_giam || formData.phan_tram_giam.trim() === '') {
            errors.phan_tram_giam = 'Vui lòng nhập phần trăm giảm giá';
        } else if (Number(formData.phan_tram_giam) <= 0 || Number(formData.phan_tram_giam) > 100) {
            errors.phan_tram_giam = 'Phần trăm giảm phải lớn hơn 0 và tối đa là 100';
        }

        // 3. Kiểm tra Ngày bắt đầu
        if (!formData.ngay_bat_dau) {
            errors.ngay_bat_dau = 'Vui lòng chọn ngày bắt đầu';
        } else if (!isValidDateInput(formData.ngay_bat_dau)) {
            errors.ngay_bat_dau = 'Ngày bắt đầu không hợp lệ';
        }

        // 4. Kiểm tra Ngày kết thúc (nếu có nhập)
        if (formData.ngay_ket_thuc) {
            if (!isValidDateInput(formData.ngay_ket_thuc)) {
                errors.ngay_ket_thuc = 'Ngày kết thúc không hợp lệ';
            } else if (!errors.ngay_bat_dau) {
                const startDate = new Date(formData.ngay_bat_dau);
                const endDate = new Date(formData.ngay_ket_thuc);
                if (endDate < startDate) {
                    errors.ngay_ket_thuc = 'Ngày kết thúc không được trước ngày bắt đầu';
                }
            }
        }

        // Nếu có lỗi, cập nhật state và dừng lưu
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({}); // Reset lỗi nếu tất cả hợp lệ

        try {
            const method = editingId ? 'PUT' : 'POST'
            const payload = {
                ma_khuyen_mai: editingId || undefined,
                ten_chuong_trinh: formData.ten_chuong_trinh,
                mo_ta: formData.mo_ta,
                phan_tram_giam: parseFloat(formData.phan_tram_giam),
                ngay_bat_dau: new Date(formData.ngay_bat_dau).toISOString(),
                ngay_ket_thuc: formData.ngay_ket_thuc ? new Date(formData.ngay_ket_thuc).toISOString() : null
            }

            const response = await fetch('/api/tuyen-sinh/khuyen-mai', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                const savedData = await response.json()
                if (editingId) {
                    setData(data.map(item => item.ma_khuyen_mai === savedData.ma_khuyen_mai ? savedData : item))
                    showToast('Cập nhật thành công!', 'success')
                } else {
                    setData([...data, savedData])
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

    // --- TÍNH TOÁN TÌM KIẾM & PHÂN TRANG ---
    const filteredData = data.filter(item => {
        const matchSearch = item.ten_chuong_trinh.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.ma_khuyen_mai.toString().includes(searchTerm);
        
        // Lọc theo tháng (Dựa trên ngày bắt đầu áp dụng)
        let matchMonth = true;
        if (selectedMonth !== 'all') {
            const startMonth = new Date(item.ngay_bat_dau).getMonth() + 1;
            matchMonth = startMonth.toString() === selectedMonth;
        }

        return matchSearch && matchMonth;
    });

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    return (
        <div className="bg-gray-50 min-h-screen p-6 relative">
            <div className="bg-white rounded-lg shadow-md p-6">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-[#1d4ed8] flex items-center gap-3 uppercase">
                        <FaGift className="text-blue-600" />
                        Chương trình Khuyến mãi
                    </h1>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm">
                        <FaPlus /> Thêm Chương Trình Khuyến mãi
                    </button>
                </div>

                {/* THANH CÔNG CỤ: TÌM KIẾM & BỘ LỌC */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 w-full items-center">
                    <div className="relative flex-1 md:max-w-md w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <FaSearch className="text-gray-400 text-sm" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Tìm mã, tên chương trình khuyến mãi..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm focus:border-[#1d4ed8] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-gray-400" 
                        />
                    </div>

                    <div className="relative w-full md:w-36 shrink-0 group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FaFilter className="text-gray-400 text-[11px]" />
                        </div>
                        <select 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-8 pr-7 text-sm font-semibold text-gray-700 shadow-sm focus:border-[#1d4ed8] focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer transition-all hover:bg-gray-50"
                        >
                            <option value="all">Tất cả</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                <option key={month} value={month.toString()}>Tháng {month}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <FaChevronDown className="text-gray-400 text-[10px] transition-transform group-hover:text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Bảng Dữ Liệu */}
                <div className="overflow-x-auto rounded-t-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#1d4ed8] text-white uppercase font-semibold text-xs">
                            <tr>
                                <th className="px-4 py-4 text-center whitespace-nowrap">Mã</th>
                                <th className="px-4 py-4 min-w-[250px] whitespace-nowrap text-center">Tên Chương Trình</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap">Giảm Giá</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap">Thời Gian Áp Dụng</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap">Trạng Thái</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-8 font-medium">Đang tải dữ liệu...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Không tìm thấy dữ liệu.</td></tr>
                            ) : (
                                currentItems.map((row, index) => {
                                    const trangThai = getTrangThai(row.ngay_bat_dau, row.ngay_ket_thuc)
                                    return (
                                        <tr key={row.ma_khuyen_mai} className={`border-b hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="px-4 py-4 text-center font-bold text-gray-500">{row.ma_khuyen_mai}</td>
                                            <td className="px-4 py-4">
                                                <div className="font-bold text-[#1d4ed8]">{row.ten_chuong_trinh}</div>
                                            </td>
                                            <td className="px-4 py-4 text-center font-semibold text-orange-600 text-base whitespace-nowrap">
                                                {row.phan_tram_giam}%
                                            </td>
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                <span className="block">{new Date(row.ngay_bat_dau).toLocaleDateString('vi-VN')}</span>
                                                <span className="block text-gray-400 text-xs mt-1">đến</span>
                                                <span className="block">{row.ngay_ket_thuc ? new Date(row.ngay_ket_thuc).toLocaleDateString('vi-VN') : 'Không thời hạn'}</span>
                                            </td>
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trangThai.style}`}>
                                                    {trangThai.text}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => openViewModal(row)} className="p-2 text-green-600 bg-green-100 rounded hover:bg-green-200 transition" title="Xem"><FaEye /></button>
                                                    <button onClick={() => openEditModal(row)} className="p-2 text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition" title="Sửa"><FaEdit /></button>
                                                    <button onClick={() => openDeleteModal(row.ma_khuyen_mai)} className="p-2 text-red-600 bg-red-100 rounded hover:bg-red-200 transition" title="Xóa"><FaTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {!isLoading && filteredData.length > 0 && (
                    <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                        <div>
                            Hiển thị <span className="font-bold">{indexOfFirstItem + 1}</span> đến <span className="font-bold">{Math.min(indexOfLastItem, filteredData.length)}</span> trong tổng số <span className="font-bold">{filteredData.length}</span> khuyến mãi
                        </div>
                        <div className="flex gap-1">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                                disabled={currentPage === 1} 
                                className="px-3 py-1.5 border border-gray-300 rounded disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-50 transition bg-white"
                            >
                                Trước
                            </button>

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
                    <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-lg">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaGift className="text-blue-600" />
                                {isViewMode ? 'Chi Tiết Khuyến Mãi' : editingId ? 'Cập Nhật Khuyến Mãi' : 'Thêm Khuyến Mãi Mới'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Tên chương trình <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="ten_chuong_trinh" 
                                    value={formData.ten_chuong_trinh} 
                                    onChange={handleChange} 
                                    disabled={isViewMode} 
                                    className={`w-full border rounded-md p-2.5 text-gray-900 disabled:bg-gray-100 disabled:opacity-100 disabled:text-gray-900 transition outline-none ${formErrors.ten_chuong_trinh && !isViewMode ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-400 focus:ring-2 focus:ring-blue-500'}`} 
                                />
                                {formErrors.ten_chuong_trinh && !isViewMode && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.ten_chuong_trinh}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Phần trăm giảm (%) <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        name="phan_tram_giam" 
                                        value={formData.phan_tram_giam} 
                                        onChange={handleChange} 
                                        disabled={isViewMode} 
                                        className={`w-full border rounded-md p-2.5 text-orange-600 disabled:bg-gray-100 disabled:opacity-100 disabled:text-orange-600 font-semibold transition outline-none ${formErrors.phan_tram_giam && !isViewMode ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-400 focus:ring-2 focus:ring-blue-500'}`} 
                                    />
                                    {formErrors.phan_tram_giam && !isViewMode && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.phan_tram_giam}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Ngày bắt đầu <span className="text-red-500">*</span></label>
                                    <input 
                                        type="date" 
                                        name="ngay_bat_dau" 
                                        value={formData.ngay_bat_dau} 
                                        onChange={handleChange} 
                                        disabled={isViewMode} 
                                        className={`w-full border rounded-md p-2.5 text-gray-900 disabled:bg-gray-100 disabled:opacity-100 disabled:text-gray-900 transition outline-none ${formErrors.ngay_bat_dau && !isViewMode ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-400 focus:ring-2 focus:ring-blue-500'}`} 
                                    />
                                    {formErrors.ngay_bat_dau && !isViewMode && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.ngay_bat_dau}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Ngày kết thúc (Tùy chọn)</label>
                                    <input 
                                        type="date" 
                                        name="ngay_ket_thuc" 
                                        value={formData.ngay_ket_thuc} 
                                        onChange={handleChange} 
                                        disabled={isViewMode} 
                                        className={`w-full border rounded-md p-2.5 text-gray-900 disabled:bg-gray-100 disabled:opacity-100 disabled:text-gray-900 transition outline-none ${formErrors.ngay_ket_thuc && !isViewMode ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-400 focus:ring-2 focus:ring-blue-500'}`} 
                                    />
                                    {formErrors.ngay_ket_thuc && !isViewMode && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.ngay_ket_thuc}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Mô tả chương trình</label>
                                <textarea 
                                    name="mo_ta" 
                                    rows={3} 
                                    value={formData.mo_ta} 
                                    onChange={handleChange} 
                                    disabled={isViewMode} 
                                    className="w-full border border-gray-400 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none disabled:bg-gray-100 disabled:opacity-100 disabled:text-gray-900 outline-none transition" 
                                    placeholder="Nhập chi tiết về chương trình..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-5 border-t bg-gray-50 rounded-b-lg">
                            {Object.keys(formErrors).length > 0 && !isViewMode && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm font-medium border border-red-100 flex items-center gap-2">
                                    <FaExclamationTriangle /> Vui lòng kiểm tra lại các trường báo đỏ!
                                </div>
                            )}
                            <div className="flex justify-end gap-3">
                                <button onClick={closeModal} className="px-5 py-2 border border-gray-300 bg-white rounded-md hover:bg-gray-100 font-medium text-gray-800">{isViewMode ? 'Đóng' : 'Hủy bỏ'}</button>
                                {!isViewMode && (
                                    <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium shadow-sm transition">
                                        <FaSave /> {editingId ? 'Cập nhật' : 'Lưu chương trình'}
                                    </button>
                                )}
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
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mr-4"><span className="text-red-600 font-bold text-2xl">!</span></div>
                            <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa</h3>
                        </div>
                        <p className="text-gray-600 mb-6 ml-16">Bạn có chắc chắn muốn xóa chương trình khuyến mãi này? Dữ liệu không thể khôi phục.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={closeDeleteModal} className="px-5 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-gray-800">Hủy bỏ</button>
                            <button onClick={confirmDelete} className="px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium">Xác nhận xóa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST */}
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