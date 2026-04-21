'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaPlus, FaSave, FaSearch, FaTimes, FaTrash } from 'react-icons/fa'


interface PhongBan {
    ma_phong_ban: number
    ten_phong_ban: string
    mo_ta?: string
    ngay_thanh_lap?: string | null
}

export default function DanhMucPhongBanPage() {
    const [data, setData] = useState<PhongBan[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<number | null>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(data.length / itemsPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    const [formData, setFormData] = useState({
        ma_phong_ban: '',
        ten_phong_ban: '',
        mo_ta: '',
        ngay_thanh_lap: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/danh-muc/phong-ban')
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

    const handleCancelEdit = () => {
        setFormData({
            ma_phong_ban: '',
            ten_phong_ban: '',
            mo_ta: '',
            ngay_thanh_lap: '',
        })
        setEditingId(null)
    }

    const handleSavePhongBan = async () => {
        if (!formData.ten_phong_ban?.trim()) {
            alert('Vui lòng nhập Tên phòng ban!')
            return
        }

        try {
            const method = editingId ? 'PUT' : 'POST'
            const payload = {
                ...formData,
                ngay_thanh_lap: formData.ngay_thanh_lap || null,
            }

            const response = await fetch('/api/danh-muc/phong-ban', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                const savedPhongBan = await response.json()

                if (editingId) {
                    setData(
                        data.map((item) =>
                            item.ma_phong_ban === savedPhongBan.ma_phong_ban ? savedPhongBan : item,
                        ),
                    )
                    alert('Cập nhật phòng ban thành công!')
                } else {
                    setData([...data, savedPhongBan])
                    alert('Thêm phòng ban thành công!')
                }

                handleCancelEdit()
            } else {
                alert(`Có lỗi xảy ra khi ${editingId ? 'cập nhật' : 'thêm'} phòng ban.`)
            }
        } catch (error) {
            console.error('Lỗi:', error)
            alert('Không thể kết nối đến máy chủ.')
        }
    }

    const handleEditClick = (row: PhongBan) => {
        const formattedDate = row.ngay_thanh_lap ? new Date(row.ngay_thanh_lap).toISOString().split('T')[0] : ''

        setFormData({
            ma_phong_ban: row.ma_phong_ban.toString(),
            ten_phong_ban: row.ten_phong_ban,
            mo_ta: row.mo_ta || '',
            ngay_thanh_lap: formattedDate,
        })
        setEditingId(row.ma_phong_ban)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = async (id: number) => {
        const isConfirm = window.confirm(
            'Bạn có chắc chắn muốn xóa phòng ban này không? Hành động này không thể hoàn tác!',
        )

        if (isConfirm) {
            try {
                const response = await fetch(`/api/danh-muc/phong-ban?id=${id}`, {
                    method: 'DELETE',
                })

                if (response.ok) {
                    setData(data.filter((item) => item.ma_phong_ban !== id))
                    alert('Đã xóa phòng ban thành công!')
                } else {
                    alert('Có lỗi xảy ra khi xóa.')
                }
            } catch (error) {
                console.error('Lỗi xóa:', error)
                alert('Không thể kết nối đến máy chủ.')
            }
        }
    }

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (formData.ma_phong_ban) params.append('ma_phong_ban', formData.ma_phong_ban)
            if (formData.ten_phong_ban) params.append('ten_phong_ban', formData.ten_phong_ban)
            if (formData.mo_ta) params.append('mo_ta', formData.mo_ta)
            if (formData.ngay_thanh_lap) params.append('ngay_thanh_lap', formData.ngay_thanh_lap)

            const response = await fetch(`/api/danh-muc/phong-ban?${params.toString()}`)
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
        <div className="bg-white p-6 rounded-lg shadow-sm min-h-screen max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8 uppercase">
                Quản lý Danh mục Phòng ban
            </h1>

            {}
            <div className="mb-8 p-5 bg-gray-50 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mã phòng ban:
                        </label>
                        <input
                            type="number"
                            name="ma_phong_ban"
                            value={formData.ma_phong_ban}
                            placeholder={editingId ? 'Đang sửa...' : 'Nhập mã để tìm...'}
                            onChange={handleChange}
                            disabled={!!editingId}
                            className={`w-full border rounded p-2 focus:outline-blue-500 text-gray-800 ${editingId ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên phòng ban: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="ten_phong_ban"
                            value={formData.ten_phong_ban}
                            onChange={handleChange}
                            placeholder="VD: Phòng Đào tạo..."
                            className="w-full border border-gray-300 rounded p-2 focus:outline-blue-500 text-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày thành lập:
                        </label>
                        <input
                            type="date"
                            name="ngay_thanh_lap"
                            value={formData.ngay_thanh_lap}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-2 focus:outline-blue-500 text-gray-800 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả:</label>
                    <textarea
                        name="mo_ta"
                        value={formData.mo_ta}
                        onChange={handleChange}
                        placeholder="VD: Quản lý chất lượng giảng dạy và học viên..."
                        className="w-full border border-gray-300 rounded p-2 focus:outline-blue-500 text-gray-800"
                        rows={2}
                    />
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-200">
                    {!editingId ? (
                        <>
                            <button
                                onClick={handleSearch}
                                className="flex items-center gap-2 px-6 py-2 border border-gray-400 rounded hover:bg-gray-100 font-medium transition text-gray-600 cursor-pointer mt-2">
                                <FaSearch /> Tìm kiếm
                            </button>
                            <button
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition shadow-sm cursor-pointer mt-2 ml-2"
                                onClick={handleSavePhongBan}>
                                <FaPlus /> Thêm mới
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={handleCancelEdit}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 font-medium transition text-gray-600 cursor-pointer">
                                <FaTimes /> Hủy
                            </button>
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium transition shadow-sm cursor-pointer"
                                onClick={handleSavePhongBan}>
                                <FaSave /> Cập nhật
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500 font-medium">Đang tải dữ liệu...</div>
                ) : (
                    <table className="w-full border-collapse border border-gray-300 text-sm text-center text-gray-700">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 p-3 w-24">Mã PB</th>
                                <th className="border border-gray-300 p-3 text-left w-48">Tên phòng ban</th>
                                <th className="border border-gray-300 p-3 text-left">Mô tả</th>
                                <th className="border border-gray-300 p-3 w-32">Ngày thành lập</th>
                                <th className="border border-gray-300 p-3 w-28">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row) => (
                                <tr key={row.ma_phong_ban} className="hover:bg-gray-50 transition">
                                    <td className="border border-gray-300 p-3">{row.ma_phong_ban}</td>
                                    <td className="border border-gray-300 p-3 text-left font-medium text-blue-600">
                                        {row.ten_phong_ban}
                                    </td>
                                    <td className="border border-gray-300 p-3 text-left">
                                        {row.mo_ta}
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                        {row.ngay_thanh_lap ? new Date(row.ngay_thanh_lap).toLocaleDateString('vi-VN') : <span className="text-gray-400">-</span>}
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => handleEditClick(row)}
                                                className="p-1.5 bg-gray-100 border rounded hover:bg-yellow-100 hover:text-yellow-600 cursor-pointer mr-2"
                                                title="Sửa">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="p-1.5 bg-gray-100 border rounded hover:bg-red-100 hover:text-red-600 cursor-pointer"
                                                onClick={() => handleDeleteClick(row.ma_phong_ban)}
                                                title="Xóa">
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

            {}
            {!isLoading && data.length > 0 && (
                <div className="flex justify-between items-center mt-6 font-medium text-gray-600">
                    <div className="text-sm">
                        Hiển thị{' '}
                        <span className="font-bold text-gray-800">{indexOfFirstItem + 1}</span> đến{' '}
                        <span className="font-bold text-gray-800">
                            {Math.min(indexOfLastItem, data.length)}
                        </span>{' '}
                        trong tổng số <span className="font-bold text-gray-800">{data.length}</span>{' '}
                        phòng ban
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded border ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 hover:cursor-pointer border-gray-300'}`}>
                            Trước
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-3 py-1 rounded border ${
                                    currentPage === number
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'hover:bg-gray-100 border-gray-300 hover:cursor-pointer'
                                }`}>
                                {number}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 hover:cursor-pointer border-gray-300'}`}>
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}