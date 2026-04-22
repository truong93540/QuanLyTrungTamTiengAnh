'use client'

import Alert from '@/components/Alert'
import ConfirmModal from '@/components/ConfirmModal'
import { useState, useEffect, useRef } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaFileContract } from 'react-icons/fa'

interface PhieuThu {
    ma_phieu_thu: number
    so_tien: number
    ngay_thu: string
    noi_dung: string
    ma_hoc_vien: number
    ma_nhan_su: number
    ma_cam_ket?: number
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

interface CamKet {
    ma_cam_ket: number
    ma_hoc_vien: number
    ngay_ky: string
    noi_dung_cam_ket: string
}

export default function PhieuThuHocPhiPage() {
    const [data, setData] = useState<PhieuThu[]>([])
    const [nhanSuList, setNhanSuList] = useState<NhanSu[]>([])
    const [hocVienList, setHocVienList] = useState<HocVien[]>([])
    const [camKetList, setCamKetList] = useState<CamKet[]>([])
    const [viewCamKetModal, setViewCamKetModal] = useState<{ isOpen: boolean; noiDung: string | null }>({
        isOpen: false,
        noiDung: null,
    })
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isNhanSuDropdownOpen, setIsNhanSuDropdownOpen] = useState(false)
    const nhanSuDropdownRef = useRef<HTMLDivElement>(null)
    const [isCamKetDropdownOpen, setIsCamKetDropdownOpen] = useState(false)
    const camKetDropdownRef = useRef<HTMLDivElement>(null)
    const [isAddingCamKet, setIsAddingCamKet] = useState(false)
    const [isSubmittingCamKet, setIsSubmittingCamKet] = useState(false)
    const [newCamKetData, setNewCamKetData] = useState({
        ngay_ky: new Date().toISOString().split('T')[0],
        ngay_het_han: '',
        noi_dung_cam_ket: ''
    })
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
        ma_cam_ket: '',
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
                const [phieuThuRes, nhanSuRes, hocVienRes, camKetRes] = await Promise.all([
                    fetch('/api/tai-chinh/phieu-thu'),
                    fetch('/api/dao-tao/nhan-su'),
                    fetch('/api/dao-tao/hoc-vien'),
                    fetch('/api/tuyen-sinh/cam-ket')
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
                if (camKetRes.ok) {
                    const resultCk = await camKetRes.json()
                    setCamKetList(resultCk)
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
            if (camKetDropdownRef.current && !camKetDropdownRef.current.contains(event.target as Node)) {
                setIsCamKetDropdownOpen(false)
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
            ma_cam_ket: '',
        })
        setFormError(null)
        setEditingId(null)
        setIsAddingCamKet(false)
        setNewCamKetData({
            ngay_ky: new Date().toISOString().split('T')[0],
            ngay_het_han: '',
            noi_dung_cam_ket: ''
        })
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

    const handleSaveNewCamKet = async () => {
        if (!newCamKetData.noi_dung_cam_ket.trim()) {
            setFormError('Vui lòng nhập nội dung cam kết')
            return
        }
        setIsSubmittingCamKet(true)
        setFormError(null)
        try {
            const payload = {
                ma_hoc_vien: Number(formData.ma_hoc_vien),
                ngay_ky: newCamKetData.ngay_ky,
                trang_thai: 'Đang hiệu lực',
                noi_dung_cam_ket: newCamKetData.noi_dung_cam_ket,
                ngay_het_han: newCamKetData.ngay_het_han ? newCamKetData.ngay_het_han : null
            }
            const response = await fetch('/api/tuyen-sinh/cam-ket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (response.ok) {
                const result = await response.json()
                setCamKetList([result, ...camKetList])
                setFormData({ ...formData, ma_cam_ket: result.ma_cam_ket.toString() })
                setIsAddingCamKet(false)
                setNewCamKetData({
                    ngay_ky: new Date().toISOString().split('T')[0],
                    ngay_het_han: '',
                    noi_dung_cam_ket: ''
                })
                showAlert('Thêm cam kết mới thành công', 'success')
            } else {
                const errorData = await response.json().catch(() => null)
                setFormError(errorData?.error || 'Lỗi khi tạo cam kết')
            }
        } catch (error) {
            setFormError('Lỗi kết nối máy chủ')
        } finally {
            setIsSubmittingCamKet(false)
        }
    }

    const handleSavePhieuThu = async () => {
        if (isSubmitting) return
        if (
            !formData.so_tien ||
            !formData.ngay_thu ||
            !formData.ma_hoc_vien ||
            !formData.ma_nhan_su ||
            !formData.ma_cam_ket
        ) {
            setFormError('Vui lòng nhập đầy đủ thông tin bắt buộc, bao gồm cả cam kết!')
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
            
            const payload = {
                ...formData,
                ma_cam_ket: formData.ma_cam_ket ? Number(formData.ma_cam_ket) : null,
            }

            const response = await fetch('/api/tai-chinh/phieu-thu', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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

    const handleViewCamKet = (ma_cam_ket: number) => {
        const camKet = camKetList.find(ck => ck.ma_cam_ket === ma_cam_ket)
        if (camKet) {
            setViewCamKetModal({ isOpen: true, noiDung: camKet.noi_dung_cam_ket })
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        handleCancelEdit()
    }
    const openModalForAdd = () => {
        setIsModalOpen(true)
        setIsAddingCamKet(false)
        setNewCamKetData({
            ngay_ky: new Date().toISOString().split('T')[0],
            ngay_het_han: '',
            noi_dung_cam_ket: ''
        })
        setFormData({
            ma_phieu_thu: '',
            so_tien: '',
            ngay_thu: new Date().toISOString().split('T')[0],
            ma_hoc_vien: '',
            noi_dung: '',
            ma_nhan_su: '',
            ten_hoc_vien: '',
            ma_cam_ket: '',
        })
    }
    const openModalForEdit = (row: PhieuThu) => {
        setIsAddingCamKet(false)
        setNewCamKetData({
            ngay_ky: new Date().toISOString().split('T')[0],
            ngay_het_han: '',
            noi_dung_cam_ket: ''
        })
        const formattedDate = new Date(row.ngay_thu).toISOString().split('T')[0]
        setFormData({
            ma_phieu_thu: row.ma_phieu_thu.toString(),
            so_tien: row.so_tien.toString(),
            ngay_thu: formattedDate,
            ma_hoc_vien: row.ma_hoc_vien.toString(),
            ma_nhan_su: row.ma_nhan_su.toString(),
            noi_dung: row.noi_dung,
            ten_hoc_vien: row.hoc_vien?.ho_ten || '',
            ma_cam_ket: row.ma_cam_ket ? row.ma_cam_ket.toString() : '',
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-gray-700">
                                <div className="space-y-4">
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
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded p-2 pr-12 focus:outline-blue-500"
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
                                <div className="flex items-start">
                                    <label className="w-1/4 text-sm font-medium text-gray-700 pt-2">
                                        Cam kết áp dụng:
                                    </label>
                                    <div className="w-3/4">
                                        <div className="relative w-full" ref={camKetDropdownRef}>
                                            <div
                                                className={`w-full border rounded p-2 flex justify-between items-center ${!formData.ma_hoc_vien || camKetList.filter(ck => ck.ma_hoc_vien.toString() === formData.ma_hoc_vien).length === 0 ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300 bg-white cursor-pointer hover:border-blue-500'}`}
                                                onClick={() => {
                                                    if (!(!formData.ma_hoc_vien || camKetList.filter(ck => ck.ma_hoc_vien.toString() === formData.ma_hoc_vien).length === 0)) {
                                                        setIsCamKetDropdownOpen(!isCamKetDropdownOpen);
                                                    }
                                                }}
                                            >
                                                <span className="truncate">
                                                    {!formData.ma_hoc_vien 
                                                        ? '-- Nhập mã học viên trước --' 
                                                        : camKetList.filter(ck => ck.ma_hoc_vien.toString() === formData.ma_hoc_vien).length === 0
                                                            ? 'Học viên này chưa có cam kết'
                                                            : formData.ma_cam_ket && camKetList.find(ck => ck.ma_cam_ket.toString() === formData.ma_cam_ket)
                                                                ? `Cam kết ${formData.ma_cam_ket} - ${new Date(camKetList.find(ck => ck.ma_cam_ket.toString() === formData.ma_cam_ket)!.ngay_ky).toLocaleDateString('vi-VN')}`
                                                                : '-- Chọn cam kết --'}
                                                </span>
                                                <span className="text-gray-400 text-xs">▼</span>
                                            </div>
                                            {isCamKetDropdownOpen && formData.ma_hoc_vien && camKetList.filter(ck => ck.ma_hoc_vien.toString() === formData.ma_hoc_vien).length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto custom-scrollbar">
                                                    {camKetList
                                                        .filter(ck => ck.ma_hoc_vien.toString() === formData.ma_hoc_vien)
                                                        .sort((a, b) => b.ma_cam_ket - a.ma_cam_ket)
                                                        .map(ck => (
                                                        <div
                                                            key={ck.ma_cam_ket}
                                                            className={`p-2 text-sm cursor-pointer hover:bg-blue-50 ${formData.ma_cam_ket === ck.ma_cam_ket.toString() ? 'bg-blue-100 font-medium text-blue-700' : 'text-gray-700'}`}
                                                            onClick={() => {
                                                                setFormData({ ...formData, ma_cam_ket: ck.ma_cam_ket.toString() });
                                                                setFormError(null);
                                                                setIsCamKetDropdownOpen(false);
                                                            }}
                                                        >
                                                            Cam kết {ck.ma_cam_ket} - {new Date(ck.ngay_ky).toLocaleDateString('vi-VN')}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
                                            {formData.ma_cam_ket && !isAddingCamKet && (
                                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 w-full mb-2">
                                                    <strong>Nội dung cam kết:</strong> {camKetList.find(ck => ck.ma_cam_ket.toString() === formData.ma_cam_ket)?.noi_dung_cam_ket || 'Không có nội dung'}
                                                </div>
                                            )}
                                            {formData.ma_hoc_vien && !isAddingCamKet && (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAddingCamKet(true)}
                                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 w-full justify-end cursor-pointer"
                                                >
                                                    <FaPlus className="text-xs" /> Thêm cam kết mới
                                                </button>
                                            )}
                                        </div>

                                        {isAddingCamKet && (
                                            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <h4 className="font-semibold text-blue-800 mb-3 text-sm">Tạo cam kết mới</h4>
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Ngày ký</label>
                                                            <input 
                                                                type="date" 
                                                                value={newCamKetData.ngay_ky}
                                                                onChange={(e) => setNewCamKetData({...newCamKetData, ngay_ky: e.target.value})}
                                                                className="w-full border border-gray-300 rounded p-1.5 text-sm focus:outline-blue-500 bg-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1 truncate" title="Ngày hết hạn (Tuỳ chọn)">Ngày hết hạn</label>
                                                            <input 
                                                                type="date" 
                                                                value={newCamKetData.ngay_het_han}
                                                                onChange={(e) => setNewCamKetData({...newCamKetData, ngay_het_han: e.target.value})}
                                                                className="w-full border border-gray-300 rounded p-1.5 text-sm focus:outline-blue-500 bg-white"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Nội dung cam kết <span className="text-red-500">*</span></label>
                                                        <textarea 
                                                            value={newCamKetData.noi_dung_cam_ket}
                                                            onChange={(e) => setNewCamKetData({...newCamKetData, noi_dung_cam_ket: e.target.value})}
                                                            placeholder="Nhập nội dung cam kết..."
                                                            className="w-full border border-gray-300 rounded p-2 text-sm min-h-[80px] focus:outline-blue-500 bg-white"
                                                        ></textarea>
                                                    </div>
                                                    <div className="flex justify-end gap-2 pt-1">
                                                        <button 
                                                            type="button"
                                                            onClick={() => setIsAddingCamKet(false)}
                                                            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100 bg-white cursor-pointer"
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            disabled={isSubmittingCamKet}
                                                            onClick={handleSaveNewCamKet}
                                                            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                                        >
                                                            {isSubmittingCamKet ? 'Đang lưu...' : 'Lưu cam kết'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 flex flex-col">
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
                                        <div className="flex justify-center">
                                            {row.ma_cam_ket && (
                                                <button
                                                    onClick={() => handleViewCamKet(row.ma_cam_ket!)}
                                                    className="p-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-green-100 hover:text-green-600 transition cursor-pointer mr-1"
                                                    title="Xem nội dung cam kết">
                                                    <FaFileContract />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openModalForEdit(row)}
                                                className="p-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-yellow-100 hover:text-yellow-600 transition cursor-pointer"
                                                title="Sửa phiếu thu">
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(row.ma_phieu_thu)}
                                                className="p-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-red-100 hover:text-red-600 transition ml-1 cursor-pointer"
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

            {/* Modal Xem Cam Kết */}
            {viewCamKetModal.isOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50 transition-opacity">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto shadow-lg">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-bold text-gray-800">
                                Nội dung cam kết
                            </h2>
                            <button
                                onClick={() => setViewCamKetModal({ isOpen: false, noiDung: null })}
                                className="text-gray-400 hover:text-red-500 cursor-pointer transition">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <div className="text-gray-700 min-h-[100px] whitespace-pre-wrap p-3 bg-gray-50 border rounded border-gray-200">
                            {viewCamKetModal.noiDung}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setViewCamKetModal({ isOpen: false, noiDung: null })}
                                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition cursor-pointer shadow-sm">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
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
