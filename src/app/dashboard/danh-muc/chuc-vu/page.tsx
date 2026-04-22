'use client'

import { useState, useEffect, use } from 'react'
import { FaEdit, FaPlus, FaSave, FaSearch, FaTimes, FaTrash } from 'react-icons/fa'

interface ChucVu {
    ma_chuc_vu: number
    ten_chuc_vu: string
    ghi_chu?: string
}

export default function DanhMucChucVuPage() {
    const [data, setData] = useState<ChucVu[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(data.length / itemsPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    const [formData, setFormData] = useState({
        ma_chuc_vu: '',
        ten_chuc_vu: '',
        ghi_chu: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/danh-muc/chuc-vu')
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
        if (formData.ten_chuc_vu === '') {
            const fetchAllData = async () => {
                try {
                    const response = await fetch('/api/danh-muc/chuc-vu')
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
    }, [formData.ten_chuc_vu])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleCancelEdit = () => {
        setFormData({
            ma_chuc_vu: '',
            ten_chuc_vu: '',
            ghi_chu: '',
        })
        setEditingId(null)
    }

    const handleSaveChucVu = async () => {
        if (!formData.ten_chuc_vu.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin bắt buộc!')
            return
        }

        try {
            const method = editingId ? 'PUT' : 'POST'

            const response = await fetch('/api/danh-muc/chuc-vu', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const savedChucVu = await response.json()

                if (editingId) {
                    setData(
                        data.map((item) =>
                            item.ma_chuc_vu === savedChucVu.ma_chuc_vu ? savedChucVu : item,
                        ),
                    )
                    alert('Cập nhật chức vụ thành công!')
                } else {
                    setData([savedChucVu, ...data])
                    alert('Thêm chức vụ thành công!')
                }
                closeModal()

                handleCancelEdit()
            } else {
                alert(`Có lỗi xảy ra khi ${editingId ? 'cập nhật' : 'thêm'} chức vụ.`)
            }
        } catch (error) {
            console.error('Lỗi:', error)
            alert('Không thể kết nối đến máy chủ.')
        }
    }

    const handleEditClick = (row: ChucVu) => {
        setFormData({
            ma_chuc_vu: row.ma_chuc_vu.toString(),
            ten_chuc_vu: row.ten_chuc_vu,
            ghi_chu: row.ghi_chu || '',
        })
        setEditingId(row.ma_chuc_vu)
        setIsModalOpen(true)
        window.scrollTo({ top: 0, behavior: 'smooth' }) // Tự động cuộn lên form
    }

    const handleDeleteClick = async (id: number) => {
        const isConfirm = window.confirm(
            'Bạn có chắc chắn muốn xóa chức vụ này không? Hành động này không thể hoàn tác!',
        )

        if (isConfirm) {
            try {
                const response = await fetch(`/api/danh-muc/chuc-vu?id=${id}`, {
                    method: 'DELETE',
                })

                if (response.ok) {
                    setData(data.filter((item) => item.ma_chuc_vu !== id))
                    alert('Đã xóa chức vụ thành công!')
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
            if (formData.ten_chuc_vu) params.append('ten_chuc_vu', formData.ten_chuc_vu)

            const response = await fetch(`/api/danh-muc/chuc-vu?${params.toString()}`)
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

    const handleOpenModel = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const openAddModel = () => {
        handleOpenModel()
        setFormData({
            ma_chuc_vu: '',
            ten_chuc_vu: '',
            ghi_chu: '',
        })
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm min-h-screen max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8 uppercase">
                Quản lý Danh mục Chức vụ
            </h1>

            {/* Model */}
            {isModalOpen && (
                <div className="w-full h-full fixed bg-black/50 left-0 top-0 flex items-center justify-center">
                    <div className="mb-8 p-4 border rounded-lg w-[60%] max-h-[90vh] bg-white">
                        <div className="flex justify-between items-center p-5 border-b rounded-t-lg">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingId ? 'Cập Nhật Bản Cam Kết' : 'Thêm Bản Cam Kết Mới'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-red-500 cursor-pointer transition">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <div className="flex gap-4 mt-3">
                            {editingId && (
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mã chức vụ:
                                    </label>
                                    <input
                                        type="number"
                                        name="ma_chuc_vu"
                                        value={formData.ma_chuc_vu}
                                        placeholder={
                                            editingId ? 'Đang sửa đổi...' : 'Nhập mã chức vụ...'
                                        }
                                        onChange={handleChange}
                                        disabled={!!editingId}
                                        className={`w-full border border-gray-300 rounded p-2 focus:outline-blue-500 text-gray-800 ${editingId ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                                    />
                                </div>
                            )}

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên chức vụ:
                                </label>
                                <input
                                    type="text"
                                    name="ten_chuc_vu"
                                    value={formData.ten_chuc_vu}
                                    onChange={handleChange}
                                    placeholder="VD: Trợ giảng..."
                                    className="w-full border border-gray-300 rounded p-2 focus:outline-blue-500 text-gray-800"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú:
                            </label>
                            <textarea
                                name="ghi_chu"
                                value={formData.ghi_chu}
                                onChange={handleChange}
                                placeholder="VD: Chức vụ này dành cho trợ giảng..."
                                className="w-full border border-gray-300 rounded p-2 focus:outline-blue-500 text-gray-800"
                            />
                        </div>
                        <div className="p-5 border-t rounded-b-lg flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-100 font-medium transition cursor-pointer">
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSaveChucVu}
                                className="flex items-center gap-2 px-5 py-2 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm cursor-pointer">
                                <FaSave /> {editingId ? 'Cập nhật' : 'Lưu chức vụ'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-end gap-4 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tìm kiếm theo tên chức vụ:
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="ten_chuc_vu"
                            value={formData.ten_chuc_vu}
                            onChange={handleChange}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="VD: Trợ giảng..."
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
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition shadow-sm cursor-pointer"
                    onClick={openAddModel}>
                    <FaPlus /> Thêm mới
                </button>
            </div>

            {/* BẢNG HIỂN THỊ */}
            <div className="overflow-x-auto mt-4">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500 font-medium">Đang tải...</div>
                ) : (
                    <table className="w-full border-collapse border border-gray-300 text-sm text-center text-gray-700">
                        <thead className="bg-gray-100 ">
                            <tr>
                                <th className="border border-gray-300 p-3 w-32">Mã Chức Vụ</th>
                                <th className="border border-gray-300 p-3 text-left">
                                    Tên chức vụ
                                </th>
                                <th className="border border-gray-300 p-3 text-left">Ghi chú</th>
                                <th className="border border-gray-300 p-3 w-32">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row) => (
                                <tr key={row.ma_chuc_vu} className="hover:bg-gray-50 transition">
                                    <td className="border border-gray-300 p-3">{row.ma_chuc_vu}</td>
                                    <td className="border border-gray-300 p-3 text-left font-medium">
                                        {row.ten_chuc_vu}
                                    </td>
                                    <td className="border border-gray-300 p-3 text-left font-medium">
                                        {row.ghi_chu}
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => handleEditClick(row)}
                                                className="p-1.5 bg-gray-100 border rounded hover:bg-yellow-100 hover:text-yellow-600 cursor-pointer mr-2">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="p-1.5 bg-gray-100 border rounded hover:bg-red-100 hover:text-red-600 cursor-pointer"
                                                onClick={() => handleDeleteClick(row.ma_chuc_vu)}>
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
