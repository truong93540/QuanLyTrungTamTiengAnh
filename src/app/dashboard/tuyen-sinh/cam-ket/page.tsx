'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash } from 'react-icons/fa'

// Cập nhật Interface dựa trên hình ảnh thiết kế CSDL
interface CamKet {
    ma_cam_ket: number
    ngay_ky: string
    ngay_het_han?: string | null // Bảng không ghi Not null, nên có thể null
    noi_dung_cam_ket: string
    trang_thai: string
    ma_hoc_vien: number
    hoc_vien?: { ho_ten: string } // Quan hệ với bảng học viên (nếu có)
}

export default function QuanLyCamKetPage() {
    const [data, setData] = useState<CamKet[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<number | null>(null)

    // Cập nhật state formData khớp với các thuộc tính
    const [formData, setFormData] = useState({
        ma_cam_ket: '',
        ngay_ky: '',
        ngay_het_han: '',
        noi_dung_cam_ket: '',
        trang_thai: '',
        ma_hoc_vien: '',
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
                // Sửa API endpoint thành cam-ket
                const response = await fetch('/api/cam-ket')
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleEditClick = (row: CamKet) => {
        // Format ngày tháng từ ISO string sang YYYY-MM-DD
        const formattedNgayKy = new Date(row.ngay_ky).toISOString().split('T')[0]
        const formattedNgayHetHan = row.ngay_het_han ? new Date(row.ngay_het_han).toISOString().split('T')[0] : ''

        setFormData({
            ma_cam_ket: row.ma_cam_ket.toString(),
            ngay_ky: formattedNgayKy,
            ngay_het_han: formattedNgayHetHan,
            noi_dung_cam_ket: row.noi_dung_cam_ket,
            trang_thai: row.trang_thai,
            ma_hoc_vien: row.ma_hoc_vien.toString(),
        })
        setEditingId(row.ma_cam_ket)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCancelEdit = () => {
        setFormData({
            ma_cam_ket: '',
            ngay_ky: '',
            ngay_het_han: '',
            noi_dung_cam_ket: '',
            trang_thai: '',
            ma_hoc_vien: '',
        })
        setEditingId(null)
    }

    const handleDeleteClick = async (id: number) => {
        const isConfirm = window.confirm('Bạn có chắc chắn muốn xóa bản cam kết này không? Hành động này không thể hoàn tác!')

        if (isConfirm) {
            try {
                const response = await fetch(`/api/cam-ket?id=${id}`, {
                    method: 'DELETE',
                })

                if (response.ok) {
                    setData(data.filter((item) => item.ma_cam_ket !== id))
                    alert('Đã xóa bản cam kết thành công!')
                } else {
                    alert('Có lỗi xảy ra khi xóa.')
                }
            } catch (error) {
                console.error('Lỗi xóa:', error)
                alert('Không thể kết nối đến máy chủ.')
            }
        }
    }

    const handleSaveCamKet = async () => {
        // Validation dựa trên cột Not Null trong thiết kế CSDL
        if (
            !formData.ngay_ky ||
            !formData.noi_dung_cam_ket ||
            !formData.trang_thai ||
            !formData.ma_hoc_vien
        ) {
            alert('Vui lòng nhập đầy đủ các thông tin bắt buộc (Ngày ký, Nội dung, Trạng thái, Mã học viên)!')
            return
        }

        try {
            const method = editingId ? 'PUT' : 'POST'
            // Chuyển đổi dữ liệu rỗng của ngày hết hạn thành null để lưu CSDL
            const payload = {
                ...formData,
                ngay_het_han: formData.ngay_het_han || null 
            }

            const response = await fetch('/api/cam-ket', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                const savedData = await response.json()

                if (editingId) {
                    setData(data.map((item) => (item.ma_cam_ket === savedData.ma_cam_ket ? savedData : item)))
                    alert('Cập nhật bản cam kết thành công!')
                } else {
                    setData([savedData, ...data])
                    alert('Thêm bản cam kết thành công!')
                }

                handleCancelEdit()
            } else {
                alert(`Có lỗi xảy ra khi ${editingId ? 'cập nhật' : 'thêm'} bản cam kết.`)
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
            if (formData.ma_cam_ket) params.append('ma_cam_ket', formData.ma_cam_ket)
            if (formData.ngay_ky) params.append('ngay_ky', formData.ngay_ky)
            if (formData.ma_hoc_vien) params.append('ma_hoc_vien', formData.ma_hoc_vien)
            if (formData.trang_thai) params.append('trang_thai', formData.trang_thai)

            const response = await fetch(`/api/cam-ket?${params.toString()}`)
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
                Quản lý Bảng Cam Kết
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-6 text-gray-700">
                {/* Cột Form Trái */}
                <div className="space-y-4">
                    <div className="flex items-center">
                        <label className="w-1/4 text-sm font-medium text-gray-700">Mã cam kết:</label>
                        <input
                            type="number"
                            name="ma_cam_ket"
                            value={formData.ma_cam_ket}
                            onChange={handleChange}
                            placeholder={editingId ? 'Đang sửa đổi...' : 'Nhập mã để tìm...'}
                            disabled={editingId !== null}
                            className={`w-3/4 border rounded p-2 focus:outline-blue-500  ${editingId ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                        />
                    </div>
                    
                    <div className="flex items-center">
                        <label className="w-1/4 text-sm font-medium text-gray-700">Mã học viên: <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            name="ma_hoc_vien"
                            value={formData.ma_hoc_vien}
                            onChange={handleChange}
                            className="w-3/4 border border-gray-300 rounded p-2 focus:outline-blue-500"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/4 text-sm font-medium text-gray-700">Trạng thái: <span className="text-red-500">*</span></label>
                        <select
                            name="trang_thai"
                            value={formData.trang_thai}
                            onChange={handleChange}
                            className="w-3/4 border border-gray-300 rounded p-2 focus:outline-blue-500 bg-white"
                        >
                            <option value="">-- Chọn trạng thái --</option>
                            <option value="Đang hiệu lực">Đang hiệu lực</option>
                            <option value="Đã hết hạn">Đã hết hạn</option>
                            <option value="Đã hủy bỏ">Đã hủy bỏ</option>
                        </select>
                    </div>
                </div>

                {/* Cột Form Phải */}
                <div className="space-y-4 flex flex-col">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center w-1/2">
                            <label className="w-1/3 text-sm font-medium text-gray-700">Ngày ký: <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="ngay_ky"
                                value={formData.ngay_ky}
                                onChange={handleChange}
                                className="w-2/3 border border-gray-300 rounded p-2 focus:outline-blue-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            />
                        </div>
                        <div className="flex items-center w-1/2">
                            <label className="w-2/5 text-sm font-medium text-gray-700 text-right pr-2">Ngày hết hạn:</label>
                            <input
                                type="date"
                                name="ngay_het_han"
                                value={formData.ngay_het_han}
                                onChange={handleChange}
                                className="w-3/5 border border-gray-300 rounded p-2 focus:outline-blue-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="flex items-start flex-1">
                        <label className="w-1/6 text-sm font-medium text-gray-700 pt-2">Nội dung: <span className="text-red-500">*</span></label>
                        <textarea
                            name="noi_dung_cam_ket"
                            value={formData.noi_dung_cam_ket}
                            onChange={handleChange}
                            className="w-5/6 h-full min-h-[120px] border border-gray-300 rounded p-2 focus:outline-blue-500 resize-none"
                            placeholder="Nhập nội dung thỏa thuận cam kết..."
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Nút bấm */}
            <div className="flex justify-end gap-4 mb-8 border-b pb-6">
                {!editingId ? (
                    <>
                        <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 border border-gray-400 rounded hover:bg-gray-100 font-medium transition text-gray-600 cursor-pointer">
                            <FaSearch /> Tìm kiếm
                        </button>
                        <button onClick={handleSaveCamKet} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition shadow-sm cursor-pointer">
                            <FaPlus /> Thêm cam kết
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={handleCancelEdit} className="flex items-center gap-2 px-6 py-2 border border-gray-400 rounded hover:bg-gray-100 font-medium transition text-gray-600 cursor-pointer">
                            <FaTimes /> Hủy sửa
                        </button>
                        <button onClick={handleSaveCamKet} className="flex items-center gap-2 px-6 py-2 bg-[#16a34a] text-white rounded hover:bg-green-700 font-medium transition shadow-sm cursor-pointer">
                            <FaSave /> Cập nhật cam kết
                        </button>
                    </>
                )}
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500 font-medium">Đang tải dữ liệu từ CSDL...</div>
                ) : (
                    <table className="w-full border-collapse border border-gray-300 text-sm text-center">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="border border-gray-300 p-3">Mã CK</th>
                                <th className="border border-gray-300 p-3">Mã HV</th>
                                <th className="border border-gray-300 p-3">Tên Học Viên</th>
                                <th className="border border-gray-300 p-3">Ngày Ký</th>
                                <th className="border border-gray-300 p-3">Ngày Hết Hạn</th>
                                <th className="border border-gray-300 p-3 w-64">Nội Dung</th>
                                <th className="border border-gray-300 p-3">Trạng Thái</th>
                                <th className="border border-gray-300 p-3 w-24">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row) => (
                                <tr key={row.ma_cam_ket} className={`transition text-gray-700 ${editingId === row.ma_cam_ket ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}>
                                    <td className="border border-gray-300 p-3 font-semibold">{row.ma_cam_ket}</td>
                                    <td className="border border-gray-300 p-3">{row.ma_hoc_vien}</td>
                                    <td className="border border-gray-300 p-3 font-medium text-blue-600">{row.hoc_vien?.ho_ten || 'Không rõ'}</td>
                                    <td className="border border-gray-300 p-3">{new Date(row.ngay_ky).toLocaleDateString('vi-VN')}</td>
                                    <td className="border border-gray-300 p-3">{row.ngay_het_han ? new Date(row.ngay_het_han).toLocaleDateString('vi-VN') : <span className="text-gray-400 italic">Vô thời hạn</span>}</td>
                                    <td className="border border-gray-300 p-3 text-left">
                                        <div className="line-clamp-2" title={row.noi_dung_cam_ket}>{row.noi_dung_cam_ket}</div>
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${row.trang_thai === 'Đang hiệu lực' ? 'bg-green-100 text-green-700' : row.trang_thai === 'Đã hết hạn' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {row.trang_thai}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                        <div className="flex justify-center">
                                            <button onClick={() => handleEditClick(row)} className="p-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-yellow-100 hover:text-yellow-600 transition cursor-pointer" title="Sửa cam kết">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDeleteClick(row.ma_cam_ket)} className="p-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-red-100 hover:text-red-600 transition ml-1 cursor-pointer" title="Xóa cam kết">
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

            {/* Phân trang */}
            {!isLoading && data.length > 0 && (
                <div className="flex justify-between items-center mt-6 font-medium text-gray-600">
                    <div className="text-sm">
                        Hiển thị <span className="font-bold text-gray-800">{indexOfFirstItem + 1}</span> đến <span className="font-bold text-gray-800">{Math.min(indexOfLastItem, data.length)}</span> trong tổng số <span className="font-bold text-gray-800">{data.length}</span> cam kết
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-3 py-1 rounded border ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300'}`}>Trước</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button key={number} onClick={() => paginate(number)} className={`px-3 py-1 rounded border ${currentPage === number ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100 border-gray-300'}`}>{number}</button>
                        ))}
                        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300'}`}>Sau</button>
                    </div>
                </div>
            )}
        </div>
    )
}