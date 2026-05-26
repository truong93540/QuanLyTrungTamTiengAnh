'use client'

import Alert from '@/components/Alert'
import ConfirmModal from '@/components/ConfirmModal'
import { useState, useEffect, useRef, Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
    FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaLock,
    FaMoneyBillWave, FaBullhorn, FaFileInvoiceDollar, FaCheckCircle,
    FaHourglassHalf, FaTimesCircle, FaWallet, FaUser
} from 'react-icons/fa'
import { formatCurrency } from "@/lib/utils"

interface PhieuChi {
    ma_phieu_chi: number
    loai_phieu_chi: 'LUONG' | 'MARKETING' | 'KHAC'
    tong_tien: number
    hinh_thuc_chi?: string | null
    nguoi_nhan?: string | null
    noi_dung?: string | null
    trang_thai?: string | null
    ma_bang_luong?: number | null
    ma_chuong_trinh_marketing?: number | null
    ma_nhan_su: number
    nhan_su?: { ho_ten: string }
    bang_luong?: { ky_luong: string; tong_so_tien: number } | null
    chuong_trinh_mkt?: { ten_chuong_trinh_marketing: string } | null
    ngay_chi?: string | null
}

interface NhanSu {
    ma_nhan_su: number
    ho_ten: string
}

interface BangLuong {
    ma_bang_luong: number
    ky_luong: string
    tong_so_tien: number
    phieu_chi?: any | null
}

interface MarketingCampaign {
    ma_chuong_trinh_marketing: number
    ten_chuong_trinh_marketing: string
    ngan_sach?: number | null
    da_chi?: number | null
}

const getTodayString = () => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const formatToVnDateInput = (dateStr: string | Date | null | undefined) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    // Shift by 7 hours (Vietnam timezone UTC+7) to ensure exact local date
    const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000)
    const year = vnDate.getUTCFullYear()
    const month = String(vnDate.getUTCMonth() + 1).padStart(2, '0')
    const day = String(vnDate.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function PhieuChiContent() {
    const searchParams = useSearchParams()
    const actionParam = searchParams.get('action')
    const monthParam = searchParams.get('month')
    const yearParam = searchParams.get('year')
    const searchParam = searchParams.get('search')
    const [data, setData] = useState<PhieuChi[]>([])
    const [nhanSuList, setNhanSuList] = useState<NhanSu[]>([])
    const [bangLuongList, setBangLuongList] = useState<BangLuong[]>([])
    const [marketingList, setMarketingList] = useState<MarketingCampaign[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Dynamic dropdown states
    const [isNhanSuDropdownOpen, setIsNhanSuDropdownOpen] = useState(false)
    const nhanSuDropdownRef = useRef<HTMLDivElement>(null)
    const [isBangLuongDropdownOpen, setIsBangLuongDropdownOpen] = useState(false)
    const bangLuongDropdownRef = useRef<HTMLDivElement>(null)
    const [isMarketingDropdownOpen, setIsMarketingDropdownOpen] = useState(false)
    const marketingDropdownRef = useRef<HTMLDivElement>(null)

    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null,
    })

    // Filter states
    const today = useMemo(() => new Date(), [])
    const [filterType, setFilterType] = useState<string>('ALL')
    const [filterStatus, setFilterStatus] = useState<string>('ALL')
    const [filterMonth, setFilterMonth] = useState<string>((today.getMonth() + 1).toString())
    const [filterYear, setFilterYear] = useState<string>(today.getFullYear().toString())
    const [searchTerm, setSearchTerm] = useState<string>('')

    const [formData, setFormData] = useState({
        ma_phieu_chi: '',
        loai_phieu_chi: 'KHAC',
        tong_tien: '',
        hinh_thuc_chi: 'Chuyển khoản',
        nguoi_nhan: '',
        noi_dung: '',
        trang_thai: 'Đã chi',
        ngay_chi: getTodayString(),
        ma_bang_luong: '',
        ma_chuong_trinh_marketing: '',
        ma_nhan_su: '',
    })
    const [formError, setFormError] = useState<string | null>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Reset page to 1 when any filter changes
    useEffect(() => {
        setCurrentPage(1)
    }, [filterType, filterStatus, filterMonth, filterYear, searchTerm])

    // Fetch initial data
    const fetchAllData = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (filterType !== 'ALL') params.append('loai_phieu_chi', filterType)
            if (filterStatus !== 'ALL') params.append('trang_thai', filterStatus)
            if (searchTerm) params.append('search', searchTerm)

            params.append('t', Date.now().toString())
            const [phieuChiRes, nhanSuRes, bangLuongRes, marketingRes] = await Promise.all([
                fetch(`/api/tai-chinh/phieu-chi?${params.toString()}`, { cache: 'no-store' }),
                fetch('/api/tai-chinh/nhan-vien', { cache: 'no-store' }),
                fetch(`/api/tai-chinh/bang-luong?t=${Date.now()}`, { cache: 'no-store' }),
                fetch(`/api/tai-chinh/marketing?t=${Date.now()}`, { cache: 'no-store' })
            ])

            if (phieuChiRes.ok) {
                const result = await phieuChiRes.json()
                setData(result)
            }
            if (nhanSuRes.ok) {
                const resultNs = await nhanSuRes.json()
                setNhanSuList(resultNs)
            }
            if (bangLuongRes.ok) {
                const resultBl = await bangLuongRes.json()
                setBangLuongList(resultBl)
            }
            if (marketingRes.ok) {
                const resultMkt = await marketingRes.json()
                setMarketingList(resultMkt)
            }
        } catch (error) {
            console.error('Lỗi fetch API:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAllData()
    }, [filterType, filterStatus])

    // Click outside handler for custom dropdowns
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (nhanSuDropdownRef.current && !nhanSuDropdownRef.current.contains(event.target as Node)) {
                setIsNhanSuDropdownOpen(false)
            }
            if (bangLuongDropdownRef.current && !bangLuongDropdownRef.current.contains(event.target as Node)) {
                setIsBangLuongDropdownOpen(false)
            }
            if (marketingDropdownRef.current && !marketingDropdownRef.current.contains(event.target as Node)) {
                setIsMarketingDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Handle URL query parameters (e.g. from payroll page)
    useEffect(() => {
        if (!isLoading && actionParam === 'create_luong' && monthParam && yearParam) {
            const targetKyLuong = `${monthParam}/${yearParam}`

            // Fetch tươi để tránh dùng dữ liệu cũ (stale state)
            fetch(`/api/tai-chinh/bang-luong?t=${Date.now()}`, { cache: 'no-store' })
                .then(res => res.json())
                .then((freshList: BangLuong[]) => {
                    const bangLuong = freshList.find(bl => bl.ky_luong === targetKyLuong)
                    if (!bangLuong) return

                    // Nếu đã có phiếu chi và trạng thái khác 'Đã hủy'
                    if (bangLuong.phieu_chi && bangLuong.phieu_chi.trang_thai !== 'Đã hủy') {
                        setAlert({
                            message: `Bảng lương kỳ tháng ${targetKyLuong} đã được lập phiếu chi trước đó!`,
                            type: 'error'
                        })
                        // Dọn dẹp URL ngay lập tức để tránh lặp lại alert khi thay đổi state
                        window.history.replaceState(null, '', window.location.pathname)
                    } else if (bangLuong.phieu_chi && bangLuong.phieu_chi.trang_thai === 'Đã hủy') {
                        // Nếu đã có phiếu chi nhưng trạng thái là 'Đã hủy', chúng ta sẽ sửa lại phiếu chi cũ này
                        setFormData({
                            ma_phieu_chi: bangLuong.phieu_chi.ma_phieu_chi.toString(),
                            loai_phieu_chi: 'LUONG',
                            tong_tien: bangLuong.tong_so_tien.toString(),
                            hinh_thuc_chi: 'Chuyển khoản',
                            nguoi_nhan: 'Tất cả giáo viên & nhân sự',
                            noi_dung: `Chi trả lương kỳ tháng ${bangLuong.ky_luong}`,
                            trang_thai: 'Chờ duyệt',
                            ngay_chi: getTodayString(),
                            ma_bang_luong: bangLuong.ma_bang_luong.toString(),
                            ma_chuong_trinh_marketing: '',
                            ma_nhan_su: nhanSuList.length > 0 ? nhanSuList[0].ma_nhan_su.toString() : '',
                        })
                        setEditingId(bangLuong.phieu_chi.ma_phieu_chi)
                        setIsModalOpen(true)
                        // Dọn dẹp URL ngay lập tức
                        window.history.replaceState(null, '', window.location.pathname)
                    } else {
                        // Tạo phiếu chi mới hoàn toàn
                        setFormData({
                            ma_phieu_chi: '',
                            loai_phieu_chi: 'LUONG',
                            tong_tien: bangLuong.tong_so_tien.toString(),
                            hinh_thuc_chi: 'Chuyển khoản',
                            nguoi_nhan: 'Tất cả giáo viên & nhân sự',
                            noi_dung: `Chi trả lương kỳ tháng ${bangLuong.ky_luong}`,
                            trang_thai: 'Chờ duyệt',
                            ngay_chi: getTodayString(),
                            ma_bang_luong: bangLuong.ma_bang_luong.toString(),
                            ma_chuong_trinh_marketing: '',
                            ma_nhan_su: nhanSuList.length > 0 ? nhanSuList[0].ma_nhan_su.toString() : '',
                        })
                        setIsModalOpen(true)
                        // Dọn dẹp URL ngay lập tức
                        window.history.replaceState(null, '', window.location.pathname)
                    }
                })
                .catch(() => {
                    setAlert({ message: 'Không thể tải dữ liệu bảng lương.', type: 'error' })
                })
        } else if (!isLoading && searchParam) {
            const cleanQuery = searchParam.startsWith('#') ? searchParam.substring(1) : searchParam
            setSearchTerm(cleanQuery)
        }
    }, [isLoading, nhanSuList, actionParam, monthParam, yearParam, searchParam])

    // Recalculate and autofill based on linked entities
    useEffect(() => {
        if (formData.loai_phieu_chi === 'LUONG' && formData.ma_bang_luong) {
            const bangLuong = bangLuongList.find(bl => bl.ma_bang_luong.toString() === formData.ma_bang_luong)
            if (bangLuong) {
                setFormData(prev => ({
                    ...prev,
                    tong_tien: bangLuong.tong_so_tien.toString(),
                    nguoi_nhan: 'Tất cả giáo viên & nhân sự',
                    noi_dung: `Chi trả lương kỳ tháng ${bangLuong.ky_luong}`
                }))
            }
        } else if (formData.loai_phieu_chi === 'MARKETING' && formData.ma_chuong_trinh_marketing) {
            const campaign = marketingList.find(m => m.ma_chuong_trinh_marketing.toString() === formData.ma_chuong_trinh_marketing)
            if (campaign) {
                setFormData(prev => ({
                    ...prev,
                    noi_dung: `Chi phí chiến dịch marketing: ${campaign.ten_chuong_trinh_marketing}`
                }))
            }
        }
    }, [formData.ma_bang_luong, formData.ma_chuong_trinh_marketing, formData.loai_phieu_chi])


    const getItemMonthAndYear = (item: PhieuChi) => {
        const dateStr = item.ngay_chi
        if (dateStr) {
            const date = new Date(dateStr)

            const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000)
            return { month: vnDate.getUTCMonth() + 1, year: vnDate.getUTCFullYear() }
        }

        const now = new Date()
        const vnNow = new Date(now.getTime() + 7 * 60 * 60 * 1000)
        return { month: vnNow.getUTCMonth() + 1, year: vnNow.getUTCFullYear() }
    }


    const availableYears = useMemo(() => {
        const years = new Set<number>([new Date().getFullYear()])
        data.forEach(item => {
            const { year } = getItemMonthAndYear(item)
            years.add(year)
        })
        return Array.from(years).sort((a, b) => b - a)
    }, [data])


    const filteredData = useMemo(() => {
        return data.filter(item => {
            if (filterMonth !== 'ALL' || filterYear !== 'ALL') {
                const { month, year } = getItemMonthAndYear(item)
                if (filterMonth !== 'ALL' && month !== Number(filterMonth)) {
                    return false
                }
                if (filterYear !== 'ALL' && year !== Number(filterYear)) {
                    return false
                }
            }
            return true
        })
    }, [data, filterMonth, filterYear])

    // Dynamic metrics calculation
    const totalSpent = filteredData
        .filter(item => item.trang_thai === 'Đã chi')
        .reduce((sum, item) => sum + Number(item.tong_tien), 0)

    const totalSalaryExpenses = filteredData
        .filter(item => item.trang_thai === 'Đã chi' && item.loai_phieu_chi === 'LUONG')
        .reduce((sum, item) => sum + Number(item.tong_tien), 0)

    const totalMarketingExpenses = filteredData
        .filter(item => item.trang_thai === 'Đã chi' && item.loai_phieu_chi === 'MARKETING')
        .reduce((sum, item) => sum + Number(item.tong_tien), 0)

    const pendingCount = filteredData.filter(item => item.trang_thai === 'Chờ duyệt').length

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    const showAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormError(null)
        if (e.target.name === 'loai_phieu_chi') {
            setFormData(prev => ({
                ...prev,
                loai_phieu_chi: e.target.value as any,
                ma_bang_luong: '',
                ma_chuong_trinh_marketing: '',
                ma_nhan_su: '',

                nguoi_nhan: prev.loai_phieu_chi === 'LUONG' || prev.nguoi_nhan === 'Tất cả giáo viên & nhân sự' ? '' : prev.nguoi_nhan,
                tong_tien: prev.loai_phieu_chi === 'LUONG' ? '' : prev.tong_tien,
                noi_dung: prev.loai_phieu_chi === 'LUONG' || prev.loai_phieu_chi === 'MARKETING' ? '' : prev.noi_dung,
            }))
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    const handleCancelEdit = () => {
        setFormData({
            ma_phieu_chi: '',
            loai_phieu_chi: 'KHAC',
            tong_tien: '',
            hinh_thuc_chi: 'Chuyển khoản',
            nguoi_nhan: '',
            noi_dung: '',
            trang_thai: 'Chờ duyệt',
            ngay_chi: getTodayString(),
            ma_bang_luong: '',
            ma_chuong_trinh_marketing: '',
            ma_nhan_su: '',
        })
        setFormError(null)
        setEditingId(null)
    }

    const handleDeleteClick = (id: number) => {
        const row = data.find(item => item.ma_phieu_chi === id)
        if (row && row.trang_thai === 'Đã chi') {
            showAlert('Không thể xóa phiếu chi đã ở trạng thái Đã chi.', 'error')
            return
        }
        setConfirmDelete({ isOpen: true, id: id })
    }

    const handleConfirmDelete = async () => {
        if (!confirmDelete.id) return

        try {
            const response = await fetch(`/api/tai-chinh/phieu-chi?id=${confirmDelete.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setData(data.filter((item) => item.ma_phieu_chi !== confirmDelete.id))
                showAlert('Đã xóa phiếu chi thành công!', 'success')
                fetchAllData()
            } else {
                const errorData = await response.json().catch(() => null)
                showAlert(errorData?.error || 'Có lỗi xảy ra khi xóa.', 'error')
            }
        } catch (error) {
            console.error('Lỗi xóa:', error)
            showAlert('Không thể kết nối đến máy chủ.', 'error')
        } finally {
            setConfirmDelete({ isOpen: false, id: null })
        }
    }

    const handleApproveClick = async (maPhieuChi: number) => {
        const row = data.find(item => item.ma_phieu_chi === maPhieuChi)
        if (!row) return

        try {
            const updatedData = {
                ...row,
                ma_phieu_chi: row.ma_phieu_chi.toString(),
                ma_bang_luong: row.ma_bang_luong?.toString() || '',
                ma_chuong_trinh_marketing: row.ma_chuong_trinh_marketing?.toString() || '',
                ma_nhan_su: row.ma_nhan_su.toString(),
                trang_thai: 'Đã chi'
            }

            const response = await fetch('/api/tai-chinh/phieu-chi', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            })

            if (response.ok) {
                const saved = await response.json()
                setData(data.map((item) => item.ma_phieu_chi === saved.ma_phieu_chi ? saved : item))
                showAlert('Phê duyệt phiếu chi thành công!', 'success')
                fetchAllData()
            } else {
                const err = await response.json().catch(() => null)
                showAlert(err?.error || 'Không thể phê duyệt phiếu chi.', 'error')
            }
        } catch (error) {
            console.error('Lỗi duyệt:', error)
            showAlert('Lỗi kết nối máy chủ.', 'error')
        }
    }

    const handleSavePhieuChi = async () => {
        if (isSubmitting) return
        if (
            !formData.loai_phieu_chi ||
            !formData.tong_tien ||
            !formData.ma_nhan_su ||
            !formData.nguoi_nhan
        ) {
            setFormError('Vui lòng nhập đầy đủ thông tin bắt buộc!')
            return
        }

        if (isNaN(Number(formData.tong_tien)) || Number(formData.tong_tien) <= 0) {
            setFormError('Tổng tiền phải là số lớn hơn 0.')
            return
        }

        setFormError(null)
        setIsSubmitting(true)
        try {
            const method = editingId ? 'PUT' : 'POST'
            const response = await fetch('/api/tai-chinh/phieu-chi', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const savedPhieuChi = await response.json()

                if (editingId) {
                    setData(data.map((item) => item.ma_phieu_chi === savedPhieuChi.ma_phieu_chi ? savedPhieuChi : item))
                    showAlert('Cập nhật phiếu chi thành công!', 'success')
                } else {
                    setData([savedPhieuChi, ...data])
                    showAlert('Tạo phiếu chi mới thành công!', 'success')
                }
                setIsModalOpen(false)
                handleCancelEdit()
                fetchAllData() // Refresh list to get fresh BangLuong unique statuses
            } else {
                const errorResponse = await response.json().catch(() => null)
                setFormError(errorResponse?.error || 'Có lỗi xảy ra.')
            }
        } catch (error) {
            console.error('Lỗi:', error)
            setFormError('Không thể kết nối đến máy chủ.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const openModalForAdd = () => {
        setIsModalOpen(true)
        setFormData({
            ma_phieu_chi: '',
            loai_phieu_chi: 'KHAC',
            tong_tien: '',
            hinh_thuc_chi: 'Chuyển khoản',
            nguoi_nhan: '',
            noi_dung: '',
            trang_thai: 'Chờ duyệt',
            ngay_chi: getTodayString(),
            ma_bang_luong: '',
            ma_chuong_trinh_marketing: '',
            ma_nhan_su: '',
        })
    }

    const openModalForEdit = (row: PhieuChi) => {
        if (row.trang_thai === 'Đã chi') {
            showAlert('Không thể sửa đổi phiếu chi đã ở trạng thái Đã chi.', 'error')
            return
        }
        setFormData({
            ma_phieu_chi: row.ma_phieu_chi.toString(),
            loai_phieu_chi: row.loai_phieu_chi,
            tong_tien: row.tong_tien.toString(),
            hinh_thuc_chi: row.hinh_thuc_chi || 'Chuyển khoản',
            nguoi_nhan: row.nguoi_nhan || '',
            noi_dung: row.noi_dung || '',
            trang_thai: row.trang_thai || 'Đã chi',
            ngay_chi: formatToVnDateInput(row.ngay_chi) || getTodayString(),
            ma_bang_luong: row.ma_bang_luong?.toString() || '',
            ma_chuong_trinh_marketing: row.ma_chuong_trinh_marketing?.toString() || '',
            ma_nhan_su: row.ma_nhan_su.toString(),
        })
        setEditingId(row.ma_phieu_chi)
        setIsModalOpen(true)
    }

    return (
        <div className="bg-slate-50 min-h-screen p-6 md:p-8 text-slate-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                            <FaMoneyBillWave className="text-blue-600" /> Quản lý phiếu chi
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium ml-9">Lập, duyệt, theo dõi và quản lý dòng tiền chi tiêu của trung tâm</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {/* Unified Month/Year Selector at Header */}
                    <div className="flex bg-white p-1 items-center h-[46px] rounded-lg border border-slate-200 focus-within:border-blue-500 transition-all shadow-sm">
                        <select
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="bg-transparent px-3 py-1.5 font-bold text-slate-700 outline-none cursor-pointer border-r border-slate-100 text-sm"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={(i + 1).toString()}>Tháng {i + 1}</option>
                            ))}
                        </select>
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="bg-transparent px-3 py-1.5 font-bold text-slate-700 outline-none cursor-pointer text-sm"
                        >
                            {[2024, 2025, 2026, 2027, 2028].map(y => (
                                <option key={y} value={y.toString()}>Năm {y}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stat 1 */}
                <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-slate-100/80 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-200/50">
                    <div className="flex-1 min-w-0 pr-1">
                        <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1.5">Tổng tiền đã chi</p>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrency(totalSpent)}</h3>
                    </div>
                    <div className="p-3.5 bg-emerald-50 rounded-lg text-emerald-600 flex-shrink-0 shadow-sm shadow-emerald-100/50">
                        <FaWallet size={22} />
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-slate-100/80 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-200/50">
                    <div className="flex-1 min-w-0 pr-1">
                        <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1.5">Chi Lương Nhân Viên</p>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrency(totalSalaryExpenses)}</h3>
                    </div>
                    <div className="p-3.5 bg-blue-50 rounded-lg text-blue-600 flex-shrink-0 shadow-sm shadow-blue-100/50">
                        <FaFileInvoiceDollar size={22} />
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-slate-100/80 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-200/50">
                    <div className="flex-1 min-w-0 pr-1">
                        <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1.5">Chi Marketing</p>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrency(totalMarketingExpenses)}</h3>
                    </div>
                    <div className="p-3.5 bg-purple-50 rounded-lg text-purple-600 flex-shrink-0 shadow-sm shadow-purple-100/50">
                        <FaBullhorn size={22} />
                    </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-slate-100/80 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-200/50">
                    <div className="flex-1 min-w-0 pr-1">
                        <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1.5">Phiếu chờ duyệt</p>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{pendingCount}</h3>
                    </div>
                    <div className="p-3.5 bg-amber-50 rounded-lg text-amber-600 flex-shrink-0 shadow-sm shadow-amber-100/50">
                        <FaHourglassHalf size={22} />
                    </div>
                </div>
            </div>

            {/* Main Table & Filter Controls Container */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                {/* Table Header Action & Filter Bar (Gộp tìm kiếm, bộ lọc và bảng dữ liệu vào 1 vùng tương tự phiếu thu) */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/10 space-y-5">
                    {/* Hàng 1: Tiêu đề bảng & Nút Thêm mới */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100/80">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                                Danh sách phiếu chi
                            </h3>
                            <p className="text-sm font-medium text-slate-400 mt-0.5">Quản lý dòng tiền chi tiêu của trung tâm</p>
                        </div>
                        <button
                            onClick={openModalForAdd}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-100 transition-all active:scale-95 text-sm cursor-pointer whitespace-nowrap"
                        >
                            <FaPlus /> Thêm phiếu chi mới
                        </button>
                    </div>

                    {/* Hàng 2: Tìm kiếm & Bộ lọc */}
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            {/* Ô tìm kiếm */}
                            <div className="relative w-full sm:w-72">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm người nhận, nội dung..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && fetchAllData()}
                                    className="w-full border border-slate-200 focus:border-blue-500 rounded-lg px-4 py-2.5 outline-none text-sm pr-10 font-medium text-slate-700 bg-white"
                                />
                                <button
                                    onClick={fetchAllData}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-blue-600"
                                >
                                    <FaSearch size={14} />
                                </button>
                            </div>

                            {/* Lọc loại chi phí */}
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full sm:w-auto border border-slate-200 focus:border-blue-500 rounded-lg px-4 py-2.5 outline-none text-sm bg-white cursor-pointer font-bold text-slate-600"
                            >
                                <option value="ALL">Tất cả loại chi</option>
                                <option value="LUONG">Chi lương</option>
                                <option value="MARKETING">Chi Marketing</option>
                                <option value="KHAC">Chi khác</option>
                            </select>

                            {/* Lọc trạng thái */}
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full sm:w-auto border border-slate-200 focus:border-blue-500 rounded-lg px-4 py-2.5 outline-none text-sm bg-white cursor-pointer font-bold text-slate-600 animate-in fade-in duration-200"
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="Đã chi">Đã chi</option>
                                <option value="Chờ duyệt">Chờ duyệt</option>
                                <option value="Đã hủy">Đã hủy</option>
                            </select>
                        </div>

                        {/* Nút đặt lại bộ lọc */}
                        <button
                            onClick={() => {
                                setFilterType('ALL')
                                setFilterStatus('ALL')
                                setFilterMonth((today.getMonth() + 1).toString())
                                setFilterYear(today.getFullYear().toString())
                                setSearchTerm('')
                                fetchAllData()
                            }}
                            className="w-full lg:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                        >
                            Đặt lại bộ lọc
                        </button>
                    </div>
                </div>
                {isLoading ? (
                    <div className="text-center py-16 text-slate-400 font-bold flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tải dữ liệu từ cơ sở dữ liệu...</span>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 font-bold">
                        Không có phiếu chi nào được tìm thấy.
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 text-slate-500 font-bold text-sm border-b border-slate-100">
                                    <th className="py-4 px-4 text-center whitespace-nowrap">Mã phiếu</th>
                                    <th className="py-4 px-4 text-left whitespace-nowrap">Loại phiếu chi</th>
                                    <th className="py-4 px-4 text-right whitespace-nowrap">Tổng tiền</th>
                                    <th className="py-4 px-4 text-center whitespace-nowrap">Hình thức</th>
                                    <th className="py-4 px-4 text-left whitespace-nowrap">Người nhận</th>
                                    <th className="py-4 px-4 text-left whitespace-nowrap">Người lập</th>
                                    <th className="py-4 px-4 text-left whitespace-nowrap">Nội dung</th>
                                    <th className="py-4 px-4 text-center whitespace-nowrap">Ngày chi</th>
                                    <th className="py-4 px-4 text-center whitespace-nowrap">Trạng thái</th>
                                    <th className="py-4 px-4 text-center whitespace-nowrap">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentItems.map((row) => (
                                    <tr key={row.ma_phieu_chi} className="hover:bg-slate-50/50 transition-all font-medium text-slate-600 text-sm">
                                        <td className="py-4 px-4 text-center font-bold text-slate-800 whitespace-nowrap">{row.ma_phieu_chi}</td>
                                        <td className="py-4 px-4 text-left whitespace-nowrap">
                                            {row.loai_phieu_chi === 'LUONG' ? (
                                                <span className="px-2.5 py-1 text-sm font-bold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 whitespace-nowrap">Lương nhân sự</span>
                                            ) : row.loai_phieu_chi === 'MARKETING' ? (
                                                <span className="px-2.5 py-1 text-sm font-bold bg-purple-50 text-purple-600 rounded-full border border-purple-100 whitespace-nowrap">Marketing</span>
                                            ) : (
                                                <span className="px-2.5 py-1 text-sm font-bold bg-blue-50 text-blue-600 rounded-full border border-blue-100 whitespace-nowrap">Chi khác</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-slate-800 whitespace-nowrap">{formatCurrency(row.tong_tien)}</td>
                                        <td className="py-4 px-4 text-center whitespace-nowrap">{row.hinh_thuc_chi || 'N/A'}</td>
                                        <td className="py-4 px-4 text-left font-bold text-slate-800 whitespace-nowrap">{row.nguoi_nhan || 'N/A'}</td>
                                        <td className="py-4 px-4 text-left whitespace-nowrap">{row.nhan_su?.ho_ten || 'Không rõ'}</td>
                                        <td className="py-4 px-4 text-left min-w-[200px] max-w-md break-words whitespace-normal text-slate-600" title={row.noi_dung || ''}>
                                            {row.noi_dung || <span className="text-slate-300 italic">Không có mô tả</span>}
                                        </td>
                                        <td className="py-4 px-4 text-center font-bold text-slate-500 whitespace-nowrap">
                                            {row.ngay_chi ? new Date(row.ngay_chi).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : <span className="text-slate-300 italic">-</span>}
                                        </td>
                                        <td className="py-4 px-4 text-center whitespace-nowrap">
                                            {row.trang_thai === 'Đã chi' ? (
                                                <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600"><FaCheckCircle /> Đã chi</span>
                                            ) : row.trang_thai === 'Chờ duyệt' ? (
                                                <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-500"><FaHourglassHalf /> Chờ duyệt</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-sm font-bold text-rose-500"><FaTimesCircle /> Đã hủy</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center whitespace-nowrap">
                                            <div className="flex justify-center gap-2 items-center">
                                                {row.trang_thai === 'Chờ duyệt' && (
                                                    <button
                                                        onClick={() => handleApproveClick(row.ma_phieu_chi)}
                                                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold rounded-lg transition active:scale-90 text-sm flex items-center gap-1 border border-emerald-200 cursor-pointer"
                                                        title="Phê duyệt phiếu chi"
                                                    >
                                                        <FaCheckCircle size={12} />
                                                        <span>Duyệt</span>
                                                    </button>
                                                )}
                                                {row.trang_thai !== 'Đã chi' ? (
                                                    <>
                                                        <button
                                                            onClick={() => openModalForEdit(row)}
                                                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-100 rounded-lg transition active:scale-90 cursor-pointer"
                                                            title="Sửa phiếu chi"
                                                        >
                                                            <FaEdit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(row.ma_phieu_chi)}
                                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition active:scale-90 cursor-pointer"
                                                            title="Xóa phiếu chi"
                                                        >
                                                            <FaTrash size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm" title="Phiếu chi đã hoàn tất và được khóa">
                                                        <FaLock size={10} />
                                                        <span>Đã khóa</span>
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Footer */}
                {!isLoading && filteredData.length > 0 && (
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
                        <div className="text-sm font-[500] text-gray-500 tracking-wider">
                            Hiển thị <span className="text-blue-500 font-[700]">{indexOfFirstItem + 1}</span> - <span className="text-blue-500 font-[700]">{Math.min(indexOfLastItem, filteredData.length)}</span> của <span className="text-gray-900 font-[700]">{filteredData.length}</span> phiếu chi
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3.5 py-2 text-sm font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                Trước
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                <button
                                    key={n}
                                    onClick={() => paginate(n)}
                                    className={`px-3.5 py-2 text-sm font-bold rounded-lg border ${currentPage === n ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' : 'text-slate-500 border-slate-200 hover:bg-white'}`}
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3.5 py-2 text-sm font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Premium Add / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
                    <div className="bg-white rounded-lg w-full max-w-4xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    {editingId ? 'Cập nhật phiếu chi' : 'Thêm mới phiếu chi'}
                                </h2>
                                <p className="text-sm font-medium text-red-500 mt-1">Lưu ý nhập các thông tin chính xác phục vụ báo cáo kế toán</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar text-slate-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-5">
                                    {/* Loại phiếu chi */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-slate-600">Loại chi phí *</label>
                                        <select
                                            name="loai_phieu_chi"
                                            value={formData.loai_phieu_chi}
                                            onChange={handleChange}
                                            className="w-full border border-slate-200 focus:border-blue-500 rounded-lg px-4 py-2.5 outline-none bg-white cursor-pointer font-bold text-slate-600"
                                        >
                                            <option value="KHAC">Chi khác</option>
                                            <option value="LUONG">Chi trả lương nhân sự</option>
                                            <option value="MARKETING">Chi Marketing</option>
                                        </select>
                                    </div>

                                    {/* Conditional fields based on type */}
                                    {formData.loai_phieu_chi === 'LUONG' && (
                                        <div className="flex flex-col gap-1.5" ref={bangLuongDropdownRef}>
                                            <label className="text-sm font-bold text-slate-600">Chọn Bảng Lương *</label>
                                            <div className="relative">
                                                <div
                                                    onClick={() => setIsBangLuongDropdownOpen(!isBangLuongDropdownOpen)}
                                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white flex justify-between items-center cursor-pointer hover:border-blue-500 font-medium text-sm"
                                                >
                                                    <span className="truncate">
                                                        {formData.ma_bang_luong
                                                            ? `Bảng lương tháng ${bangLuongList.find(bl => bl.ma_bang_luong.toString() === formData.ma_bang_luong)?.ky_luong} (${formatCurrency(Number(bangLuongList.find(bl => bl.ma_bang_luong.toString() === formData.ma_bang_luong)?.tong_so_tien))})`
                                                            : '-- Chọn bảng lương đã chốt --'}
                                                    </span>
                                                    <span className="text-slate-400 text-sm">▼</span>
                                                </div>
                                                {isBangLuongDropdownOpen && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                                                        {bangLuongList.length === 0 ? (
                                                            <div className="p-3 text-sm text-slate-400 italic text-center">Không có bảng lương nào</div>
                                                        ) : (
                                                            bangLuongList.map(bl => {
                                                                const isAlreadyPaid = bl.phieu_chi && bl.phieu_chi.ma_phieu_chi.toString() !== formData.ma_phieu_chi;
                                                                return (
                                                                    <div
                                                                        key={bl.ma_bang_luong}
                                                                        onClick={() => {
                                                                            if (isAlreadyPaid) return;
                                                                            setFormData(prev => ({ ...prev, ma_bang_luong: bl.ma_bang_luong.toString() }))
                                                                            setIsBangLuongDropdownOpen(false)
                                                                        }}
                                                                        className={`p-3 text-sm flex justify-between items-center ${isAlreadyPaid ? 'opacity-40 cursor-not-allowed bg-slate-50' : 'cursor-pointer hover:bg-blue-50/50'} ${formData.ma_bang_luong === bl.ma_bang_luong.toString() ? 'bg-blue-50 font-bold text-blue-600' : 'text-slate-700'}`}
                                                                    >
                                                                        <span>Bảng lương tháng {bl.ky_luong}</span>
                                                                        <span className="font-bold">{formatCurrency(bl.tong_so_tien)} {isAlreadyPaid && '(Đã chi)'}</span>
                                                                    </div>
                                                                )
                                                            })
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {formData.loai_phieu_chi === 'MARKETING' && (
                                        <div className="flex flex-col gap-1.5" ref={marketingDropdownRef}>
                                            <label className="text-sm font-bold text-slate-600">Chọn Chiến dịch Marketing *</label>
                                            <div className="relative">
                                                <div
                                                    onClick={() => setIsMarketingDropdownOpen(!isMarketingDropdownOpen)}
                                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white flex justify-between items-center cursor-pointer hover:border-blue-500 font-medium text-sm"
                                                >
                                                    <span className="truncate">
                                                        {formData.ma_chuong_trinh_marketing
                                                            ? marketingList.find(m => m.ma_chuong_trinh_marketing.toString() === formData.ma_chuong_trinh_marketing)?.ten_chuong_trinh_marketing
                                                            : '-- Chọn chiến dịch marketing --'}
                                                    </span>
                                                    <span className="text-slate-400 text-sm">▼</span>
                                                </div>
                                                {isMarketingDropdownOpen && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto custom-scrollbar">
                                                        {marketingList.length === 0 ? (
                                                            <div className="p-3 text-sm text-slate-400 italic text-center">Không có chiến dịch nào</div>
                                                        ) : (
                                                            marketingList.map(m => {
                                                                const budget = m.ngan_sach || 0;
                                                                const spent = m.da_chi || 0;
                                                                return (
                                                                    <div
                                                                        key={m.ma_chuong_trinh_marketing}
                                                                        onClick={() => {
                                                                            setFormData(prev => ({ ...prev, ma_chuong_trinh_marketing: m.ma_chuong_trinh_marketing.toString() }))
                                                                            setIsMarketingDropdownOpen(false)
                                                                        }}
                                                                        className={`p-3 text-sm cursor-pointer hover:bg-blue-50/50 border-b border-slate-50 last:border-b-0 flex flex-col gap-0.5 transition ${formData.ma_chuong_trinh_marketing === m.ma_chuong_trinh_marketing.toString() ? 'bg-blue-50 font-bold text-blue-600' : 'text-slate-700'}`}
                                                                    >
                                                                        <span className="font-bold text-slate-800">{m.ten_chuong_trinh_marketing}</span>
                                                                        <div className="flex items-center gap-2.5 text-sm text-slate-400 font-medium">
                                                                            <span>Ngân sách: <strong className="text-slate-600">{formatCurrency(budget)}</strong></span>
                                                                            <span>•</span>
                                                                            <span>Đã chi: <strong className="text-red-600">{formatCurrency(spent)}</strong></span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Thống kê ngân sách chiến dịch trực quan */}
                                            {formData.ma_chuong_trinh_marketing && (() => {
                                                const campaign = marketingList.find(m => m.ma_chuong_trinh_marketing.toString() === formData.ma_chuong_trinh_marketing);
                                                if (!campaign) return null;
                                                const nganSach = campaign.ngan_sach || 0;

                                                // Tính toán số tiền đã chi trước đó (loại trừ phiếu chi hiện tại nếu đang sửa đổi và có trạng thái là Đã chi)
                                                let daChiTruoc = campaign.da_chi || 0;
                                                if (editingId) {
                                                    const currentPhieu = data.find(p => p.ma_phieu_chi === editingId);
                                                    if (currentPhieu &&
                                                        currentPhieu.ma_chuong_trinh_marketing?.toString() === formData.ma_chuong_trinh_marketing &&
                                                        currentPhieu.trang_thai === 'Đã chi') {
                                                        daChiTruoc = Math.max(0, daChiTruoc - Number(currentPhieu.tong_tien));
                                                    }
                                                }

                                                const phieuNay = Number(formData.tong_tien) || 0;
                                                const tongDuKien = daChiTruoc + phieuNay;
                                                const conLai = nganSach - tongDuKien;
                                                const phanTramDaChi = nganSach > 0 ? Math.min((tongDuKien / nganSach) * 100, 100) : 0;

                                                return (
                                                    <div className="mt-2.5 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-sm">
                                                        <div className="flex items-center justify-between text-sm font-bold text-gray-700 tracking-wider">
                                                            <span className="flex items-center gap-1.5"><FaBullhorn className="text-purple-500" /> Ngân sách chiến dịch</span>
                                                            <span className="text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200/60 shadow-sm font-bold text-[14px] whitespace-nowrap">{formatCurrency(nganSach)}</span>
                                                        </div>

                                                        {/* Các hàng thông số rộng rãi không lo bị nhảy chữ */}
                                                        <div className="space-y-2">
                                                            <div className="bg-white px-3.5 py-2.5 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between">
                                                                <span className="text-gray-500 text-[14px] font-bold tracking-wider">Đã chi trước đó</span>
                                                                <span className="text-[15px] font-bold text-slate-600 whitespace-nowrap">{formatCurrency(daChiTruoc)}</span>
                                                            </div>
                                                            <div className="bg-white px-3.5 py-2.5 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between">
                                                                <span className="text-gray-500 text-[14px] font-bold tracking-wider">Phiếu chi này</span>
                                                                <span className="text-[15px] font-bold text-blue-600 whitespace-nowrap">{formatCurrency(phieuNay)}</span>
                                                            </div>
                                                            <div className="bg-white px-3.5 py-2.5 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between">
                                                                <span className="text-gray-500 text-[14px] font-bold tracking-wider">Còn lại</span>
                                                                <span className={`text-[15px] font-bold whitespace-nowrap ${conLai < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                                    {formatCurrency(conLai)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {nganSach > 0 && (
                                                            <div className="space-y-3.5 bg-white p-3.5 rounded-lg border border-slate-100 shadow-sm">
                                                                <div className="flex flex-col gap-2 text-[14px] font-bold text-gray-500">
                                                                    <div className="flex items-center justify-between">
                                                                        <span>Dự kiến chi tiêu:</span>
                                                                        <span className="text-slate-700 font-bold whitespace-nowrap">{formatCurrency(tongDuKien)}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span>Trạng thái ngân sách:</span>
                                                                        <span className={`whitespace-nowrap font-bold ${tongDuKien > nganSach ? 'text-red-600 animate-pulse' : 'text-gray-500'}`}>
                                                                            {((tongDuKien / nganSach) * 100).toFixed(1)}% {tongDuKien > nganSach ? '(Vượt ngân sách!)' : '(An toàn)'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all duration-500 ${tongDuKien > nganSach ? 'bg-rose-500 animate-pulse' : tongDuKien >= nganSach * 0.8 ? 'bg-amber-500' : 'bg-blue-600'}`}
                                                                        style={{ width: `${phanTramDaChi}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    {/* Số tiền chi */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-slate-600">Tổng số tiền chi (VNĐ) *</label>
                                        <input
                                            type="number"
                                            name="tong_tien"
                                            value={formData.tong_tien}
                                            onChange={handleChange}
                                            placeholder="Nhập số tiền chi..."
                                            disabled={formData.loai_phieu_chi === 'LUONG'}
                                            className={`w-full border rounded-lg px-4 py-2.5 outline-none font-bold text-slate-800 ${formData.loai_phieu_chi === 'LUONG' ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 'border-slate-200 focus:border-blue-500'}`}
                                        />
                                    </div>

                                    {/* Hình thức thanh toán */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-slate-600">Hình thức chi *</label>
                                        <select
                                            name="hinh_thuc_chi"
                                            value={formData.hinh_thuc_chi}
                                            onChange={handleChange}
                                            className="w-full border border-slate-200 focus:border-blue-500 rounded-lg px-4 py-2.5 outline-none bg-white cursor-pointer font-bold text-slate-600"
                                        >
                                            <option value="Chuyển khoản">Chuyển khoản ngân hàng</option>
                                            <option value="Tiền mặt">Tiền mặt</option>
                                            <option value="Thẻ tín dụng">Thẻ tín dụng doanh nghiệp</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-5">
                                    {/* Tên người nhận */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-slate-600">Tên người nhận tiền *</label>
                                        <input
                                            type="text"
                                            name="nguoi_nhan"
                                            value={formData.nguoi_nhan}
                                            onChange={handleChange}
                                            placeholder="Tên nhân viên, đối tác, nhà cung cấp..."
                                            disabled={formData.loai_phieu_chi === 'LUONG'}
                                            className={`w-full border rounded-lg px-4 py-2.5 outline-none font-medium text-slate-850 ${formData.loai_phieu_chi === 'LUONG' ? 'bg-slate-50 border-slate-200 text-gray-500 cursor-not-allowed' : 'border-slate-200 focus:border-blue-500'}`}
                                        />
                                    </div>

                                    {/* Người lập phiếu */}
                                    <div className="flex flex-col gap-1.5" ref={nhanSuDropdownRef}>
                                        <label className="text-sm font-bold text-slate-600">Người lập phiếu *</label>
                                        <div className="relative">
                                            <div
                                                onClick={() => setIsNhanSuDropdownOpen(!isNhanSuDropdownOpen)}
                                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white flex justify-between items-center cursor-pointer hover:border-blue-500 font-medium text-sm"
                                            >
                                                <span className="truncate">
                                                    {formData.ma_nhan_su
                                                        ? nhanSuList.find(ns => ns.ma_nhan_su.toString() === formData.ma_nhan_su)?.ho_ten
                                                        : '-- Chọn nhân sự lập phiếu --'}
                                                </span>
                                                <span className="text-slate-400 text-sm">▼</span>
                                            </div>
                                            {isNhanSuDropdownOpen && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                                                    {nhanSuList.map(ns => (
                                                        <div
                                                            key={ns.ma_nhan_su}
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, ma_nhan_su: ns.ma_nhan_su.toString() }))
                                                                setIsNhanSuDropdownOpen(false)
                                                            }}
                                                            className={`p-3 text-sm cursor-pointer hover:bg-blue-50/50 ${formData.ma_nhan_su === ns.ma_nhan_su.toString() ? 'bg-blue-50 font-bold text-blue-600' : 'text-slate-700'}`}
                                                        >
                                                            {ns.ho_ten}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Trạng thái duyệt chi */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-slate-600">Trạng thái phiếu *</label>
                                        {formData.trang_thai === 'Đã chi' ? (
                                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2.5 rounded-lg border border-emerald-100 w-fit">
                                                <FaCheckCircle /> Đã chi (Đã duyệt)
                                            </div>
                                        ) : (
                                            <div className="flex gap-4 py-2">
                                                {['Đã chi', 'Chờ duyệt', 'Đã hủy'].map(status => (
                                                    <label key={status} className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-600">
                                                        <input
                                                            type="radio"
                                                            name="trang_thai"
                                                            value={status}
                                                            checked={formData.trang_thai === status}
                                                            onChange={handleChange}
                                                            className="w-4 h-4 text-blue-600 cursor-pointer"
                                                        />
                                                        <span>{status}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Ngày chi */}
                                    <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                                        <label className="text-sm font-bold text-slate-600">Ngày chi *</label>
                                        <input
                                            type="date"
                                            name="ngay_chi"
                                            value={formData.ngay_chi || ''}
                                            onChange={handleChange}
                                            className="w-full border border-slate-200 focus:border-blue-500 rounded-lg px-4 py-2.5 outline-none font-bold text-slate-800 text-sm"
                                        />
                                    </div>

                                    {/* Nội dung / Diễn giải */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-slate-600">Nội dung chi tiết</label>
                                        <textarea
                                            name="noi_dung"
                                            value={formData.noi_dung}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Nội dung chi tiết lý do chi tiền..."
                                            className="w-full border border-slate-200 focus:border-blue-500 rounded-lg px-4 py-2.5 outline-none font-medium text-slate-800 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error Alert inside Modal */}
                        {formError && (
                            <div className="mx-6 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700 shrink-0">
                                {formError}
                            </div>
                        )}

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 border border-slate-200 text-slate-600 bg-white rounded-lg hover:bg-slate-50 font-bold transition active:scale-95 text-sm cursor-pointer"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSavePhieuChi}
                                disabled={isSubmitting}
                                className={`flex items-center gap-2 px-6 py-2.5 text-white rounded-lg font-bold shadow-lg transition active:scale-95 text-sm ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 cursor-pointer'}`}
                            >
                                <FaSave /> {isSubmitting ? 'Đang xử lý...' : (editingId ? 'Cập nhật phiếu chi' : 'Lưu phiếu chi')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Alert */}
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                    autoClose={3000}
                />
            )}

            {/* Custom Confirm Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Xác nhận xóa phiếu chi"
                message="Bạn có chắc chắn muốn xóa phiếu chi này không? Bản ghi này sẽ bị xóa vĩnh viễn khỏi sổ sách kế toán."
                onConfirm={handleConfirmDelete}
                onClose={() => setConfirmDelete({ isOpen: false, id: null })}
                type="danger"
            />
        </div>
    )
}

export default function PhieuChiPage() {
    return (
        <Suspense fallback={
            <div className="bg-slate-50 min-h-screen p-6 md:p-8 text-slate-850 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <PhieuChiContent />
        </Suspense>
    )
}
