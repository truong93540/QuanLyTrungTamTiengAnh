'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
    FaEdit, 
    FaSearch, 
    FaPlus, 
    FaSave, 
    FaTimes, 
    FaTrash, 
    FaUserGraduate, 
    FaEye, 
    FaCheckCircle, 
    FaSpinner, 
    FaExclamationTriangle, 
    FaChevronDown, 
    FaChevronUp,
    FaFilter, 
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUsers,
    FaChalkboardTeacher,
    FaWalking,
    FaCampground
} from 'react-icons/fa'

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
    const [danhSachLopHoc, setDanhSachLopHoc] = useState<LopHoc[]>([])
    const [danhSachTatCaHocVien, setDanhSachTatCaHocVien] = useState<HocVien[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    // TÌM KIẾM VÀ LỌC 
    const currentDate = new Date();
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMonth, setSelectedMonth] = useState<string>((currentDate.getMonth() + 1).toString()) 
    const [selectedYear, setSelectedYear] = useState<string>(currentDate.getFullYear().toString())
    
    const [tuKhoaGiaoVien, setTuKhoaGiaoVien] = useState("")
    
    // Modal & Form States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isViewMode, setIsViewMode] = useState(false)
    const [viewData, setViewData] = useState<HoatDong | null>(null)

    // Accordion States (View Mode)
    const [showGiaoVienDetail, setShowGiaoVienDetail] = useState(false)
    const [showHocVienDetail, setShowHocVienDetail] = useState(false)
    const [openStudentClassId, setOpenStudentClassId] = useState<number | null>(null)
    
    // STATE: QUẢN LÝ THÊM HỌC VIÊN
    const [danhSachThamGia, setDanhSachThamGia] = useState<{ma_hoc_vien: number, ho_ten: string, ten_lop?: string}[]>([])
    const [hocVienTrongLop, setHocVienTrongLop] = useState<{ma_hoc_vien: number, ho_ten: string, ten_lop: string}[]>([])
    const [idChonTamThoi, setIdChonTamThoi] = useState<number[]>([])
    const [tuKhoaLop, setTuKhoaLop] = useState("")
    const [tuKhoaTuDo, setTuKhoaTuDo] = useState("") // State cho thanh tìm kiếm học viên tự do

    const [formData, setFormData] = useState({
        ten_hoat_dong: '',
        mo_ta: '',
        ngay_to_chuc: '',
        dia_diem: '',
        chi_phi: '',
        danh_sach_giao_vien: [] as number[] 
    })

    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
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
                const [resHD, resGV, resLop, resHV] = await Promise.all([
                    fetch('/api/tuyen-sinh/ngoai-khoa'),
                    fetch('/api/tuyen-sinh/ngoai-khoa?action=get_teachers'),
                    fetch('/api/tuyen-sinh/lop-hoc'),
                    fetch('/api/tuyen-sinh/hoc-vien')
                ])

                if (resHD.ok) setData(await resHD.json())
                if (resGV.ok) setDanhSachGiaoVien(await resGV.json())
                if (resLop.ok) setDanhSachLopHoc(await resLop.json())
                if (resHV.ok) setDanhSachTatCaHocVien(await resHV.json())

            } catch (error) {
                console.error('Lỗi fetch API:', error)
                showToast('Lỗi khi tải dữ liệu. Vui lòng kiểm tra lại kết nối.', 'error')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
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
        const assignedStudents = row.tham_gia_hoc_vien?.map(th => ({
            ma_hoc_vien: th.hoc_vien?.ma_hoc_vien || 0,
            ho_ten: th.hoc_vien?.ho_ten || '',
            ten_lop: th.hoc_vien?.tham_gia_lop && th.hoc_vien.tham_gia_lop.length > 0 
                ? th.hoc_vien.tham_gia_lop[0].lop_hoc?.ten_lop 
                : 'Chưa xếp lớp'
        })) || []

        setFormData({
            ten_hoat_dong: row.ten_hoat_dong,
            mo_ta: row.mo_ta || '',
            ngay_to_chuc: new Date(row.ngay_to_chuc).toISOString().slice(0, 16), 
            dia_diem: row.dia_diem || '',
            chi_phi: row.chi_phi !== null && row.chi_phi !== undefined ? row.chi_phi.toString() : '',
            danh_sach_giao_vien: assignedTeachers
        })
        setDanhSachThamGia(assignedStudents)
    }

    const openAddModal = () => {
        setIsViewMode(false)
        setEditingId(null)
        setFormData({ ten_hoat_dong: '', mo_ta: '', ngay_to_chuc: '', dia_diem: '', chi_phi: '', danh_sach_giao_vien: [] })
        setDanhSachThamGia([])
        setHocVienTrongLop([])
        setIdChonTamThoi([])
        setTuKhoaLop('')
        setTuKhoaTuDo('')
        setTuKhoaGiaoVien('') 
        setFormErrors({})
        setIsModalOpen(true)
    }

    const openEditModal = (row: HoatDong) => { 
        fillFormData(row)
        setIsViewMode(false)
        setEditingId(row.ma_hoat_dong_ngoai_khoa)
        setTuKhoaGiaoVien('') 
        setHocVienTrongLop([])
        setIdChonTamThoi([])
        setTuKhoaLop('')
        setTuKhoaTuDo('')
        setFormErrors({})
        setIsModalOpen(true)
    }

    const openViewModal = (row: HoatDong) => { 
        setIsViewMode(true)
        setViewData(row)
        setEditingId(row.ma_hoat_dong_ngoai_khoa)
        setTuKhoaGiaoVien('') 
        setFormErrors({})
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
        const errors: Record<string, string> = {};

        if (!formData.ten_hoat_dong.trim()) errors.ten_hoat_dong = 'Vui lòng nhập tên hoạt động ngoại khóa';
        if (!formData.dia_diem.trim()) errors.dia_diem = 'Vui lòng nhập địa điểm tổ chức';
        
        if (!formData.ngay_to_chuc) {
            errors.ngay_to_chuc = 'Vui lòng chọn ngày giờ tổ chức';
        } else {
            const dateObj = new Date(formData.ngay_to_chuc);
            if (!(dateObj instanceof Date && !isNaN(dateObj.getTime()))) {
                errors.ngay_to_chuc = 'Ngày giờ tổ chức không hợp lệ';
            }
        }

        if (formData.chi_phi !== '' && Number(formData.chi_phi) < 0) {
            errors.chi_phi = 'Chi phí không được là số âm';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({}); 

        try {
            const method = editingId ? 'PUT' : 'POST'
            const payload = {
                ...formData,
                ma_hoat_dong_ngoai_khoa: editingId,
                chi_phi: formData.chi_phi ? parseInt(formData.chi_phi) : null,
                danh_sach_hoc_vien: danhSachThamGia.map(hv => hv.ma_hoc_vien) // Gửi mảng ID học viên xuống API
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

    const filteredData = data.filter(item => {
        const lowerSearch = searchTerm.toLowerCase();
        const matchActivityOrLocation = item.ten_hoat_dong.toLowerCase().includes(lowerSearch) || 
                                        (item.dia_diem && item.dia_diem.toLowerCase().includes(lowerSearch));
        const matchTeacher = item.phan_cong?.some(pc => 
            pc.giao_vien?.ho_ten.toLowerCase().includes(lowerSearch)
        ) || false;
        const matchSearch = matchActivityOrLocation || matchTeacher;

        let matchMonth = true;
        let matchYear = true;

        if (item.ngay_to_chuc) {
            const dateToChuc = new Date(item.ngay_to_chuc);
            const month = (dateToChuc.getMonth() + 1).toString();
            const year = dateToChuc.getFullYear().toString();

            if (selectedMonth !== 'all') matchMonth = month === selectedMonth;
            if (selectedYear.trim() !== '') matchYear = year === selectedYear.trim();
        }

        return matchSearch && matchMonth && matchYear;
    }).sort((a, b) => b.ma_hoat_dong_ngoai_khoa - a.ma_hoat_dong_ngoai_khoa)
    
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const danhSachGiaoVienLoc = danhSachGiaoVien.filter((gv) =>
        gv.ho_ten.toLowerCase().includes(tuKhoaGiaoVien.toLowerCase())
    )

    // Lọc danh sách học viên tự do (Chưa xếp lớp hoặc tìm toàn bộ)
    const hocVienTuDoLoc = tuKhoaTuDo.trim() === "" ? [] : danhSachTatCaHocVien.filter(hv => 
        hv.ho_ten.toLowerCase().includes(tuKhoaTuDo.toLowerCase()) || 
        hv.ma_hoc_vien.toString().includes(tuKhoaTuDo)
    )

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
                    <h1 className="text-2xl font-bold text-[#1d4ed8] flex items-center gap-3 uppercase tracking-wide">
                        <FaWalking className="text-blue-600" /> Quản Lý Hoạt Động Ngoại Khóa
                    </h1>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm w-full md:w-auto justify-center">
                        <FaPlus /> Thêm hoạt động
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6 w-full">
                    <div className="relative flex-1 md:max-w-md">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <FaSearch className="text-gray-400 text-sm" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Tìm theo tên hoạt động, địa điểm, giáo viên..." 
                            value={searchTerm} 
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} 
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm focus:border-[#1d4ed8] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-gray-400" 
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-32 shrink-0 group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaFilter className="text-gray-400 text-xs" />
                            </div>
                            <select 
                                value={selectedMonth}
                                onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
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

                        <div className="relative w-full md:w-28 shrink-0">
                            <input 
                                type="number" 
                                placeholder="Năm..." 
                                value={selectedYear}
                                onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
                                className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-sm font-semibold text-gray-700 shadow-sm focus:border-[#1d4ed8] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-t-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#1d4ed8] text-white uppercase font-semibold text-xs border-b">
                            <tr>
                                <th className="px-4 py-4 text-center whitespace-nowrap">Mã</th>
                                <th className="px-4 py-4 min-w-[200px] text-center">Tên Hoạt Động</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap">Ngày Tổ Chức</th>
                                <th className="px-4 py-4 min-w-[150px] text-center">Địa Điểm</th>
                                <th className="px-4 py-4 text-right whitespace-nowrap">Chi Phí</th>
                                <th className="px-4 py-4 min-w-[200px] text-center">Giáo Viên Tham Gia</th>
                                <th className="px-4 py-4 text-center w-32">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center py-8 font-medium">Đang tải dữ liệu...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Không tìm thấy hoạt động nào.</td></tr>
                            ) : (
                                currentItems.map((row, index) => (
                                    <tr key={row.ma_hoat_dong_ngoai_khoa} className={`border-b hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-4 py-4 text-center text-gray-600 font-medium">{row.ma_hoat_dong_ngoai_khoa}</td>
                                        <td className="px-4 py-4 font-bold text-[#1d4ed8]">
                                            {row.ten_hoat_dong}
                                        </td>
                                        <td className="px-4 py-4 text-center text-gray-800 font-medium whitespace-nowrap">{new Date(row.ngay_to_chuc).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-4 py-4 text-gray-600">{row.dia_diem || <span className="italic text-gray-400">Chưa cập nhật</span>}</td>
                                        
                                        <td className="px-4 py-4 text-right font-bold text-red-600 whitespace-nowrap">
                                            {formatCurrency(row.chi_phi)}
                                        </td>

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
                                                            <th className="px-4 py-3 text-center">Mã GV</th>
                                                            <th className="px-4 py-3">Họ & Tên</th>
                                                            <th className="px-4 py-3 text-center">Số Điện Thoại</th>
                                                            <th className="px-4 py-3">Email Liên Hệ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white">
                                                        {viewData.phan_cong.map((pc, idx) => (
                                                            <tr key={pc.ma_giao_vien} className={`border-b last:border-0 hover:bg-gray-50 ${idx % 2 !== 0 ? 'bg-gray-50/50' : ''}`}>
                                                                <td className="px-4 py-3.5 font-bold text-gray-500 text-center">GV{pc.ma_giao_vien}</td>
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
                    <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl animate-fade-in-up flex flex-col border border-gray-200 max-h-[95vh]">
                        
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-lg shrink-0">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2">
                                <FaWalking /> {editingId ? 'Cập Nhật Hoạt Động' : 'Thêm Hoạt Động Mới'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[14px] text-gray-700 mb-1.5 font-bold">Tên hoạt động ngoại khóa <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" name="ten_hoat_dong" value={formData.ten_hoat_dong} onChange={handleChange} 
                                        placeholder="Ví dụ: Dã ngoại thực tế, CLB Tiếng Anh..."
                                        className={`w-full border rounded-md px-3 py-2.5 outline-none text-gray-900 font-medium text-[15px] transition ${formErrors.ten_hoat_dong ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`} 
                                    />
                                    {formErrors.ten_hoat_dong && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.ten_hoat_dong}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[14px] text-gray-700 mb-1.5 font-bold flex items-center gap-1">Ngày tổ chức <span className="text-red-500">*</span></label>
                                        <input 
                                            type="datetime-local" name="ngay_to_chuc" value={formData.ngay_to_chuc} onChange={handleChange} 
                                            className={`w-full border rounded-md px-3 py-2.5 outline-none text-gray-900 font-medium text-[15px] transition ${formErrors.ngay_to_chuc ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`} 
                                        />
                                        {formErrors.ngay_to_chuc && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.ngay_to_chuc}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[14px] text-gray-700 mb-1.5 font-bold flex items-center gap-1">Chi phí dự kiến (VNĐ)</label>
                                        <input 
                                            type="number" name="chi_phi" value={formData.chi_phi} onChange={handleChange} 
                                            className={`w-full border rounded-md px-3 py-2.5 outline-none text-red-600 font-bold text-[15px] transition ${formErrors.chi_phi ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`} 
                                        />
                                        {formErrors.chi_phi && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.chi_phi}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[14px] text-gray-700 mb-1.5 font-bold flex items-center gap-1">Địa điểm tổ chức <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" name="dia_diem" value={formData.dia_diem} onChange={handleChange} 
                                        placeholder="Ví dụ: Công viên Yên Sở..."
                                        className={`w-full border rounded-md px-3 py-2.5 outline-none text-gray-900 font-medium text-[15px] transition ${formErrors.dia_diem ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`} 
                                    />
                                    {formErrors.dia_diem && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.dia_diem}</p>}
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

                                {formData.danh_sach_giao_vien.length > 0 && (
                                    <div className="mb-4 bg-white p-3 rounded-md border border-blue-200 shadow-sm">
                                        <p className="text-xs font-bold text-blue-800 mb-3 uppercase border-b border-blue-100 pb-2">Giáo viên đã phân công:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.danh_sach_giao_vien.map(id => {
                                                const gv = danhSachGiaoVien.find(g => g.ma_giao_vien === id);
                                                return (
                                                    <span key={`selected-${id}`} className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-md text-sm font-semibold border border-blue-200 shadow-sm">
                                                        {gv?.ho_ten || `GV${id}`}
                                                        <FaTimes className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => handleTeacherToggle(id, false)} title="Bỏ chọn" />
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {tuKhoaGiaoVien.trim() !== "" && (
                                    <div className="bg-white border border-gray-200 p-3 rounded-md shadow-sm max-h-48 overflow-y-auto animate-fade-in-down">
                                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase border-b pb-2">Kết quả tìm kiếm:</p>
                                        {danhSachGiaoVien.filter(gv => gv.ho_ten.toLowerCase().includes(tuKhoaGiaoVien.toLowerCase())).length === 0 ? (
                                            <p className="text-sm text-gray-500 italic text-center py-2">Không tìm thấy giáo viên nào phù hợp.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {danhSachGiaoVien.filter(gv => gv.ho_ten.toLowerCase().includes(tuKhoaGiaoVien.toLowerCase())).map(gv => (
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
                                                            {gv.ho_ten} <span className="text-gray-400 font-normal text-xs">(GV{gv.ma_giao_vien})</span> 
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <hr className="border-gray-200" />

                            {/* MODULE THÊM HỌC VIÊN VÀO GIỎ */}
                            <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm text-[#1d4ed8] font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <FaUserGraduate /> Thêm học viên tham gia
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {/* Cột 1: Chọn lớp */}
                                    <div>
                                        <span className="block text-xs font-semibold text-gray-500 mb-1">Thêm nhanh từ lớp:</span>
                                        <select 
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white cursor-pointer text-gray-900 font-medium"
                                            onChange={(e) => {
                                                const maLop = parseInt(e.target.value);
                                                if (!maLop) { setHocVienTrongLop([]); setIdChonTamThoi([]); setTuKhoaLop(""); return; }
                                                
                                                const selectedLop = danhSachLopHoc.find(l => l.ma_lop_hoc === maLop);
                                                
                                                // Lọc những học viên đang thuộc lớp học được chọn
                                                const studentsInClass = danhSachTatCaHocVien.filter(hv => 
                                                    hv.tham_gia_lop?.some(tl => tl.lop_hoc?.ma_lop_hoc === maLop)
                                                ).map(hv => ({
                                                    ma_hoc_vien: hv.ma_hoc_vien,
                                                    ho_ten: hv.ho_ten,
                                                    ten_lop: selectedLop?.ten_lop || ''
                                                }));
                                                
                                                setHocVienTrongLop(studentsInClass);
                                                setIdChonTamThoi([]);
                                                setTuKhoaLop("");
                                            }}
                                        >
                                            <option value="">-- Chọn lớp học --</option>
                                            {danhSachLopHoc.map(lop => (
                                                <option key={lop.ma_lop_hoc} value={lop.ma_lop_hoc}>{lop.ten_lop}</option>
                                            ))}
                                        </select>

                                        {/* Khung tìm kiếm/Chọn học viên bên trong lớp */}
                                        {hocVienTrongLop.length > 0 && (() => {
                                            const hocVienLopFiltered = hocVienTrongLop.filter(hv => 
                                                hv.ho_ten.toLowerCase().includes(tuKhoaLop.toLowerCase()) || 
                                                hv.ma_hoc_vien.toString().includes(tuKhoaLop)
                                            );

                                            const isAllFilteredSelected = hocVienLopFiltered.length > 0 && 
                                                hocVienLopFiltered.every(hv => idChonTamThoi.includes(hv.ma_hoc_vien));

                                            return (
                                                <div className="animate-fade-in-down mt-3">
                                                    <div className="bg-white border border-blue-200 rounded-md p-3 shadow-sm flex flex-col gap-3">
                                                        
                                                        {/* Thanh tìm kiếm nội bộ */}
                                                        <div className="relative">
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                                <FaSearch size={14}/>
                                                            </span>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Tìm nhanh học viên trong lớp..." 
                                                                value={tuKhoaLop}
                                                                onChange={(e) => setTuKhoaLop(e.target.value)}
                                                                className="w-full border border-gray-300 rounded py-2 pl-9 pr-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 font-medium placeholder-gray-500 transition shadow-sm"
                                                            />
                                                        </div>

                                                        {/* Thanh thao tác */}
                                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                                            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700 hover:text-blue-600 transition select-none">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                                    checked={isAllFilteredSelected}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            const newIds = [...idChonTamThoi];
                                                                            hocVienLopFiltered.forEach(hv => {
                                                                                if (!newIds.includes(hv.ma_hoc_vien)) newIds.push(hv.ma_hoc_vien);
                                                                            });
                                                                            setIdChonTamThoi(newIds);
                                                                        } else {
                                                                            const filteredIds = hocVienLopFiltered.map(hv => hv.ma_hoc_vien);
                                                                            setIdChonTamThoi(idChonTamThoi.filter(id => !filteredIds.includes(id)));
                                                                        }
                                                                    }}
                                                                />
                                                                Chọn tất cả ({idChonTamThoi.length}/{hocVienTrongLop.length})
                                                            </label>
                                                        </div>

                                                        {/* Danh sách lọc hiển thị */}
                                                        <div className="max-h-[140px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
                                                            {hocVienLopFiltered.length === 0 ? (
                                                                <p className="text-xs text-gray-400 italic text-center py-2">Không tìm thấy học viên khớp từ khóa.</p>
                                                            ) : (
                                                                hocVienLopFiltered.map(hv => (
                                                                    <label key={hv.ma_hoc_vien} className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-700 hover:bg-blue-50 p-1.5 rounded transition select-none">
                                                                        <input 
                                                                            type="checkbox" 
                                                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                                            checked={idChonTamThoi.includes(hv.ma_hoc_vien)}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) {
                                                                                    setIdChonTamThoi(prev => [...prev, hv.ma_hoc_vien]);
                                                                                } else {
                                                                                    setIdChonTamThoi(prev => prev.filter(id => id !== hv.ma_hoc_vien));
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span className="truncate">{hv.ho_ten}</span>
                                                                    </label>
                                                                ))
                                                            )}
                                                        </div>

                                                        <button 
                                                            type="button"
                                                            disabled={idChonTamThoi.length === 0}
                                                            onClick={() => {
                                                                const selected = hocVienTrongLop.filter(hv => idChonTamThoi.includes(hv.ma_hoc_vien));
                                                                setDanhSachThamGia(prev => {
                                                                    const mangMoi = [...prev];
                                                                    selected.forEach(hvMoi => {
                                                                        if (!mangMoi.find(item => item.ma_hoc_vien === hvMoi.ma_hoc_vien)) {
                                                                            mangMoi.push(hvMoi);
                                                                        }
                                                                    });
                                                                    return mangMoi;
                                                                });
                                                                setHocVienTrongLop([]);
                                                                setIdChonTamThoi([]);
                                                                setTuKhoaLop("");
                                                                // Reset select value to default programmatically if needed
                                                            }}
                                                            className="w-full bg-blue-600 text-white py-2 rounded text-sm font-bold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm mt-1"
                                                        >
                                                            Đưa {idChonTamThoi.length} người vào danh sách tham gia
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })()}
                                    </div>

                                    {/* Cột 2: Thêm học viên tự do / chưa xếp lớp */}
                                    <div>
                                        <span className="block text-xs font-semibold text-gray-500 mb-1">Hoặc thêm học viên tự do / chưa xếp lớp:</span>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FaSearch /></span>
                                            <input
                                                type="text"
                                                placeholder="🔍 Nhập tên hoặc mã học viên..."
                                                value={tuKhoaTuDo}
                                                onChange={(e) => setTuKhoaTuDo(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 outline-none text-sm text-gray-900 font-medium placeholder-gray-500 focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
                                            />
                                        </div>
                                        
                                        {tuKhoaTuDo.trim() !== "" && (
                                            <div className="bg-white border border-gray-200 p-2 rounded-md shadow-sm max-h-[220px] overflow-y-auto mt-2 animate-fade-in-down">
                                                {hocVienTuDoLoc.length === 0 ? (
                                                    <p className="text-xs text-gray-500 italic p-2 text-center">Không tìm thấy học viên.</p>
                                                ) : (
                                                    <div className="flex flex-col gap-1">
                                                        {hocVienTuDoLoc.map(hv => {
                                                            const isAdded = danhSachThamGia.some(item => item.ma_hoc_vien === hv.ma_hoc_vien);
                                                            const tenLop = hv.tham_gia_lop && hv.tham_gia_lop.length > 0 
                                                                ? hv.tham_gia_lop[0].lop_hoc?.ten_lop 
                                                                : 'Chưa xếp lớp';
                                                            
                                                            return (
                                                                <div 
                                                                    key={`free-${hv.ma_hoc_vien}`} 
                                                                    className={`flex items-center justify-between p-2 rounded border transition text-sm ${isAdded ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed' : 'hover:bg-blue-50 border-transparent hover:border-blue-100 cursor-pointer'}`}
                                                                    onClick={() => {
                                                                        if (isAdded) return;
                                                                        setDanhSachThamGia(prev => [...prev, { 
                                                                            ma_hoc_vien: hv.ma_hoc_vien, 
                                                                            ho_ten: hv.ho_ten, 
                                                                            ten_lop: tenLop 
                                                                        }]);
                                                                        setTuKhoaTuDo("");
                                                                    }}
                                                                >
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-gray-800">{hv.ho_ten} <span className="text-xs font-normal text-gray-400">({hv.ma_hoc_vien})</span></span>
                                                                        <span className="text-[10px] text-gray-500">{tenLop}</span>
                                                                    </div>
                                                                    {isAdded ? (
                                                                        <FaCheckCircle className="text-green-500" />
                                                                    ) : (
                                                                        <FaPlus className="text-blue-500" />
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Hiển thị giỏ danh sách tham gia */}
                                {danhSachThamGia.length > 0 && (
                                    <div className="mt-2 pt-4 border-t border-gray-200">
                                        <span className="block text-xs font-semibold text-green-700 mb-2 uppercase">Giỏ học viên đã chọn ({danhSachThamGia.length}):</span>
                                        <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                                            {danhSachThamGia.map(hv => (
                                                <span key={`cart-${hv.ma_hoc_vien}`} className="flex items-center gap-1.5 bg-white border border-green-200 px-3 py-1 rounded-full text-sm font-semibold shadow-sm text-gray-800">
                                                    {hv.ho_ten}
                                                    {hv.ten_lop && <span className="text-[10px] text-gray-500 font-normal ml-1">({hv.ten_lop})</span>}
                                                    <FaTimes className="cursor-pointer text-gray-400 hover:text-red-500 ml-1 transition" onClick={() => setDanhSachThamGia(prev => prev.filter(x => x.ma_hoc_vien !== hv.ma_hoc_vien))}/>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                            {Object.keys(formErrors).length > 0 && <div className="mr-auto text-red-600 font-medium self-center text-sm bg-red-50 px-3 py-1.5 rounded border border-red-100 flex items-center gap-2"><FaExclamationTriangle /> Vui lòng kiểm tra lại các thông tin báo đỏ!</div>}
                            <button onClick={closeModal} className="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 font-semibold transition shadow-sm">
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