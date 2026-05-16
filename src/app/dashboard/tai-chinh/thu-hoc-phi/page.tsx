'use client'

import Alert from '@/components/Alert'
import ConfirmModal from '@/components/ConfirmModal'
import { useState, useEffect, useRef } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash } from 'react-icons/fa'

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



export default function PhieuThuHocPhiPage() {
    const [data, setData] = useState<PhieuThu[]>([])
    const [nhanSuList, setNhanSuList] = useState<NhanSu[]>([])
    const [hocVienList, setHocVienList] = useState<HocVien[]>([])
    const [khoaHocList, setKhoaHocList] = useState<KhoaHoc[]>([])
    const [khuyenMaiList, setKhuyenMaiList] = useState<KhuyenMai[]>([])
    const [isLoading, setIsLoading] = useState(true)
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

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(data.length / itemsPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [phieuThuRes, nhanSuRes, hocVienRes, khoaHocRes, khuyenMaiRes] = await Promise.all([
                    fetch('/api/tai-chinh/phieu-thu'),
                    fetch('/api/tai-chinh/nhan-vien'),
                    fetch('/api/dao-tao/hoc-vien'),
                    fetch('/api/tai-chinh/khoa-hoc'),
                    fetch('/api/tai-chinh/khuyen-mai'),
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
                    setHocVienList(resultHv)
                }
                if (khoaHocRes.ok) {
                    const resultKh = await khoaHocRes.json()
                    setKhoaHocList(resultKh)
                }
                if (khuyenMaiRes.ok) {
                    const resultKm = await khuyenMaiRes.json()
                    setKhuyenMaiList(resultKm)
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
        if (!formData.ma_khoa_hoc) return

        const khoaHoc = khoaHocList.find(kh => kh.ma_khoa_hoc.toString() === formData.ma_khoa_hoc)
        if (!khoaHoc) return

        let finalPrice = Number(khoaHoc.hoc_phi)

        if (formData.ma_khuyen_mai) {
            const khuyenMai = khuyenMaiList.find(km => km.ma_khuyen_mai.toString() === formData.ma_khuyen_mai)
            if (khuyenMai && khuyenMai.phan_tram_giam) {
                finalPrice = finalPrice * (1 - khuyenMai.phan_tram_giam / 100)
            }
        }

        setFormData(prev => {
            // Chỉ cập nhật nếu khác biệt để tránh re-render vô hạn
            if (prev.so_tien !== finalPrice.toString()) {
                return { ...prev, so_tien: finalPrice.toString() }
            }
            return prev
        })
    }, [formData.ma_khoa_hoc, formData.ma_khuyen_mai, khoaHocList, khuyenMaiList])

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
        setIsModalOpen(true)
        setFormData({
            ma_phieu_thu: '',
            so_tien: '',
            ngay_thu: new Date().toISOString().split('T')[0],
            ma_hoc_vien: '',
            noi_dung: '',
            ma_nhan_su: '',
            ten_hoc_vien: '',
            ma_khoa_hoc: '',
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
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8 uppercase">
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
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-x-12 gap-y-6 text-gray-700">
                                <div className="space-y-4 md:col-span-2">
                                {editingId && (
                                    <div className="flex items-center">
                                        <label className="w-1/4 text-sm font-medium text-gray-700">
                                            Mã phiếu thu:
                                        </label>
                                        <input
                                            type="number"
                                            name="ma_phieu_thu"
                                            value={formData.ma_phieu_thu}
                                            onChange={handleChange}
                                            placeholder={editingId ? 'Đang sửa đổi...' : ''}
                                            disabled={editingId !== null}
                                            className={`w-3/4 border rounded p-2 focus:outline-blue-500  ${editingId ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                                        />
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm font-medium text-gray-700">
                                        Số tiền:
                                    </label>
                                    <div className="w-3/4 relative">
                                        <input
                                            type="number"
                                            name="so_tien"
                                            value={formData.so_tien}
                                            readOnly
                                            disabled
                                            className="w-full border border-gray-200 bg-gray-100 text-gray-700 rounded p-2 pr-12 font-medium cursor-not-allowed"
                                        />
                                        <span className="absolute right-3 top-2 text-gray-500 font-medium">
                                            VNĐ
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm font-medium text-gray-700">
                                        Ngày thu:
                                    </label>
                                    <input
                                        type="date"
                                        name="ngay_thu"
                                        value={formData.ngay_thu}
                                        onChange={handleChange}
                                        className="w-3/4 border border-gray-300 rounded p-2 focus:outline-blue-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                                <div className="flex items-start">
                                    <label className="w-1/4 text-sm font-medium text-gray-700 pt-2">
                                        Mã học viên:
                                    </label>
                                    <div className="w-3/4">
                                        <input
                                            type="number"
                                            name="ma_hoc_vien"
                                            value={formData.ma_hoc_vien}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded p-2 focus:outline-blue-500"
                                        />
                                        {formData.ma_hoc_vien && (
                                            <div className="text-sm mt-1 font-medium text-blue-600">
                                                {hocVienList.some(hv => hv.ma_hoc_vien.toString() === formData.ma_hoc_vien)
                                                    ? `Tên học viên: ${hocVienList.find(hv => hv.ma_hoc_vien.toString() === formData.ma_hoc_vien)?.ho_ten}`
                                                    : <span className="text-red-500">Không tìm thấy học viên</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                            </div>

                            <div className="space-y-4 flex flex-col md:col-span-3">
                                <div className="flex items-center">
                                    <label className="w-1/3 text-sm font-medium text-gray-700">
                                        Khóa học:
                                    </label>
                                    <div className="w-2/3 relative" ref={khoaHocDropdownRef}>
                                        <div
                                            className="w-full border border-gray-300 rounded p-2 bg-white flex justify-between items-center cursor-pointer hover:border-blue-500"
                                            onClick={() => setIsKhoaHocDropdownOpen(!isKhoaHocDropdownOpen)}
                                        >
                                            <span className="truncate text-sm">
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
                                    <div className="flex items-center">
                                        <label className="w-1/3 text-sm font-medium text-gray-700">
                                            Khuyến mãi áp dụng:
                                        </label>
                                        <div className="w-2/3 relative" ref={khuyenMaiDropdownRef}>
                                            <div
                                                className="w-full border border-gray-300 rounded p-2 bg-white flex justify-between items-center cursor-pointer hover:border-blue-500"
                                                onClick={() => setIsKhuyenMaiDropdownOpen(!isKhuyenMaiDropdownOpen)}
                                            >
                                                <span className="truncate text-sm">
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
                                <div className="flex items-center">
                                    <label className="w-1/3 text-sm font-medium text-gray-700">
                                        Người lập phiếu:
                                    </label>
                                    <div className="w-2/3 relative" ref={nhanSuDropdownRef}>
                                        <div
                                            className="w-full border border-gray-300 rounded p-2 bg-white flex justify-between items-center cursor-pointer hover:border-blue-500"
                                            onClick={() => setIsNhanSuDropdownOpen(!isNhanSuDropdownOpen)}
                                        >
                                            <span className="truncate text-sm">
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
                                <div className="flex items-start">
                                    <label className="w-1/3 text-sm font-medium text-gray-700 pt-2">
                                        Nội dung:
                                    </label>
                                    <textarea
                                        name="noi_dung"
                                        value={formData.noi_dung}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-2/3 border border-gray-300 rounded p-2 focus:outline-blue-500 resize-none"></textarea>
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

            <div className="flex justify-between items-end gap-4 mb-8 border-b pb-6">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tìm kiếm theo tên học viên:
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="ten_hoc_vien"
                            value={formData.ten_hoc_vien}
                            onChange={handleChange}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Nhập tên học viên..."
                            className="border border-gray-300 rounded p-2 focus:outline-blue-500 text-gray-800"
                        />
                        <button
                            onClick={handleSearch}
                            className="flex items-center gap-2 px-6 py-2 font-medium transition shadow-sm cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700">
                            <FaSearch /> Tìm kiếm
                        </button>
                    </div>
                </div>
                <button
                    onClick={openModalForAdd}
                    className="flex items-center gap-2 px-6 py-2 font-medium transition shadow-sm cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700">
                    <FaPlus /> Thêm mới
                </button>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500 font-medium">
                        Đang tải dữ liệu từ CSDL...
                    </div>
                ) : (
                    <table className="w-full border-collapse border border-gray-300 text-sm text-center">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="border border-gray-300 p-1">Mã phiếu</th>
                                <th className="border border-gray-300 p-1">Số tiền</th>
                                <th className="border border-gray-300 p-1">Ngày thu</th>
                                <th className="border border-gray-300 p-1">Mã HV</th>
                                <th className="border border-gray-300 p-1">Tên HV</th>
                                <th className="border border-gray-300 p-1">Tên người lập</th>
                                <th className="border border-gray-300 p-1">Nội dung</th>
                                <th className="border border-gray-300 p-1">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row) => (
                                <tr
                                    key={row.ma_phieu_thu}
                                    className={`transition text-gray-700 ${editingId === row.ma_phieu_thu ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}>
                                    <td className="border border-gray-300 p-1">
                                        {row.ma_phieu_thu}
                                    </td>
                                    <td className="border border-gray-300 p-1 font-medium text-blue-600">
                                        {new Intl.NumberFormat('vi-VN').format(row.so_tien)}
                                    </td>
                                    <td className="border border-gray-300 p-1">
                                        {new Date(row.ngay_thu).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="border border-gray-300 p-1">
                                        {row.ma_hoc_vien}
                                    </td>
                                    <td className="border border-gray-300 p-1 font-medium text-left">
                                        {row.hoc_vien?.ho_ten || 'Không rõ'}
                                    </td>
                                    <td className="border border-gray-300 p-1 text-left">
                                        {row.nhan_su?.ho_ten || 'Không rõ'}
                                    </td>
                                    <td className="border border-gray-300 p-1 text-left">
                                        {row.noi_dung}
                                    </td>
                                    <td className="border border-gray-300 p-1">
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
                            ))}
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
                                className={`px-3 py-1 rounded border ${
                                    currentPage === number
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
