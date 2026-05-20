'use client'

import { useState, useEffect } from 'react'
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
    FaQuestionCircle,
    FaUserPlus,
    FaExclamationTriangle,
    FaShieldAlt,
    FaSync,
    FaTasks,
    FaClock,
    FaFileAlt,
    FaFilter,
    FaChevronDown,
    FaChevronUp,
    FaBookOpen,
} from 'react-icons/fa'

interface KhoaHoc {
    ma_khoa_hoc: number
    ten_khoa_hoc: string
    hoc_phi?: number
    thoi_luong?: string
}

interface CamKet {
    ma_cam_ket: number
    ngay_ky: string
    ngay_het_han?: string | null
    noi_dung_cam_ket: string
    trang_thai: string
    ma_hoc_vien: number
    ma_khoa_hoc?: number | null
    so_buoi_vang_cho_phep?: number | null
    tham_gia_thi_day_du?: boolean | null
    so_buoi_di_muon?: number | null
    so_lan_thieu_bai_tap?: number | null
    bi_vi_pham?: boolean
    ly_do_vi_pham?: string | null
    hoc_vien?: { ho_ten: string }
    khoa_hoc?: { ten_khoa_hoc: string }
    so_buoi_vang_thuc_te?: number | null
    so_buoi_di_muon_thuc_te?: number | null
    so_lan_thieu_bai_tap_thuc_te?: number | null
    da_bo_thi?: boolean | null
}

export default function QuanLyCamKetPage() {
    const [data, setData] = useState<CamKet[]>([])
    const [danhSachKhoaHoc, setDanhSachKhoaHoc] = useState<KhoaHoc[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // States cho Ẩn/Hiện từng khối chi tiết
    const [showStudentInfo, setShowStudentInfo] = useState(false)
    const [showCourseInfo, setShowCourseInfo] = useState(false)

    // Tìm kiếm và Lọc
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMonth, setSelectedMonth] = useState<string>('all')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isViewMode, setIsViewMode] = useState(false)
    const [isChecking, setIsChecking] = useState(false)

    const [activeTab, setActiveTab] = useState<'info' | 'violation'>('info')
    const [violationStats, setViolationStats] = useState({
        vang: 0,
        muon: 0,
        thieu_bt: 0,
        bo_thi: false,
    })
    const [dateError, setDateError] = useState('')

    const [formData, setFormData] = useState({
        ma_cam_ket: '',
        ngay_ky: '',
        ngay_het_han: '',
        noi_dung_cam_ket:
            'Cam kết tuân thủ nội quy lớp học, đi học đầy đủ và hoàn thành bài tập về nhà.',
        trang_thai: 'Đang hiệu lực',
        ma_hoc_vien: '',
        ten_hoc_vien: '',
        ma_khoa_hoc: '',
        so_buoi_vang_cho_phep: 3 as number | string,
        tham_gia_thi_day_du: true,
        so_buoi_di_muon: 3 as number | string,
        so_lan_thieu_bai_tap: 3 as number | string,
        bi_vi_pham: false,
        ly_do_vi_pham: '',
    })

    // STATE MỚI: Quản lý lỗi cho từng trường dữ liệu
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [newStudentErrors, setNewStudentErrors] = useState<Record<string, string>>({})

    const [fullStudentInfo, setFullStudentInfo] = useState<any>(null)
    const [fullCourseInfo, setFullCourseInfo] = useState<any>(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)

    const [isAskStudentModalOpen, setIsAskStudentModalOpen] = useState(false)
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
    const [isSubmittingStudent, setIsSubmittingStudent] = useState(false)
    const [newStudentData, setNewStudentData] = useState({
        ho_ten: '',
        ngay_sinh: '',
        gioi_tinh: 'Nam',
        so_dien_thoai: '',
        email: '',
        dia_chi: '',
        trang_thai: 'Đang học',
    })

    const [studentSuggestions, setStudentSuggestions] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) return 'Chưa cập nhật'
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    }

    const formatDateForView = (isoString: string) => {
        if (!isoString) return ''
        const d = new Date(isoString)
        return d.toLocaleDateString('vi-VN')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCamKet = await fetch('/api/tuyen-sinh/cam-ket')
                if (resCamKet.ok) setData(await resCamKet.json())
                const resKhoaHoc = await fetch('/api/tuyen-sinh/khoa-hoc')
                if (resKhoaHoc.ok) setDanhSachKhoaHoc(await resKhoaHoc.json())
            } catch (error) {
                console.error('Lỗi fetch API:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleStartAddWorkflow = () => setIsAskStudentModalOpen(true)
    const handleHasStudent = () => {
        setIsAskStudentModalOpen(false)
        openAddModal()
    }
    const handleNoStudent = () => {
        setIsAskStudentModalOpen(false)
        setNewStudentData({
            ho_ten: '',
            ngay_sinh: '',
            gioi_tinh: 'Nam',
            so_dien_thoai: '',
            email: '',
            dia_chi: '',
            trang_thai: 'Đang học',
        })
        setNewStudentErrors({})
        setIsAddStudentModalOpen(true)
    }

    const handleNewStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewStudentData({ ...newStudentData, [name]: value })
        // Xóa lỗi của trường này khi người dùng bắt đầu nhập lại
        if (newStudentErrors[name]) {
            setNewStudentErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const handleSaveNewStudent = async () => {
        const errors: Record<string, string> = {}
        if (!newStudentData.ho_ten.trim()) errors.ho_ten = 'Họ và tên không được để trống'
        if (!newStudentData.ngay_sinh) errors.ngay_sinh = 'Vui lòng chọn ngày sinh'

        if (Object.keys(errors).length > 0) {
            setNewStudentErrors(errors)
            return
        }

        setIsSubmittingStudent(true)
        try {
            const payload = {
                ...newStudentData,
                ngay_sinh: new Date(newStudentData.ngay_sinh).toISOString(),
            }
            const response = await fetch('/api/tuyen-sinh/hoc-vien', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                const createdStudent = await response.json()
                showToast('Tạo hồ sơ học viên thành công!', 'success')
                setIsAddStudentModalOpen(false)
                setIsViewMode(false)
                setEditingId(null)
                setFormData({
                    ma_cam_ket: '',
                    ngay_ky: new Date().toISOString().split('T')[0],
                    ngay_het_han: '',
                    noi_dung_cam_ket:
                        'Cam kết tuân thủ nội quy lớp học, đi học đầy đủ và hoàn thành bài tập về nhà.',
                    trang_thai: 'Đang hiệu lực',
                    ma_hoc_vien: createdStudent.ma_hoc_vien.toString(),
                    ten_hoc_vien: createdStudent.ho_ten,
                    ma_khoa_hoc: '',
                    so_buoi_vang_cho_phep: 3,
                    tham_gia_thi_day_du: true,
                    so_buoi_di_muon: 3,
                    so_lan_thieu_bai_tap: 3,
                    bi_vi_pham: false,
                    ly_do_vi_pham: '',
                })
                setFormErrors({})
                setActiveTab('info')
                setIsModalOpen(true)
            } else {
                setNewStudentErrors({ general: 'Có lỗi xảy ra khi lưu trên máy chủ.' })
            }
        } catch (error) {
            setNewStudentErrors({ general: 'Lỗi kết nối máy chủ.' })
        } finally {
            setIsSubmittingStudent(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
        } else {
            setFormData({ ...formData, [name]: value })
        }

        // Tự động xóa thông báo lỗi của trường đang được nhập
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const nameValue = e.target.value
        setFormData({ ...formData, ten_hoc_vien: nameValue, ma_hoc_vien: '' })
        if (formErrors.ten_hoc_vien || formErrors.ma_hoc_vien) {
            setFormErrors((prev) => ({ ...prev, ten_hoc_vien: '', ma_hoc_vien: '' }))
        }

        if (nameValue.trim().length < 2) {
            setStudentSuggestions([])
            setShowSuggestions(false)
            return
        }
        setIsSearching(true)
        try {
            const response = await fetch(`/api/tuyen-sinh/hoc-vien?search=${nameValue}`)
            if (response.ok) {
                setStudentSuggestions(await response.json())
                setShowSuggestions(true)
            }
        } catch (error) {
        } finally {
            setIsSearching(false)
        }
    }

    const selectStudent = (student: any) => {
        setFormData({
            ...formData,
            ten_hoc_vien: student.ho_ten,
            ma_hoc_vien: student.ma_hoc_vien.toString(),
        })
        setShowSuggestions(false)
        setFormErrors((prev) => ({ ...prev, ten_hoc_vien: '', ma_hoc_vien: '' }))
    }

    const handleNameBlur = () => {
        setTimeout(async () => {
            setShowSuggestions(false)
            if (!formData.ma_hoc_vien && formData.ten_hoc_vien.trim().length >= 2) {
                try {
                    const response = await fetch(
                        `/api/tuyen-sinh/hoc-vien?search=${formData.ten_hoc_vien}`,
                    )
                    if (response.ok) {
                        const data = await response.json()
                        const exactMatches = data.filter(
                            (sv: any) =>
                                sv.ho_ten.toLowerCase() ===
                                formData.ten_hoc_vien.trim().toLowerCase(),
                        )
                        if (exactMatches.length === 1) {
                            setFormData((prev) => ({
                                ...prev,
                                ten_hoc_vien: exactMatches[0].ho_ten,
                                ma_hoc_vien: exactMatches[0].ma_hoc_vien.toString(),
                            }))
                            setFormErrors((prev) => ({
                                ...prev,
                                ten_hoc_vien: '',
                                ma_hoc_vien: '',
                            }))
                        }
                    }
                } catch (error) {}
            }
        }, 200)
    }

    const handleIdBlur = async () => {
        if (!formData.ma_hoc_vien) return
        try {
            const response = await fetch(`/api/tuyen-sinh/hoc-vien?id=${formData.ma_hoc_vien}`)
            if (response.ok) {
                const data = await response.json()
                const student = Array.isArray(data) ? data[0] : data
                if (student) {
                    setFormData((prev) => ({ ...prev, ten_hoc_vien: student.ho_ten }))
                    setFormErrors((prev) => ({ ...prev, ten_hoc_vien: '', ma_hoc_vien: '' }))
                } else {
                    setFormData((prev) => ({ ...prev, ten_hoc_vien: 'Không tìm thấy học viên' }))
                }
            }
        } catch (error) {}
    }

    const fillFormData = (row: CamKet) => {
        setFormData({
            ma_cam_ket: row.ma_cam_ket.toString(),
            ngay_ky: new Date(row.ngay_ky).toISOString().split('T')[0],
            ngay_het_han: row.ngay_het_han
                ? new Date(row.ngay_het_han).toISOString().split('T')[0]
                : '',
            noi_dung_cam_ket: row.noi_dung_cam_ket || '',
            trang_thai: row.trang_thai || 'Đang hiệu lực',
            ma_hoc_vien: row.ma_hoc_vien.toString(),
            ten_hoc_vien: row.hoc_vien?.ho_ten || '',
            ma_khoa_hoc: row.ma_khoa_hoc ? row.ma_khoa_hoc.toString() : '',
            so_buoi_vang_cho_phep: row.so_buoi_vang_cho_phep ?? 3,
            tham_gia_thi_day_du: row.tham_gia_thi_day_du ?? true,
            so_buoi_di_muon: row.so_buoi_di_muon ?? 3,
            so_lan_thieu_bai_tap: row.so_lan_thieu_bai_tap ?? 3,
            bi_vi_pham: row.bi_vi_pham || false,
            ly_do_vi_pham: row.ly_do_vi_pham || '',
        })
        setViolationStats({
            vang: row.so_buoi_vang_thuc_te || 0,
            muon: row.so_buoi_di_muon_thuc_te || 0,
            thieu_bt: row.so_lan_thieu_bai_tap_thuc_te || 0,
            bo_thi: row.da_bo_thi || false,
        })
    }

    const openViewModal = async (row: CamKet) => {
        fillFormData(row)
        setIsViewMode(true)
        setEditingId(row.ma_cam_ket)
        setActiveTab('info')
        setIsModalOpen(true)
        setIsLoadingDetails(true)
        setShowStudentInfo(false)
        setShowCourseInfo(false)
        setFormErrors({})

        try {
            const [resStudent, resCourse] = await Promise.all([
                fetch(`/api/tuyen-sinh/hoc-vien?id=${row.ma_hoc_vien}`),
                row.ma_khoa_hoc
                    ? fetch(`/api/tuyen-sinh/khoa-hoc?id=${row.ma_khoa_hoc}`)
                    : Promise.resolve(null),
            ])

            if (resStudent.ok) {
                const dataS = await resStudent.json()
                setFullStudentInfo(Array.isArray(dataS) ? dataS[0] : dataS)
            }
            if (resCourse && resCourse.ok) {
                const dataC = await resCourse.json()
                setFullCourseInfo(Array.isArray(dataC) ? dataC[0] : dataC)
            } else {
                setFullCourseInfo(null)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoadingDetails(false)
        }
    }

    const openAddModal = () => {
        setIsViewMode(false)
        setEditingId(null)
        setFormData({
            ma_cam_ket: '',
            ngay_ky: new Date().toISOString().split('T')[0],
            ngay_het_han: '',
            noi_dung_cam_ket:
                'Cam kết tuân thủ nội quy lớp học, đi học đầy đủ và hoàn thành bài tập về nhà.',
            trang_thai: 'Đang hiệu lực',
            ma_hoc_vien: '',
            ten_hoc_vien: '',
            ma_khoa_hoc: '',
            so_buoi_vang_cho_phep: 3,
            tham_gia_thi_day_du: true,
            so_buoi_di_muon: 3,
            so_lan_thieu_bai_tap: 3,
            bi_vi_pham: false,
            ly_do_vi_pham: '',
        })
        setViolationStats({ vang: 0, muon: 0, thieu_bt: 0, bo_thi: false })
        setActiveTab('info')
        setIsModalOpen(true)
        setFormErrors({})
    }

    const openEditModal = (row: CamKet) => {
        fillFormData(row)
        setIsViewMode(false)
        setEditingId(row.ma_cam_ket)
        setActiveTab('info')
        setIsModalOpen(true)
        setFormErrors({})
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
        setIsViewMode(false)
        setShowStudentInfo(false)
        setShowCourseInfo(false)
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
            const response = await fetch(`/api/tuyen-sinh/cam-ket?id=${deletingId}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                setData(data.filter((item) => item.ma_cam_ket !== deletingId))
                showToast('Đã xóa bản cam kết thành công!', 'success')
            } else showToast('Có lỗi xảy ra khi xóa.', 'error')
        } catch (error) {
            showToast('Không thể kết nối đến máy chủ.', 'error')
        } finally {
            closeDeleteModal()
        }
    }

    // HÀM KIỂM TRA LỖI TỪNG TRƯỜNG DỮ LIỆU
    const handleSaveCamKet = async () => {
        const newErrors: Record<string, string> = {}

        // 1. Kiểm tra Dữ liệu trống
        if (!formData.ten_hoc_vien.trim()) newErrors.ten_hoc_vien = 'Vui lòng nhập tên học viên'
        if (!formData.ma_hoc_vien) newErrors.ma_hoc_vien = 'Vui lòng chọn học viên hợp lệ'
        if (!formData.ma_khoa_hoc) newErrors.ma_khoa_hoc = 'Vui lòng chọn khóa học cam kết'
        if (!formData.ngay_ky) newErrors.ngay_ky = 'Vui lòng chọn ngày ký cam kết'
        if (!formData.noi_dung_cam_ket.trim())
            newErrors.noi_dung_cam_ket = 'Nội dung hợp đồng không được để trống'

        // 2. Kiểm tra Số âm
        if (formData.so_buoi_vang_cho_phep === '' || Number(formData.so_buoi_vang_cho_phep) < 0)
            newErrors.so_buoi_vang_cho_phep = 'Nhập số hợp lệ'
        if (formData.so_buoi_di_muon === '' || Number(formData.so_buoi_di_muon) < 0)
            newErrors.so_buoi_di_muon = 'Nhập số hợp lệ'
        if (formData.so_lan_thieu_bai_tap === '' || Number(formData.so_lan_thieu_bai_tap) < 0)
            newErrors.so_lan_thieu_bai_tap = 'Nhập số hợp lệ'

        // 3. Kiểm tra Ngày tháng (Logic ngày kết thúc)
        if (formData.ngay_het_han && formData.ngay_ky) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const expirationDate = new Date(formData.ngay_het_han)
            expirationDate.setHours(0, 0, 0, 0)
            const signDate = new Date(formData.ngay_ky)
            signDate.setHours(0, 0, 0, 0)

            if (expirationDate < signDate) {
                newErrors.ngay_het_han = 'Ngày hết hạn không được trước ngày ký'
            } else if (formData.trang_thai === 'Đang hiệu lực' && expirationDate < today) {
                newErrors.ngay_het_han = 'Cam kết này đã qua ngày hết hạn so với hôm nay'
            } else if (formData.trang_thai === 'Đã hết hạn' && expirationDate >= today) {
                newErrors.ngay_het_han = 'Cam kết vẫn còn hạn'
            }
        }

        // NẾU CÓ LỖI -> DỪNG VÀ HIỂN THỊ
        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors)
            return
        }

        // NẾU KHÔNG CÓ LỖI -> GỌI API LƯU DATA
        try {
            const method = editingId ? 'PUT' : 'POST'
            const payload = {
                ...formData,
                ngay_het_han: formData.ngay_het_han || null,
                ma_khoa_hoc: parseInt(formData.ma_khoa_hoc),
                so_buoi_vang_cho_phep: parseInt(formData.so_buoi_vang_cho_phep.toString()),
                so_buoi_di_muon: parseInt(formData.so_buoi_di_muon.toString()),
                so_lan_thieu_bai_tap: parseInt(formData.so_lan_thieu_bai_tap.toString()),
            }

            const response = await fetch('/api/tuyen-sinh/cam-ket', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                const savedData = await response.json()
                if (editingId) {
                    setData(
                        data.map((item) =>
                            item.ma_cam_ket === savedData.ma_cam_ket ? savedData : item,
                        ),
                    )
                } else {
                    setData([...data, savedData])
                }
                showToast(editingId ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success')
                closeModal()
            } else {
                showToast(`Có lỗi xảy ra khi lưu.`, 'error')
            }
        } catch (error) {
            showToast('Lỗi máy chủ.', 'error')
        }
    }

    const handleCheckViolation = async () => {
        if (!editingId) return
        setIsChecking(true)
        try {
            const response = await fetch('/api/tuyen-sinh/cam-ket', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'check_violation', ma_cam_ket: editingId }),
            })
            if (response.ok) {
                const dataRes = await response.json()
                const { updatedCamKet, stats } = dataRes
                setViolationStats(stats)
                setFormData((prev) => ({
                    ...prev,
                    bi_vi_pham: updatedCamKet.bi_vi_pham,
                    ly_do_vi_pham: updatedCamKet.ly_do_vi_pham || '',
                }))
                setData(data.map((item) => (item.ma_cam_ket === editingId ? updatedCamKet : item)))
                showToast('Phân tích thành công!', 'success')
            } else {
                showToast('Lỗi dữ liệu điểm danh', 'error')
            }
        } catch (error) {
            showToast('Lỗi mạng khi kiểm tra', 'error')
        } finally {
            setIsChecking(false)
        }
    }

    const filteredData = data
        .filter((item) => {
            const lowerSearch = searchTerm.toLowerCase()
            const matchSearch =
                (item.hoc_vien?.ho_ten || '').toLowerCase().includes(lowerSearch) ||
                item.ma_hoc_vien.toString().includes(searchTerm) ||
                (item.khoa_hoc?.ten_khoa_hoc || '').toLowerCase().includes(lowerSearch)

            let matchMonth = true
            if (selectedMonth !== 'all') {
                const dateKy = new Date(item.ngay_ky)
                const month = (dateKy.getMonth() + 1).toString()
                matchMonth = month === selectedMonth
            }

            return matchSearch && matchMonth
        })
        .sort((a, b) => b.ma_cam_ket - a.ma_cam_ket)

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    return (
        <div className="bg-gray-50 min-h-screen p-6 relative">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-7xl mx-auto border border-gray-200">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-[#1d4ed8] flex items-center gap-3 uppercase">
                        <FaShieldAlt className="text-blue-600" /> Quản lý Bản Cam Kết
                    </h1>
                    <button
                        onClick={handleStartAddWorkflow}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm">
                        <FaPlus /> Thêm cam kết
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6 w-full lg:w-2/3">
                    <div className="relative flex-1 md:max-w-md">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <FaSearch className="text-gray-400 text-sm" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm tên, mã học viên hoặc tên khóa học..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm focus:border-[#1d4ed8] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-gray-400"
                        />
                    </div>
                    <div className="relative w-full md:w-36 shrink-0 group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FaFilter className="text-gray-400 text-xs" />
                        </div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => {
                                setSelectedMonth(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-8 pr-7 text-sm font-semibold text-gray-700 shadow-sm focus:border-[#1d4ed8] focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer transition-all hover:bg-gray-50">
                            <option value="all">Tất cả</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                <option key={month} value={month.toString()}>
                                    Tháng {month}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <FaChevronDown className="text-gray-400 text-[10px] transition-transform group-hover:text-gray-600" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-t-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#1d4ed8] text-white uppercase font-semibold text-xs border-b">
                            <tr>
                                <th className="px-4 py-4 text-center">Mã CK</th>
                                <th className="px-4 py-4">Học Viên</th>
                                <th className="px-4 py-4 min-w-[200px]">Khóa Học</th>
                                <th className="px-4 py-4 text-center">Ngày Ký</th>
                                <th className="px-4 py-4 text-center">Trạng Thái</th>
                                <th className="px-4 py-4 text-center">Vi Phạm</th>
                                <th className="px-4 py-4 text-center w-28">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 font-medium">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">
                                        Không tìm thấy cam kết nào.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((row, index) => (
                                    <tr
                                        key={row.ma_cam_ket}
                                        className={`border-b hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-4 py-4 text-center text-gray-600 font-medium">
                                            {row.ma_cam_ket}
                                        </td>
                                        <td className="px-4 py-4 font-bold text-[#1d4ed8]">
                                            {row.hoc_vien?.ho_ten || `Mã HV: ${row.ma_hoc_vien}`}
                                        </td>
                                        <td className="px-4 py-4 font-medium text-gray-800">
                                            {row.khoa_hoc?.ten_khoa_hoc || (
                                                <span className="text-gray-400 italic">
                                                    Chưa liên kết
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-center text-gray-600">
                                            {formatDateForView(row.ngay_ky)}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${row.trang_thai === 'Đang hiệu lực' ? 'bg-green-100 text-green-700 border-green-200' : row.trang_thai === 'Đã hết hạn' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                                {row.trang_thai}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {row.bi_vi_pham ? (
                                                <span className="px-3 py-1 rounded bg-red-100 border border-red-200 text-red-600 text-xs font-bold inline-flex items-center gap-1">
                                                    <FaExclamationTriangle /> Có
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold">
                                                    Không
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openViewModal(row)}
                                                    className="p-2 text-green-600 bg-green-100 rounded hover:bg-green-200 transition"
                                                    title="Xem chi tiết & vi phạm">
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(row)}
                                                    className="p-2 text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition"
                                                    title="Sửa cam kết">
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(row.ma_cam_ket)}
                                                    className="p-2 text-red-600 bg-red-100 rounded hover:bg-red-200 transition"
                                                    title="Xóa cam kết">
                                                    <FaTrash />
                                                </button>
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
                        <div>
                            Hiển thị{' '}
                            <span className="font-bold text-gray-800">{indexOfFirstItem + 1}</span>{' '}
                            đến{' '}
                            <span className="font-bold text-gray-800">
                                {Math.min(indexOfLastItem, filteredData.length)}
                            </span>{' '}
                            trong tổng số{' '}
                            <span className="font-bold text-gray-800">{filteredData.length}</span>{' '}
                            cam kết
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 rounded border ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300 text-gray-700'}`}>
                                Trước
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => setCurrentPage(number)}
                                    className={`px-3 py-1.5 rounded border ${currentPage === number ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]' : 'hover:bg-gray-100 border-gray-300 text-gray-700'}`}>
                                    {number}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1.5 rounded border ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300 text-gray-700'}`}>
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL THÊM HỌC VIÊN DỰ PHÒNG */}
            {isAskStudentModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up text-center border border-gray-200">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <FaQuestionCircle size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Thông tin học viên</h3>
                        <p className="text-gray-600 mb-8 font-medium">
                            Học viên này đã có hồ sơ trong hệ thống chưa?
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleHasStudent}
                                className="w-full py-3 bg-[#1d4ed8] text-white rounded-md font-semibold hover:bg-blue-700 transition">
                                Đã có hồ sơ
                            </button>
                            <button
                                onClick={handleNoStudent}
                                className="w-full py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                                <FaUserPlus /> Chưa có (Thêm mới)
                            </button>
                            <button
                                onClick={() => setIsAskStudentModalOpen(false)}
                                className="w-full py-2.5 mt-2 text-gray-500 hover:bg-gray-100 rounded-md font-medium transition">
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAddStudentModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl animate-fade-in-up flex flex-col border border-gray-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2">
                                <FaUserPlus /> Đăng ký hồ sơ học viên mới
                            </h2>
                            <button
                                onClick={() => setIsAddStudentModalOpen(false)}
                                className="text-gray-400 hover:text-red-500 transition">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ho_ten"
                                        value={newStudentData.ho_ten}
                                        onChange={handleNewStudentChange}
                                        className={`w-full border rounded-md p-2.5 outline-none text-black ${newStudentErrors.ho_ten ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                                    />
                                    {newStudentErrors.ho_ten && (
                                        <p className="text-red-500 text-xs italic mt-1 font-medium">
                                            {newStudentErrors.ho_ten}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Ngày sinh <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="ngay_sinh"
                                        value={newStudentData.ngay_sinh}
                                        onChange={handleNewStudentChange}
                                        className={`w-full border rounded-md p-2.5 outline-none text-black ${newStudentErrors.ngay_sinh ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                                    />
                                    {newStudentErrors.ngay_sinh && (
                                        <p className="text-red-500 text-xs italic mt-1 font-medium">
                                            {newStudentErrors.ngay_sinh}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Giới tính
                                    </label>
                                    <select
                                        name="gioi_tinh"
                                        value={newStudentData.gioi_tinh}
                                        onChange={handleNewStudentChange}
                                        className="w-full border border-gray-300 rounded-md p-2.5 outline-none bg-white text-black">
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        name="so_dien_thoai"
                                        value={newStudentData.so_dien_thoai}
                                        onChange={handleNewStudentChange}
                                        className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newStudentData.email}
                                        onChange={handleNewStudentChange}
                                        placeholder="ví dụ: nguyenvana@gmail.com"
                                        className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-black"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        name="dia_chi"
                                        value={newStudentData.dia_chi}
                                        onChange={handleNewStudentChange}
                                        className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Trạng thái
                                    </label>
                                    <select
                                        name="trang_thai"
                                        value={newStudentData.trang_thai}
                                        onChange={handleNewStudentChange}
                                        className="w-full border border-gray-300 rounded-md p-2.5 outline-none bg-white text-black">
                                        <option value="Đang học">Đang học</option>
                                        <option value="Nghỉ học">Nghỉ học</option>
                                        <option value="Bảo lưu">Bảo lưu</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            {newStudentErrors.general && (
                                <div className="mr-auto text-red-600 font-medium self-center text-sm">
                                    {newStudentErrors.general}
                                </div>
                            )}
                            <button
                                onClick={() => setIsAddStudentModalOpen(false)}
                                className="px-5 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-100 font-medium transition">
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSaveNewStudent}
                                disabled={isSubmittingStudent}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition disabled:opacity-50">
                                {isSubmittingStudent ? (
                                    <FaSpinner className="animate-spin" />
                                ) : (
                                    <FaSave />
                                )}{' '}
                                Lưu và Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL GIAO DIỆN TAB (XEM VÀ SỬA) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl shadow-2xl animate-fade-in-up flex flex-col max-h-[95vh] overflow-hidden border border-gray-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white rounded-t-lg shrink-0">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2 uppercase tracking-wide">
                                <FaShieldAlt />{' '}
                                {isViewMode
                                    ? 'Hồ Sơ Cam Kết'
                                    : editingId
                                      ? 'Cập Nhật Bản Cam Kết'
                                      : 'Tạo Bản Cam Kết Mới'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-red-500 transition">
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="flex px-6 pt-2 bg-gray-50 border-b border-gray-200 shrink-0">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`py-2 px-4 font-bold border-b-2 outline-none transition-colors ${activeTab === 'info' ? 'border-[#1d4ed8] text-[#1d4ed8]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                Hồ sơ & Điều khoản
                            </button>
                            {editingId && (
                                <button
                                    onClick={() => setActiveTab('violation')}
                                    className={`py-2 px-4 font-bold border-b-2 outline-none transition-colors ${activeTab === 'violation' ? 'border-[#1d4ed8] text-[#1d4ed8]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                    Tra cứu Vi phạm
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-white">
                            {/* TAB 1: THÔNG TIN VÀ ĐIỀU KHOẢN */}
                            {activeTab === 'info' && (
                                <div className="space-y-6">
                                    {isViewMode ? (
                                        <div className="space-y-6 animate-fade-in-up">
                                            {isLoadingDetails ? (
                                                <div className="flex justify-center items-center py-10">
                                                    <FaSpinner className="animate-spin text-3xl text-blue-600" />
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {/* 1. KHỐI THÔNG TIN HỌC VIÊN */}
                                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm relative overflow-hidden mb-4">
                                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>
                                                        <div
                                                            className="flex justify-between items-center p-4 pl-6 cursor-pointer hover:bg-blue-50/30 transition-colors"
                                                            onClick={() =>
                                                                setShowStudentInfo(!showStudentInfo)
                                                            }>
                                                            <h3 className="font-bold text-gray-800 flex items-center gap-2 uppercase text-sm">
                                                                <FaUserGraduate className="text-blue-600 text-lg" />{' '}
                                                                Thông tin Học viên
                                                            </h3>
                                                            <button className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-100 transition pointer-events-none">
                                                                {showStudentInfo ? (
                                                                    <FaChevronUp />
                                                                ) : (
                                                                    <FaChevronDown />
                                                                )}{' '}
                                                                {showStudentInfo
                                                                    ? 'Thu gọn'
                                                                    : 'Xem chi tiết'}
                                                            </button>
                                                        </div>

                                                        {showStudentInfo && (
                                                            <div className="p-5 pl-6 border-t border-gray-100 animate-fade-in-down bg-white">
                                                                <h3 className="text-sm font-bold text-blue-800 uppercase mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                                                    <FaUserGraduate /> Hồ sơ cá nhân
                                                                </h3>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6 text-sm">
                                                                    <div>
                                                                        <span className="block text-gray-500 text-xs mb-1">
                                                                            Mã Học Viên
                                                                        </span>
                                                                        <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                                                                            {fullStudentInfo?.ma_hoc_vien ||
                                                                                formData.ma_hoc_vien}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-gray-500 text-xs mb-1">
                                                                            Họ và tên
                                                                        </span>
                                                                        <span className="font-bold text-blue-700 text-base">
                                                                            {fullStudentInfo?.ho_ten ||
                                                                                formData.ten_hoc_vien}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-gray-500 text-xs mb-1">
                                                                            Ngày sinh
                                                                        </span>
                                                                        <span className="font-semibold text-gray-800">
                                                                            {fullStudentInfo?.ngay_sinh
                                                                                ? new Date(
                                                                                      fullStudentInfo.ngay_sinh,
                                                                                  ).toLocaleDateString(
                                                                                      'vi-VN',
                                                                                  )
                                                                                : 'Chưa cập nhật'}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-gray-500 text-xs mb-1">
                                                                            Giới tính
                                                                        </span>
                                                                        <span className="font-semibold text-gray-800">
                                                                            {fullStudentInfo?.gioi_tinh ||
                                                                                'Chưa cập nhật'}
                                                                        </span>
                                                                    </div>

                                                                    <div>
                                                                        <span className="block text-gray-500 text-xs mb-1">
                                                                            Số điện thoại
                                                                        </span>
                                                                        <span className="font-semibold text-gray-800">
                                                                            {fullStudentInfo?.so_dien_thoai ||
                                                                                'Chưa cập nhật'}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-gray-500 text-xs mb-1">
                                                                            Email liên hệ
                                                                        </span>
                                                                        <span
                                                                            className="font-semibold text-gray-800 truncate block"
                                                                            title={
                                                                                fullStudentInfo?.email
                                                                            }>
                                                                            {fullStudentInfo?.email ||
                                                                                'Chưa cập nhật'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-span-2">
                                                                        <span className="block text-gray-500 text-xs mb-1">
                                                                            Địa chỉ
                                                                        </span>
                                                                        <span
                                                                            className="font-semibold text-gray-800 truncate block"
                                                                            title={
                                                                                fullStudentInfo?.dia_chi
                                                                            }>
                                                                            {fullStudentInfo?.dia_chi ||
                                                                                'Chưa cập nhật'}
                                                                        </span>
                                                                    </div>

                                                                    <div className="col-span-4 border-t pt-4 mt-2">
                                                                        <span className="block text-gray-500 text-xs mb-1">
                                                                            Mục tiêu đầu ra (Chứng
                                                                            chỉ)
                                                                        </span>
                                                                        <span className="font-bold text-purple-700">
                                                                            {fullStudentInfo?.dau_ra_chung_chi ||
                                                                                'Chưa cập nhật mục tiêu đầu ra'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* 2. KHỐI CHI TIẾT KHÓA HỌC */}
                                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm relative overflow-hidden mb-6">
                                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>
                                                        <div
                                                            className="flex justify-between items-center p-4 pl-6 cursor-pointer hover:bg-green-50/30 transition-colors"
                                                            onClick={() =>
                                                                setShowCourseInfo(!showCourseInfo)
                                                            }>
                                                            <h3 className="font-bold text-gray-800 flex items-center gap-2 uppercase text-sm">
                                                                <FaBookOpen className="text-green-600 text-lg" />{' '}
                                                                Khóa học áp dụng
                                                            </h3>
                                                            <button className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded text-xs font-semibold hover:bg-green-100 transition pointer-events-none">
                                                                {showCourseInfo ? (
                                                                    <FaChevronUp />
                                                                ) : (
                                                                    <FaChevronDown />
                                                                )}{' '}
                                                                {showCourseInfo
                                                                    ? 'Thu gọn'
                                                                    : 'Xem chi tiết'}
                                                            </button>
                                                        </div>

                                                        {showCourseInfo && (
                                                            <div className="p-5 pl-6 border-t border-gray-100 animate-fade-in-down bg-white">
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6 text-sm">
                                                                    <div className="col-span-2">
                                                                        <span className="block text-gray-500 text-xs mb-1">
                                                                            Tên khóa học
                                                                        </span>
                                                                        <span className="font-bold text-gray-900 text-base">
                                                                            {fullCourseInfo?.ten_khoa_hoc ||
                                                                                danhSachKhoaHoc.find(
                                                                                    (k) =>
                                                                                        k.ma_khoa_hoc.toString() ===
                                                                                        formData.ma_khoa_hoc,
                                                                                )?.ten_khoa_hoc ||
                                                                                '-'}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-gray-500 text-xs mb-1">
                                                                            Học phí
                                                                        </span>
                                                                        <span className="font-bold text-red-600 text-base">
                                                                            {formatCurrency(
                                                                                fullCourseInfo?.hoc_phi,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-gray-500 text-xs mb-1">
                                                                            Thời lượng
                                                                        </span>
                                                                        <span className="font-semibold text-gray-800 text-base">
                                                                            {fullCourseInfo?.thoi_luong ||
                                                                                'Chưa cập nhật'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Chi Tiết Bản Cam Kết (Luôn Hiển Thị) */}
                                                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                                        <h3 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                                                            <FaFileAlt /> Chi tiết Bản cam kết
                                                        </h3>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-sm mb-5">
                                                            <div>
                                                                <span className="block text-gray-500 text-xs mb-1">
                                                                    Ngày ký
                                                                </span>
                                                                <span className="font-semibold text-gray-800">
                                                                    {formData.ngay_ky
                                                                        ? new Date(
                                                                              formData.ngay_ky,
                                                                          ).toLocaleDateString(
                                                                              'vi-VN',
                                                                          )
                                                                        : '-'}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="block text-gray-500 text-xs mb-1">
                                                                    Ngày hết hạn
                                                                </span>
                                                                <span className="font-semibold text-gray-800">
                                                                    {formData.ngay_het_han
                                                                        ? new Date(
                                                                              formData.ngay_het_han,
                                                                          ).toLocaleDateString(
                                                                              'vi-VN',
                                                                          )
                                                                        : 'Vô thời hạn'}
                                                                </span>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="block text-gray-500 text-xs mb-1">
                                                                    Trạng thái
                                                                </span>
                                                                <span
                                                                    className={`px-2.5 py-1 rounded text-xs font-bold border ${formData.trang_thai === 'Đang hiệu lực' ? 'bg-green-100 text-green-700 border-green-200' : formData.trang_thai === 'Đã hết hạn' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                                                    {formData.trang_thai}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="mb-5">
                                                            <span className="block text-gray-500 text-xs mb-1">
                                                                Nội dung hợp đồng
                                                            </span>
                                                            <div className="bg-white p-3 border border-gray-200 rounded text-gray-700 leading-relaxed min-h-[60px]">
                                                                {formData.noi_dung_cam_ket}
                                                            </div>
                                                        </div>

                                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
                                                            Điều kiện nội quy bắt buộc
                                                        </h4>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                                                            <div className="bg-white p-3 rounded border border-gray-200">
                                                                <span className="block text-[10px] text-gray-500 mb-1 font-bold">
                                                                    Vắng mặt tối đa
                                                                </span>
                                                                <span className="text-lg font-black text-amber-600">
                                                                    {formData.so_buoi_vang_cho_phep}
                                                                </span>{' '}
                                                                <span className="text-xs text-gray-500">
                                                                    buổi
                                                                </span>
                                                            </div>
                                                            <div className="bg-white p-3 rounded border border-gray-200">
                                                                <span className="block text-[10px] text-gray-500 mb-1 font-bold">
                                                                    Đi muộn tối đa
                                                                </span>
                                                                <span className="text-lg font-black text-purple-600">
                                                                    {formData.so_buoi_di_muon}
                                                                </span>{' '}
                                                                <span className="text-xs text-gray-500">
                                                                    buổi
                                                                </span>
                                                            </div>
                                                            <div className="bg-white p-3 rounded border border-gray-200">
                                                                <span className="block text-[10px] text-gray-500 mb-1 font-bold">
                                                                    Thiếu bài tập
                                                                </span>
                                                                <span className="text-lg font-black text-blue-600">
                                                                    {formData.so_lan_thieu_bai_tap}
                                                                </span>{' '}
                                                                <span className="text-xs text-gray-500">
                                                                    lần
                                                                </span>
                                                            </div>
                                                            <div className="bg-white p-3 rounded border border-gray-200 flex flex-col justify-center">
                                                                <span className="block text-[10px] text-gray-500 mb-1 font-bold">
                                                                    Quy định kỳ thi
                                                                </span>
                                                                <span
                                                                    className={`text-sm font-bold ${formData.tham_gia_thi_day_du ? 'text-green-600' : 'text-gray-500'}`}>
                                                                    {formData.tham_gia_thi_day_du
                                                                        ? 'Bắt buộc thi'
                                                                        : 'Không bắt buộc'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        // GIAO DIỆN FORM ĐỂ THÊM/SỬA
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="relative">
                                                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                                                        Tên học viên{' '}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="ten_hoc_vien"
                                                        value={formData.ten_hoc_vien}
                                                        onChange={handleNameChange}
                                                        onFocus={() =>
                                                            studentSuggestions.length > 0 &&
                                                            setShowSuggestions(true)
                                                        }
                                                        onBlur={handleNameBlur}
                                                        placeholder="Nhập tên học viên..."
                                                        className={`w-full border rounded-md px-3 py-2.5 outline-none text-black bg-white focus:ring-2 focus:ring-blue-500 ${formErrors.ten_hoc_vien ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                                    />
                                                    {formErrors.ten_hoc_vien && (
                                                        <p className="text-red-500 text-xs italic mt-1 font-medium">
                                                            {formErrors.ten_hoc_vien}
                                                        </p>
                                                    )}

                                                    {showSuggestions && (
                                                        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                                            {isSearching ? (
                                                                <li className="p-3 text-sm text-gray-500 text-center">
                                                                    Đang tìm kiếm...
                                                                </li>
                                                            ) : studentSuggestions.length > 0 ? (
                                                                studentSuggestions.map((sv) => (
                                                                    <li
                                                                        key={sv.ma_hoc_vien}
                                                                        onMouseDown={() =>
                                                                            selectStudent(sv)
                                                                        }
                                                                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0">
                                                                        <div className="font-bold text-gray-800">
                                                                            {sv.ho_ten}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            Mã HV:{' '}
                                                                            <span className="text-blue-600 font-semibold">
                                                                                {sv.ma_hoc_vien}
                                                                            </span>
                                                                        </div>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li className="p-3 text-sm text-red-500 text-center">
                                                                    Không tìm thấy học viên
                                                                </li>
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                                                        Mã học viên{' '}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="ma_hoc_vien"
                                                        value={formData.ma_hoc_vien}
                                                        onChange={handleChange}
                                                        onBlur={handleIdBlur}
                                                        className={`w-full border rounded-md px-3 py-2.5 outline-none text-black bg-white focus:ring-2 focus:ring-blue-500 ${formErrors.ma_hoc_vien ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                                    />
                                                    {formErrors.ma_hoc_vien && (
                                                        <p className="text-red-500 text-xs italic mt-1 font-medium">
                                                            {formErrors.ma_hoc_vien}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                                                        Khóa học cam kết{' '}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="ma_khoa_hoc"
                                                        value={formData.ma_khoa_hoc}
                                                        onChange={handleChange}
                                                        className={`w-full border rounded-md px-3 py-2.5 outline-none text-black bg-white focus:ring-2 focus:ring-blue-500 ${formErrors.ma_khoa_hoc ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}>
                                                        <option value="">
                                                            -- Chọn khóa học --
                                                        </option>
                                                        {danhSachKhoaHoc.map((kh) => (
                                                            <option
                                                                key={kh.ma_khoa_hoc}
                                                                value={kh.ma_khoa_hoc.toString()}>
                                                                {kh.ten_khoa_hoc}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {formErrors.ma_khoa_hoc && (
                                                        <p className="text-red-500 text-xs italic mt-1 font-medium">
                                                            {formErrors.ma_khoa_hoc}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                                                        Trạng thái
                                                    </label>
                                                    <select
                                                        name="trang_thai"
                                                        value={formData.trang_thai}
                                                        onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                                        <option value="Đang hiệu lực">
                                                            Đang hiệu lực
                                                        </option>
                                                        <option value="Đã hết hạn">
                                                            Đã hết hạn
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                                                        Ngày ký{' '}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="ngay_ky"
                                                        value={formData.ngay_ky}
                                                        onChange={handleChange}
                                                        className={`w-full border rounded-md px-3 py-2.5 outline-none text-black bg-white focus:ring-2 focus:ring-blue-500 ${formErrors.ngay_ky ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                                    />
                                                    {formErrors.ngay_ky && (
                                                        <p className="text-red-500 text-xs italic mt-1 font-medium">
                                                            {formErrors.ngay_ky}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                                                        Ngày hết hạn
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="ngay_het_han"
                                                        value={formData.ngay_het_han}
                                                        onChange={handleChange}
                                                        className={`w-full border rounded-md px-3 py-2.5 outline-none text-black bg-white focus:ring-2 focus:ring-blue-500 ${formErrors.ngay_het_han || dateError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                                    />
                                                    {formErrors.ngay_het_han && (
                                                        <p className="text-red-500 text-xs italic mt-1 font-medium">
                                                            {formErrors.ngay_het_han}
                                                        </p>
                                                    )}
                                                    {dateError && !formErrors.ngay_het_han && (
                                                        <p className="text-red-500 text-xs italic mt-1 font-medium">
                                                            {dateError}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                                                    Thiết lập Điều kiện & Nội quy
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1 font-bold">
                                                            Tối đa VẮNG
                                                        </label>
                                                        <div className="flex">
                                                            <input
                                                                type="number"
                                                                name="so_buoi_vang_cho_phep"
                                                                value={
                                                                    formData.so_buoi_vang_cho_phep
                                                                }
                                                                onChange={handleChange}
                                                                className={`w-16 border rounded-l px-2 py-2 text-center text-blue-600 font-bold text-[15px] outline-none ${formErrors.so_buoi_vang_cho_phep ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-400'}`}
                                                            />
                                                            <span className="bg-gray-50 border border-l-0 border-gray-300 rounded-r px-3 py-2 text-sm text-gray-600 font-medium">
                                                                buổi
                                                            </span>
                                                        </div>
                                                        {formErrors.so_buoi_vang_cho_phep && (
                                                            <p className="text-red-500 text-[10px] mt-1 font-medium">
                                                                {formErrors.so_buoi_vang_cho_phep}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1 font-bold">
                                                            Tối đa ĐI MUỘN
                                                        </label>
                                                        <div className="flex">
                                                            <input
                                                                type="number"
                                                                name="so_buoi_di_muon"
                                                                value={formData.so_buoi_di_muon}
                                                                onChange={handleChange}
                                                                className={`w-16 border rounded-l px-2 py-2 text-center text-blue-600 font-bold text-[15px] outline-none ${formErrors.so_buoi_di_muon ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-400'}`}
                                                            />
                                                            <span className="bg-gray-50 border border-l-0 border-gray-300 rounded-r px-3 py-2 text-sm text-gray-600 font-medium">
                                                                buổi
                                                            </span>
                                                        </div>
                                                        {formErrors.so_buoi_di_muon && (
                                                            <p className="text-red-500 text-[10px] mt-1 font-medium">
                                                                {formErrors.so_buoi_di_muon}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1 font-bold">
                                                            Thiếu BÀI TẬP
                                                        </label>
                                                        <div className="flex">
                                                            <input
                                                                type="number"
                                                                name="so_lan_thieu_bai_tap"
                                                                value={
                                                                    formData.so_lan_thieu_bai_tap
                                                                }
                                                                onChange={handleChange}
                                                                className={`w-16 border rounded-l px-2 py-2 text-center text-blue-600 font-bold text-[15px] outline-none ${formErrors.so_lan_thieu_bai_tap ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-400'}`}
                                                            />
                                                            <span className="bg-gray-50 border border-l-0 border-gray-300 rounded-r px-3 py-2 text-sm text-gray-600 font-medium">
                                                                lần
                                                            </span>
                                                        </div>
                                                        {formErrors.so_lan_thieu_bai_tap && (
                                                            <p className="text-red-500 text-[10px] mt-1 font-medium">
                                                                {formErrors.so_lan_thieu_bai_tap}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col justify-center pt-3">
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                name="tham_gia_thi_day_du"
                                                                checked={
                                                                    formData.tham_gia_thi_day_du
                                                                }
                                                                onChange={handleChange}
                                                                className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                                            />
                                                            <span className="ml-2 text-xs font-bold text-gray-600 uppercase">
                                                                Bắt buộc thi
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5 uppercase">
                                                        Nội dung hợp đồng chi tiết{' '}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea
                                                        name="noi_dung_cam_ket"
                                                        value={formData.noi_dung_cam_ket}
                                                        onChange={handleChange}
                                                        rows={3}
                                                        className={`w-full border rounded-md px-3 py-2.5 outline-none text-black bg-white focus:ring-2 focus:ring-blue-500 resize-none ${formErrors.noi_dung_cam_ket ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}></textarea>
                                                    {formErrors.noi_dung_cam_ket && (
                                                        <p className="text-red-500 text-xs italic mt-1 font-medium">
                                                            {formErrors.noi_dung_cam_ket}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 2: KIỂM TRA VI PHẠM */}
                            {activeTab === 'violation' && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div
                                        className={`p-5 rounded-xl border relative overflow-hidden ${formData.bi_vi_pham ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`mt-1 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${formData.bi_vi_pham ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {formData.bi_vi_pham ? (
                                                        <FaExclamationTriangle size={18} />
                                                    ) : (
                                                        <FaCheckCircle size={18} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3
                                                        className={`font-bold text-lg uppercase tracking-wide ${formData.bi_vi_pham ? 'text-red-600' : 'text-gray-800'}`}>
                                                        {formData.bi_vi_pham
                                                            ? 'Đã vi phạm cam kết'
                                                            : 'Chưa ghi nhận vi phạm'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Dữ liệu được tổng hợp từ điểm danh và nhận
                                                        xét của giáo viên.
                                                    </p>
                                                </div>
                                            </div>

                                            {editingId && !isViewMode && (
                                                <button
                                                    onClick={handleCheckViolation}
                                                    disabled={isChecking}
                                                    className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition shadow-sm disabled:opacity-70">
                                                    <FaSync
                                                        className={isChecking ? 'animate-spin' : ''}
                                                    />{' '}
                                                    {isChecking
                                                        ? 'Đang phân tích...'
                                                        : 'Cập nhật dữ liệu mới'}
                                                </button>
                                            )}
                                        </div>
                                        {formData.bi_vi_pham && formData.ly_do_vi_pham && (
                                            <div className="mt-5 bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                                                <span className="font-bold text-red-600 block mb-2 text-sm">
                                                    Chi tiết vi phạm hệ thống phát hiện:
                                                </span>
                                                <span className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                                                    {formData.ly_do_vi_pham}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1 mt-8 mb-3">
                                        Thống kê chi tiết quá trình học
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center p-5 relative overflow-hidden">
                                            <div
                                                className={`absolute top-0 left-0 w-full h-1.5 ${violationStats.thieu_bt > (Number(formData.so_lan_thieu_bai_tap) || 0) ? 'bg-blue-500' : 'bg-blue-500'}`}></div>
                                            <FaTasks className="text-2xl mb-3 text-blue-400" />
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                                                Thiếu bài tập
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-gray-800">
                                                    {violationStats.thieu_bt}
                                                </span>
                                                <span className="text-sm font-medium text-gray-500">
                                                    lần
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 mt-3 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                                                Cho phép: {formData.so_lan_thieu_bai_tap}
                                            </span>
                                        </div>
                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center p-5 relative overflow-hidden">
                                            <div
                                                className={`absolute top-0 left-0 w-full h-1.5 ${violationStats.vang > (Number(formData.so_buoi_vang_cho_phep) || 0) ? 'bg-amber-500' : 'bg-amber-500'}`}></div>
                                            <FaUserGraduate className="text-2xl mb-3 text-amber-500" />
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                                                Vắng học
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-gray-800">
                                                    {violationStats.vang}
                                                </span>
                                                <span className="text-sm font-medium text-gray-500">
                                                    buổi
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 mt-3 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                                                Cho phép: {formData.so_buoi_vang_cho_phep}
                                            </span>
                                        </div>
                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center p-5 relative overflow-hidden">
                                            <div
                                                className={`absolute top-0 left-0 w-full h-1.5 ${violationStats.muon > (Number(formData.so_buoi_di_muon) || 0) ? 'bg-purple-500' : 'bg-purple-500'}`}></div>
                                            <FaClock className="text-2xl mb-3 text-purple-500" />
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                                                Đi muộn
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-gray-800">
                                                    {violationStats.muon}
                                                </span>
                                                <span className="text-sm font-medium text-gray-500">
                                                    buổi
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 mt-3 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                                                Cho phép: {formData.so_buoi_di_muon}
                                            </span>
                                        </div>
                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center p-5 relative overflow-hidden">
                                            <div
                                                className={`absolute top-0 left-0 w-full h-1.5 ${formData.tham_gia_thi_day_du && violationStats.bo_thi ? 'bg-green-500' : 'bg-green-500'}`}></div>
                                            <FaFileAlt className="text-2xl mb-3 text-green-500" />
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                                                Bỏ thi / test
                                            </span>
                                            <div className="flex items-baseline gap-1 mt-1 mb-1">
                                                <span className="text-3xl font-black text-gray-800">
                                                    {violationStats.bo_thi ? 'Có' : 'Không'}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 mt-3 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                                                Bắt buộc:{' '}
                                                {formData.tham_gia_thi_day_du ? 'Có' : 'Không'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Modal */}
                        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3 shrink-0">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-100 font-semibold transition">
                                Đóng
                            </button>
                            {!isViewMode && activeTab === 'info' && (
                                <button
                                    onClick={handleSaveCamKet}
                                    className="flex items-center gap-2 px-8 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-semibold transition shadow-sm">
                                    <FaSave /> {editingId ? 'Lưu cập nhật' : 'Tạo cam kết'}
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
                        <button
                            onClick={closeDeleteModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                            <FaTimes size={20} />
                        </button>
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mr-4">
                                <FaExclamationTriangle className="text-red-600 text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa</h3>
                        </div>
                        <p className="text-gray-600 mb-6 ml-16 text-sm">
                            Bạn có chắc chắn muốn xóa bản cam kết này?
                        </p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                onClick={closeDeleteModal}
                                className="px-5 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                                Hủy bỏ
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors shadow-sm">
                                Xác nhận xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-5 right-5 z-[70] animate-fade-in-down transition-all duration-300">
                    <div
                        className={`flex items-center min-w-[300px] p-4 bg-white rounded shadow-lg border-l-4 ${toast.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
                        <div className="flex-shrink-0 mr-3">
                            {toast.type === 'success' ? (
                                <FaCheckCircle className="text-green-500 text-2xl" />
                            ) : (
                                <div className="bg-red-100 rounded-full p-1">
                                    <FaTimes className="text-red-500 text-lg" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-gray-800 font-medium text-sm">
                            {toast.message}
                        </div>
                        <button
                            onClick={() => setToast(null)}
                            className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none">
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
