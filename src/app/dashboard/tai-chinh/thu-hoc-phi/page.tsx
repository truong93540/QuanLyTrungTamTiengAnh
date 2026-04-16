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

    // State nhận biết đang ở chế độ Sửa (lưu ID của phiếu đang sửa), nếu null là đang Thêm mới
    const [editingId, setEditingId] = useState<number | null>(null)

    const [formData, setFormData] = useState({
        ma_phieu_thu: '',
        so_tien: '',
        ngay_thu: '',
        ma_hoc_vien: '',
        ma_nhan_su: '',
        noi_dung: '',
    })

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
                const response = await fetch('/api/phieu-thu')
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // === HÀM BẤM NÚT SỬA Ở TỪNG DÒNG ===
    const handleEditClick = (row: PhieuThu) => {
        // Format ngày tháng từ ISO string (CSDL) sang YYYY-MM-DD để đưa lên thẻ <input type="date">
        const formattedDate = new Date(row.ngay_thu).toISOString().split('T')[0]

        setFormData({
            ma_phieu_thu: row.ma_phieu_thu.toString(),
            so_tien: row.so_tien.toString(),
            ngay_thu: formattedDate,
            ma_hoc_vien: row.ma_hoc_vien.toString(),
            ma_nhan_su: row.ma_nhan_su.toString(),
            noi_dung: row.noi_dung,
        })
        setEditingId(row.ma_phieu_thu) // Bật chế độ Sửa
        window.scrollTo({ top: 0, behavior: 'smooth' }) // Tự động cuộn lên form
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
        })
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
                const response = await fetch(`/api/phieu-thu?id=${id}`, {
                    method: 'DELETE',
                })

                if (response.ok) {
                    // Dùng hàm filter để loại bỏ dòng vừa xóa khỏi danh sách hiện tại (không cần load lại trang)
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

    // === HÀM LƯU DỮ LIỆU (Dùng chung cho THÊM và SỬA) ===
    const handleSavePhieuThu = async () => {
        if (
            !formData.so_tien ||
            !formData.ngay_thu ||
            !formData.ma_hoc_vien ||
            !formData.ma_nhan_su
        ) {
            alert('Vui lòng nhập đầy đủ thông tin bắt buộc!')
            return
        }

        try {
            const method = editingId ? 'PUT' : 'POST'

            const response = await fetch('/api/phieu-thu', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const savedPhieuThu = await response.json()

                if (editingId) {
                    // Nếu là Sửa: Tìm dòng cũ trong bảng và thay bằng dòng mới cập nhật
                    setData(
                        data.map((item) =>
                            item.ma_phieu_thu === savedPhieuThu.ma_phieu_thu ? savedPhieuThu : item,
                        ),
                    )
                    alert('Cập nhật phiếu thu thành công!')
                } else {
                    // Nếu là Thêm: Đẩy dòng mới lên đầu bảng
                    setData([savedPhieuThu, ...data])
                    alert('Thêm phiếu thu thành công!')
                }

                // Lưu xong thì làm sạch form
                handleCancelEdit()
            } else {
                alert(`Có lỗi xảy ra khi ${editingId ? 'cập nhật' : 'thêm'} phiếu thu.`)
            }
        } catch (error) {
            console.error('Lỗi:', error)
            alert('Không thể kết nối đến máy chủ.')
        }
    }

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (formData.ma_phieu_thu) params.append('ma_phieu_thu', formData.ma_phieu_thu)
            if (formData.so_tien) params.append('so_tien', formData.so_tien)
            if (formData.ngay_thu) params.append('ngay_thu', formData.ngay_thu)
            if (formData.ma_hoc_vien) params.append('ma_hoc_vien', formData.ma_hoc_vien)
            if (formData.ma_nhan_su) params.append('ma_nhan_su', formData.ma_nhan_su)

            const response = await fetch(`/api/phieu-thu?${params.toString()}`)
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

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm min-h-screen">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8 uppercase">
                Quản lý phiếu thu học phí
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-6 text-gray-700">
                <div className="space-y-4">
                    <div className="flex items-center">
                        <label className="w-1/4 text-sm font-medium text-gray-700">
                            Mã phiếu thu:
                        </label>
                        <input
                            type="number"
                            name="ma_phieu_thu"
                            value={formData.ma_phieu_thu}
                            onChange={handleChange}
                            placeholder={editingId ? 'Đang sửa đổi...' : 'Nhập mã để tìm...'}
                            disabled={editingId !== null} // Khóa ô này nếu đang Sửa
                            className={`w-3/4 border rounded p-2 focus:outline-blue-500  ${editingId ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-1/4 text-sm font-medium text-gray-700">Số tiền:</label>
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
                        <label className="w-1/4 text-sm font-medium text-gray-700">Ngày thu:</label>
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

            {/* Giao diện nút bấm thay đổi linh hoạt theo chế độ */}
            <div className="flex justify-end gap-4 mb-8 border-b pb-6">
                {!editingId ? (
                    <>
                        <button
                            onClick={handleSearch}
                            className="flex items-center gap-2 px-6 py-2 border border-gray-400 rounded hover:bg-gray-100 font-medium transition text-gray-600 cursor-pointer">
                            <FaSearch /> Tìm kiếm
                        </button>
                        <button
                            onClick={handleSavePhieuThu}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition shadow-sm cursor-pointer">
                            <FaPlus /> Thêm phiếu thu
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-2 px-6 py-2 border border-gray-400 rounded hover:bg-gray-100 font-medium transition text-gray-600 cursor-pointer">
                            <FaTimes /> Hủy sửa
                        </button>
                        <button
                            onClick={handleSavePhieuThu}
                            className="flex items-center gap-2 px-6 py-2 bg-[#16a34a] text-white rounded hover:bg-green-700 font-medium transition shadow-sm cursor-pointer">
                            <FaSave /> Cập nhật phiếu thu
                        </button>
                    </>
                )}
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
                                                onClick={() => handleEditClick(row)}
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
