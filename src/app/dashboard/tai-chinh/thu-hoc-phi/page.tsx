'use client'

import Alert from '@/components/Alert'
import ConfirmModal from '@/components/ConfirmModal'
import { useState, useEffect, useRef } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaChalkboardTeacher, FaArrowLeft } from 'react-icons/fa'

interface PhieuThu {
    ma_phieu_thu: number
    so_tien: number
    ngay_thu: string
    noi_dung: string
    ma_hoc_vien: number
    ma_nhan_su: number
    ma_khoa_hoc: number
    ma_khuyen_mai?: number | null
    hoc_vien?: { ho_ten: string }
    nhan_su?: { ho_ten: string }
    khoa_hoc?: { ma_khoa_hoc: number, ten_khoa_hoc: string, hoc_phi: number } | null
    khuyen_mai?: { ma_khuyen_mai: number, ten_chuong_trinh: string, phan_tram_giam: number } | null
}

interface NhanSu {
    ma_nhan_su: number
    ho_ten: string
}

interface HocVien {
    ma_hoc_vien: number
    ho_ten: string
}

interface KhoaHoc {
    ma_khoa_hoc: number
    ten_khoa_hoc: string
    hoc_phi: number
}

interface KhuyenMai {
    ma_khuyen_mai: number
    ten_chuong_trinh: string
    phan_tram_giam: number
}

interface ThamGiaLop {
    ma_tham_gia_lop: number
    ma_hoc_vien: number
    hoc_vien: {
        ma_hoc_vien: number
        ho_ten: string
    }
}

interface LopHoc {
    ma_lop_hoc: number
    ten_lop: string
    si_so_toi_da?: number | null
    ma_khoa_hoc: number
    khoa_hoc: {
        ma_khoa_hoc: number
        ten_khoa_hoc: string
        hoc_phi: number
    }
    tham_gia: ThamGiaLop[]
}

export default function PhieuThuHocPhiPage() {
    const [data, setData] = useState<PhieuThu[]>([])
    const [nhanSuList, setNhanSuList] = useState<NhanSu[]>([])
    const [hocVienList, setHocVienList] = useState<HocVien[]>([])
    const [khoaHocList, setKhoaHocList] = useState<KhoaHoc[]>([])
    const [khuyenMaiList, setKhuyenMaiList] = useState<KhuyenMai[]>([])
    const [lopHocList, setLopHocList] = useState<LopHoc[]>([])
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
    const [classSearchQuery, setClassSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [filterCourseId, setFilterCourseId] = useState<string>('')
    const [filterStaffId, setFilterStaffId] = useState<string>('')
    const [filterStartDate, setFilterStartDate] = useState<string>('')
    const [filterEndDate, setFilterEndDate] = useState<string>('')
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isNhanSuDropdownOpen, setIsNhanSuDropdownOpen] = useState(false)
    const nhanSuDropdownRef = useRef<HTMLDivElement>(null)
    const [isKhoaHocDropdownOpen, setIsKhoaHocDropdownOpen] = useState(false)
    const khoaHocDropdownRef = useRef<HTMLDivElement>(null)
    const [isKhuyenMaiDropdownOpen, setIsKhuyenMaiDropdownOpen] = useState(false)
    const khuyenMaiDropdownRef = useRef<HTMLDivElement>(null)
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null,
    })

    const [formData, setFormData] = useState({
        ma_phieu_thu: '',
        so_tien: '',
        ngay_thu: '',
        ma_hoc_vien: '',
        ma_nhan_su: '',
        noi_dung: '',
        ten_hoc_vien: '',
        ma_khoa_hoc: '',
        ma_khuyen_mai: '',
    })
    const [formError, setFormError] = useState<string | null>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const getFilteredData = () => {
        let result = data
        if (selectedClassId === -1) {
            result = data.filter(row => {
                return !lopHocList.some(lop =>
                    lop.ma_khoa_hoc === row.ma_khoa_hoc &&
                    lop.tham_gia.some(tg => tg.ma_hoc_vien === row.ma_hoc_vien)
                )
            })
        } else if (selectedClassId !== null) {
            const selectedClass = lopHocList.find(c => c.ma_lop_hoc === selectedClassId)
            if (selectedClass) {
                const studentIds = selectedClass.tham_gia.map(tg => tg.ma_hoc_vien)
                result = data.filter(row => studentIds.includes(row.ma_hoc_vien) && row.ma_khoa_hoc === selectedClass.ma_khoa_hoc)
            }
        }

        // Áp dụng bộ lọc nâng cao
        if (filterCourseId) {
            result = result.filter(row => row.ma_khoa_hoc?.toString() === filterCourseId)
        }
        if (filterStaffId) {
            result = result.filter(row => row.ma_nhan_su?.toString() === filterStaffId)
        }
        if (filterStartDate) {
            result = result.filter(row => new Date(row.ngay_thu).getTime() >= new Date(filterStartDate).getTime())
        }
        if (filterEndDate) {
            const end = new Date(filterEndDate)
            end.setHours(23, 59, 59, 999)
            result = result.filter(row => new Date(row.ngay_thu).getTime() <= end.getTime())
        }

        return result
    }
    const filteredData = getFilteredData()

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    useEffect(() => {
        setCurrentPage(1)
    }, [selectedClassId, filterCourseId, filterStaffId, filterStartDate, filterEndDate])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [phieuThuRes, nhanSuRes, hocVienRes, khoaHocRes, khuyenMaiRes, lopHocRes] = await Promise.all([
                    fetch('/api/tai-chinh/phieu-thu'),
                    fetch('/api/tai-chinh/nhan-vien'),
                    fetch('/api/dao-tao/hoc-vien'),
                    fetch('/api/tai-chinh/khoa-hoc'),
                    fetch('/api/tai-chinh/khuyen-mai'),
                    fetch('/api/tai-chinh/lop-hoc'),
                ])
                if (phieuThuRes.ok) {
                    const result = await phieuThuRes.json()
                    setData(result)
                }
                if (nhanSuRes.ok) {
                    const resultNs = await nhanSuRes.json()
                    setNhanSuList(resultNs)
                }
                if (hocVienRes.ok) {
                    const resultHv = await hocVienRes.json()
                    setHocVienList(Array.isArray(resultHv) ? resultHv : (resultHv.data ?? []))
                }
                if (khoaHocRes.ok) {
                    const resultKh = await khoaHocRes.json()
                    setKhoaHocList(resultKh)
                }
                if (khuyenMaiRes.ok) {
                    const resultKm = await khuyenMaiRes.json()
                    setKhuyenMaiList(resultKm)
                }
                if (lopHocRes.ok) {
                    const resultLh = await lopHocRes.json()
                    setLopHocList(resultLh)
                }
            } catch (error) {
                console.error('Lỗi fetch API:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (!formData.ma_hoc_vien || editingId) return

        // Tìm các phiếu thu trước đây của học sinh này
        const previousPayments = data.filter(pt => pt.ma_hoc_vien.toString() === formData.ma_hoc_vien)
        if (previousPayments.length === 0) return

        // Lấy phiếu thu gần nhất (sắp xếp giảm dần theo ngày thu từ backend)
        const latestPayment = previousPayments[0]

        setFormData(prev => {
            const nextState = { ...prev }
            let updated = false

            if (!prev.ma_khoa_hoc && latestPayment.ma_khoa_hoc) {
                nextState.ma_khoa_hoc = latestPayment.ma_khoa_hoc.toString()
                updated = true
            }

            if (!prev.ma_khuyen_mai && latestPayment.ma_khuyen_mai) {
                nextState.ma_khuyen_mai = latestPayment.ma_khuyen_mai.toString()
                updated = true
            }

            return updated ? nextState : prev
        })
    }, [formData.ma_hoc_vien, data, editingId])

    useEffect(() => {
        if (!formData.ma_khoa_hoc) return

        const khoaHoc = khoaHocList.find(kh => kh.ma_khoa_hoc.toString() === formData.ma_khoa_hoc)
        if (!khoaHoc) return

        // 1. Tìm khuyến mãi cũ từ các đợt đóng trước của học viên cho khóa học này
        const previousPayments = data.filter(pt =>
            pt.ma_hoc_vien.toString() === formData.ma_hoc_vien &&
            pt.ma_khoa_hoc.toString() === formData.ma_khoa_hoc &&
            (editingId ? pt.ma_phieu_thu !== editingId : true)
        )
        const firstPaymentWithPromo = previousPayments.find(pt => pt.ma_khuyen_mai)
        const inheritedPromoId = firstPaymentWithPromo ? firstPaymentWithPromo.ma_khuyen_mai?.toString() || '' : ''


        setFormData(prev => {
            if (inheritedPromoId && !prev.ma_khuyen_mai) {
                return { ...prev, ma_khuyen_mai: inheritedPromoId }
            }
            return prev
        })
    }, [formData.ma_hoc_vien, formData.ma_khoa_hoc, formData.ma_khuyen_mai, khoaHocList, khuyenMaiList, data, editingId])

    const initialSearchMountRef = useRef(true)

    useEffect(() => {
        if (initialSearchMountRef.current) {
            initialSearchMountRef.current = false
            return
        }

        if (formData.ten_hoc_vien === '') {
            const fetchAllData = async () => {
                try {
                    const response = await fetch('/api/tai-chinh/phieu-thu')
                    if (response.ok) {
                        const result = await response.json()
                        setData(result)
                        setCurrentPage(1)
                    }
                } catch (error) {
                    console.error('Lỗi khi tải tất cả dữ liệu:', error)
                }
            }
            fetchAllData()
        }
    }, [formData.ten_hoc_vien])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (nhanSuDropdownRef.current && !nhanSuDropdownRef.current.contains(event.target as Node)) {
                setIsNhanSuDropdownOpen(false)
            }
            if (khoaHocDropdownRef.current && !khoaHocDropdownRef.current.contains(event.target as Node)) {
                setIsKhoaHocDropdownOpen(false)
            }
            if (khuyenMaiDropdownRef.current && !khuyenMaiDropdownRef.current.contains(event.target as Node)) {
                setIsKhuyenMaiDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if (isLoading) return

        const params = new URLSearchParams(window.location.search)
        const maHocVienParam = params.get('ma_hoc_vien')
        if (maHocVienParam) {
            setIsModalOpen(true)
            setFormData({
                ma_phieu_thu: '',
                so_tien: '',
                ngay_thu: new Date().toISOString().split('T')[0],
                ma_hoc_vien: maHocVienParam,
                noi_dung: '',
                ma_nhan_su: '',
                ten_hoc_vien: '',
                ma_khoa_hoc: '',
                ma_khuyen_mai: '',
            })
            // Xóa tham số khỏi URL
            window.history.replaceState(null, '', window.location.pathname)
        }
    }, [isLoading])

    const showAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormError(null)
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // === HÀM HỦY SỬA (Làm sạch form) ===
    const handleCancelEdit = () => {
        setFormData({
            ma_phieu_thu: '',
            so_tien: '',
            ngay_thu: '',
            ma_hoc_vien: '',
            ma_nhan_su: '',
            noi_dung: '',
            ten_hoc_vien: '',
            ma_khoa_hoc: '',
            ma_khuyen_mai: '',
        })
        setFormError(null)
        setEditingId(null)
    }

    const handleDeleteClick = (id: number) => {
        setConfirmDelete({ isOpen: true, id: id })
    }

    // === HÀM BẤM NÚT XÓA Ở TỪNG DÒNG ===
    const handleConfirmDelete = async () => {
        if (!confirmDelete.id) return

        try {
            const response = await fetch(`/api/tai-chinh/phieu-thu?id=${confirmDelete.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setData(data.filter((item) => item.ma_phieu_thu !== confirmDelete.id))
                showAlert('Đã xóa phiếu thu thành công!', 'success')
            } else {
                showAlert('Có lỗi xảy ra khi xóa.', 'error')
            }
        } catch (error) {
            console.error('Lỗi xóa:', error)
            showAlert('Không thể kết nối đến máy chủ.', 'error')
        }
    }

    const handleSavePhieuThu = async () => {
        if (isSubmitting) return
        if (
            !formData.so_tien ||
            !formData.ngay_thu ||
            !formData.ma_hoc_vien ||
            !formData.ma_nhan_su ||
            !formData.ma_khoa_hoc
        ) {
            setFormError('Vui lòng nhập đầy đủ thông tin!')
            return
        }

        if (isNaN(Number(formData.ma_hoc_vien)) || isNaN(Number(formData.ma_nhan_su))) {
            setFormError('Mã học viên và mã nhân sự phải là số.')
            return
        }

        setFormError(null)

        setIsSubmitting(true)
        try {
            const method = editingId ? 'PUT' : 'POST'

            const response = await fetch('/api/tai-chinh/phieu-thu', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const savedPhieuThu = await response.json()

                if (editingId) {
                    setData(
                        data.map((item) =>
                            item.ma_phieu_thu === savedPhieuThu.ma_phieu_thu ? savedPhieuThu : item,
                        ),
                    )
                    showAlert('Cập nhật phiếu thu thành công!', 'success')
                    setIsModalOpen(false)
                } else {
                    setData([savedPhieuThu, ...data])
                    showAlert('Thêm phiếu thu thành công!', 'success')
                    setIsModalOpen(false)
                }

                handleCancelEdit()
            } else {
                const errorResponse = await response.json().catch(() => null)
                setFormError(
                    errorResponse?.error ||
                    `Có lỗi xảy ra khi ${editingId ? 'cập nhật' : 'thêm'} phiếu thu.`,
                )
            }
        } catch (error) {
            console.error('Lỗi:', error)
            setFormError('Không thể kết nối đến máy chủ.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (formData.ten_hoc_vien) params.append('ten_hoc_vien', formData.ten_hoc_vien)

            const response = await fetch(`/api/tai-chinh/phieu-thu?${params.toString()}`)
            if (response.ok) {
                const result = await response.json()
                setData(result)
                setCurrentPage(1)
            }
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        handleCancelEdit()
    }

    const openModalForAdd = () => {
        const selectedClass = lopHocList.find(c => c.ma_lop_hoc === selectedClassId)
        setIsModalOpen(true)
        setFormData({
            ma_phieu_thu: '',
            so_tien: '',
            ngay_thu: new Date().toISOString().split('T')[0],
            ma_hoc_vien: '',
            noi_dung: '',
            ma_nhan_su: '',
            ten_hoc_vien: '',
            ma_khoa_hoc: selectedClass ? selectedClass.ma_khoa_hoc.toString() : '',
            ma_khuyen_mai: '',
        })
    }

    const openModalForEdit = (row: PhieuThu) => {
        const formattedDate = new Date(row.ngay_thu).toISOString().split('T')[0]
        setFormData({
            ma_phieu_thu: row.ma_phieu_thu.toString(),
            so_tien: row.so_tien.toString(),
            ngay_thu: formattedDate,
            ma_hoc_vien: row.ma_hoc_vien.toString(),
            ma_nhan_su: row.ma_nhan_su.toString(),
            noi_dung: row.noi_dung,
            ten_hoc_vien: row.hoc_vien?.ho_ten || '',
            ma_khoa_hoc: row.ma_khoa_hoc?.toString() || '',
            ma_khuyen_mai: row.ma_khuyen_mai?.toString() || '',
        })
        setEditingId(row.ma_phieu_thu)
        setIsModalOpen(true)
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm min-h-screen">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-1 uppercase">
                Quản lý phiếu thu học phí
            </h1>

            {/* Model */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50 transition-opacity p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl mx-auto shadow-lg flex flex-col max-h-[95vh]">
                        <div className="flex justify-between items-center p-5 border-b rounded-t-lg shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingId
                                    ? 'Cập nhật phiếu thu học phí'
                                    : 'Thêm mới phiếu thu học phí'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-red-500 cursor-pointer transition">
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
                                <div className="space-y-5">
                                    {editingId && (
                                        <div className="flex flex-col">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Mã phiếu thu
                                            </label>
                                            <input
                                                type="number"
                                                name="ma_phieu_thu"
                                                value={formData.ma_phieu_thu}
                                                onChange={handleChange}
                                                placeholder={editingId ? 'Đang sửa đổi...' : ''}
                                                disabled={editingId !== null}
                                                className={`w-full border rounded p-2 focus:outline-blue-500 text-sm ${editingId ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-col">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Mã học viên <span className="text-red-500">*</span>
                                        </label>

                                        {/* Dropdown chọn nhanh học viên thuộc lớp đang chọn */}
                                        {(() => {
                                            const selectedClass = lopHocList.find(c => c.ma_lop_hoc === selectedClassId)
                                            if (!selectedClass || selectedClass.tham_gia.length === 0) return null
                                            return (
                                                <div className="mb-2.5 p-3 bg-blue-50/40 border border-blue-100/80 rounded-[8px]">
                                                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                                                        Chọn nhanh học viên trong lớp {selectedClass.ten_lop}:
                                                    </label>
                                                    <select
                                                        value={formData.ma_hoc_vien}
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    ma_hoc_vien: e.target.value
                                                                }))
                                                            }
                                                        }}
                                                        className="w-full border border-gray-300 rounded-[8px] p-2 text-sm bg-white text-slate-800 focus:outline-blue-500 cursor-pointer font-medium"
                                                    >
                                                        <option value="">-- Chọn học viên --</option>
                                                        {selectedClass.tham_gia.map(tg => (
                                                            <option key={tg.hoc_vien.ma_hoc_vien} value={tg.hoc_vien.ma_hoc_vien}>
                                                                {tg.hoc_vien.ho_ten} (Mã: {tg.hoc_vien.ma_hoc_vien})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )
                                        })()}

                                        <input
                                            type="number"
                                            name="ma_hoc_vien"
                                            value={formData.ma_hoc_vien}
                                            onChange={handleChange}
                                            placeholder="Nhập mã học viên..."
                                            className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-blue-500 text-sm"
                                        />
                                        {formData.ma_hoc_vien && (
                                            <div className="text-xs mt-1.5 font-semibold text-blue-600">
                                                {hocVienList.some(hv => hv.ma_hoc_vien.toString() === formData.ma_hoc_vien)
                                                    ? <span>{`Tên học viên: ${hocVienList.find(hv => hv.ma_hoc_vien.toString() === formData.ma_hoc_vien)?.ho_ten}`}</span>
                                                    : <span className="text-red-500">Không tìm thấy học viên</span>}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Số tiền thu <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="so_tien"
                                                value={formData.so_tien}
                                                onChange={handleChange}
                                                placeholder="Nhập số tiền thu học phí..."
                                                className="w-full border border-gray-300 rounded p-2 pr-12 font-semibold text-sm focus:outline-blue-500 text-slate-800"
                                            />
                                            <span className="absolute right-3 top-2.5 text-gray-400 text-xs font-bold">
                                                VNĐ
                                            </span>
                                        </div>
                                    </div>

                                    {(() => {
                                        if (!formData.ma_hoc_vien || !formData.ma_khoa_hoc) return null

                                        const previousPaymentsForCheck = data.filter(pt =>
                                            pt.ma_hoc_vien.toString() === formData.ma_hoc_vien &&
                                            pt.ma_khoa_hoc.toString() === formData.ma_khoa_hoc &&
                                            (editingId ? pt.ma_phieu_thu !== editingId : true)
                                        )
                                        const totalPaidBeforeCheck = previousPaymentsForCheck.reduce((sum, pt) => sum + Number(pt.so_tien), 0)

                                        const checkKhoaHoc = khoaHocList.find(kh => kh.ma_khoa_hoc.toString() === formData.ma_khoa_hoc)
                                        let checkFinalPrice = checkKhoaHoc ? Number(checkKhoaHoc.hoc_phi) : 0

                                        let promoId = formData.ma_khuyen_mai
                                        if (!promoId && previousPaymentsForCheck.length > 0) {
                                            const prevWithPromo = previousPaymentsForCheck.find(pt => pt.ma_khuyen_mai != null)
                                            if (prevWithPromo && prevWithPromo.ma_khuyen_mai != null) {
                                                promoId = prevWithPromo.ma_khuyen_mai.toString()
                                            }
                                        }

                                        let appliedDiscountPercent = 0
                                        let promoName = ""
                                        if (promoId) {
                                            const checkKhuyenMai = khuyenMaiList.find(km => km.ma_khuyen_mai.toString() === promoId)
                                            if (checkKhuyenMai) {
                                                appliedDiscountPercent = checkKhuyenMai.phan_tram_giam || 0
                                                promoName = checkKhuyenMai.ten_chuong_trinh
                                                checkFinalPrice = checkFinalPrice * (1 - appliedDiscountPercent / 100)
                                            }
                                        }

                                        const remainingDue = Math.max(0, checkFinalPrice - totalPaidBeforeCheck)

                                        return (
                                            <div className="w-full flex flex-col gap-2.5 p-4 bg-blue-50/30 border border-blue-100 rounded-[8px] text-sm text-slate-700 shadow-sm animate-fade-in">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-500 font-medium">Học phí gốc của khóa:</span>
                                                    <span className="font-semibold text-slate-700">
                                                        {checkKhoaHoc ? new Intl.NumberFormat('vi-VN').format(checkKhoaHoc.hoc_phi) : 0} đ
                                                    </span>
                                                </div>
                                                {appliedDiscountPercent > 0 && (
                                                    <div className="flex justify-between items-center text-emerald-600">
                                                        <span className="font-medium text-sm">Khuyến mãi áp dụng ({promoName}):</span>
                                                        <span className="font-semibold">-{appliedDiscountPercent}%</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-2">
                                                    <span className="text-slate-500 font-medium">Học phí thực tế phải nộp:</span>
                                                    <span className="font-semibold text-slate-800">
                                                        {new Intl.NumberFormat('vi-VN').format(checkFinalPrice)} đ
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-500 font-medium">Đã đóng trước đó:</span>
                                                    <span className="font-semibold text-emerald-600">
                                                        {new Intl.NumberFormat('vi-VN').format(totalPaidBeforeCheck)} đ
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center border-t border-slate-200/80 pt-2.5 font-semibold">
                                                    <span className="text-slate-800">Học phí còn thiếu:</span>
                                                    <span className={`${remainingDue > 0 ? 'text-rose-600' : 'text-green-600'} text-base font-bold`}>
                                                        {new Intl.NumberFormat('vi-VN').format(remainingDue)} đ
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })()}

                                    <div className="flex flex-col">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Ngày thu <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="ngay_thu"
                                            value={formData.ngay_thu}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded p-2 focus:outline-blue-500 text-sm [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Khóa học đăng ký <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative" ref={khoaHocDropdownRef}>
                                            <div
                                                className="w-full border border-gray-300 rounded p-2 bg-white flex justify-between items-center cursor-pointer hover:border-blue-500 text-sm text-slate-700"
                                                onClick={() => setIsKhoaHocDropdownOpen(!isKhoaHocDropdownOpen)}
                                            >
                                                <span className="truncate">
                                                    {formData.ma_khoa_hoc
                                                        ? khoaHocList.find(kh => kh.ma_khoa_hoc.toString() === formData.ma_khoa_hoc)?.ten_khoa_hoc || '-- Chọn khóa học --'
                                                        : '-- Chọn khóa học --'}
                                                </span>
                                                <span className="text-gray-400 text-xs">▼</span>
                                            </div>
                                            {isKhoaHocDropdownOpen && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                                                    <div
                                                        className="p-2 text-sm cursor-pointer hover:bg-blue-50 text-gray-500"
                                                        onClick={() => {
                                                            setFormData({ ...formData, ma_khoa_hoc: '' })
                                                            setFormError(null)
                                                            setIsKhoaHocDropdownOpen(false)
                                                        }}
                                                    >
                                                        -- Chọn khóa học --
                                                    </div>
                                                    {khoaHocList.map(kh => (
                                                        <div
                                                            key={kh.ma_khoa_hoc}
                                                            className={`p-2 text-sm cursor-pointer hover:bg-blue-50 ${formData.ma_khoa_hoc === kh.ma_khoa_hoc.toString() ? 'bg-blue-100 font-medium text-blue-700' : 'text-gray-700'}`}
                                                            onClick={() => {
                                                                setFormData({ ...formData, ma_khoa_hoc: kh.ma_khoa_hoc.toString() })
                                                                setFormError(null)
                                                                setIsKhoaHocDropdownOpen(false)
                                                            }}
                                                        >
                                                            {kh.ten_khoa_hoc}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {khuyenMaiList.length > 0 && (
                                        <div className="flex flex-col">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Khuyến mãi áp dụng
                                            </label>
                                            <div className="relative" ref={khuyenMaiDropdownRef}>
                                                <div
                                                    className="w-full border border-gray-300 rounded p-2 bg-white flex justify-between items-center cursor-pointer hover:border-blue-500 text-sm text-slate-700"
                                                    onClick={() => setIsKhuyenMaiDropdownOpen(!isKhuyenMaiDropdownOpen)}
                                                >
                                                    <span className="truncate">
                                                        {formData.ma_khuyen_mai
                                                            ? khuyenMaiList.find(km => km.ma_khuyen_mai.toString() === formData.ma_khuyen_mai)?.ten_chuong_trinh + ` (Giảm ${khuyenMaiList.find(km => km.ma_khuyen_mai.toString() === formData.ma_khuyen_mai)?.phan_tram_giam}%)` || '-- Không áp dụng khuyến mãi --'
                                                            : '-- Không áp dụng khuyến mãi --'}
                                                    </span>
                                                    <span className="text-gray-400 text-xs">▼</span>
                                                </div>
                                                {isKhuyenMaiDropdownOpen && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                                                        <div
                                                            className="p-2 text-sm cursor-pointer hover:bg-blue-50 text-gray-500"
                                                            onClick={() => {
                                                                setFormData({ ...formData, ma_khuyen_mai: '' })
                                                                setFormError(null)
                                                                setIsKhuyenMaiDropdownOpen(false)
                                                            }}
                                                        >
                                                            -- Không áp dụng khuyến mãi --
                                                        </div>
                                                        {khuyenMaiList.map(km => (
                                                            <div
                                                                key={km.ma_khuyen_mai}
                                                                className={`p-2 text-sm cursor-pointer hover:bg-blue-50 ${formData.ma_khuyen_mai === km.ma_khuyen_mai.toString() ? 'bg-blue-100 font-medium text-blue-700' : 'text-gray-700'}`}
                                                                onClick={() => {
                                                                    setFormData({ ...formData, ma_khuyen_mai: km.ma_khuyen_mai.toString() })
                                                                    setFormError(null)
                                                                    setIsKhuyenMaiDropdownOpen(false)
                                                                }}
                                                            >
                                                                {km.ten_chuong_trinh} (Giảm {km.phan_tram_giam}%)
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Người lập phiếu thu <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative" ref={nhanSuDropdownRef}>
                                            <div
                                                className="w-full border border-gray-300 rounded p-2 bg-white flex justify-between items-center cursor-pointer hover:border-blue-500 text-sm text-slate-700"
                                                onClick={() => setIsNhanSuDropdownOpen(!isNhanSuDropdownOpen)}
                                            >
                                                <span className="truncate">
                                                    {formData.ma_nhan_su
                                                        ? nhanSuList.find(ns => ns.ma_nhan_su.toString() === formData.ma_nhan_su)?.ho_ten || '-- Chọn người lập --'
                                                        : '-- Chọn người lập --'}
                                                </span>
                                                <span className="text-gray-400 text-xs">▼</span>
                                            </div>
                                            {isNhanSuDropdownOpen && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                                                    <div
                                                        className="p-2 text-sm cursor-pointer hover:bg-blue-50 text-gray-500"
                                                        onClick={() => {
                                                            setFormData({ ...formData, ma_nhan_su: '' })
                                                            setFormError(null)
                                                            setIsNhanSuDropdownOpen(false)
                                                        }}
                                                    >
                                                        -- Chọn người lập --
                                                    </div>
                                                    {nhanSuList.map(ns => (
                                                        <div
                                                            key={ns.ma_nhan_su}
                                                            className={`p-2 text-sm cursor-pointer hover:bg-blue-50 ${formData.ma_nhan_su === ns.ma_nhan_su.toString() ? 'bg-blue-100 font-medium text-blue-700' : 'text-gray-700'}`}
                                                            onClick={() => {
                                                                setFormData({ ...formData, ma_nhan_su: ns.ma_nhan_su.toString() })
                                                                setFormError(null)
                                                                setIsNhanSuDropdownOpen(false)
                                                            }}
                                                        >
                                                            {ns.ho_ten}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Nội dung chi tiết
                                        </label>
                                        <textarea
                                            name="noi_dung"
                                            value={formData.noi_dung}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Ghi chú thêm nội dung phiếu thu..."
                                            className="w-full border border-gray-300 rounded p-2 focus:outline-blue-500 resize-none text-sm text-slate-700"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {formError && (
                            <div className="mx-6 mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shrink-0">
                                {formError}
                            </div>
                        )}
                        <div className="p-5 border-t rounded-b-lg flex justify-end gap-3 shrink-0">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-100 font-medium transition cursor-pointer">
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSavePhieuThu}
                                disabled={isSubmitting}
                                className={`flex items-center gap-2 px-5 py-2 text-white rounded-md font-medium shadow-sm transition ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#1d4ed8] hover:bg-blue-700 cursor-pointer'}`}
                            >
                                <FaSave /> {isSubmitting ? 'Đang xử lý...' : (editingId ? 'Cập nhật' : 'Lưu phiếu thu')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* end model */}

            {/* Bộ lọc theo lớp học */}
            {selectedClassId === null ? (
                <div className="mb-6 bg-slate-50/50 p-4 border border-gray-100 rounded-[8px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                        <label className="text-sm font-semibold text-slate-700">
                            Chọn lớp học:
                        </label>
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Tìm nhanh lớp học..."
                                value={classSearchQuery}
                                onChange={(e) => setClassSearchQuery(e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-[8px] py-1.5 pl-8 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 font-medium"
                            />
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-400 text-sm">
                                <FaSearch />
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-70 overflow-y-auto custom-scrollbar pr-1">
                        {/* Thẻ Tất cả các lớp */}
                        <button
                            onClick={() => setSelectedClassId(null)}
                            className={`p-3 rounded-[8px] border text-sm font-semibold text-center transition flex flex-col justify-center items-center min-h-[96px] h-auto shadow-sm cursor-pointer ${selectedClassId === null
                                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/10 text-slate-700'
                                }`}
                        >
                            <span className="text-base mb-1">📁</span>
                            <span className="break-words w-full">Tất cả các lớp</span>
                            <span className={`text-sm mt-1 font-medium ${selectedClassId === null ? 'opacity-80' : 'text-gray-400'}`}>({data.length} phiếu)</span>
                        </button>

                        {/* Thẻ Chưa phân lớp */}
                        <button
                            onClick={() => setSelectedClassId(-1)}
                            className={`p-3 rounded-[8px] border text-sm text-left transition flex flex-col justify-between min-h-[96px] h-auto shadow-sm cursor-pointer ${selectedClassId === -1
                                ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'
                                : 'bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50/10 text-slate-700'
                                }`}
                        >
                            <div className="flex justify-between items-start w-full gap-2 mb-1">
                                <span className={`font-semibold text-sm leading-snug break-words flex-1 ${selectedClassId === -1 ? 'text-white' : 'text-slate-800'}`}>
                                    ⚠️ Chưa xếp lớp
                                </span>
                                <span className={`px-1.5 py-0.5 rounded-[4px] text-sm font-semibold shrink-0 ${selectedClassId === -1 ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-700'}`}>
                                    {(() => {
                                        const unassignedReceipts = data.filter(row => {
                                            return !lopHocList.some(lop =>
                                                lop.ma_khoa_hoc === row.ma_khoa_hoc &&
                                                lop.tham_gia.some(tg => tg.ma_hoc_vien === row.ma_hoc_vien)
                                            )
                                        })
                                        return unassignedReceipts.length
                                    })()}
                                </span>
                            </div>
                            <span className={`block text-sm break-words w-full mt-1 font-medium leading-snug ${selectedClassId === -1 ? 'text-amber-100' : 'text-gray-500'}`}>
                                Học viên đóng phí nhưng chưa được xếp lớp
                            </span>
                            <div className={`flex justify-between items-center w-full mt-2 text-sm font-semibold border-t pt-1.5 ${selectedClassId === -1 ? 'border-amber-500 text-white' : 'border-gray-100/50 text-amber-600'}`}>
                                <span>Xem chi tiết</span>
                            </div>
                        </button>

                        {/* Danh sách các thẻ lớp học */}
                        {lopHocList
                            .filter(lop => lop.ten_lop.toLowerCase().includes(classSearchQuery.toLowerCase()))
                            .map(lop => {
                                const classReceiptsCount = data.filter(row => {
                                    const studentIds = lop.tham_gia.map(tg => tg.ma_hoc_vien)
                                    return studentIds.includes(row.ma_hoc_vien) && row.ma_khoa_hoc === lop.ma_khoa_hoc
                                }).length

                                return (
                                    <button
                                        key={lop.ma_lop_hoc}
                                        onClick={() => setSelectedClassId(lop.ma_lop_hoc)}
                                        className="p-3 rounded-[8px] border text-sm text-left transition flex flex-col justify-between min-h-[96px] h-auto shadow-sm cursor-pointer bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/10 text-slate-700"
                                    >
                                        <div className="flex justify-between items-start w-full gap-2 mb-1">
                                            <span className="font-semibold text-sm leading-snug break-words flex-1 text-slate-800">
                                                {lop.ten_lop}
                                            </span>
                                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-[4px] text-sm font-semibold shrink-0">
                                                {lop.tham_gia.length} HV
                                            </span>
                                        </div>
                                        <span className="block text-sm text-gray-500 break-words w-full mt-1 font-medium leading-snug">
                                            📖 {lop.khoa_hoc.ten_khoa_hoc}
                                        </span>
                                        <div className="flex justify-between items-center w-full mt-2 text-sm font-semibold text-blue-600 border-t border-gray-100/50 pt-1.5">
                                            <span>{classReceiptsCount} phiếu</span>
                                            <span className="text-sm text-gray-400 font-normal">ID: {lop.ma_lop_hoc}</span>
                                        </div>
                                    </button>
                                )
                            })}
                    </div>
                </div>
            ) : (
                // Giao diện khi chọn một lớp học cụ thể hoặc chọn Chưa xếp lớp
                (() => {
                    if (selectedClassId === -1) {
                        const unassignedReceipts = data.filter(row => {
                            return !lopHocList.some(lop =>
                                lop.ma_khoa_hoc === row.ma_khoa_hoc &&
                                lop.tham_gia.some(tg => tg.ma_hoc_vien === row.ma_hoc_vien)
                            )
                        })
                        const studentCount = new Set(unassignedReceipts.map(r => r.ma_hoc_vien)).size

                        return (
                            <div className="mb-6 bg-amber-50/20 border border-amber-100/60 p-4 rounded-[8px] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedClassId(null)}
                                        className="flex items-center justify-center w-10 h-10 rounded-[8px] bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-amber-600 transition shadow-sm cursor-pointer shrink-0"
                                        title="Quay lại danh sách lớp học"
                                    >
                                        <FaArrowLeft size={16} />
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-lg font-semibold text-amber-800">
                                                ⚠️ Chưa xếp lớp
                                            </span>
                                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-[4px] text-sm font-semibold">
                                                {studentCount} học viên
                                            </span>
                                            <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-[4px] text-sm font-semibold">
                                                {unassignedReceipts.length} phiếu thu học phí
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 font-medium">
                                            Danh sách học viên đã nộp học phí nhưng chưa được xếp vào lớp học tương ứng.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedClassId(null)}
                                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-[8px] hover:bg-gray-50 font-semibold text-sm transition cursor-pointer shadow-sm"
                                >
                                    Xem tất cả các lớp
                                </button>
                            </div>
                        )
                    }

                    const lop = lopHocList.find(c => c.ma_lop_hoc === selectedClassId)
                    if (!lop) return null

                    const classReceiptsCount = data.filter(row => {
                        const studentIds = lop.tham_gia.map(tg => tg.ma_hoc_vien)
                        return studentIds.includes(row.ma_hoc_vien) && row.ma_khoa_hoc === lop.ma_khoa_hoc
                    }).length

                    return (
                        <div className="mb-6 bg-blue-50/20 border border-blue-100/60 p-4 rounded-[8px] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedClassId(null)}
                                    className="flex items-center justify-center w-10 h-10 rounded-[8px] bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition shadow-sm cursor-pointer shrink-0"
                                    title="Quay lại danh sách lớp học"
                                >
                                    <FaArrowLeft size={16} />
                                </button>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-lg font-semibold text-blue-800">
                                            Lớp: {lop.ten_lop}
                                        </span>
                                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-[4px] text-sm font-semibold">
                                            {lop.tham_gia.length} học viên
                                        </span>
                                        <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-[4px] text-sm font-semibold">
                                            {classReceiptsCount} phiếu thu học phí
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 font-medium">
                                        Khóa học đăng ký: <span className="font-semibold text-slate-800">{lop.khoa_hoc.ten_khoa_hoc}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedClassId(null)}
                                className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-[8px] hover:bg-gray-50 font-semibold text-sm transition cursor-pointer shadow-sm"
                            >
                                Xem tất cả các lớp
                            </button>
                        </div>
                    )
                })()
            )}

            {selectedClassId !== null && (
                (() => {
                    if (selectedClassId === -1) {
                        const unassignedGrouped = (() => {
                            const unassignedReceipts = data.filter(row => {
                                return !lopHocList.some(lop =>
                                    lop.ma_khoa_hoc === row.ma_khoa_hoc &&
                                    lop.tham_gia.some(tg => tg.ma_hoc_vien === row.ma_hoc_vien)
                                )
                            })

                            const groups: {
                                ma_hoc_vien: number
                                ho_ten: string
                                ma_khoa_hoc: number
                                ten_khoa_hoc: string
                                baseTuition: number
                                totalPaid: number
                                discountPercent: number
                                promoName: string
                                remainingDue: number
                                rawPromoPayment?: any
                            }[] = []

                            unassignedReceipts.forEach(pt => {
                                let group = groups.find(g => g.ma_hoc_vien === pt.ma_hoc_vien && g.ma_khoa_hoc === pt.ma_khoa_hoc)
                                if (!group) {
                                    const kh = khoaHocList.find(kh => kh.ma_khoa_hoc === pt.ma_khoa_hoc)
                                    const baseTuition = kh ? kh.hoc_phi : 0

                                    const promoPayment = data.find(
                                        p => p.ma_hoc_vien === pt.ma_hoc_vien && p.ma_khoa_hoc === pt.ma_khoa_hoc && p.ma_khuyen_mai != null
                                    )
                                    let discountPercent = 0
                                    let promoName = ""
                                    if (promoPayment && promoPayment.ma_khuyen_mai) {
                                        const km = khuyenMaiList.find(km => km.ma_khuyen_mai === promoPayment.ma_khuyen_mai)
                                        if (km) {
                                            discountPercent = km.phan_tram_giam || 0
                                            promoName = km.ten_chuong_trinh
                                        }
                                    }

                                    group = {
                                        ma_hoc_vien: pt.ma_hoc_vien,
                                        ho_ten: pt.hoc_vien?.ho_ten || 'Không rõ',
                                        ma_khoa_hoc: pt.ma_khoa_hoc,
                                        ten_khoa_hoc: pt.khoa_hoc?.ten_khoa_hoc || 'Không rõ',
                                        baseTuition: baseTuition,
                                        totalPaid: 0,
                                        discountPercent: discountPercent,
                                        promoName: promoName,
                                        remainingDue: 0,
                                        rawPromoPayment: promoPayment
                                    }
                                    groups.push(group)
                                }
                                group.totalPaid += pt.so_tien
                            })

                            groups.forEach(g => {
                                const actualTuition = g.baseTuition * (1 - g.discountPercent / 100)
                                g.remainingDue = Math.max(0, actualTuition - g.totalPaid)
                            })

                            return groups
                        })()

                        return (
                            <div className="mb-8 bg-white border border-gray-200 rounded-[8px] p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 tracking-wider">
                                    <span className="w-1.5 h-4 bg-amber-600 rounded-sm"></span>
                                    Bảng tổng hợp học phí & Công nợ học viên chưa xếp lớp
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300 text-sm text-center">
                                        <thead className="bg-gray-50 text-gray-700">
                                            <tr>
                                                <th className="border border-gray-300 p-2.5 min-w-[80px] whitespace-nowrap">Mã HV</th>
                                                <th className="border border-gray-300 p-2.5 min-w-[160px] text-left whitespace-nowrap">Học viên</th>
                                                <th className="border border-gray-300 p-2.5 min-w-[180px] text-left whitespace-nowrap">Khóa học đăng ký</th>
                                                <th className="border border-gray-300 p-2.5 min-w-[120px] whitespace-nowrap">Học phí gốc</th>
                                                <th className="border border-gray-300 p-2.5 min-w-[150px] whitespace-nowrap">Khuyến mãi</th>
                                                <th className="border border-gray-300 p-2.5 min-w-[120px] whitespace-nowrap">Đã đóng</th>
                                                <th className="border border-gray-300 p-2.5 min-w-[120px] whitespace-nowrap">Còn thiếu</th>
                                                <th className="border border-gray-300 p-2.5 min-w-[110px] whitespace-nowrap">Trạng thái</th>
                                                <th className="border border-gray-300 p-2.5 min-w-[110px] whitespace-nowrap">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {unassignedGrouped.length === 0 ? (
                                                <tr>
                                                    <td colSpan={9} className="border border-gray-300 py-10 text-gray-500 font-medium bg-gray-50 text-center">
                                                        Chưa có học viên nào chưa xếp lớp đã đóng học phí
                                                    </td>
                                                </tr>
                                            ) : (
                                                unassignedGrouped.map(g => (
                                                    <tr key={`${g.ma_hoc_vien}-${g.ma_khoa_hoc}`} className="hover:bg-slate-50 transition text-gray-700">
                                                        <td className="border border-gray-300 p-2.5">
                                                            {g.ma_hoc_vien}
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5 text-left font-semibold text-slate-800 whitespace-nowrap">
                                                            {g.ho_ten}
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5 text-left text-slate-600 font-medium">
                                                            {g.ten_khoa_hoc}
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5 text-slate-600 font-medium">
                                                            {new Intl.NumberFormat('vi-VN').format(g.baseTuition)} đ
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5 text-slate-600 font-medium">
                                                            {g.discountPercent > 0 ? (
                                                                <span className="text-emerald-600 font-semibold" title={g.promoName}>
                                                                    -{g.discountPercent}% ({g.promoName})
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">Không có</span>
                                                            )}
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5 text-blue-600 font-semibold">
                                                            {new Intl.NumberFormat('vi-VN').format(g.totalPaid)} đ
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5 font-bold">
                                                            {g.remainingDue > 0 ? (
                                                                <span className="text-rose-600">
                                                                    {new Intl.NumberFormat('vi-VN').format(g.remainingDue)} đ
                                                                </span>
                                                            ) : (
                                                                <span className="text-green-600 font-semibold">Đã đóng đủ</span>
                                                            )}
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5">
                                                            {g.remainingDue > 0 ? (
                                                                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-[4px] text-sm font-semibold whitespace-nowrap">
                                                                    Còn thiếu
                                                                </span>
                                                            ) : (
                                                                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-[4px] text-sm font-semibold whitespace-nowrap">
                                                                    Hoàn thành
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5">
                                                            {g.remainingDue > 0 ? (
                                                                <button
                                                                    onClick={() => {
                                                                        // Mở modal thêm phiếu thu, tự động điền sẵn học viên
                                                                        setEditingId(null)
                                                                        setFormData({
                                                                            ma_phieu_thu: '',
                                                                            so_tien: '',
                                                                            ngay_thu: new Date().toISOString().split('T')[0],
                                                                            ma_hoc_vien: g.ma_hoc_vien.toString(),
                                                                            ma_nhan_su: '',
                                                                            noi_dung: `Thu học phí đợt tiếp theo khóa ${g.ten_khoa_hoc}`,
                                                                            ten_hoc_vien: g.ho_ten,
                                                                            ma_khoa_hoc: g.ma_khoa_hoc.toString(),
                                                                            ma_khuyen_mai: g.rawPromoPayment?.ma_khuyen_mai ? g.rawPromoPayment.ma_khuyen_mai.toString() : '',
                                                                        })
                                                                        setFormError(null)
                                                                        setIsModalOpen(true)
                                                                    }}
                                                                    className="px-2.5 py-1 bg-amber-600 text-white rounded-[8px] hover:bg-amber-700 text-sm font-bold transition shadow-sm cursor-pointer whitespace-nowrap"
                                                                >
                                                                    Thu học phí
                                                                </button>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Đã thu đủ</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    }

                    const lop = lopHocList.find(c => c.ma_lop_hoc === selectedClassId)
                    if (!lop) return null

                    const kh = khoaHocList.find(kh => kh.ma_khoa_hoc === lop.ma_khoa_hoc)
                    const baseTuition = kh ? kh.hoc_phi : 0

                    return (
                        <div className="mb-8 bg-white border border-gray-200 rounded-[8px] p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 tracking-wider">
                                <span className="w-1.5 h-4 bg-blue-600 rounded-sm"></span>
                                Bảng tổng hợp học phí & Công nợ học viên trong lớp
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300 text-sm text-center">
                                    <thead className="bg-gray-50 text-gray-700">
                                        <tr>
                                            <th className="border border-gray-300 p-2.5 min-w-[80px] whitespace-nowrap">Mã HV</th>
                                            <th className="border border-gray-300 p-2.5 min-w-[160px] text-left whitespace-nowrap">Học viên</th>
                                            <th className="border border-gray-300 p-2.5 min-w-[120px] whitespace-nowrap">Học phí gốc</th>
                                            <th className="border border-gray-300 p-2.5 min-w-[150px] whitespace-nowrap">Khuyến mãi</th>
                                            <th className="border border-gray-300 p-2.5 min-w-[120px] whitespace-nowrap">Đã đóng</th>
                                            <th className="border border-gray-300 p-2.5 min-w-[120px] whitespace-nowrap">Còn thiếu</th>
                                            <th className="border border-gray-300 p-2.5 min-w-[110px] whitespace-nowrap">Trạng thái</th>
                                            <th className="border border-gray-300 p-2.5 min-w-[110px] whitespace-nowrap">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lop.tham_gia.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="border border-gray-300 py-10 text-gray-500 font-medium bg-gray-50 text-center">
                                                    Chưa có học viên nào tham gia lớp học này
                                                </td>
                                            </tr>
                                        ) : (
                                            lop.tham_gia.map(tg => {
                                                const totalPaid = data
                                                    .filter(pt => pt.ma_hoc_vien === tg.ma_hoc_vien && pt.ma_khoa_hoc === lop.ma_khoa_hoc)
                                                    .reduce((sum, pt) => sum + pt.so_tien, 0)

                                                const promoPayment = data.find(
                                                    pt => pt.ma_hoc_vien === tg.ma_hoc_vien && pt.ma_khoa_hoc === lop.ma_khoa_hoc && pt.ma_khuyen_mai != null
                                                )
                                                let discountPercent = 0
                                                let promoName = ""
                                                if (promoPayment && promoPayment.ma_khuyen_mai) {
                                                    const km = khuyenMaiList.find(km => km.ma_khuyen_mai === promoPayment.ma_khuyen_mai)
                                                    if (km) {
                                                        discountPercent = km.phan_tram_giam || 0
                                                        promoName = km.ten_chuong_trinh
                                                    }
                                                }

                                                const actualTuition = baseTuition * (1 - discountPercent / 100)
                                                const remainingDue = Math.max(0, actualTuition - totalPaid)

                                                return (
                                                    <tr key={tg.ma_hoc_vien} className="hover:bg-slate-50 transition text-gray-700">
                                                        <td className="border border-gray-300 p-2.5">
                                                            {tg.ma_hoc_vien}
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5 text-left font-semibold text-slate-800 whitespace-nowrap">
                                                            {tg.hoc_vien?.ho_ten || 'Không rõ'}
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5 text-slate-600 font-medium">
                                                            {new Intl.NumberFormat('vi-VN').format(baseTuition)} đ
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5 text-slate-600 font-medium">
                                                            {discountPercent > 0 ? (
                                                                <span className="text-emerald-600 font-semibold" title={promoName}>
                                                                    -{discountPercent}% ({promoName})
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">Không có</span>
                                                            )}
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5 text-blue-600 font-semibold">
                                                            {new Intl.NumberFormat('vi-VN').format(totalPaid)} đ
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5 font-bold">
                                                            {remainingDue > 0 ? (
                                                                <span className="text-rose-600">
                                                                    {new Intl.NumberFormat('vi-VN').format(remainingDue)} đ
                                                                </span>
                                                            ) : (
                                                                <span className="text-green-600 font-semibold">Đã đóng đủ</span>
                                                            )}
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5">
                                                            {remainingDue > 0 ? (
                                                                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-[4px] text-sm font-semibold whitespace-nowrap">
                                                                    Còn thiếu
                                                                </span>
                                                            ) : (
                                                                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-[4px] text-sm font-semibold whitespace-nowrap">
                                                                    Hoàn thành
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="border border-gray-300 p-2.5">
                                                            {remainingDue > 0 ? (
                                                                <button
                                                                    onClick={() => {
                                                                        // Mở modal thêm phiếu thu, tự động điền sẵn học viên
                                                                        setEditingId(null)
                                                                        setFormData({
                                                                            ma_phieu_thu: '',
                                                                            so_tien: '',
                                                                            ngay_thu: new Date().toISOString().split('T')[0],
                                                                            ma_hoc_vien: tg.ma_hoc_vien.toString(),
                                                                            ma_nhan_su: '',
                                                                            noi_dung: `Thu học phí đợt tiếp theo khóa ${lop.khoa_hoc.ten_khoa_hoc}`,
                                                                            ten_hoc_vien: tg.hoc_vien?.ho_ten || '',
                                                                            ma_khoa_hoc: lop.ma_khoa_hoc.toString(),
                                                                            ma_khuyen_mai: promoPayment?.ma_khuyen_mai ? promoPayment.ma_khuyen_mai.toString() : '',
                                                                        })
                                                                        setFormError(null)
                                                                        setIsModalOpen(true)
                                                                    }}
                                                                    className="px-2.5 py-1 bg-blue-600 text-white rounded-[8px] hover:bg-blue-700 text-sm font-bold transition shadow-sm cursor-pointer whitespace-nowrap"
                                                                >
                                                                    Thu học phí
                                                                </button>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Đã thu đủ</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                })()
            )}

            {selectedClassId === -1 && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-[8px] flex items-center gap-3 text-sm font-medium">
                    <span className="text-lg">⚠️</span>
                    <div>
                        <span className="font-bold text-amber-900">Danh sách chờ xếp lớp:</span> Hệ thống đang lọc và hiển thị phiếu thu của những học viên đã đóng học phí thành công nhưng chưa được xếp vào bất kỳ lớp học nào thuộc khóa học tương ứng.
                    </div>
                </div>
            )}
            {/* Khối Quản lý & Danh sách Phiếu thu (Gom tìm kiếm, bộ lọc và bảng dữ liệu vào 1 vùng) */}
            <div className="bg-white border border-gray-200 rounded-[8px] p-6 shadow-sm mt-6">
                {/* Bộ Tìm kiếm & Bộ lọc nâng cao */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    {/* Hàng 1: Tìm kiếm tên & Thêm mới */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
                        <div className="flex-1 max-w-xl">
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                Tìm kiếm theo tên học viên
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        name="ten_hoc_vien"
                                        value={formData.ten_hoc_vien}
                                        onChange={handleChange}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="Nhập tên học viên cần tìm..."
                                        className="w-full border border-gray-300 rounded-[8px] py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 text-sm font-medium bg-white"
                                    />
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-sm">
                                        <FaSearch />
                                    </span>
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="flex items-center gap-2 px-5 py-2 font-semibold transition shadow-sm cursor-pointer bg-blue-600 text-white rounded-[8px] hover:bg-blue-700 text-sm shrink-0">
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={openModalForAdd}
                            className="flex items-center justify-center gap-2 px-5 py-2 font-semibold transition shadow-sm cursor-pointer bg-blue-600 text-white rounded-[8px] hover:bg-blue-700 text-sm shrink-0 h-[38px] md:self-end">
                            <FaPlus /> Thêm mới
                        </button>
                    </div>

                    {/* Hàng 2: Bộ lọc nâng cao */}
                    <div className="mt-1">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold tracking-wider text-gray-700 flex items-center gap-1.5">
                                <span className="w-1.5 h-3 bg-blue-500 rounded-sm"></span>
                                Bộ lọc
                            </span>
                            {(filterCourseId || filterStaffId || filterStartDate || filterEndDate) && (
                                <button
                                    onClick={() => {
                                        setFilterCourseId('')
                                        setFilterStaffId('')
                                        setFilterStartDate('')
                                        setFilterEndDate('')
                                    }}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 transition flex items-center gap-1 cursor-pointer bg-red-50 hover:bg-red-100/60 px-2.5 py-1 rounded-[6px] border border-red-200/50"
                                >
                                    <FaTimes size={10} /> Đặt lại bộ lọc
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Bộ lọc Khóa học */}
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Khóa học đăng ký</label>
                                <select
                                    value={filterCourseId}
                                    onChange={(e) => setFilterCourseId(e.target.value)}
                                    className="border border-gray-300 rounded-[8px] p-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-medium"
                                >
                                    <option value="">-- Tất cả khóa học --</option>
                                    {khoaHocList.map(kh => (
                                        <option key={kh.ma_khoa_hoc} value={kh.ma_khoa_hoc}>
                                            {kh.ten_khoa_hoc}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Bộ lọc Nhân sự lập */}
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Người lập phiếu</label>
                                <select
                                    value={filterStaffId}
                                    onChange={(e) => setFilterStaffId(e.target.value)}
                                    className="border border-gray-300 rounded-[8px] p-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-medium"
                                >
                                    <option value="">-- Tất cả người lập --</option>
                                    {nhanSuList.map(ns => (
                                        <option key={ns.ma_nhan_su} value={ns.ma_nhan_su}>
                                            {ns.ho_ten}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Bộ lọc Từ ngày */}
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Từ ngày thu</label>
                                <input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) => setFilterStartDate(e.target.value)}
                                    className="border border-gray-300 rounded-[8px] p-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer font-medium"
                                />
                            </div>

                            {/* Bộ lọc Đến ngày */}
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Đến ngày thu</label>
                                <input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                    className="border border-gray-300 rounded-[8px] p-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 tracking-wider mt-2">
                    <span className={`w-1.5 h-4 rounded-sm ${selectedClassId === -1 ? 'bg-amber-600' : 'bg-blue-600'}`}></span>
                    {(() => {
                        if (selectedClassId === null) return "Danh sách các phiếu thu học phí"
                        if (selectedClassId === -1) return "Danh sách phiếu thu học viên chưa xếp lớp"
                        const lop = lopHocList.find(c => c.ma_lop_hoc === selectedClassId)
                        return `Danh sách phiếu thu lớp ${lop ? lop.ten_lop : ''}`
                    })()}
                </h3>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500 font-medium">
                            Đang tải dữ liệu từ CSDL...
                        </div>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300 text-sm text-center">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="border border-gray-300 p-2.5 min-w-[90px] whitespace-nowrap">Mã phiếu</th>
                                    <th className="border border-gray-300 p-2.5 min-w-[120px] whitespace-nowrap">Số tiền</th>
                                    <th className="border border-gray-300 p-2.5 min-w-[110px] whitespace-nowrap">Ngày thu</th>
                                    <th className="border border-gray-300 p-2.5 min-w-[85px] whitespace-nowrap">Mã HV</th>
                                    <th className="border border-gray-300 p-2.5 min-w-[170px] whitespace-nowrap">Tên HV</th>
                                    {(selectedClassId === null || selectedClassId === -1) && (
                                        <th className="border border-gray-300 p-2.5 min-w-[200px]">Khóa học</th>
                                    )}
                                    {(selectedClassId === null || selectedClassId === -1) && (
                                        <th className="border border-gray-300 p-2.5 min-w-[120px] whitespace-nowrap">Còn thiếu</th>
                                    )}
                                    <th className="border border-gray-300 p-2.5 min-w-[170px] whitespace-nowrap">Người lập</th>
                                    <th className="border border-gray-300 p-2.5 min-w-[260px]">Nội dung</th>
                                    <th className="border border-gray-300 p-2.5 min-w-[100px] whitespace-nowrap">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={(selectedClassId === null || selectedClassId === -1) ? 10 : 8} className="border border-gray-300 py-10 text-gray-500 font-medium bg-gray-50 text-center text-sm">
                                            {selectedClassId === -1
                                                ? "Không tìm thấy học viên chưa xếp lớp nào đã đóng học phí"
                                                : selectedClassId !== null
                                                    ? "Chưa có học viên nào đóng học phí"
                                                    : "Không tìm thấy phiếu thu nào"}
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((row) => (
                                        <tr
                                            key={row.ma_phieu_thu}
                                            className={`transition text-gray-700 ${editingId === row.ma_phieu_thu ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}>
                                            <td className="border border-gray-300 p-2.5">
                                                {row.ma_phieu_thu}
                                            </td>
                                            <td className="border border-gray-300 p-2.5 font-semibold text-blue-600">
                                                {new Intl.NumberFormat('vi-VN').format(row.so_tien)}
                                            </td>
                                            <td className="border border-gray-300 p-2.5">
                                                {new Date(row.ngay_thu).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="border border-gray-300 p-2.5">
                                                {row.ma_hoc_vien}
                                            </td>
                                            <td className="border border-gray-300 p-2.5 font-semibold text-left text-slate-800 whitespace-nowrap">
                                                {row.hoc_vien?.ho_ten || 'Không rõ'}
                                            </td>
                                            {(selectedClassId === null || selectedClassId === -1) && (
                                                <td className="border border-gray-300 p-2.5 text-left text-slate-700">
                                                    {row.khoa_hoc?.ten_khoa_hoc || 'Không rõ'}
                                                </td>
                                            )}
                                            {(selectedClassId === null || selectedClassId === -1) && (
                                                <td className="border border-gray-300 p-2.5 text-center font-medium">
                                                    {(() => {
                                                        const totalPaid = data
                                                            .filter(pt => pt.ma_hoc_vien === row.ma_hoc_vien && pt.ma_khoa_hoc === row.ma_khoa_hoc)
                                                            .reduce((sum, pt) => sum + pt.so_tien, 0)

                                                        const promoPayment = data.find(
                                                            pt => pt.ma_hoc_vien === row.ma_hoc_vien && pt.ma_khoa_hoc === row.ma_khoa_hoc && pt.khuyen_mai
                                                        )
                                                        const discountPercent = promoPayment?.khuyen_mai?.phan_tram_giam || 0

                                                        const baseTuition = row.khoa_hoc?.hoc_phi || 0
                                                        const actualTuition = baseTuition * (1 - discountPercent / 100)
                                                        const conThieu = Math.max(0, actualTuition - totalPaid)

                                                        if (conThieu > 0) {
                                                            return (
                                                                <span className="text-amber-600 text-sm font-semibold">
                                                                    {new Intl.NumberFormat('vi-VN').format(conThieu)} đ
                                                                </span>
                                                            )
                                                        }
                                                        return (
                                                            <span className="text-green-600 text-sm font-semibold">
                                                                Đã đóng đủ
                                                            </span>
                                                        )
                                                    })()}
                                                </td>
                                            )}
                                            <td className="border border-gray-300 p-2.5 text-left text-slate-700 whitespace-nowrap">
                                                {row.nhan_su?.ho_ten || 'Không rõ'}
                                            </td>
                                            <td className="border border-gray-300 p-2.5 text-left text-slate-600">
                                                {row.noi_dung}
                                            </td>
                                            <td className="border border-gray-300 p-2.5">
                                                <div className="flex justify-center gap-1">
                                                    <button
                                                        onClick={() => openModalForEdit(row)}
                                                        className="p-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-yellow-100 hover:text-yellow-600 transition cursor-pointer"
                                                        title="Sửa phiếu thu">
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(row.ma_phieu_thu)}
                                                        className="p-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-red-100 hover:text-red-600 transition cursor-pointer"
                                                        title="Xóa phiếu thu">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {!isLoading && data.length > 0 && (
                    <div className="flex justify-between items-center mt-6 font-medium text-gray-600">
                        <div className="text-sm">
                            Hiển thị{' '}
                            <span className="font-bold text-gray-800">{indexOfFirstItem + 1}</span> đến{' '}
                            <span className="font-bold text-gray-800">
                                {Math.min(indexOfLastItem, data.length)}
                            </span>{' '}
                            trong tổng số <span className="font-bold text-gray-800">{data.length}</span>{' '}
                            phiếu thu
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded border ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300'}`}>
                                Trước
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`px-3 py-1 rounded border ${currentPage === number
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'hover:bg-gray-100 border-gray-300'
                                        }`}>
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300'}`}>
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Alert */}
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                    autoClose={3000}
                />
            )}

            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa phiếu thu này? Hành động này sẽ không thể khôi phục lại dữ liệu."
                onConfirm={handleConfirmDelete}
                onClose={() => setConfirmDelete({ isOpen: false, id: null })}
                type="danger"
            />
        </div>
    )
}
