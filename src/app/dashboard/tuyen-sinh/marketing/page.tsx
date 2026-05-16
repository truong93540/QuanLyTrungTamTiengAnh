'use client'
import { useState, useEffect } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaBullhorn, FaEye, FaCheckCircle, FaUsers, FaGraduationCap, FaChevronDown, FaChevronUp } from 'react-icons/fa'

interface KhoaHocInfo {
    ten_khoa_hoc: string
    hoc_phi: number
    thoi_luong: string
    trinh_do: string
    trang_thai: string 
}

interface NhanSuInfo {
    ho_ten: string
    so_dien_thoai: string | null
    email: string | null
    phong_ban?: { ten_phong_ban: string }
}

interface NhanSu {
    ma_nhan_su: number
    ho_ten: string
    so_dien_thoai: string | null
    email: string | null
}

interface PhanCong {
    ma_nhan_su: number
    vai_tro: string
    nhan_su?: NhanSuInfo
}

interface ChuongTrinhMarketing {
    ma_chuong_trinh_marketing: number
    ten_chuong_trinh_marketing: string
    ma_khoa_hoc: number
    khoa_hoc?: KhoaHocInfo
    noi_dung: string
    ngay_bat_dau: string
    ngay_ket_thuc: string
    ngan_sach: number
    phan_cong?: PhanCong[]
}

interface PhanCongForm {
    ma_nhan_su: number;
    vai_tro: string;
}

interface KhoaHoc {
    ma_khoa_hoc: number
    ten_khoa_hoc: string
}

export default function QuanLyMarketingPage() {
    const [data, setData] = useState<ChuongTrinhMarketing[]>([])
    const [danhSachKhoaHoc, setDanhSachKhoaHoc] = useState<KhoaHoc[]>([]) 
    const [danhSachNhanSu, setDanhSachNhanSu] = useState<NhanSu[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [tuKhoaNhanSu, setTuKhoaNhanSu] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewMode, setIsViewMode] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    // Trạng thái điều khiển Đóng/Mở chi tiết (View Mode)
    const [showKhoaHocDetail, setShowKhoaHocDetail] = useState(false)
    const [showNhanSuDetail, setShowNhanSuDetail] = useState(false)

    // View Data State 
    const [viewData, setViewData] = useState<ChuongTrinhMarketing | null>(null)

    // Form States 
    const [formData, setFormData] = useState({
        ten_chuong_trinh_marketing: '',
        ma_khoa_hoc: '',
        noi_dung: '',
        ngay_bat_dau: '',
        ngay_ket_thuc: '',
        ngan_sach: '',
        danh_sach_nhan_su: [] as PhanCongForm[] 
    })
    const [formError, setFormError] = useState('')
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const formatDateForInput = (isoString: string | null) => {
        if (!isoString) return ''
        return new Date(isoString).toISOString().split('T')[0]
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    }

    const getTrangThai = (start: string, end: string) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const startDate = new Date(start)
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date(end)
        endDate.setHours(23, 59, 59, 999)

        if (today.getTime() < startDate.getTime()) return { text: 'Sắp tới', style: 'bg-yellow-100 text-yellow-700 border border-yellow-200' }
        if (today.getTime() > endDate.getTime()) return { text: 'Đã kết thúc', style: 'bg-gray-100 text-gray-600 border border-gray-200' }
        return { text: 'Đang diễn ra', style: 'bg-green-100 text-green-700 border border-green-200' }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resMarketing = await fetch('/api/tuyen-sinh/marketing')
                if (resMarketing.ok) setData(await resMarketing.json())

                const resKhoaHoc = await fetch('/api/tuyen-sinh/khoa-hoc')
                if (resKhoaHoc.ok) setDanhSachKhoaHoc(await resKhoaHoc.json())

                const resNhanSu = await fetch('/api/tuyen-sinh/marketing?action=get_marketing_staff')
                if (resNhanSu.ok) setDanhSachNhanSu(await resNhanSu.json())

            } catch (error) {
                showToast('Lỗi khi tải dữ liệu từ máy chủ', 'error')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (formError) setFormError('') 
    }

    const handleToggleNhanSu = (ma_nhan_su: number, isChecked: boolean) => {
        if (isViewMode) return;
        setFormData(prev => {
            if (isChecked) {
                return { ...prev, danh_sach_nhan_su: [...prev.danh_sach_nhan_su, { ma_nhan_su, vai_tro: 'Nhân viên phụ trách' }] }
            } else {
                return { ...prev, danh_sach_nhan_su: prev.danh_sach_nhan_su.filter(id => id.ma_nhan_su !== ma_nhan_su) }
            }
        })
    }

    const handleRoleChange = (ma_nhan_su: number, vai_tro: string) => {
        setFormData(prev => ({
            ...prev,
            danh_sach_nhan_su: prev.danh_sach_nhan_su.map(item => 
                item.ma_nhan_su === ma_nhan_su ? { ...item, vai_tro } : item
            )
        }))
    }

    const openAddModal = () => {
        setIsViewMode(false)
        setEditingId(null)
        setFormData({ ten_chuong_trinh_marketing: '', ma_khoa_hoc: '', noi_dung: '', ngay_bat_dau: '', ngay_ket_thuc: '', ngan_sach: '', danh_sach_nhan_su: [] })
        setTuKhoaNhanSu('')
        setFormError('')
        setIsModalOpen(true)
    }

    const openEditModal = (row: ChuongTrinhMarketing) => {
        setIsViewMode(false)
        setEditingId(row.ma_chuong_trinh_marketing)
        setTuKhoaNhanSu('')
        setFormData({
            ten_chuong_trinh_marketing: row.ten_chuong_trinh_marketing,
            ma_khoa_hoc: row.ma_khoa_hoc?.toString() || '',
            noi_dung: row.noi_dung || '',
            ngay_bat_dau: formatDateForInput(row.ngay_bat_dau),
            ngay_ket_thuc: formatDateForInput(row.ngay_ket_thuc),
            ngan_sach: row.ngan_sach?.toString() || '',
            danh_sach_nhan_su: row.phan_cong?.map(pc => ({ ma_nhan_su: pc.ma_nhan_su, vai_tro: pc.vai_tro || '' })) || []
        })
        setFormError('')
        setIsModalOpen(true)
    }

    const openViewModal = (row: ChuongTrinhMarketing) => {
        setIsViewMode(true)
        setViewData(row) 
        setEditingId(row.ma_chuong_trinh_marketing)
        setTuKhoaNhanSu('')
        setFormError('')
        // Tự động thu gọn các mục chi tiết khi mở lên
        setShowKhoaHocDetail(false)
        setShowNhanSuDetail(false)
        setIsModalOpen(true)
    }

    const closeModal = () => setIsModalOpen(false)

    const openDeleteModal = (id: number) => {
        setDeletingId(id)
        setIsDeleteModalOpen(true)
    }
    
    const closeDeleteModal = () => setIsDeleteModalOpen(false)

    const confirmDelete = async () => {
        if (!deletingId) return
        try {
            const response = await fetch(`/api/tuyen-sinh/marketing?id=${deletingId}`, { method: 'DELETE' })
            if (response.ok) {
                setData(data.filter((item) => item.ma_chuong_trinh_marketing !== deletingId))
                showToast('Đã xóa chương trình marketing!', 'success')
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
        if (!formData.ten_chuong_trinh_marketing || !formData.ma_khoa_hoc || !formData.ngay_bat_dau || !formData.ngay_ket_thuc || !formData.ngan_sach) {
            setFormError('Vui lòng nhập đầy đủ các trường bắt buộc (*)')
            return
        }

        try {
            const payload = {
                ma_chuong_trinh_marketing: editingId || undefined,
                ten_chuong_trinh_marketing: formData.ten_chuong_trinh_marketing,
                ma_khoa_hoc: parseInt(formData.ma_khoa_hoc),
                noi_dung: formData.noi_dung,
                ngan_sach: parseFloat(formData.ngan_sach),
                ngay_bat_dau: new Date(formData.ngay_bat_dau).toISOString(),
                ngay_ket_thuc: new Date(formData.ngay_ket_thuc).toISOString(),
                danh_sach_nhan_su: formData.danh_sach_nhan_su 
            }

            const response = await fetch('/api/tuyen-sinh/marketing', {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                const resMarketing = await fetch('/api/tuyen-sinh/marketing')
                if (resMarketing.ok) setData(await resMarketing.json())
                
                showToast(editingId ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success')
                setIsModalOpen(false)
            } else {
                showToast(`Lỗi khi lưu dữ liệu.`, 'error')
            }
        } catch (error) {
            showToast('Không thể kết nối đến máy chủ.', 'error')
        }
    }

    const filteredData = data.filter(item => 
        item.ten_chuong_trinh_marketing.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ma_chuong_trinh_marketing.toString().includes(searchTerm)
    )

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const nhanSuDaChonIDs = formData.danh_sach_nhan_su.map(i => i.ma_nhan_su);
    const nhanSuTimKiem = tuKhoaNhanSu.trim() === "" ? [] : danhSachNhanSu.filter(ns => 
        ns.ho_ten.toLowerCase().includes(tuKhoaNhanSu.toLowerCase()) && 
        !nhanSuDaChonIDs.includes(ns.ma_nhan_su)
    )

    return (
        <div className="bg-gray-50 min-h-screen p-6 relative">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-[#1d4ed8] flex items-center gap-3 uppercase tracking-wide">
                        <FaBullhorn className="text-blue-600" /> Chương trình Marketing
                    </h1>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm">
                        <FaPlus /> Thêm Chương Trình
                    </button>
                </div>

                <div className="mb-6 w-full md:w-1/2 lg:w-1/3">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><FaSearch /></span>
                        <input
                            type="text" placeholder="Tìm kiếm mã hoặc tên chương trình..." value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full border border-gray-300 rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] transition shadow-sm text-sm text-gray-900 placeholder-gray-500 font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#1d4ed8] text-white font-semibold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-4 text-center whitespace-nowrap border-b border-blue-600">Mã</th>
                                <th className="px-4 py-4 min-w-[250px] border-b border-blue-600">Thông Tin Chương Trình</th>
                                <th className="px-4 py-4 text-right whitespace-nowrap border-b border-blue-600">Ngân Sách</th>
                                <th className="px-4 py-4 min-w-[200px] border-b border-blue-600">Nhân Sự Phụ Trách</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap border-b border-blue-600">Thời Gian</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap border-b border-blue-600">Trạng Thái</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap border-b border-blue-600">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center py-8 font-medium">Đang tải dữ liệu...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Không tìm thấy dữ liệu.</td></tr>
                            ) : (
                                currentItems.map((row, index) => {
                                    const trangThai = getTrangThai(row.ngay_bat_dau, row.ngay_ket_thuc)
                                    return (
                                        <tr key={row.ma_chuong_trinh_marketing} className={`border-b hover:bg-blue-50/50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                            <td className="px-4 py-4 text-center font-bold text-gray-500 align-top">{row.ma_chuong_trinh_marketing}</td>
                                            <td className="px-4 py-4 align-top">
                                                <div className="font-bold text-[#1d4ed8] text-base mb-1">{row.ten_chuong_trinh_marketing}</div>
                                            </td>
                                            <td className="px-4 py-4 text-right font-bold text-red-600 whitespace-nowrap align-top">
                                                {formatCurrency(row.ngan_sach)}
                                            </td>
                                            <td className="px-4 py-4 align-top">
                                                {row.phan_cong && row.phan_cong.length > 0 ? (
                                                    <div className="flex flex-col gap-1.5">
                                                        {row.phan_cong.map(pc => (
                                                            <div key={pc.ma_nhan_su} className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md w-max">
                                                                <span className="font-semibold">{pc.nhan_su?.ho_ten || `Mã ${pc.ma_nhan_su}`}</span> 
                                                                <span className="text-gray-500 font-normal ml-1">({pc.vai_tro})</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <span className="italic text-gray-400 text-xs">Chưa phân công</span>}
                                            </td>
                                            <td className="px-4 py-4 text-center whitespace-nowrap align-top text-xs font-medium text-gray-600">
                                                <div>{new Date(row.ngay_bat_dau).toLocaleDateString('vi-VN')}</div>
                                                <div className="text-gray-400 my-0.5">đến</div>
                                                <div>{new Date(row.ngay_ket_thuc).toLocaleDateString('vi-VN')}</div>
                                            </td>
                                            <td className="px-4 py-4 text-center whitespace-nowrap align-top">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trangThai.style}`}>
                                                    {trangThai.text}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap align-top">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => openViewModal(row)} className="p-2 text-green-600 bg-green-50 border border-green-100 rounded hover:bg-green-100 transition shadow-sm" title="Xem chi tiết"><FaEye /></button>
                                                    <button onClick={() => openEditModal(row)} className="p-2 text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition shadow-sm" title="Sửa"><FaEdit /></button>
                                                    <button onClick={() => { setDeletingId(row.ma_chuong_trinh_marketing); setIsDeleteModalOpen(true); }} className="p-2 text-red-600 bg-red-50 border border-red-100 rounded hover:bg-red-100 transition shadow-sm" title="Xóa"><FaTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && filteredData.length > 0 && (
                    <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                        <div>
                            Hiển thị <span className="font-bold">{indexOfFirstItem + 1}</span> đến <span className="font-bold">{Math.min(indexOfLastItem, filteredData.length)}</span> trong tổng số <span className="font-bold">{filteredData.length}</span> chương trình
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-50 transition bg-white">Trước</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 border rounded transition font-medium ${currentPage === page ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded disabled:bg-gray-50 disabled:text-gray-400 hover:bg-gray-50 transition bg-white">Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL XEM CHI TIẾT (VIEW MODE) */}
            {isModalOpen && isViewMode && viewData && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl animate-fade-in-up flex flex-col max-h-[95vh]">
                        
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl shrink-0">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2 uppercase tracking-wide">
                                <FaBullhorn /> Chi Tiết Chương Trình
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 bg-gray-50/50">
                            
                            {/* Khối 1: Thông tin tổng quan (Luôn hiện) */}
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-5 border-l-4 border-[#1d4ed8] pl-3 flex items-center">Thông Tin Chung</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 text-sm">
                                    <div>
                                        <span className="text-gray-500 block mb-1">Tên chương trình</span>
                                        <span className="font-bold text-xl text-[#1d4ed8]">{viewData.ten_chuong_trinh_marketing}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Ngân sách dự kiến</span>
                                        <span className="font-bold text-red-600 text-lg">{formatCurrency(viewData.ngan_sach)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Thời gian triển khai</span>
                                        <span className="font-semibold text-gray-800 text-base">
                                            {new Date(viewData.ngay_bat_dau).toLocaleDateString('vi-VN')} - {new Date(viewData.ngay_ket_thuc).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className="text-gray-500 block mb-2">Nội dung chi tiết</span>
                                        <p className="text-gray-800 bg-gray-50 p-3.5 rounded-md border border-gray-200 leading-relaxed min-h-[80px]">
                                            {viewData.noi_dung || <span className="italic text-gray-400">Không có mô tả</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Khối 2: Liên kết Khóa Học (Accordion) */}
                            {viewData.khoa_hoc && (
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                    <div 
                                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                                        onClick={() => setShowKhoaHocDetail(!showKhoaHocDetail)}
                                    >
                                        <h3 className="text-lg font-bold text-gray-800 border-l-4 border-green-500 pl-3 flex items-center gap-2">
                                            <FaGraduationCap className="text-green-600"/> Khóa Học Áp Dụng
                                        </h3>
                                        <button className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-md hover:bg-green-200 transition">
                                            {showKhoaHocDetail ? <><FaChevronUp /> Thu gọn</> : <><FaChevronDown /> Xem chi tiết</>}
                                        </button>
                                    </div>
                                    
                                    {showKhoaHocDetail && (
                                        <div className="p-5 pt-0 animate-fade-in-up">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 bg-[#f6fbf7] p-4 rounded-lg border border-green-200 text-sm">
                                                <div className="col-span-2 md:col-span-4 mb-1">
                                                    <span className="text-gray-500 block mb-1">Tên khóa học</span>
                                                    <span className="font-bold text-gray-800 text-base">{viewData.khoa_hoc.ten_khoa_hoc}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block mb-1">Học phí</span>
                                                    <span className="font-bold text-red-600">{formatCurrency(viewData.khoa_hoc.hoc_phi)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block mb-1">Thời lượng</span>
                                                    <span className="font-bold text-gray-800">{viewData.khoa_hoc.thoi_luong}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block mb-1">Trình độ</span>
                                                    <span className="font-bold text-gray-800">{viewData.khoa_hoc.trinh_do}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block mb-1">Trạng thái</span>
                                                    <span className="font-bold text-blue-600">{viewData.khoa_hoc.trang_thai}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Khối 3: Đội ngũ Nhân Sự (Accordion) */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div 
                                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => setShowNhanSuDetail(!showNhanSuDetail)}
                                >
                                    <h3 className="text-lg font-bold text-gray-800 border-l-4 border-purple-500 pl-3 flex items-center gap-2">
                                        <FaUsers className="text-purple-600"/> Đội Ngũ Nhân Sự Phụ Trách
                                    </h3>
                                    <button className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-md hover:bg-purple-200 transition">
                                        {showNhanSuDetail ? <><FaChevronUp /> Thu gọn</> : <><FaChevronDown /> Xem chi tiết</>}
                                    </button>
                                </div>
                                
                                {showNhanSuDetail && (
                                    <div className="px-5 pb-5 pt-0 animate-fade-in-up">
                                        {viewData.phan_cong && viewData.phan_cong.length > 0 ? (
                                            <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                                                        <tr>
                                                            <th className="px-4 py-3 text-center">Họ & Tên</th>
                                                            <th className="px-4 py-3 text-center">Phòng Ban</th>
                                                            <th className="px-4 py-3 text-center">Vai Trò</th>
                                                            <th className="px-4 py-3 text-center">Số Điện Thoại</th>
                                                            <th className="px-4 py-3">Email Liên Hệ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white">
                                                        {viewData.phan_cong.map((pc, idx) => (
                                                            <tr key={pc.ma_nhan_su} className={`border-b last:border-0 hover:bg-gray-50 ${idx % 2 !== 0 ? 'bg-gray-50/50' : ''}`}>
                                                                <td className="px-4 py-3.5 font-bold text-gray-800">{pc.nhan_su?.ho_ten}</td>
                                                                <td className="px-4 py-3.5 text-gray-600 font-medium">{pc.nhan_su?.phong_ban?.ten_phong_ban || '-'}</td>
                                                                <td className="px-4 py-3.5">
                                                                    <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md text-xs font-bold border border-purple-200">
                                                                        {pc.vai_tro}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3.5 text-center text-gray-600 font-medium">{pc.nhan_su?.so_dien_thoai || '-'}</td>
                                                                <td className="px-4 py-3.5 text-gray-600 font-medium">{pc.nhan_su?.email || '-'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg text-center">
                                                <p className="text-sm text-gray-500 italic">Chương trình này chưa được phân công nhân sự nào.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>
                        
                        <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl flex justify-end shrink-0">
                            <button onClick={closeModal} className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 font-bold transition shadow-sm text-sm">Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL THÊM / SỬA */}
            {isModalOpen && !isViewMode && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl animate-fade-in-up flex flex-col max-h-[95vh]">
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-lg shrink-0">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2 uppercase tracking-wide">
                                <FaBullhorn /> {editingId ? 'Cập Nhật Chương Trình' : 'Thêm Chương Trình Mới'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-700 mb-1.5 font-bold">Tên chương trình Marketing <span className="text-red-500">*</span></label>
                                    <input type="text" name="ten_chuong_trinh_marketing" value={formData.ten_chuong_trinh_marketing} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] outline-none text-sm text-gray-900 font-medium" />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-1.5 font-bold">Áp dụng cho Khóa học <span className="text-red-500">*</span></label>
                                    <select name="ma_khoa_hoc" value={formData.ma_khoa_hoc} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] outline-none text-sm bg-white text-gray-900 font-medium">
                                        <option value="">-- Chọn khóa học --</option>
                                        {danhSachKhoaHoc.map(kh => (
                                            <option key={kh.ma_khoa_hoc} value={kh.ma_khoa_hoc}>{kh.ten_khoa_hoc}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-1.5 font-bold">Ngân sách (VNĐ) <span className="text-red-500">*</span></label>
                                    <input type="number" name="ngan_sach" value={formData.ngan_sach} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] outline-none text-sm text-red-600 font-bold" placeholder="VD: 5000000" />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-1.5 font-bold">Ngày bắt đầu <span className="text-red-500">*</span></label>
                                    <input type="date" name="ngay_bat_dau" value={formData.ngay_bat_dau} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] outline-none text-sm text-gray-900 font-medium" />
                                </div>
                                
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1.5 font-bold">Ngày kết thúc <span className="text-red-500">*</span></label>
                                    <input type="date" name="ngay_ket_thuc" value={formData.ngay_ket_thuc} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] outline-none text-sm text-gray-900 font-medium" />
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm text-[#1d4ed8] font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <FaUsers /> Phân công nhân sự Marketing
                                </label>
                                
                                <div className="mb-4 relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FaSearch /></span>
                                    <input
                                        type="text" placeholder="🔍 Gõ tên nhân sự để tìm kiếm..." value={tuKhoaNhanSu} onChange={(e) => setTuKhoaNhanSu(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#1d4ed8] shadow-sm text-gray-900 font-medium"
                                    />
                                </div>

                                <div className="space-y-4">
                                    {formData.danh_sach_nhan_su.length > 0 && (
                                        <div className="bg-white p-3 rounded-md border border-blue-200 shadow-sm">
                                            <p className="text-xs font-bold text-blue-800 mb-3 uppercase border-b border-blue-100 pb-2">Đội ngũ đã chọn:</p>
                                            <div className="space-y-2">
                                                {formData.danh_sach_nhan_su.map(item => {
                                                    const nsInfo = danhSachNhanSu.find(n => n.ma_nhan_su === item.ma_nhan_su);
                                                    return (
                                                        <div key={`selected-${item.ma_nhan_su}`} className="flex items-center gap-3 bg-blue-50/50 p-2.5 rounded border border-blue-100">
                                                            <input type="checkbox" checked={true} onChange={(e) => handleToggleNhanSu(item.ma_nhan_su, e.target.checked)} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                                                            <span className="text-sm font-semibold text-gray-800 w-1/3 truncate">{nsInfo?.ho_ten}</span>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Nhập vai trò (VD: Content...)" 
                                                                value={item.vai_tro}
                                                                onChange={(e) => handleRoleChange(item.ma_nhan_su, e.target.value)}
                                                                className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm text-gray-900 font-medium placeholder-gray-400"
                                                            />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {tuKhoaNhanSu.trim() !== "" && (
                                        <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm max-h-48 overflow-y-auto">
                                            <p className="text-xs font-bold text-gray-500 mb-2 uppercase border-b pb-2">Kết quả tìm kiếm:</p>
                                            {nhanSuTimKiem.length === 0 ? (
                                                <p className="text-sm text-gray-500 italic py-2">Không tìm thấy nhân sự Marketing nào phù hợp.</p>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {nhanSuTimKiem.map(ns => (
                                                        <label key={`search-${ns.ma_nhan_su}`} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition border border-transparent hover:border-gray-200">
                                                            <input type="checkbox" checked={false} onChange={(e) => handleToggleNhanSu(ns.ma_nhan_su, e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                                                            <span className="text-sm text-gray-700 font-medium">{ns.ho_ten} <span className="text-xs text-gray-400">({ns.ma_nhan_su})</span></span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            <div>
                                <label className="block text-sm text-gray-700 mb-1.5 font-bold">Nội dung chi tiết</label>
                                <textarea name="noi_dung" rows={3} value={formData.noi_dung} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] outline-none text-sm resize-none text-gray-900 font-medium" placeholder="Nhập chi tiết về thông điệp quảng cáo, kịch bản sự kiện..."></textarea>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg shrink-0">
                            {formError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm font-medium border border-red-100">{formError}</div>}
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-300 bg-white rounded-md hover:bg-gray-100 font-semibold text-gray-700 transition shadow-sm">Hủy bỏ</button>
                                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-bold shadow-sm transition">
                                    <FaSave /> {editingId ? 'Cập nhật' : 'Lưu chiến dịch'}
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
                        <button onClick={() => setIsDeleteModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
                        <div className="flex items-center mb-4 gap-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full"><span className="text-red-600 font-bold text-2xl">!</span></div>
                            <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa</h3>
                        </div>
                        <p className="text-gray-600 mb-6 text-sm">Bạn có chắc chắn muốn xóa chương trình marketing này? Dữ liệu phân công liên quan cũng sẽ bị xóa và không thể khôi phục.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-gray-800">Hủy bỏ</button>
                            <button onClick={confirmDelete} className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium shadow-sm">Xác nhận xóa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST */}
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