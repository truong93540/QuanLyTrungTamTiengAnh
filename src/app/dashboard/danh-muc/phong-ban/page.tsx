'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaPlus, FaSave, FaSearch, FaTimes, FaTrash, FaEye, FaBuilding } from 'react-icons/fa'

interface PhongBan {
    ma_phong_ban: number
    ten_phong_ban: string
    mo_ta?: string
    ngay_thanh_lap?: string | null
}

export default function DanhMucPhongBanPage() {
    const [data, setData] = useState<PhongBan[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    // --- STATE CHO MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewMode, setIsViewMode] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)

    // --- STATE TÌM KIẾM (ĐÃ GỘP CHUNG) ---
    const [searchTerm, setSearchTerm] = useState('')

    // --- STATE FORM (Dùng cho Modal) ---
    const [formData, setFormData] = useState({
        ma_phong_ban: '',
        ten_phong_ban: '',
        mo_ta: '',
        ngay_thanh_lap: '',
    })

    // --- XỬ LÝ LỌC DỮ LIỆU TÌM KIẾM ---
    const filteredData = data.filter(item => 
        item.ten_phong_ban.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.ma_phong_ban.toString().includes(searchTerm)
    )

    // --- STATE PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

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

    // --- HANDLER MODAL ---
    const openAddModal = () => {
        setIsViewMode(false)
        setEditingId(null)
        setFormData({ ma_phong_ban: '', ten_phong_ban: '', mo_ta: '', ngay_thanh_lap: '' })
        setIsModalOpen(true)
    }

    const openEditModal = (row: PhongBan) => {
        setIsViewMode(false)
        setEditingId(row.ma_phong_ban)
        setFormData({
            ma_phong_ban: row.ma_phong_ban.toString(),
            ten_phong_ban: row.ten_phong_ban,
            mo_ta: row.mo_ta || '',
            ngay_thanh_lap: row.ngay_thanh_lap ? new Date(row.ngay_thanh_lap).toISOString().split('T')[0] : '',
        })
        setIsModalOpen(true)
    }

    const openViewModal = (row: PhongBan) => {
        setIsViewMode(true)
        setFormData({
            ma_phong_ban: row.ma_phong_ban.toString(),
            ten_phong_ban: row.ten_phong_ban,
            mo_ta: row.mo_ta || '',
            ngay_thanh_lap: row.ngay_thanh_lap ? new Date(row.ngay_thanh_lap).toISOString().split('T')[0] : '',
        })
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
        setIsViewMode(false)
    }

    // --- HANDLER FORM & API ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSavePhongBan = async () => {
        if (!formData.ten_phong_ban?.trim()) {
            alert('Vui lòng nhập Tên phòng ban bắt buộc!')
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
                    setData(data.map((item) => item.ma_phong_ban === savedPhongBan.ma_phong_ban ? savedPhongBan : item))
                    alert('Cập nhật phòng ban thành công!')
                } else {
                    setData([...data, savedPhongBan])
                    alert('Thêm phòng ban thành công!')
                }
                closeModal()
            } else {
                alert(`Có lỗi xảy ra khi ${editingId ? 'cập nhật' : 'thêm'} phòng ban.`)
            }
        } catch (error) {
            console.error('Lỗi:', error)
            alert('Không thể kết nối đến máy chủ.')
        }
    }

    const handleDeleteClick = async (id: number) => {
        const isConfirm = window.confirm('Bạn có chắc chắn muốn xóa phòng ban này không? Hành động này không thể hoàn tác!')
        if (isConfirm) {
            try {
                const response = await fetch(`/api/danh-muc/phong-ban?id=${id}`, { method: 'DELETE' })
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

    return (
        <div className="bg-gray-50 min-h-screen p-6 relative">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
                
                {/* HEADER LỚN */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-[#1d4ed8] flex items-center gap-3 uppercase">
                        <FaBuilding className="text-blue-600" />
                        Quản lý Danh mục Phòng ban
                    </h1>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm">
                        <FaPlus /> Thêm phòng ban
                    </button>
                </div>

                {/* KHU VỰC TÌM KIẾM ĐÃ GỘP CHUNG */}
                <div className="mb-6 w-full md:w-1/2 lg:w-1/3">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <FaSearch />
                        </span>
                        <input
                            type="text" 
                            placeholder="Tìm theo mã hoặc tên phòng ban..." 
                            value={searchTerm}
                            onChange={(e) => { 
                                setSearchTerm(e.target.value)
                                setCurrentPage(1) // Reset về trang 1 khi gõ tìm kiếm
                            }}
                            className="w-full border border-gray-300 rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent transition shadow-sm placeholder-gray-500 text-gray-900"
                        />
                    </div>
                </div>

                {/* BẢNG DỮ LIỆU */}
                <div className="overflow-x-auto rounded-t-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#1d4ed8] text-white uppercase font-semibold text-xs">
                            <tr>
                                <th className="px-4 py-4 text-center whitespace-nowrap w-24">Mã PB</th>
                                <th className="px-4 py-4 text-left whitespace-nowrap w-48">Tên phòng ban</th>
                                <th className="px-4 py-4 text-center min-w-[200px]">Mô tả</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap w-32">Ngày thành lập</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap w-32">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-8 font-medium">Đang tải dữ liệu...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Không tìm thấy phòng ban nào.</td></tr>
                            ) : (
                                currentItems.map((row, index) => (
                                    <tr key={row.ma_phong_ban} className={`border-b hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-4 py-4 text-center font-bold text-gray-600">{row.ma_phong_ban}</td>
                                        <td className="px-4 py-4 text-left font-bold text-[#1d4ed8]">{row.ten_phong_ban}</td>
                                        <td className="px-4 py-4 text-left text-gray-600">{row.mo_ta || '-'}</td>
                                        <td className="px-4 py-4 text-center font-medium">
                                            {row.ngay_thanh_lap ? new Date(row.ngay_thanh_lap).toLocaleDateString('vi-VN') : <span className="text-gray-400">-</span>}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openViewModal(row)} className="p-2 text-green-600 bg-green-100 rounded hover:bg-green-200 transition" title="Xem chi tiết"><FaEye /></button>
                                                <button onClick={() => openEditModal(row)} className="p-2 text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition" title="Sửa"><FaEdit /></button>
                                                <button onClick={() => handleDeleteClick(row.ma_phong_ban)} className="p-2 text-red-600 bg-red-100 rounded hover:bg-red-200 transition" title="Xóa"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PHÂN TRANG */}
                {!isLoading && filteredData.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 font-medium text-gray-600 text-sm gap-4">
                        <div>Hiển thị <span className="font-bold text-gray-800">{indexOfFirstItem + 1}</span> đến <span className="font-bold text-gray-800">{Math.min(indexOfLastItem, filteredData.length)}</span> trong tổng số <span className="font-bold text-gray-800">{filteredData.length}</span> phòng ban</div>
                        <div className="flex gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className={`px-3 py-1.5 rounded border ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300'}`}>Trước</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button key={number} onClick={() => paginate(number)} className={`px-3 py-1.5 rounded border ${currentPage === number ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]' : 'hover:bg-gray-100 border-gray-300'}`}>{number}</button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded border ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300'}`}>Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL THÊM / SỬA / XEM CHI TIẾT */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-lg">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaBuilding className="text-[#1d4ed8]" />
                                {isViewMode ? 'Chi Tiết Phòng Ban' : editingId ? 'Cập Nhật Phòng Ban' : 'Thêm Phòng Ban Mới'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên phòng ban <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" name="ten_phong_ban" value={formData.ten_phong_ban} onChange={handleChange} disabled={isViewMode}
                                        placeholder="VD: Phòng Đào tạo..." 
                                        className="w-full border border-black rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 font-medium disabled:bg-gray-100 disabled:border-gray-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày thành lập</label>
                                    <input 
                                        type="date" name="ngay_thanh_lap" value={formData.ngay_thanh_lap} onChange={handleChange} disabled={isViewMode}
                                        className="w-full border border-black rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 font-medium disabled:bg-gray-100 disabled:border-gray-300"
                                    />
                                </div>
                            </div>

                            {/* Trường Mã hệ thống cấp (chỉ hiện khi Sửa hoặc Xem) */}
                            {(editingId || isViewMode) && (
                                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Mã phòng ban (Hệ thống cấp)</label>
                                    <input type="text" value={formData.ma_phong_ban} disabled className="w-full border border-gray-300 bg-gray-200 text-gray-800 font-bold rounded p-2 text-sm cursor-not-allowed" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                                <textarea 
                                    name="mo_ta" value={formData.mo_ta} onChange={handleChange} disabled={isViewMode} rows={4} 
                                    placeholder="Nhập mô tả về chức năng, nhiệm vụ của phòng ban..." 
                                    className="w-full border border-black rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-gray-900 font-medium disabled:bg-gray-100 disabled:border-gray-300"
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-5 border-t bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            <button onClick={closeModal} className="px-5 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-100 font-medium transition">{isViewMode ? 'Đóng' : 'Hủy bỏ'}</button>
                            {!isViewMode && (
                                <button onClick={handleSavePhongBan} className="flex items-center gap-2 px-5 py-2 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm">
                                    <FaSave /> {editingId ? 'Lưu thay đổi' : 'Xác nhận Thêm'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}