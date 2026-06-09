'use client'
import { useState, useEffect, useMemo } from 'react'
import { 
    FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaEye, FaCheckCircle, 
    FaSpinner, FaExclamationTriangle, FaBullhorn, FaFilter, FaChevronDown, 
    FaChevronUp, FaGraduationCap, FaUsers, FaBookOpen
} from 'react-icons/fa'

interface NhanSu {
    ma_nhan_su: number
    ho_ten: string
    so_dien_thoai: string | null
    email: string | null
    phong_ban?: { ten_phong_ban: string } 
}

interface PhanCong {
    ma_nhan_su: number
    vai_tro: string
    nhan_su?: NhanSu
}

interface ChiTietMarketing {
    ma_khoa_hoc: number
    khoa_hoc?: KhoaHoc
}

interface ChuongTrinhMarketing {
    ma_chuong_trinh_marketing: number
    ten_chuong_trinh_marketing: string
    noi_dung: string
    ngay_bat_dau: string
    ngay_ket_thuc: string
    ngan_sach: number
    phan_cong?: PhanCong[]
    chi_tiet_marketing?: ChiTietMarketing[] 
}

interface PhanCongForm {
    ma_nhan_su: number;
    vai_tro: string;
}

interface KhoaHoc {
    ma_khoa_hoc: number
    ten_khoa_hoc: string
    hoc_phi?: number
    thoi_luong?: string
    trinh_do?: string    
    trang_thai?: string   
}

interface ChuongTrinhHoc {
    ma_chuong_trinh: number
    ten_chuong_trinh: string
}

export default function QuanLyMarketingPage() {
    const [data, setData] = useState<ChuongTrinhMarketing[]>([])
    const [danhSachKhoaHoc, setDanhSachKhoaHoc] = useState<KhoaHoc[]>([]) 
    const [danhSachNhanSu, setDanhSachNhanSu] = useState<NhanSu[]>([])
    const [chuongTrinhHocList, setChuongTrinhHocList] = useState<ChuongTrinhHoc[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    const currentDate = new Date();
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMonth, setSelectedMonth] = useState<string>((currentDate.getMonth() + 1).toString()) 
    const [selectedYear, setSelectedYear] = useState<string>(currentDate.getFullYear().toString()) 
    
    const [tuKhoaNhanSu, setTuKhoaNhanSu] = useState("")
    const [tuKhoaKhoaHoc, setTuKhoaKhoaHoc] = useState("") 

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewMode, setIsViewMode] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const [showKhoaHocDetail, setShowKhoaHocDetail] = useState(false) 
    const [showNhanSuDetail, setShowNhanSuDetail] = useState(false) 
    const [viewData, setViewData] = useState<ChuongTrinhMarketing | null>(null)

    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false)
    const [isSubmittingCourse, setIsSubmittingCourse] = useState(false)
    const [newCourseData, setNewCourseData] = useState({
        ten_khoa_hoc: '', thoi_luong: '', hoc_phi: '', trinh_do: 'A1', trang_thai: 'Đang mở', ma_chuong_trinh: ''
    })
    const [newCourseErrors, setNewCourseErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        ten_chuong_trinh_marketing: '',
        noi_dung: '',
        ngay_bat_dau: '',
        ngay_ket_thuc: '',
        ngan_sach: '',
        danh_sach_khoa_hoc: [] as number[], 
        danh_sach_nhan_su: [] as PhanCongForm[] 
    })
    
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

    const formatCurrency = (amount: number | undefined | null) => {
        if (amount === undefined || amount === null) return 'N/A';
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
                const [resMarketing, resKhoaHoc, resNhanSu, resCTHoc] = await Promise.all([
                    fetch('/api/tuyen-sinh/marketing'),
                    fetch('/api/tuyen-sinh/khoa-hoc'),
                    fetch('/api/tuyen-sinh/marketing?action=get_all_staff'),
                    fetch('/api/tuyen-sinh/chuong-trinh-hoc') 
                ])

                if (resMarketing.ok) setData(await resMarketing.json())
                if (resKhoaHoc.ok) setDanhSachKhoaHoc(await resKhoaHoc.json())
                if (resNhanSu.ok) setDanhSachNhanSu(await resNhanSu.json())
                if (resCTHoc.ok) setChuongTrinhHocList(await resCTHoc.json())

            } catch (error) {
                showToast('Lỗi khi tải dữ liệu từ máy chủ', 'error')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    const handleToggleNhanSu = (ma_nhan_su: number, isChecked: boolean) => {
        if (isViewMode) return;
        setFormData(prev => {
            if (isChecked) return { ...prev, danh_sach_nhan_su: [...prev.danh_sach_nhan_su, { ma_nhan_su, vai_tro: '' }] }
            return { ...prev, danh_sach_nhan_su: prev.danh_sach_nhan_su.filter(id => id.ma_nhan_su !== ma_nhan_su) }
        })
    }

    const handleRoleChange = (ma_nhan_su: number, vai_tro: string) => {
        setFormData(prev => ({
            ...prev,
            danh_sach_nhan_su: prev.danh_sach_nhan_su.map(item => item.ma_nhan_su === ma_nhan_su ? { ...item, vai_tro } : item)
        }))
    }

    const handleToggleKhoaHoc = (ma_khoa_hoc: number, isChecked: boolean) => {
        if (isViewMode) return;
        setFormData(prev => {
            const newList = isChecked 
                ? [...prev.danh_sach_khoa_hoc, ma_khoa_hoc] 
                : prev.danh_sach_khoa_hoc.filter(id => id !== ma_khoa_hoc);
            
            if (newList.length > 0 && formErrors.danh_sach_khoa_hoc) {
                setFormErrors(errs => ({ ...errs, danh_sach_khoa_hoc: '' }));
            }
            return { ...prev, danh_sach_khoa_hoc: newList };
        })
    }

    const openAddModal = () => {
        setIsViewMode(false)
        setEditingId(null)
        setFormData({ ten_chuong_trinh_marketing: '', noi_dung: '', ngay_bat_dau: '', ngay_ket_thuc: '', ngan_sach: '', danh_sach_khoa_hoc: [], danh_sach_nhan_su: [] })
        setTuKhoaNhanSu('')
        setTuKhoaKhoaHoc('')
        setFormErrors({}) 
        setIsModalOpen(true)
    }

    const fillFormData = (row: ChuongTrinhMarketing) => {
        setFormData({
            ten_chuong_trinh_marketing: row.ten_chuong_trinh_marketing,
            noi_dung: row.noi_dung || '',
            ngay_bat_dau: formatDateForInput(row.ngay_bat_dau),
            ngay_ket_thuc: formatDateForInput(row.ngay_ket_thuc),
            ngan_sach: row.ngan_sach?.toString() || '',
            danh_sach_khoa_hoc: row.chi_tiet_marketing?.map(ct => ct.ma_khoa_hoc) || [],
            danh_sach_nhan_su: row.phan_cong?.map(pc => ({ ma_nhan_su: pc.ma_nhan_su, vai_tro: pc.vai_tro || '' })) || []
        })
    }

    const openEditModal = (row: ChuongTrinhMarketing) => {
        setIsViewMode(false)
        setEditingId(row.ma_chuong_trinh_marketing)
        setTuKhoaNhanSu('')
        setTuKhoaKhoaHoc('')
        fillFormData(row)
        setFormErrors({}) 
        setIsModalOpen(true)
    }

    const openViewModal = (row: ChuongTrinhMarketing) => {
        setIsViewMode(true)
        setViewData(row) 
        setEditingId(row.ma_chuong_trinh_marketing)
        setTuKhoaNhanSu('')
        setTuKhoaKhoaHoc('')
        setFormErrors({})
        setShowKhoaHocDetail(false) 
        setShowNhanSuDetail(false) 
        setIsModalOpen(true)
    }

    const closeModal = () => setIsModalOpen(false)

    const openDeleteModal = (id: number) => { setDeletingId(id); setIsDeleteModalOpen(true) }
    const closeDeleteModal = () => { setIsDeleteModalOpen(false); setDeletingId(null) }

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
        } catch (error) { showToast('Không thể kết nối đến máy chủ.', 'error') } finally { closeDeleteModal() }
    }

    const isValidDateInput = (dateString: string) => {
        const dateObj = new Date(dateString);
        return dateObj instanceof Date && !isNaN(dateObj.getTime());
    }

    const handleSave = async () => {
        const errors: Record<string, string> = {};

        if (!formData.ten_chuong_trinh_marketing.trim()) errors.ten_chuong_trinh_marketing = 'Vui lòng nhập tên chương trình';
        
        if (!formData.danh_sach_nhan_su || formData.danh_sach_nhan_su.length === 0) {
        errors.danh_sach_nhan_su = 'Vui lòng phân công ít nhất 1 nhân sự phụ trách';
        }
        if (formData.danh_sach_khoa_hoc.length === 0) errors.danh_sach_khoa_hoc = 'Vui lòng chọn ít nhất 1 khóa học áp dụng';
        
        if (!formData.ngan_sach || formData.ngan_sach.toString().trim() === '') {
            errors.ngan_sach = 'Vui lòng nhập ngân sách dự kiến';
        } else if (Number(formData.ngan_sach) < 0) {
            errors.ngan_sach = 'Ngân sách không được là số âm';
        }

        if (!formData.ngay_bat_dau) {
            errors.ngay_bat_dau = 'Vui lòng nhập dữ liệu'; 
        } else if (!isValidDateInput(formData.ngay_bat_dau)) {
            errors.ngay_bat_dau = 'Dữ liệu ngày tháng năm không hợp lệ'; 
        }

        if (!formData.ngay_ket_thuc) {
            errors.ngay_ket_thuc = 'Vui lòng nhập dữ liệu'; 
        } else if (!isValidDateInput(formData.ngay_ket_thuc)) {
            errors.ngay_ket_thuc = 'Dữ liệu ngày tháng năm không hợp lệ'; 
        }

        if (!errors.ngay_bat_dau && !errors.ngay_ket_thuc) {
            const startDate = new Date(formData.ngay_bat_dau);
            const endDate = new Date(formData.ngay_ket_thuc);
            if (endDate < startDate) {
                errors.ngay_ket_thuc = 'Ngày kết thúc không được trước ngày bắt đầu';
            }
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({}); 
        try {
            const payload = {
                ma_chuong_trinh_marketing: editingId || undefined,
                ten_chuong_trinh_marketing: formData.ten_chuong_trinh_marketing,
                noi_dung: formData.noi_dung,
                ngan_sach: parseFloat(formData.ngan_sach),
                ngay_bat_dau: new Date(formData.ngay_bat_dau).toISOString(),
                ngay_ket_thuc: new Date(formData.ngay_ket_thuc).toISOString(),
                danh_sach_khoa_hoc: formData.danh_sach_khoa_hoc, 
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
        } catch (error) { showToast('Không thể kết nối đến máy chủ.', 'error') }
    }

    const handleNewCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewCourseData({ ...newCourseData, [name]: value });
        if (newCourseErrors[name]) setNewCourseErrors(prev => ({ ...prev, [name]: '' }));
    }

    const handleSaveNewCourse = async () => {
        const errors: Record<string, string> = {};
        if (!newCourseData.ten_khoa_hoc.trim()) errors.ten_khoa_hoc = 'Vui lòng nhập tên khóa học';
        if (!newCourseData.thoi_luong.trim()) errors.thoi_luong = 'Vui lòng nhập thời lượng';
        if (!newCourseData.hoc_phi || Number(newCourseData.hoc_phi) < 0) errors.hoc_phi = 'Học phí không hợp lệ';
        if (!newCourseData.ma_chuong_trinh) errors.ma_chuong_trinh = 'Vui lòng chọn chương trình học';
        if (Object.keys(errors).length > 0) {
            setNewCourseErrors(errors);
            return;
        }

        setIsSubmittingCourse(true);
        try {
            const payload = {
                ten_khoa_hoc: newCourseData.ten_khoa_hoc,
                thoi_luong: newCourseData.thoi_luong,
                hoc_phi: Number(newCourseData.hoc_phi),
                trinh_do: newCourseData.trinh_do,
                trang_thai: newCourseData.trang_thai,
                ma_chuong_trinh: Number(newCourseData.ma_chuong_trinh)
            };

            const response = await fetch('/api/tuyen-sinh/khoa-hoc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const createdCourse = await response.json();
                setDanhSachKhoaHoc(prev => [createdCourse, ...prev]);
            
                setFormData(prev => ({
                    ...prev,
                    danh_sach_khoa_hoc: [...prev.danh_sach_khoa_hoc, createdCourse.ma_khoa_hoc]
                }));
                if (formErrors.danh_sach_khoa_hoc) setFormErrors(errs => ({ ...errs, danh_sach_khoa_hoc: '' }));

                showToast('Đã tạo và tích chọn Khóa học mới!', 'success');
                setIsAddCourseModalOpen(false);
                setNewCourseData({ ten_khoa_hoc: '', thoi_luong: '', hoc_phi: '', trinh_do: 'A1', trang_thai: 'Đang mở', ma_chuong_trinh: '' });
            } else {
                setNewCourseErrors({ general: 'Có lỗi khi lưu khóa học mới.' });
            }
        } catch (error) {
            setNewCourseErrors({ general: 'Lỗi kết nối máy chủ.' });
        } finally {
            setIsSubmittingCourse(false);
        }
    }

    const filteredData = data.filter(item => {
        const lowerSearch = searchTerm.toLowerCase();
        const matchProgram = item.ten_chuong_trinh_marketing.toLowerCase().includes(lowerSearch) ||
                             item.ma_chuong_trinh_marketing.toString().includes(lowerSearch);
        const matchStaff = item.phan_cong?.some(pc => pc.nhan_su?.ho_ten.toLowerCase().includes(lowerSearch)) || false;
        const matchCourse = item.chi_tiet_marketing?.some(ct => ct.khoa_hoc?.ten_khoa_hoc.toLowerCase().includes(lowerSearch)) || false;
        const matchSearch = matchProgram || matchStaff || matchCourse;
        
        let matchDate = true;
        const startDate = new Date(item.ngay_bat_dau);
        const startMonth = (startDate.getMonth() + 1).toString();
        const startYear = startDate.getFullYear().toString();

        if (selectedMonth !== 'all' && startMonth !== selectedMonth) matchDate = false;
        if (selectedYear.trim() !== '' && startYear !== selectedYear.trim()) matchDate = false;

        return matchSearch && matchDate;
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const nhanSuDaChonIDs = formData.danh_sach_nhan_su.map(i => i.ma_nhan_su);
    const nhanSuTimKiem = tuKhoaNhanSu.trim() === "" ? [] : danhSachNhanSu.filter(ns => 
        ns.ho_ten.toLowerCase().includes(tuKhoaNhanSu.toLowerCase()) && !nhanSuDaChonIDs.includes(ns.ma_nhan_su)
    )

    const khoaHocDaChonIDs = formData.danh_sach_khoa_hoc;
    const khoaHocTimKiem = tuKhoaKhoaHoc.trim() === "" ? [] : danhSachKhoaHoc.filter(kh => 
        kh.ten_khoa_hoc.toLowerCase().includes(tuKhoaKhoaHoc.toLowerCase()) && !khoaHocDaChonIDs.includes(kh.ma_khoa_hoc)
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

                <div className="flex flex-col md:flex-row gap-4 mb-6 w-full items-center">
                    <div className="relative flex-1 md:max-w-md w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <FaSearch className="text-gray-400 text-sm" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Tìm mã, tên chương trình, khóa học hoặc nhân sự..." 
                            value={searchTerm} 
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} 
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm focus:border-[#1d4ed8] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-gray-400" 
                        />
                    </div>
                    
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm h-[42px] overflow-hidden shrink-0 w-full md:w-auto">
                        <div className="relative flex-1 md:w-[130px]">
                            <select 
                                value={selectedMonth}
                                onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
                                className="appearance-none w-full bg-transparent py-2.5 pl-4 pr-8 text-sm font-semibold text-gray-700 cursor-pointer outline-none focus:bg-gray-50 transition-colors"
                            >
                                <option value="all">Tất cả tháng</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                    <option key={month} value={month.toString()}>Tháng {month}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <FaChevronDown className="text-gray-500 text-[10px]" />
                            </div>
                        </div>

                        <div className="w-[1px] h-6 bg-gray-200"></div>

                        <div className="relative flex-1 md:w-[130px]">
                            <input 
                                type="number" 
                                placeholder="Tất cả năm"
                                value={selectedYear}
                                onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
                                className="w-full bg-transparent py-2.5 px-4 text-sm font-semibold text-gray-700 outline-none focus:bg-gray-50 transition-colors placeholder-gray-500 appearance-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#1d4ed8] text-white font-semibold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-4 text-center whitespace-nowrap border-b border-blue-600">Mã</th>
                                <th className="px-4 py-4 min-w-[250px] border-b border-blue-600 text-center">Tên Chương Trình</th>
                                <th className="px-4 py-4 min-w-[200px] border-b border-blue-600">Khóa Học Áp Dụng</th>
                                <th className="px-4 py-4 text-right whitespace-nowrap border-b border-blue-600">Ngân Sách</th>
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
                                            <td className="px-4 py-4 align-top">
                              {row.chi_tiet_marketing && row.chi_tiet_marketing.length > 0 ? (
                                 <div className="max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                                 <div className="flex flex-col gap-1.5">
                                  {row.chi_tiet_marketing.map((ct, idx) => (
                                         <span 
                                        key={idx} 
                                        className="text-[11px] font-bold text-green-800 bg-green-50 px-2 py-1 rounded border border-green-200 block truncate" 
                                        title={ct.khoa_hoc?.ten_khoa_hoc}
                                            >
                                        • {ct.khoa_hoc?.ten_khoa_hoc || `Mã KH: ${ct.ma_khoa_hoc}`}
                                         </span>
                                                ))}
                                     </div>
                                         </div>
                                        ) : (
                                        <span className="italic text-gray-400 text-xs">Chưa áp dụng</span>
                                                 )}
                                        </td>
                                            <td className="px-4 py-4 text-right font-bold text-red-600 whitespace-nowrap align-top">
                                                {formatCurrency(row.ngan_sach)}
                                            </td>
                                            <td className="px-4 py-4 text-center whitespace-nowrap align-top text-xs font-medium text-gray-600">
                                                <div>{new Date(row.ngay_bat_dau).toLocaleDateString('vi-VN')}</div>
                                                <div className="text-gray-400 my-0.5">đến</div>
                                                <div>{new Date(row.ngay_ket_thuc).toLocaleDateString('vi-VN')}</div>
                                            </td>
                                            <td className="px-4 py-4 text-center whitespace-nowrap align-top">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trangThai.style}`}>{trangThai.text}</span>
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
                        <div>Hiển thị <span className="font-bold">{indexOfFirstItem + 1}</span> đến <span className="font-bold">{Math.min(indexOfLastItem, filteredData.length)}</span> / <span className="font-bold">{filteredData.length}</span> chương trình</div>
                        <div className="flex gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded disabled:bg-gray-50 hover:bg-gray-50 transition bg-white">Trước</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 border rounded transition font-medium ${currentPage === page ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded disabled:bg-gray-50 hover:bg-gray-50 transition bg-white">Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL VIEW (BÁO CÁO CHI TIẾT) */}
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
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-5 border-l-4 border-[#1d4ed8] pl-3 flex items-center">Thông Tin Chung</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 text-sm">
                                    <div><span className="text-gray-500 block mb-1">Tên chương trình</span><span className="font-bold text-xl text-[#1d4ed8]">{viewData.ten_chuong_trinh_marketing}</span></div>
                                    <div><span className="text-gray-500 block mb-1">Ngân sách dự kiến</span><span className="font-bold text-red-600 text-lg">{formatCurrency(viewData.ngan_sach)}</span></div>
                                    <div><span className="text-gray-500 block mb-1">Thời gian triển khai</span><span className="font-semibold text-gray-800 text-base">{new Date(viewData.ngay_bat_dau).toLocaleDateString('vi-VN')} - {new Date(viewData.ngay_ket_thuc).toLocaleDateString('vi-VN')}</span></div>
                                    <div className="md:col-span-2"><span className="text-gray-500 block mb-2">Nội dung chi tiết</span><p className="text-gray-800 bg-gray-50 p-3.5 rounded-md border border-gray-200 leading-relaxed min-h-[80px]">{viewData.noi_dung || <span className="italic text-gray-400">Không có mô tả</span>}</p></div>
                                </div>
                            </div>

                            {/* Khối 2: Liên kết Khóa Học */}
                           <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition" 
        onClick={() => setShowKhoaHocDetail(!showKhoaHocDetail)}
    >
        <h3 className="text-lg font-bold text-gray-900 border-l-4 border-green-500 pl-3 flex items-center gap-2">
            <FaGraduationCap className="text-green-600"/> Khóa Học Áp Dụng ({viewData.chi_tiet_marketing?.length || 0})
        </h3>
        <button className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-md hover:bg-green-200 transition">
            {showKhoaHocDetail ? <><FaChevronUp /> Thu gọn</> : <><FaChevronDown /> Xem chi tiết</>}
        </button>
    </div>
    
    {showKhoaHocDetail && (
        <div className="px-5 pb-5 pt-0 animate-fade-in-up">
            {viewData.chi_tiet_marketing && viewData.chi_tiet_marketing.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewData.chi_tiet_marketing.map((ct, idx) => (
                        <div key={idx} className="bg-[#f6fbf7] p-4 rounded-lg border border-green-200 shadow-sm transition hover:shadow-md flex flex-col gap-3">
                            {/* Header: Tên + Trạng thái */}
                            <div className="flex justify-between items-start gap-2">
                                <span className="font-bold text-gray-900 text-base line-clamp-1" title={ct.khoa_hoc?.ten_khoa_hoc}>
                                    {ct.khoa_hoc?.ten_khoa_hoc || `Mã KH: ${ct.ma_khoa_hoc}`}
                                </span>
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded border border-green-200 shrink-0">
                                    {ct.khoa_hoc?.trang_thai || 'Đang mở'}
                                </span>
                            </div>

                            {/* Thông tin chính */}
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-white px-2 py-1 rounded border border-gray-200 text-gray-700 font-semibold">
                                    Trình độ: {ct.khoa_hoc?.trinh_do || 'N/A'}
                                </span>
                                <span className="bg-white px-2 py-1 rounded border border-gray-200 text-gray-700 font-semibold">
                                    Thời lượng: {ct.khoa_hoc?.thoi_luong || 'N/A'}
                                </span>
                            </div>

                            {/* Mô tả & Học phí */}
                            <div className="text-sm border-t border-green-100 pt-2">
                                <div className="text-gray-700 font-medium">
                                    Học phí: <span className="font-bold text-red-600">{formatCurrency(ct.khoa_hoc?.hoc_phi || 0)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-sm text-gray-500 italic">Chưa áp dụng cho khóa học nào.</p>
                </div>
            )}
        </div>
    )}
</div>

                            {/* Khối 3: Đội ngũ Nhân Sự */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition" onClick={() => setShowNhanSuDetail(!showNhanSuDetail)}>
                                    <h3 className="text-lg font-bold text-gray-800 border-l-4 border-purple-500 pl-3 flex items-center gap-2"><FaUsers className="text-purple-600"/> Đội Ngũ Nhân Sự Phụ Trách ({viewData.phan_cong?.length || 0})</h3>
                                    <button className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-md">{showNhanSuDetail ? <><FaChevronUp /> Thu gọn</> : <><FaChevronDown /> Xem chi tiết</>}</button>
                                </div>
                                
                                {showNhanSuDetail && (
                                    <div className="px-5 pb-5 pt-0 animate-fade-in-up">
                                        {viewData.phan_cong && viewData.phan_cong.length > 0 ? (
                                            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                                                        <tr>
                                                            <th className="px-4 py-3 text-center">Mã NS</th><th className="px-4 py-3">Họ & Tên</th><th className="px-4 py-3 text-center">Vai Trò</th><th className="px-4 py-3">Phòng Ban</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white">
                                                        {viewData.phan_cong?.map((pc, idx) => (
                                                            <tr key={pc.ma_nhan_su} className="border-t border-gray-100 hover:bg-gray-50">
                                                                <td className="px-4 py-4 text-center text-gray-900 font-bold whitespace-nowrap">NS{pc.nhan_su?.ma_nhan_su}</td>
                                                                <td className="px-4 py-4 font-bold text-gray-900">{pc.nhan_su?.ho_ten}</td>
                                                                <td className="px-4 py-4 text-center"><span className="bg-purple-50 text-purple-800 px-2 py-1 rounded text-xs font-bold border border-purple-200">{pc.vai_tro || 'Thành viên'}</span></td>
                                                                <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{pc.nhan_su?.phong_ban?.ten_phong_ban || '-'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg text-center"><p className="text-sm text-gray-500 italic">Chưa phân công nhân sự nào.</p></div>}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl flex justify-end shrink-0">
                            <button onClick={closeModal} className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 font-bold transition shadow-sm text-sm">Đóng Báo Cáo</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL THÊM KHÓA HỌC NHANH */}
            {isAddCourseModalOpen && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4">
        <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl animate-fade-in-up flex flex-col border border-gray-200">
            <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><FaPlus className="text-green-600" /> Tạo Khóa Học </h2>
                <button 
                    onClick={() => {
                        setIsAddCourseModalOpen(false);
                        setNewCourseData({ ten_khoa_hoc: '', thoi_luong: '', hoc_phi: '', trinh_do: 'A1', trang_thai: 'Đang mở', ma_chuong_trinh: '' });
                        setNewCourseErrors({});
                    }} 
                    className="text-gray-400 hover:text-red-500 transition"
                >
                    <FaTimes size={20} />
                </button>
            </div>
            
            <div className="p-6 space-y-4">
                {/* Tên khóa học */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên khóa học <span className="text-red-500">*</span></label>
                    <input 
                        type="text" name="ten_khoa_hoc" value={newCourseData.ten_khoa_hoc} onChange={handleNewCourseChange} 
                        className={`w-full border p-2.5 rounded-md outline-none text-gray-900 font-medium transition ${newCourseErrors.ten_khoa_hoc ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`} 
                    />
                    {newCourseErrors.ten_khoa_hoc && <p className="text-red-500 text-xs mt-1 font-medium">{newCourseErrors.ten_khoa_hoc}</p>}
                </div>

                {/* Chương trình & Trình độ */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Chương trình <span className="text-red-500">*</span></label>
                        <select 
                            name="ma_chuong_trinh" 
                            value={newCourseData.ma_chuong_trinh} 
                            onChange={handleNewCourseChange} 
                            className={`w-full border rounded-md p-2.5 outline-none text-gray-900 font-medium bg-white transition ${newCourseErrors.ma_chuong_trinh ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`}
                        >
                            <option value="">-- Chọn --</option>
                            {chuongTrinhHocList.map(ct => (
                                <option key={ct.ma_chuong_trinh} value={ct.ma_chuong_trinh}>{ct.ten_chuong_trinh}</option>
                            ))}
                        </select>
                        {newCourseErrors.ma_chuong_trinh && <p className="text-red-500 text-xs mt-1 font-medium">{newCourseErrors.ma_chuong_trinh}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Trình độ <span className="text-red-500">*</span></label>
                        <select name="trinh_do" value={newCourseData.trinh_do} onChange={handleNewCourseChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-gray-900 font-medium bg-white focus:ring-2 focus:ring-green-500 transition">
                            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                    </div>
                </div>

                {/* Học phí & Thời lượng */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Học phí (VNĐ) <span className="text-red-500">*</span></label>
                        <input type="number" name="hoc_phi" value={newCourseData.hoc_phi} onChange={handleNewCourseChange} className={`w-full border p-2.5 rounded-md outline-none text-gray-900 font-medium transition ${newCourseErrors.hoc_phi ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`} />
                        {newCourseErrors.hoc_phi && <p className="text-red-500 text-xs mt-1 font-medium">{newCourseErrors.hoc_phi}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Thời lượng <span className="text-red-500">*</span></label>
                        <input type="text" name="thoi_luong" value={newCourseData.thoi_luong} onChange={handleNewCourseChange} placeholder="VD: 3 tháng, 20 buổi..." className={`w-full border p-2.5 rounded-md outline-none text-gray-900 font-medium transition ${newCourseErrors.thoi_luong ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`} />
                        {newCourseErrors.thoi_luong && <p className="text-red-500 text-xs mt-1 font-medium">{newCourseErrors.thoi_luong}</p>}
                    </div>
                </div>
                
                {newCourseErrors.general && <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100 font-medium">{newCourseErrors.general}</div>}
            </div>

            <div className="p-5 border-t bg-gray-50 rounded-b-lg flex justify-end gap-3">
                <button 
                    onClick={() => {
                        setIsAddCourseModalOpen(false);
                        setNewCourseData({ ten_khoa_hoc: '', thoi_luong: '', hoc_phi: '', trinh_do: 'A1', trang_thai: 'Đang mở', ma_chuong_trinh: '' });
                        setNewCourseErrors({});
                    }} 
                    className="px-5 py-2.5 border border-gray-300 bg-white rounded-md hover:bg-gray-100 font-bold text-gray-700 transition"
                >
                    Hủy
                </button>
                <button onClick={handleSaveNewCourse} disabled={isSubmittingCourse} className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-70">
                    {isSubmittingCourse ? <FaSpinner className="animate-spin" /> : <><FaSave /> Lưu khóa học</>}
                </button>
            </div>
        </div>
    </div>
)}

            {/* MODAL THÊM / SỬA (MARKETING) */}
            {isModalOpen && !isViewMode && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl animate-fade-in-up flex flex-col max-h-[95vh]">
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
                                    <input 
                                        type="text" name="ten_chuong_trinh_marketing" value={formData.ten_chuong_trinh_marketing} 
                                        onChange={handleChange} className={`w-full border rounded-md p-2.5 outline-none text-sm text-gray-900 font-medium ${formErrors.ten_chuong_trinh_marketing ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#1d4ed8]'}`} 
                                    />
                                    {formErrors.ten_chuong_trinh_marketing && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.ten_chuong_trinh_marketing}</p>}
                                </div>

                                {/* BLOCK: MULTI-SELECT KHÓA HỌC */}
                                <div className="md:col-span-2 bg-green-50/30 p-4 rounded-lg border border-green-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm text-green-800 font-bold flex items-center gap-2"><FaGraduationCap/> Áp dụng cho Khóa học <span className="text-red-500">*</span></label>
                                        <button onClick={() => setIsAddCourseModalOpen(true)} className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded flex items-center gap-1 font-semibold shadow-sm transition"><FaPlus/> Tạo khóa học </button>
                                    </div>
                                    
                                    {formData.danh_sach_khoa_hoc.length > 0 && (
                                        <div className="mb-3 flex flex-wrap gap-2">
                                            {formData.danh_sach_khoa_hoc.map(id => {
                                                const kh = danhSachKhoaHoc.find(k => k.ma_khoa_hoc === id);
                                                return (
                                                    <span key={`sel-kh-${id}`} className="flex items-center gap-1.5 bg-green-100 text-green-800 px-2.5 py-1 rounded text-xs font-bold border border-green-200">
                                                        {kh?.ten_khoa_hoc || `Mã KH: ${id}`}
                                                        <FaTimes className="cursor-pointer hover:text-red-600 ml-1" onClick={() => handleToggleKhoaHoc(id, false)} title="Bỏ chọn"/>
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    )}

                                    <div className="relative mb-1">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FaSearch /></span>
                                        <input type="text" placeholder="Gõ tên để tìm và chọn khóa học..." value={tuKhoaKhoaHoc} onChange={(e) => setTuKhoaKhoaHoc(e.target.value)} className={`w-full border bg-white rounded-md py-2.5 pl-9 pr-3 outline-none text-sm text-gray-900 font-medium ${formErrors.danh_sach_khoa_hoc ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`} />
                                    </div>
                                    {formErrors.danh_sach_khoa_hoc && <p className="text-red-500 text-xs font-medium mt-1">{formErrors.danh_sach_khoa_hoc}</p>}

                                    {tuKhoaKhoaHoc.trim() !== "" && (
                                        <div className="mt-2 bg-white border border-gray-200 p-2 rounded-md shadow-sm max-h-40 overflow-y-auto">
                                            {khoaHocTimKiem.length === 0 ? <p className="text-xs text-gray-500 italic p-2 text-center">Không tìm thấy khóa học</p> : (
                                                <div className="flex flex-col gap-1">
                                                    {khoaHocTimKiem.map(kh => (
                                                        <label key={kh.ma_khoa_hoc} className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer border border-transparent hover:border-gray-100 transition text-sm">
                                                            <input type="checkbox" className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500" checked={formData.danh_sach_khoa_hoc.includes(kh.ma_khoa_hoc)} onChange={(e) => handleToggleKhoaHoc(kh.ma_khoa_hoc, e.target.checked)}/>
                                                            <span className="font-medium text-gray-800">{kh.ten_khoa_hoc} <span className="text-gray-400 font-normal text-xs ml-1">- {formatCurrency(kh.hoc_phi)}</span></span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-1.5 font-bold">Ngân sách (VNĐ) <span className="text-red-500">*</span></label>
                                    <input type="number" name="ngan_sach" value={formData.ngan_sach} onChange={handleChange} className={`w-full border rounded-md p-2.5 outline-none text-sm text-red-600 font-bold ${formErrors.ngan_sach ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#1d4ed8]'}`} />
                                    {formErrors.ngan_sach && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.ngan_sach}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-1.5 font-bold">Ngày bắt đầu <span className="text-red-500">*</span></label>
                                    <input type="date" name="ngay_bat_dau" value={formData.ngay_bat_dau} onChange={handleChange} className={`w-full border rounded-md p-2.5 outline-none text-sm text-gray-900 font-medium ${formErrors.ngay_bat_dau ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#1d4ed8]'}`} />
                                    {formErrors.ngay_bat_dau && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.ngay_bat_dau}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1.5 font-bold">Ngày kết thúc <span className="text-red-500">*</span></label>
                                    <input type="date" name="ngay_ket_thuc" value={formData.ngay_ket_thuc} onChange={handleChange} className={`w-full border rounded-md p-2.5 outline-none text-sm text-gray-900 font-medium ${formErrors.ngay_ket_thuc ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#1d4ed8]'}`} />
                                    {formErrors.ngay_ket_thuc && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.ngay_ket_thuc}</p>}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200 mb-4">
    <label className="block text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-[#1d4ed8]">
        <FaUsers /> Phân công nhân sự <span className="text-red-500">*</span>
    </label>
    
    <div className="mb-4 ">
        <div className = "relative">
       <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FaSearch /></span>
        <input 
            type="text" 
            placeholder="Gõ tên nhân sự để tìm kiếm..." 
            value={tuKhoaNhanSu} 
            onChange={(e) => {
                setTuKhoaNhanSu(e.target.value);
                if (formErrors.danh_sach_nhan_su) {
                    setFormErrors(prev => ({ ...prev, danh_sach_nhan_su: '' }));
                }
            }} 
            className={`w-full border rounded-md py-2.5 pl-10 pr-3 text-sm outline-none shadow-sm font-medium transition bg-white text-gray-900 ${formErrors.danh_sach_nhan_su ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#1d4ed8]'}`} 
        />
        </div>
        
        {formErrors.danh_sach_nhan_su && (
            <p className="text-red-500 text-sm mt-1.5 font-medium">
                {formErrors.danh_sach_nhan_su}
            </p>
        )}
    </div>

    <div className="space-y-4">
        {formData.danh_sach_nhan_su.length > 0 && (
            <div className="bg-white p-3 rounded-md border border-blue-200 shadow-sm">
                <p className="text-xs font-bold text-blue-800 mb-3 uppercase border-b border-blue-100 pb-2">Đội ngũ đã chọn:</p>
                <div className="space-y-2">
                    {formData.danh_sach_nhan_su.map(item => {
                        const nsInfo = danhSachNhanSu.find(n => n.ma_nhan_su === item.ma_nhan_su);
                        const currentProgram = data.find(d => d.ma_chuong_trinh_marketing === editingId);
                        const oldInfo = currentProgram?.phan_cong?.find(pc => pc.ma_nhan_su === item.ma_nhan_su)?.nhan_su;
                        const tenHienThi = nsInfo?.ho_ten || oldInfo?.ho_ten || `Mã nhân sự: ${item.ma_nhan_su}`;

                        return (
                            <div key={`selected-${item.ma_nhan_su}`} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-blue-50/50 p-2.5 rounded border border-blue-100">
                                <div className="flex items-center gap-3 sm:w-1/3">
                                    <input 
                                        type="checkbox" 
                                        checked={true} 
                                        onChange={(e) => {
                                            handleToggleNhanSu(item.ma_nhan_su, e.target.checked);
                                            if (formErrors.danh_sach_nhan_su) {
                                                setFormErrors(prev => ({ ...prev, danh_sach_nhan_su: '' }));
                                            }
                                        }} 
                                        className="w-4 h-4 text-blue-600 rounded cursor-pointer shrink-0" 
                                    />
                                    <span className="text-sm font-semibold text-gray-800 truncate" title={tenHienThi}>{tenHienThi}</span>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Nhập vai trò (VD: Content...)" 
                                    value={item.vai_tro} 
                                    onChange={(e) => handleRoleChange(item.ma_nhan_su, e.target.value)} 
                                    className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm text-gray-900 font-medium placeholder-gray-400 bg-white" 
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
                    <p className="text-sm text-gray-500 italic py-2">Không tìm thấy nhân sự nào phù hợp.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {nhanSuTimKiem.map(ns => (
                            <label key={`search-${ns.ma_nhan_su}`} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition border border-transparent hover:border-gray-200">
                                <input 
                                    type="checkbox" 
                                    checked={false} 
                                    onChange={(e) => {
                                        handleToggleNhanSu(ns.ma_nhan_su, e.target.checked);
                                        if (formErrors.danh_sach_nhan_su) {
                                            setFormErrors(prev => ({ ...prev, danh_sach_nhan_su: '' }));
                                        }
                                    }} 
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300" 
                                />
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
                                <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Nội dung chi tiết</label>
                                <textarea name="noi_dung" rows={3} value={formData.noi_dung} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1d4ed8] outline-none text-sm resize-none text-gray-900 font-medium" placeholder="Nhập chi tiết về thông điệp quảng cáo, kịch bản sự kiện..."></textarea>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3 shrink-0">
                            {Object.keys(formErrors).length > 0 && <div className="mr-auto text-red-600 font-medium self-center text-sm"><FaExclamationTriangle className="inline mr-1" /> Vui lòng kiểm tra lại các trường bị lỗi!</div>}
                            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-100 font-semibold transition">Hủy bỏ</button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-bold shadow-sm transition">
                                <FaSave /> {editingId ? 'Cập nhật' : 'Lưu chương trình'}
                            </button>
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