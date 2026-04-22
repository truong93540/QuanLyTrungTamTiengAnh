'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash } from 'react-icons/fa'

interface PhieuThu {
    ma_phieu_thu: number
    so_tien: number
    ngay_thu: string
    noi_dung: string
    ma_hoc_vien: number
    ma_nhan_su: number
    hoc_vien?: { ho_ten: string }
    nhan_su?: { ho_ten: string }
}

export default function PhieuThuHocPhiPage() {
    const [data, setData] = useState<PhieuThu[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        ma_phieu_thu: '',
        so_tien: '',
        ngay_thu: '',
        ma_hoc_vien: '',
        ma_nhan_su: '',
        noi_dung: '',
        ten_hoc_vien: '',
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
                const response = await fetch('/api/tai-chinh/phieu-thu')
                if (response.ok) {
                    const result = await response.json()
                    setData(result)
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        })
        setFormError(null)
        setEditingId(null)
    }

    // === HÀM BẤM NÚT XÓA Ở TỪNG DÒNG ===
    const handleDeleteClick = async (id: number) => {
        // Hiện hộp thoại cảnh báo trước khi xóa thật
        const isConfirm = window.confirm(
            'Bạn có chắc chắn muốn xóa phiếu thu này không? Hành động này không thể hoàn tác!',
        )

        if (isConfirm) {
            try {
                const response = await fetch(`/api/tai-chinh/phieu-thu?id=${id}`, {
                    method: 'DELETE',
                })

                if (response.ok) {
                    setData(data.filter((item) => item.ma_phieu_thu !== id))
                    alert('Đã xóa phiếu thu thành công!')
                } else {
                    alert('Có lỗi xảy ra khi xóa.')
                }
            } catch (error) {
                console.error('Lỗi xóa:', error)
                alert('Không thể kết nối đến máy chủ.')
            }
        }
    }

    const handleSavePhieuThu = async () => {
        if (isSubmitting) return
        if (
            !formData.so_tien ||
            !formData.ngay_thu ||
            !formData.ma_hoc_vien ||
            !formData.ma_nhan_su
        ) {
            setFormError('Vui lòng nhập đầy đủ thông tin bắt buộc!')
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
                    alert('Cập nhật phiếu thu thành công!')
                    setIsModalOpen(false)
                } else {
                    setData([savedPhieuThu, ...data])
                    alert('Thêm phiếu thu thành công!')
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
                <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50 transition-opacity">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-auto shadow-lg">
                        <div className="flex justify-between items-center p-5 border-b rounded-t-lg">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-6 text-gray-700 mt-5">
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
                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm font-medium text-gray-700">
                                        Mã học viên:
                                    </label>
                                    <input
                                        type="number"
                                        name="ma_hoc_vien"
                                        value={formData.ma_hoc_vien}
                                        onChange={handleChange}
                                        className="w-3/4 border border-gray-300 rounded p-2 focus:outline-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 flex flex-col">
                                <div className="flex items-center">
                                    <label className="w-1/3 text-sm font-medium text-gray-700">
                                        Mã nhân sự lập phiếu:
                                    </label>
                                    <input
                                        type="number"
                                        name="ma_nhan_su"
                                        value={formData.ma_nhan_su}
                                        onChange={handleChange}
                                        className="w-2/3 border border-gray-300 rounded p-2 focus:outline-blue-500"
                                    />
                                </div>
                                <div className="flex items-start flex-1">
                                    <label className="w-1/3 text-sm font-medium text-gray-700 pt-2">
                                        Nội dung:
                                    </label>
                                    <textarea
                                        name="noi_dung"
                                        value={formData.noi_dung}
                                        onChange={handleChange}
                                        className="w-2/3 h-full min-h-30 border border-gray-300 rounded p-2 focus:outline-blue-500 resize-none"></textarea>
                                </div>
                            </div>
                        </div>

                        {formError && (
                            <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {formError}
                            </div>
                        )}
                        <div className="p-5 border-t rounded-b-lg flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-100 font-medium transition cursor-pointer">
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSavePhieuThu}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-5 py-2 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm cursor-pointer">
                                <FaSave /> {editingId ? 'Cập nhật' : 'Lưu phiếu thu'}
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
                                <th className="border border-gray-300 p-3">Mã phiếu thu</th>
                                <th className="border border-gray-300 p-3">Số tiền</th>
                                <th className="border border-gray-300 p-3">Ngày thu</th>
                                <th className="border border-gray-300 p-3">Mã học viên</th>
                                <th className="border border-gray-300 p-3">Tên học viên</th>
                                <th className="border border-gray-300 p-3">Mã người lập</th>
                                <th className="border border-gray-300 p-3">Tên người lập</th>
                                <th className="border border-gray-300 p-3 w-48">Nội dung</th>
                                <th className="border border-gray-300 p-3 w-24">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row) => (
                                <tr
                                    key={row.ma_phieu_thu}
                                    className={`transition text-gray-700 ${editingId === row.ma_phieu_thu ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}>
                                    <td className="border border-gray-300 p-3">
                                        {row.ma_phieu_thu}
                                    </td>
                                    <td className="border border-gray-300 p-3 font-medium text-blue-600">
                                        {new Intl.NumberFormat('vi-VN').format(row.so_tien)}
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                        {new Date(row.ngay_thu).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                        {row.ma_hoc_vien}
                                    </td>
                                    <td className="border border-gray-300 p-3 font-medium">
                                        {row.hoc_vien?.ho_ten || 'Không rõ'}
                                    </td>
                                    <td className="border border-gray-300 p-3">{row.ma_nhan_su}</td>
                                    <td className="border border-gray-300 p-3">
                                        {row.nhan_su?.ho_ten || 'Không rõ'}
                                    </td>
                                    <td className="border border-gray-300 p-3 text-left">
                                        {row.noi_dung}
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                        <div className="flex justify-center">
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
        </div>
    )
}
