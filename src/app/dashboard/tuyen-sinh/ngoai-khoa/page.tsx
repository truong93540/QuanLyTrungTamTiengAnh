'use client'
import { useState, useEffect, useMemo } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaEye, FaCheckCircle, FaExclamationTriangle, FaWalking, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaUsers, FaChalkboardTeacher, FaUserGraduate, FaChevronDown, FaChevronUp, FaCampground } from 'react-icons/fa'

interface GiaoVien {
    ma_giao_vien: number
    ho_ten: string
    so_dien_thoai?: string | null
    email?: string | null
}

interface PhanCong {
    ma_giao_vien: number
    giao_vien: GiaoVien
}

interface LopHoc {
    ma_lop_hoc: number
    ten_lop: string
}

interface ThamGiaLop {
    lop_hoc?: LopHoc
}

interface HocVien {
    ma_hoc_vien: number
    ho_ten: string
    so_dien_thoai: string | null
    email: string | null
    tham_gia_lop?: ThamGiaLop[]
}

interface ThamGiaNgoaiKhoa {
    hoc_vien?: HocVien
}

interface HoatDong {
    ma_hoat_dong_ngoai_khoa: number
    ten_hoat_dong: string
    mo_ta?: string | null
    ngay_to_chuc: string
    dia_diem?: string | null
    chi_phi?: number | null
    phan_cong?: PhanCong[]
    tham_gia_hoc_vien?: ThamGiaNgoaiKhoa[]
}

export default function QuanLyHoatDongNgoaiKhoaPage() {
    const [data, setData] = useState<HoatDong[]>([])
    const [danhSachGiaoVien, setDanhSachGiaoVien] = useState<GiaoVien[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [tuKhoaGiaoVien, setTuKhoaGiaoVien] = useState(""); 
    
    // Modal & Form States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isViewMode, setIsViewMode] = useState(false)
    const [viewData, setViewData] = useState<HoatDong | null>(null)

    // Accordion States (View Mode)
    const [showGiaoVienDetail, setShowGiaoVienDetail] = useState(false)
    const [showHocVienDetail, setShowHocVienDetail] = useState(false)
    const [openStudentClassId, setOpenStudentClassId] = useState<number | null>(null)
    
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

    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) return 'Miễn phí'
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    }

    const formatDateForView = (isoString: string) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return `${d.toLocaleDateString('vi-VN')} - ${d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}`;
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
        const assignedTeachers = row.phan_cong?.map(pc => pc.ma_giao_vien) || []
        setFormData({
            ten_hoat_dong: row.ten_hoat_dong,
            mo_ta: row.mo_ta || '',
            ngay_to_chuc: new Date(row.ngay_to_chuc).toISOString().slice(0, 16), // Format datetime-local
            dia_diem: row.dia_diem || '',
            chi_phi: row.chi_phi !== null && row.chi_phi !== undefined ? row.chi_phi.toString() : '',
            danh_sach_giao_vien: assignedTeachers
        })
    }

    const openAddModal = () => {
        setIsViewMode(false)
        setEditingId(null)
        setFormData({ ten_hoat_dong: '', mo_ta: '', ngay_to_chuc: '', dia_diem: '', chi_phi: '', danh_sach_giao_vien: [] })
        setTuKhoaGiaoVien('') 
        setFormError('')
        setIsModalOpen(true)
    }

    const openEditModal = (row: HoatDong) => { 
        fillFormData(row)
        setIsViewMode(false)
        setEditingId(row.ma_hoat_dong_ngoai_khoa)
        setTuKhoaGiaoVien('') 
        setFormError('')
        setIsModalOpen(true)
    }

    const openViewModal = (row: HoatDong) => { 
        setIsViewMode(true)
        setViewData(row)
        setEditingId(row.ma_hoat_dong_ngoai_khoa)
        setTuKhoaGiaoVien('') 
        setFormError('')

        // Đóng các accordion mặc định
        setShowGiaoVienDetail(false)
        setShowHocVienDetail(false)
        setOpenStudentClassId(null)

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
                const resFresh = await fetch('/api/tuyen-sinh/ngoai-khoa')
                if (resFresh.ok) setData(await resFresh.json())
                showToast(editingId ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success')
                closeModal()
            } else {
                showToast('Có lỗi xảy ra khi lưu.', 'error')
            }
        } catch (error) {
            showToast('Lỗi kết nối máy chủ.', 'error')
        }
    }

    // Lọc Dữ Liệu Bảng
    const filteredData = data.filter(item => 
        item.ten_hoat_dong.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.dia_diem && item.dia_diem.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => b.ma_hoat_dong_ngoai_khoa - a.ma_hoat_dong_ngoai_khoa) 
    
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const danhSachGiaoVienLoc = danhSachGiaoVien.filter((gv) =>
        gv.ho_ten.toLowerCase().includes(tuKhoaGiaoVien.toLowerCase())
    )

    // Thuật toán Gom Nhóm Học Viên
    const groupedHocVien = useMemo(() => {
        if (!viewData?.tham_gia_hoc_vien) return {};
        return viewData.tham_gia_hoc_vien.reduce((acc, current) => {
            const hv = current.hoc_vien;
            if (!hv) return acc;
            
            const lops = hv.tham_gia_lop && hv.tham_gia_lop.length > 0 ? hv.tham_gia_lop : [{ lop_hoc: { ma_lop_hoc: 0, ten_lop: 'Chưa xếp lớp' } }];

            lops.forEach(tl => {
                const lop = tl.lop_hoc;
                if (!lop) return;
                if (!acc[lop.ma_lop_hoc]) acc[lop.ma_lop_hoc] = { ten_lop: lop.ten_lop, danh_sach: [] };
                if (!acc[lop.ma_lop_hoc].danh_sach.find((x: any) => x.ma_hoc_vien === hv.ma_hoc_vien)) {
                    acc[lop.ma_lop_hoc].danh_sach.push(hv);
                }
            });
            return acc;
        }, {} as Record<number, { ten_lop: string, danh_sach: HocVien[] }>);
    }, [viewData]);

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
                                <th className="px-4 py-4 min-w-[150px] text-center">Địa Điểm</th>
                                <th className="px-4 py-4 min-w-[200px] text-center">Giáo Viên Tham Gia</th>
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
                                        </td>
                                        <td className="px-4 py-4 text-center text-gray-800 font-medium whitespace-nowrap">{new Date(row.ngay_to_chuc).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-4 py-4 text-gray-600">{row.dia_diem || <span className="italic text-gray-400">Chưa cập nhật</span>}</td>
                                        
                                        <td className="px-4 py-4">
                                            {row.phan_cong && row.phan_cong.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5 justify-center">
                                                    {row.phan_cong.map((pc, idx) => (
                                                        <span key={idx} className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-md border border-purple-200">
                                                            {pc.giao_vien?.ho_ten || `GV ID: ${pc.ma_giao_vien}`}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : <div className="text-center"><span className="italic text-gray-400 text-xs">Chưa phân công</span></div>}
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

            {/* MODAL VIEW (BÁO CÁO CHI TIẾT) */}
            {isModalOpen && isViewMode && viewData && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl animate-fade-in-up flex flex-col max-h-[95vh]">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl shrink-0">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2 uppercase tracking-wide"><FaCampground /> Báo Cáo Hoạt Động Ngoại Khóa</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-5 bg-gray-50/50">
                            
                            {/* Khối 1: Thông tin chung */}
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-[#1d4ed8] pl-3 flex items-center">Thông Tin Chung</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                    <div className="md:col-span-2">
                                        <span className="text-gray-500 block mb-1">Tên hoạt động</span>
                                        <span className="font-bold text-xl text-[#1d4ed8]">{viewData.ten_hoat_dong}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Thời gian tổ chức</span>
                                        <span className="font-bold text-green-600 text-base flex items-center gap-2"><FaCalendarAlt/> {formatDateForView(viewData.ngay_to_chuc)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Địa điểm</span>
                                        <span className="font-semibold text-gray-800 text-base flex items-center gap-2"><FaMapMarkerAlt className="text-red-500"/> {viewData.dia_diem || 'Chưa cập nhật'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Chi phí dự kiến</span>
                                        <span className="font-bold text-red-600 text-base">{formatCurrency(viewData.chi_phi)}</span>
                                    </div>
                                    <div className="md:col-span-2 mt-1">
                                        <span className="text-gray-500 block mb-2">Mô tả chi tiết</span>
                                        <p className="text-gray-800 bg-gray-50 p-3.5 rounded-md border border-gray-200 min-h-[60px]">
                                            {viewData.mo_ta || <span className="italic text-gray-400">Không có mô tả</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Khối 2: Giáo Viên (Accordion) */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div 
                                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => setShowGiaoVienDetail(!showGiaoVienDetail)}
                                >
                                    <h3 className="text-base font-bold text-gray-800 border-l-4 border-purple-500 pl-3 flex items-center gap-2">
                                        <FaChalkboardTeacher className="text-purple-600"/> Danh Sách Giáo Viên Hỗ Trợ
                                    </h3>
                                    <button className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-md hover:bg-purple-200 transition">
                                        {showGiaoVienDetail ? <><FaChevronUp /> Thu gọn</> : <><FaChevronDown /> Xem chi tiết</>}
                                    </button>
                                </div>
                                
                                {showGiaoVienDetail && (
                                    <div className="px-5 pb-5 pt-0 animate-fade-in-up">
                                        {viewData.phan_cong && viewData.phan_cong.length > 0 ? (
                                            <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                                                        <tr>
                                                            <th className="px-4 py-3">Họ & Tên</th>
                                                            <th className="px-4 py-3 text-center">Số Điện Thoại</th>
                                                            <th className="px-4 py-3">Email Liên Hệ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white">
                                                        {viewData.phan_cong.map((pc, idx) => (
                                                            <tr key={pc.ma_giao_vien} className={`border-b last:border-0 hover:bg-gray-50 ${idx % 2 !== 0 ? 'bg-gray-50/50' : ''}`}>
                                                                <td className="px-4 py-3.5 font-bold text-gray-800">{pc.giao_vien?.ho_ten}</td>
                                                                <td className="px-4 py-3.5 text-center text-gray-600 font-medium">{pc.giao_vien?.so_dien_thoai || '-'}</td>
                                                                <td className="px-4 py-3.5 text-gray-600 font-medium">{pc.giao_vien?.email || '-'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg text-center">
                                                <p className="text-sm text-gray-500 italic">Chưa có giáo viên nào được phân công.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Khối 3: Học Viên Tham Gia (Accordion + Gom Lớp) */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div 
                                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => setShowHocVienDetail(!showHocVienDetail)}
                                >
                                    <h3 className="text-base font-bold text-gray-800 border-l-4 border-green-500 pl-3 flex items-center gap-2">
                                        <FaUserGraduate className="text-green-600"/> Học Viên Tham Gia <span className="text-xs text-gray-500 font-normal">({viewData.tham_gia_hoc_vien?.length || 0} học viên)</span>
                                    </h3>
                                    <button className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-md hover:bg-green-200 transition">
                                        {showHocVienDetail ? <><FaChevronUp /> Thu gọn</> : <><FaChevronDown /> Xem chi tiết</>}
                                    </button>
                                </div>
                                
                                {showHocVienDetail && (
                                    <div className="px-5 pb-5 pt-0 animate-fade-in-up">
                                        {Object.keys(groupedHocVien).length > 0 ? (
                                            <div className="space-y-3">
                                                {Object.entries(groupedHocVien).map(([classIdStr, group]) => {
                                                    const classId = Number(classIdStr);
                                                    const isOpen = openStudentClassId === classId;
                                                    return (
                                                        <div key={classId} className={`border rounded-lg transition-all ${isOpen ? 'border-green-400 shadow-sm ring-1 ring-green-400' : 'border-gray-200 hover:border-green-300'}`}>
                                                            <div 
                                                                className={`p-4 flex justify-between items-center cursor-pointer ${isOpen ? 'bg-[#f6fbf7]' : 'bg-white'} rounded-t-lg`}
                                                                onClick={() => setOpenStudentClassId(isOpen ? null : classId)}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <span className="font-bold text-green-700 text-base">Lớp: {group.ten_lop}</span>
                                                                    <span className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-md text-gray-600 font-semibold shadow-sm">Có {group.danh_sach.length} học viên</span>
                                                                </div>
                                                                <div className="text-green-600 bg-white p-1.5 rounded-full border border-green-200 shadow-sm">{isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}</div>
                                                            </div>
                                                            
                                                            {isOpen && (
                                                                <div className="p-0 bg-white border-t border-green-100 rounded-b-lg animate-fade-in-up overflow-hidden">
                                                                    <table className="w-full text-sm text-left">
                                                                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase text-[11px]">
                                                                            <tr>
                                                                                <th className="px-4 py-2 w-16 text-center">Mã</th>
                                                                                <th className="px-4 py-2">Họ & Tên Học Viên</th>
                                                                                <th className="px-4 py-2 text-center">SĐT</th>
                                                                                <th className="px-4 py-2">Email</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {group.danh_sach.map((hv, idx) => (
                                                                                <tr key={hv.ma_hoc_vien} className={`border-b last:border-0 ${idx % 2 !== 0 ? 'bg-gray-50/30' : ''}`}>
                                                                                    <td className="px-4 py-2.5 text-center font-bold text-gray-400">{hv.ma_hoc_vien}</td>
                                                                                    <td className="px-4 py-2.5 font-bold text-gray-800">{hv.ho_ten}</td>
                                                                                    <td className="px-4 py-2.5 text-center font-medium text-gray-600">{hv.so_dien_thoai || '-'}</td>
                                                                                    <td className="px-4 py-2.5 text-gray-600">{hv.email || '-'}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg text-center">
                                                <p className="text-sm text-gray-500 italic">Chưa có học viên nào đăng ký tham gia.</p>
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

            {/* MODAL THÊM/SỬA */}
            {isModalOpen && !isViewMode && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl animate-fade-in-up flex flex-col border border-gray-200 max-h-[90vh]">
                        
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-lg shrink-0">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2">
                                <FaWalking /> {editingId ? 'Cập Nhật Hoạt Động' : 'Thêm Hoạt Động Mới'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto flex-1">
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[14px] text-gray-700 mb-1.5 font-bold">Tên hoạt động ngoại khóa <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" name="ten_hoat_dong" value={formData.ten_hoat_dong} onChange={handleChange} 
                                        placeholder="Ví dụ: Dã ngoại thực tế, CLB Tiếng Anh..."
                                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-gray-900 font-medium text-[15px] focus:ring-2 focus:ring-blue-500 transition" 
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[14px] text-gray-700 mb-1.5 font-bold flex items-center gap-1">Ngày tổ chức <span className="text-red-500">*</span></label>
                                        <input 
                                            type="datetime-local" name="ngay_to_chuc" value={formData.ngay_to_chuc} onChange={handleChange} 
                                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-gray-900 font-medium text-[15px] focus:ring-2 focus:ring-blue-500 transition" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[14px] text-gray-700 mb-1.5 font-bold flex items-center gap-1">Chi phí dự kiến (VNĐ)</label>
                                        <input 
                                            type="number" name="chi_phi" value={formData.chi_phi} onChange={handleChange} 
                                            placeholder="Để trống nếu miễn phí"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-red-600 font-bold text-[15px] focus:ring-2 focus:ring-blue-500 transition" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[14px] text-gray-700 mb-1.5 font-bold flex items-center gap-1">Địa điểm tổ chức <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" name="dia_diem" value={formData.dia_diem} onChange={handleChange} 
                                        placeholder="Ví dụ: Công viên Yên Sở..."
                                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-gray-900 font-medium text-[15px] focus:ring-2 focus:ring-blue-500 transition" 
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm text-[#1d4ed8] font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <FaUsers/> Phân công giáo viên phụ trách
                                </label>

                                <div className="mb-4 relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FaSearch /></span>
                                    <input
                                        type="text"
                                        placeholder="🔍 Tìm kiếm tên giáo viên..."
                                        value={tuKhoaGiaoVien}
                                        onChange={(e) => setTuKhoaGiaoVien(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md py-2.5 pl-10 pr-3 outline-none text-sm text-gray-900 font-medium placeholder-gray-500 focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    />
                                </div>

                                <div className="bg-white border border-gray-200 p-3 rounded-md shadow-sm max-h-48 overflow-y-auto">
                                    {danhSachGiaoVienLoc.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic text-center py-2">Không tìm thấy giáo viên nào phù hợp.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {danhSachGiaoVienLoc.map(gv => (
                                                <label 
                                                    key={gv.ma_giao_vien} 
                                                    className={`flex items-center gap-3 p-2 rounded-md transition cursor-pointer border ${formData.danh_sach_giao_vien.includes(gv.ma_giao_vien) ? 'bg-blue-50/50 border-blue-200' : 'hover:bg-gray-50 border-transparent'}`}
                                                >
                                                    <input 
                                                        type="checkbox" 
                                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                        checked={formData.danh_sach_giao_vien.includes(gv.ma_giao_vien)}
                                                        onChange={(e) => handleTeacherToggle(gv.ma_giao_vien, e.target.checked)}
                                                    />
                                                    <span className={`text-sm ${formData.danh_sach_giao_vien.includes(gv.ma_giao_vien) ? 'font-bold text-[#1d4ed8]' : 'text-gray-700 font-medium'}`}>
                                                        {gv.ho_ten} <span className="text-gray-400 font-normal text-xs">({gv.ma_giao_vien})</span> 
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            <div>
                                <label className="block text-[14px] text-gray-700 mb-1.5 font-bold">Mô tả chi tiết</label>
                                <textarea 
                                    name="mo_ta" value={formData.mo_ta} onChange={handleChange} 
                                    rows={3} placeholder="Nhập nội dung, lịch trình hoạt động..."
                                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-gray-900 font-medium text-[15px] focus:ring-2 focus:ring-blue-500 resize-none transition"
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3 shrink-0">
                            {formError && <div className="mr-auto text-red-600 font-medium self-center text-sm bg-red-50 px-3 py-1.5 rounded border border-red-100">{formError}</div>}
                            <button onClick={closeModal} className="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-100 font-semibold transition shadow-sm">
                                Hủy bỏ
                            </button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-semibold transition shadow-sm">
                                <FaSave /> {editingId ? 'Lưu cập nhật' : 'Thêm hoạt động'}
                            </button>
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
                        <p className="text-gray-600 mb-6 ml-16 text-sm">Bạn có chắc chắn muốn xóa hoạt động ngoại khóa này? Dữ liệu phân công giáo viên liên quan cũng sẽ bị xóa.</p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={closeDeleteModal} className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors">Hủy bỏ</button>
                            <button onClick={confirmDelete} className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors shadow-sm">Xác nhận xóa</button>
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
                        <div className="flex-1 text-gray-800 font-medium text-sm">{toast.message}</div>
                        <button onClick={() => setToast(null)} className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"><FaTimes /></button>
                    </div>
                </div>
            )}
        </div>
    )
}