'use client'
import { useState, useEffect } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaBookOpen, FaEye, FaCheckCircle, FaBullhorn, FaChalkboardTeacher, FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa'

interface ChuongTrinhHoc {
    ma_chuong_trinh: number
    ten_chuong_trinh: string
    mo_ta?: string | null
    muc_tieu?: string | null
}

interface ChuongTrinhMarketing {
    ma_chuong_trinh_marketing: number
    ten_chuong_trinh_marketing: string
    ngan_sach: number
    ngay_bat_dau: string
    ngay_ket_thuc: string
}

interface PhanCongGiangDay {
    giao_vien?: { ho_ten: string }
}

interface LopHoc {
    ma_lop_hoc: number
    ten_lop: string
    si_so_toi_da: number
    ngay_khai_giang: string
    ngay_ket_thuc: string
    phan_cong_giang_day?: PhanCongGiangDay[]
    phong_hoc?: { ten_phong_hoc: string }
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
    chuong_trinh?: ChuongTrinhHoc
    marketing?: ChuongTrinhMarketing[]
    lop_hoc?: LopHoc[]
}

export default function QuanLyKhoaHocPage() {
    const [data, setData] = useState<KhoaHoc[]>([])
    const [chuongTrinhList, setChuongTrinhList] = useState<ChuongTrinhHoc[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    // Tìm kiếm & Lọc
    const [searchTerm, setSearchTerm] = useState('')
    const [filterTrinhDo, setFilterTrinhDo] = useState('all') // State lọc theo trình độ
    
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewMode, setIsViewMode] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    
    // View Data State & Accordion State
    const [viewData, setViewData] = useState<KhoaHoc | null>(null)
    const [openClassId, setOpenClassId] = useState<number | null>(null) 
    
    // Accordion States cho các khối lớn
    const [showChuongTrinhDetail, setShowChuongTrinhDetail] = useState(false)
    const [showMarketingDetail, setShowMarketingDetail] = useState(false)
    const [showLopHocDetail, setShowLopHocDetail] = useState(false)

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
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    const formatDate = (isoString: string) => {
        if (!isoString) return 'Chưa rõ';
        return new Date(isoString).toLocaleDateString('vi-VN')
    }

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [resKhoaHoc, resChuongTrinh] = await Promise.all([
                    fetch('/api/tuyen-sinh/khoa-hoc'),
                    fetch('/api/tuyen-sinh/chuong-trinh-hoc')
                ])

                if (resKhoaHoc.ok) setData(await resKhoaHoc.json())
                if (resChuongTrinh.ok) setChuongTrinhList(await resChuongTrinh.json())
            } catch (error) {
                showToast('Lỗi khi tải dữ liệu từ máy chủ', 'error')
            } finally {
                setIsLoading(false)
            }
        }
        fetchAllData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const openAddModal = () => {
        setIsViewMode(false)
        setEditingId(null)
        setFormData({ ten_khoa_hoc: '', mo_ta: '', thoi_luong: '', hoc_phi: '', trinh_do: '', trang_thai: '', ma_chuong_trinh: '' })
        setFormErrors({})
        setIsModalOpen(true)
    }

    const openEditModal = (row: KhoaHoc) => {
        setIsViewMode(false)
        setEditingId(row.ma_khoa_hoc)
        setFormData({
            ten_khoa_hoc: row.ten_khoa_hoc,
            mo_ta: row.mo_ta || '',
            thoi_luong: row.thoi_luong || '',
            hoc_phi: row.hoc_phi.toString(),
            trinh_do: row.trinh_do || '',
            trang_thai: row.trang_thai || '',
            ma_chuong_trinh: row.ma_chuong_trinh.toString(),
        })
        setFormErrors({})
        setIsModalOpen(true)
    }

    const openViewModal = (row: KhoaHoc) => {
        setIsViewMode(true)
        setViewData(row)
        
        // Đảm bảo trạng thái đóng mở Accordion gọn gàng
        setShowChuongTrinhDetail(false)
        setShowMarketingDetail(false)
        setShowLopHocDetail(false)
        setOpenClassId(null) 
        
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
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

    const handleSaveKhoaHoc = async () => {
        const errors: Record<string, string> = {};
        if (!formData.ten_khoa_hoc.trim()) errors.ten_khoa_hoc = 'Vui lòng nhập tên khóa học';
        if (!formData.ma_chuong_trinh) errors.ma_chuong_trinh = 'Vui lòng chọn chương trình học';
        if (!formData.thoi_luong.trim()) errors.thoi_luong = 'Vui lòng nhập thời lượng';
        if (!formData.hoc_phi || Number(formData.hoc_phi) < 0) errors.hoc_phi = 'Vui lòng nhập học phí hợp lệ';
        if (!formData.trinh_do) errors.trinh_do = 'Vui lòng chọn trình độ';
        if (!formData.trang_thai) errors.trang_thai = 'Vui lòng chọn trạng thái';
        if (!formData.mo_ta.trim()) errors.mo_ta = 'Vui lòng nhập mô tả khóa học';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
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
                const resFresh = await fetch('/api/tuyen-sinh/khoa-hoc')
                if (resFresh.ok) setData(await resFresh.json())
                showToast(editingId ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success')
                closeModal()
            } else {
                showToast(`Lỗi khi lưu dữ liệu.`, 'error')
            }
        } catch (error) {
            showToast('Không thể kết nối đến máy chủ.', 'error')
        }
    }

    // TÍNH TOÁN BỘ LỌC KẾT HỢP TÌM KIẾM
    const filteredData = data.filter(item => {
        const matchesSearch = item.ten_khoa_hoc.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.ma_khoa_hoc.toString().includes(searchTerm);
        const matchesTrinhDo = filterTrinhDo === 'all' || item.trinh_do === filterTrinhDo;
        return matchesSearch && matchesTrinhDo;
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const activeMarketing = viewData?.marketing?.filter(mkt => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(mkt.ngay_ket_thuc);
        endDate.setHours(23, 59, 59, 999);
        return today.getTime() <= endDate.getTime();
    }) || [];

    return (
        <div className="bg-gray-50 min-h-screen p-6 relative">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-[#1d4ed8] flex items-center gap-3 uppercase tracking-wide">
                        <FaBookOpen className="text-blue-600" />
                        Danh sách Khóa học
                    </h1>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm">
                        <FaPlus /> Thêm Khóa học
                    </button>
                </div>

                {/* THANH TÌM KIẾM & BỘ LỌC TRÌNH ĐỘ */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 w-full lg:w-2/3">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><FaSearch /></span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã hoặc tên khóa học..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full border border-gray-300 rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] transition shadow-sm text-sm text-gray-900 font-medium"
                        />
                    </div>
                    <div className="relative w-full md:w-48 shrink-0">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><FaFilter /></span>
                        <select 
                            value={filterTrinhDo} 
                            onChange={(e) => { setFilterTrinhDo(e.target.value); setCurrentPage(1); }}
                            className="w-full border border-gray-300 rounded-md py-2.5 pl-10 pr-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] transition shadow-sm text-sm text-gray-900 font-medium cursor-pointer"
                        >
                            <option value="all">Tất cả trình độ</option>
                            <option value="A1"> A1</option>
                            <option value="A2"> A2</option>
                            <option value="B1">B1</option>
                            <option value="B2"> B2</option>
                            <option value="C1"> C1</option>
                            <option value="C2">C2</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#1d4ed8] text-white uppercase font-semibold text-xs tracking-wider">
                            <tr>
                                <th className="px-5 py-4 text-center border-b border-blue-600">Mã</th>
                                <th className="px-5 py-4 min-w-[200px] border-b border-blue-600">Tên Khóa Học</th>
                                <th className="px-5 py-4 text-center border-b border-blue-600">Thời Lượng</th>
                                <th className="px-5 py-4 text-right border-b border-blue-600">Học Phí</th>
                                <th className="px-5 py-4 text-center border-b border-blue-600">Trình Độ</th>
                                <th className="px-5 py-4 text-center border-b border-blue-600">Trạng Thái</th>
                                <th className="px-5 py-4 text-center border-b border-blue-600 w-28">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center py-8 font-medium">Đang tải dữ liệu...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Không tìm thấy khóa học nào.</td></tr>
                            ) : (
                                currentItems.map((row, index) => (
                                    <tr key={row.ma_khoa_hoc} className={`border-b hover:bg-blue-50/50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-5 py-4 text-center font-bold text-gray-500">{row.ma_khoa_hoc}</td>
                                        <td className="px-5 py-4">
                                            <div className="font-bold text-[#1d4ed8] text-base">{row.ten_khoa_hoc}</div>
                                            <div className="text-xs text-gray-500 mt-1 italic">Chương Trình: {row.chuong_trinh?.ten_chuong_trinh || 'N/A'}</div>
                                        </td>
                                        <td className="px-5 py-4 text-center font-medium whitespace-nowrap">{row.thoi_luong}</td>
                                        <td className="px-5 py-4 text-right font-bold text-red-600">
                                            {formatCurrency(row.hoc_phi)}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 border border-purple-200 rounded-md text-xs font-bold">{row.trinh_do}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                                                row.trang_thai === 'Đang mở' ? 'bg-green-100 text-green-700' : 
                                                row.trang_thai === 'Sắp khai giảng' ? 'bg-blue-100 text-blue-700' : 
                                                row.trang_thai === 'Tạm dừng' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {row.trang_thai || 'Chưa rõ'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openViewModal(row)} className="p-2 text-green-600 bg-green-50 border border-green-100 rounded hover:bg-green-100 transition shadow-sm" title="Xem chi tiết"><FaEye /></button>
                                                <button onClick={() => openEditModal(row)} className="p-2 text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition shadow-sm" title="Sửa"><FaEdit /></button>
                                                <button onClick={() => openDeleteModal(row.ma_khoa_hoc)} className="p-2 text-red-600 bg-red-50 border border-red-100 rounded hover:bg-red-100 transition shadow-sm" title="Xóa"><FaTrash /></button>
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
                            Hiển thị <span className="font-bold">{indexOfFirstItem + 1}</span> đến <span className="font-bold">{Math.min(indexOfLastItem, filteredData.length)}</span> / <span className="font-bold">{filteredData.length}</span> khóa học
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-50 transition bg-white">Trước</button>
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
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-50 transition bg-white">Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL VIEW (BÁO CÁO CHI TIẾT) */}
            {isModalOpen && isViewMode && viewData && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl animate-fade-in-up flex flex-col max-h-[95vh]">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl shrink-0">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2 uppercase tracking-wide"><FaBookOpen /> Báo Cáo Chi Tiết Khóa Học</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 bg-gray-50/50">
                            
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-[#1d4ed8] pl-3">Thông Tin Chung</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-y-5 gap-x-6 text-sm">
                                    <div className="md:col-span-4">
                                        <span className="text-gray-500 block mb-1">Tên khóa học</span>
                                        <span className="font-bold text-xl text-[#1d4ed8]">{viewData.ten_khoa_hoc}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Học phí</span>
                                        <span className="font-bold text-red-600 text-lg">{formatCurrency(viewData.hoc_phi)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Thời lượng</span>
                                        <span className="font-semibold text-gray-800 text-base">{viewData.thoi_luong}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Trình độ</span>
                                        <span className="font-semibold text-gray-800 text-base">{viewData.trinh_do}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Trạng thái</span>
                                        <span className="font-semibold text-blue-600 text-base">{viewData.trang_thai}</span>
                                    </div>
                                    <div className="md:col-span-4 mt-1">
                                        <span className="text-gray-500 block mb-2">Mô tả chi tiết khóa học</span>
                                        <p className="text-gray-800 bg-gray-50 p-3.5 rounded-md border border-gray-200 min-h-[60px] text-sm">
                                            {viewData.mo_ta || <span className="italic text-gray-400">Không có mô tả</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div 
                                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => setShowChuongTrinhDetail(!showChuongTrinhDetail)}
                                >
                                    <h3 className="text-base font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
                                        <FaBookOpen className="text-indigo-600"/> Chương Trình Đào Tạo Áp Dụng
                                    </h3>
                                    <button className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition">
                                        {showChuongTrinhDetail ? <><FaChevronUp /> Thu gọn</> : <><FaChevronDown /> Xem chi tiết</>}
                                    </button>
                                </div>
                                
                                {showChuongTrinhDetail && (
                                    <div className="px-5 pb-5 pt-0 animate-fade-in-up text-sm">
                                        {viewData.chuong_trinh ? (
                                            <div className="bg-[#f8fafc] p-4 rounded-lg border border-indigo-100 space-y-4">
                                                <div>
                                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">Tên Chương Trình Học</span>
                                                    <span className="font-bold text-gray-950 text-base">{viewData.chuong_trinh.ten_chuong_trinh}</span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-gray-500 font-medium block mb-1.5">Mục tiêu đào tạo</span>
                                                        <p className="text-gray-800 bg-white p-3 rounded-md border border-gray-200 min-h-[70px] leading-relaxed">
                                                            {viewData.chuong_trinh.muc_tieu || <span className="italic text-gray-400">Chưa cập nhật mục tiêu cụ thể</span>}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 font-medium block mb-1.5">Mô tả tổng quan</span>
                                                        <p className="text-gray-800 bg-white p-3 rounded-md border border-gray-200 min-h-[70px] leading-relaxed">
                                                            {viewData.chuong_trinh.mo_ta || <span className="italic text-gray-400">Không có mô tả chi tiết chương trình</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg text-center">
                                                <p className="text-sm text-gray-500 italic">Khóa học này hiện chưa được liên kết với chương trình học nào.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div 
                                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => setShowMarketingDetail(!showMarketingDetail)}
                                >
                                    <h3 className="text-base font-bold text-gray-800 border-l-4 border-purple-500 pl-3 flex items-center gap-2">
                                        <FaBullhorn className="text-purple-600"/> Chương Trình Marketing Liên Kết
                                    </h3>
                                    <button className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-md hover:bg-purple-200 transition">
                                        {showMarketingDetail ? <><FaChevronUp /> Thu gọn</> : <><FaChevronDown /> Xem chi tiết</>}
                                    </button>
                                </div>
                                
                                {showMarketingDetail && (
                                    <div className="px-5 pb-5 pt-0 animate-fade-in-up">
                                        {activeMarketing.length > 0 ? (
                                            <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                                                        <tr>
                                                            <th className="px-4 py-3">Tên Chương Trình</th>
                                                            <th className="px-4 py-3 text-right">Ngân Sách</th>
                                                            <th className="px-4 py-3 text-center">Bắt Đầu</th>
                                                            <th className="px-4 py-3 text-center">Kết Thúc</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white">
                                                        {activeMarketing.map((mkt, idx) => (
                                                            <tr key={mkt.ma_chuong_trinh_marketing} className={`border-b last:border-0 hover:bg-gray-50 ${idx % 2 !== 0 ? 'bg-gray-50/50' : ''}`}>
                                                                <td className="px-4 py-3.5 font-bold text-gray-800">{mkt.ten_chuong_trinh_marketing}</td>
                                                                <td className="px-4 py-3.5 text-right font-bold text-red-600">{formatCurrency(mkt.ngan_sach)}</td>
                                                                <td className="px-4 py-3.5 text-center text-gray-600 font-medium">{formatDate(mkt.ngay_bat_dau)}</td>
                                                                <td className="px-4 py-3.5 text-center text-gray-600 font-medium">{formatDate(mkt.ngay_ket_thuc)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg text-center">
                                                <p className="text-sm text-gray-500 italic">Khóa học này hiện không có chiến dịch Marketing nào đang diễn ra.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div 
                                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => setShowLopHocDetail(!showLopHocDetail)}
                                >
                                    <h3 className="text-base font-bold text-gray-800 border-l-4 border-green-500 pl-3 flex items-center gap-2">
                                        <FaChalkboardTeacher className="text-green-600"/> Danh Sách Lớp Học Thuộc Khóa
                                    </h3>
                                    <button className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-md hover:bg-green-200 transition">
                                        {showLopHocDetail ? <><FaChevronUp /> Thu gọn</> : <><FaChevronDown /> Xem chi tiết</>}
                                    </button>
                                </div>
                                
                                {showLopHocDetail && (
                                    <div className="px-5 pb-5 pt-0 animate-fade-in-up">
                                        {viewData.lop_hoc && viewData.lop_hoc.length > 0 ? (
                                            <div className="space-y-3">
                                                {viewData.lop_hoc.map(lop => {
                                                    const isOpen = openClassId === lop.ma_lop_hoc;
                                                    return (
                                                        <div key={lop.ma_lop_hoc} className={`border rounded-lg transition-all ${isOpen ? 'border-green-400 shadow-sm ring-1 ring-green-400' : 'border-gray-200 hover:border-green-300'}`}>
                                                            <div 
                                                                className={`p-4 flex justify-between items-center cursor-pointer ${isOpen ? 'bg-[#f6fbf7]' : 'bg-white'} rounded-t-lg`}
                                                                onClick={() => setOpenClassId(isOpen ? null : lop.ma_lop_hoc)}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <span className="font-bold text-green-700 text-base">{lop.ten_lop}</span>
                                                                    <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600 font-semibold shadow-sm">Sĩ số: {lop.si_so_toi_da}</span>
                                                                </div>
                                                                <div className="text-green-600 bg-white p-1.5 rounded-full border border-green-200 shadow-sm">{isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}</div>
                                                            </div>
                                                            
                                                            {isOpen && (
                                                                <div className="p-4 bg-white border-t border-green-100 rounded-b-lg animate-fade-in-up">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                                                            <span className="text-gray-500 block mb-1 text-xs uppercase font-bold tracking-wider">Giáo Viên Phụ Trách</span>
                                                                            <span className="font-bold text-gray-800 text-base">
                                                                                {lop.phan_cong_giang_day && lop.phan_cong_giang_day.length > 0 
                                                                                    ? lop.phan_cong_giang_day.map(pc => pc.giao_vien?.ho_ten).join(', ') 
                                                                                    : 'Chưa phân công'}
                                                                            </span>
                                                                        </div>
                                                                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                                                            <span className="text-gray-500 block mb-1 text-xs uppercase font-bold tracking-wider">Phòng Học</span>
                                                                            <span className="font-bold text-gray-800 text-base">{lop.phong_hoc?.ten_phong_hoc || 'Chưa xếp phòng'}</span>
                                                                        </div>
                                                                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                                                            <span className="text-gray-500 block mb-1 text-xs uppercase font-bold tracking-wider">Ngày Khai Giảng</span>
                                                                            <span className="font-bold text-[#1d4ed8] text-base">{formatDate(lop.ngay_khai_giang)}</span>
                                                                        </div>
                                                                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                                                            <span className="text-gray-500 block mb-1 text-xs uppercase font-bold tracking-wider">Ngày Kết Thúc</span>
                                                                            <span className="font-bold text-[#1d4ed8] text-base">{formatDate(lop.ngay_ket_thuc)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg text-center">
                                                <p className="text-sm text-gray-500 italic">Khóa học này hiện chưa mở lớp nào.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl flex justify-end shrink-0">
                            <button onClick={closeModal} className="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 font-bold transition shadow-sm text-sm">Đóng Báo Cáo</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL THÊM / SỬA KHÓA HỌC */}
            {isModalOpen && !isViewMode && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-lg">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2 uppercase tracking-wide">
                                <FaBookOpen /> {editingId ? 'Cập Nhật Khóa Học' : 'Thêm Khóa Học Mới'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1.5 font-bold">Tên khóa học <span className="text-red-500">*</span></label>
                                <input type="text" name="ten_khoa_hoc" value={formData.ten_khoa_hoc} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] text-gray-900 font-medium outline-none" />
                                {formErrors.ten_khoa_hoc && <p className="text-red-500 text-sm mt-1">{formErrors.ten_khoa_hoc}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1.5 font-bold">Thuộc chương trình học <span className="text-red-500">*</span></label>
                                    <select name="ma_chuong_trinh" value={formData.ma_chuong_trinh} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-[#1d4ed8] text-gray-900 font-medium outline-none">
                                        <option value="">-- Chọn chương trình học --</option>
                                        {chuongTrinhList.map(ct => (
                                            <option key={ct.ma_chuong_trinh} value={ct.ma_chuong_trinh}>{ct.ten_chuong_trinh}</option>
                                        ))}
                                    </select>
                                    {formErrors.ma_chuong_trinh && <p className="text-red-500 text-sm mt-1">{formErrors.ma_chuong_trinh}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1.5 font-bold">Thời lượng <span className="text-red-500">*</span></label>
                                    <input type="text" name="thoi_luong" value={formData.thoi_luong} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] text-gray-900 font-medium outline-none" placeholder="VD: 3 tháng, 20 buổi..." />
                                    {formErrors.thoi_luong && <p className="text-red-500 text-sm mt-1">{formErrors.thoi_luong}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1.5 font-bold">Học phí (VNĐ) <span className="text-red-500">*</span></label>
                                    <input type="number" name="hoc_phi" value={formData.hoc_phi} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] text-red-600 font-bold outline-none" />
                                    {formErrors.hoc_phi && <p className="text-red-500 text-sm mt-1">{formErrors.hoc_phi}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5 font-bold">Trình độ <span className="text-red-500">*</span></label>
                                        <select name="trinh_do" value={formData.trinh_do} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-[#1d4ed8] text-gray-900 font-medium outline-none">
                                            <option value="">-- Chọn trình độ --</option>
                                            <option value="A1">A1</option>
                                            <option value="A2">A2</option>
                                            <option value="B1">B1</option>
                                            <option value="B2">B2</option>
                                            <option value="C1">C1</option>
                                            <option value="C2">C2</option>
                                        </select>
                                        {formErrors.trinh_do && <p className="text-red-500 text-sm mt-1">{formErrors.trinh_do}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5 font-bold">Trạng thái <span className="text-red-500">*</span></label>
                                        <select name="trang_thai" value={formData.trang_thai} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-[#1d4ed8] text-gray-900 font-medium outline-none">
                                            <option value="">-- Chọn --</option>
                                            <option value="Đang mở">Đang mở</option>
                                            <option value="Sắp khai giảng">Sắp khai giảng</option>
                                            <option value="Tạm dừng">Tạm dừng</option>
                                            <option value="Đã kết thúc">Đã kết thúc</option>
                                        </select>
                                        {formErrors.trang_thai && <p className="text-red-500 text-sm mt-1">{formErrors.trang_thai}</p>}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1.5 font-bold">Mô tả khóa học <span className="text-red-500">*</span></label>
                                <textarea name="mo_ta" rows={3} value={formData.mo_ta} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] text-gray-900 font-medium resize-none outline-none" placeholder="Nhập mục tiêu, kết quả đầu ra..."></textarea>
                                {formErrors.mo_ta && <p className="text-red-500 text-sm mt-1">{formErrors.mo_ta}</p>}
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg shrink-0">
                            
                            <div className="flex justify-end gap-3">
                                <button onClick={closeModal} className="px-5 py-2.5 border border-gray-300 bg-white rounded-md hover:bg-gray-100 font-semibold text-gray-700 transition shadow-sm">Hủy bỏ</button>
                                <button onClick={handleSaveKhoaHoc} className="flex items-center gap-2 px-6 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-bold shadow-sm transition">
                                    <FaSave /> {editingId ? 'Cập nhật' : 'Lưu khóa học'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XÓA */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up">
                        <button onClick={closeDeleteModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
                        <div className="flex items-center mb-4 gap-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full"><span className="text-red-600 font-bold text-2xl">!</span></div>
                            <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa</h3>
                        </div>
                        <p className="text-gray-600 mb-6 text-sm">Bạn có chắc chắn muốn xóa khóa học này? Hành động này sẽ không thể khôi phục lại dữ liệu.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={closeDeleteModal} className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-gray-800">Hủy bỏ</button>
                            <button onClick={confirmDelete} className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium shadow-sm">Xác nhận xóa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION */}
            {toast && (
                <div className="fixed top-5 right-5 z-[70] animate-fade-in-down">
                    <div className={`flex items-center min-w-[300px] p-4 bg-white rounded shadow-xl border-l-4 ${toast.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
                        {toast.type === 'success' ? <FaCheckCircle className="text-green-500 text-2xl mr-3" /> : <FaTimes className="text-red-500 text-xl mr-3" />}
                        <div className="flex-1 text-sm text-gray-800 font-medium">{toast.message}</div>
                        <button onClick={() => setToast(null)} className="ml-4 text-gray-400 hover:text-gray-600"><FaTimes /></button>
                    </div>
                </div>
            )}
        </div>
    )
}
