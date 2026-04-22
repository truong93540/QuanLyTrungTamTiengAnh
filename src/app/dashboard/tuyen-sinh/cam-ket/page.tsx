'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaUserGraduate } from 'react-icons/fa'

interface CamKet {
    ma_cam_ket: number
    ngay_ky: string
    ngay_het_han?: string | null
    noi_dung_cam_ket: string
    trang_thai: string
    ma_hoc_vien: number
    hoc_vien?: { ho_ten: string }
}

export default function QuanLyCamKetPage() {
    const [data, setData] = useState<CamKet[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

  
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)

    const [formData, setFormData] = useState({
        ma_cam_ket: '',
        ngay_ky: '',
        ngay_het_han: '',
        noi_dung_cam_ket: '',
        trang_thai: '',
        ma_hoc_vien: '',
        ten_hoc_vien: '', 
    })

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Fetch dữ liệu
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/tuyen-sinh/cam-ket')
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

    // Mở Modal Thêm
    const openAddModal = () => {
        setFormData({
            ma_cam_ket: '',
            ngay_ky: new Date().toISOString().split('T')[0], // Mặc định ngày hôm nay
            ngay_het_han: '',
            noi_dung_cam_ket: '',
            trang_thai: '',
            ma_hoc_vien: '',
            ten_hoc_vien: '', 
        })
        setEditingId(null)
        setIsModalOpen(true)
    }

    
    const openEditModal = (row: CamKet) => {
        const formattedNgayKy = new Date(row.ngay_ky).toISOString().split('T')[0]
        const formattedNgayHetHan = row.ngay_het_han ? new Date(row.ngay_het_han).toISOString().split('T')[0] : ''

        setFormData({
            ma_cam_ket: row.ma_cam_ket.toString(),
            ngay_ky: formattedNgayKy,
            ngay_het_han: formattedNgayHetHan,
            noi_dung_cam_ket: row.noi_dung_cam_ket,
            trang_thai: row.trang_thai,
            ma_hoc_vien: row.ma_hoc_vien.toString(),
            ten_hoc_vien: row.hoc_vien?.ho_ten || '', 
        })
        setEditingId(row.ma_cam_ket)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
    }

    const handleDeleteClick = async (id: number) => {
        const isConfirm = window.confirm('Bạn có chắc chắn muốn xóa bản cam kết này không? Hành động này không thể hoàn tác!')

        if (isConfirm) {
            try {
                const response = await fetch(`/api/tuyen-sinh/cam-ket?id=${id}`, {
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
        if (!formData.ngay_ky || !formData.noi_dung_cam_ket || !formData.trang_thai || !formData.ma_hoc_vien) {
            alert('Vui lòng nhập đầy đủ các thông tin bắt buộc (Ngày ký, Nội dung, Trạng thái, Mã học viên)!')
            return
        }

        try {
            const method = editingId ? 'PUT' : 'POST'
            const payload = {
                ...formData,
                ngay_het_han: formData.ngay_het_han || null 
            }

            const response = await fetch('/api/tuyen-sinh/cam-ket', {
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
                    setData([...data, savedData])
                    alert('Thêm bản cam kết thành công!')
                }

                closeModal()
            } else {
                alert(`Có lỗi xảy ra khi ${editingId ? 'cập nhật' : 'thêm'} bản cam kết.`)
            }
        } catch (error) {
            console.error('Lỗi:', error)
            alert('Không thể kết nối đến máy chủ.')
        }
    }

  
    const filteredData = data.filter(item => 
        (item.hoc_vien?.ho_ten || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ma_hoc_vien.toString().includes(searchTerm)
    )

    
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                
          
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-[#1d4ed8] flex items-center gap-3 uppercase">
                        <FaUserGraduate className="text-blue-600" />
                        Quản lý Bảng Cam Kết
                    </h1>
                    <button 
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm"
                    >
                        <FaPlus /> Thêm cam kết
                    </button>
                </div>

      
                <div className="mb-6 w-full md:w-1/2 lg:w-1/3">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc mã học viên..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1) 
                            }}
                           className="w-full border border-gray-300 rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent transition shadow-sm placeholder-gray-500 text-gray-900"
                        />
                    </div>
                </div>


                <div className="overflow-x-auto rounded-t-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                       <thead className="bg-[#1d4ed8] text-white uppercase font-semibold text-xs">
                            <tr>
                               
                                <th className="px-4 py-4 text-center whitespace-nowrap">Mã Cam Kết</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap">Mã Học Viên</th>
                                
                                <th className="px-4 py-4 whitespace-nowrap min-w-[200px] text-center">Tên Học Viên</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap">Ngày Ký</th>
                                <th className="px-4 py-4 text-center whitespace-nowrap">Ngày Hết Hạn</th>
                                
                                
                                <th className="px-4 py-4 w-[25%] text-center">Nội Dung</th>
                                
                                <th className="px-4 py-4 text-center whitespace-nowrap">Trạng Thái</th>
                                <th className="px-4 py-4 text-center w-28 whitespace-nowrap">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={8} className="text-center py-8 font-medium">Đang tải dữ liệu...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-8 text-gray-500">Không tìm thấy cam kết nào.</td></tr>
                            ) : (
                                currentItems.map((row, index) => (
                                    <tr key={row.ma_cam_ket} className={`border-b hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-4 py-4 text-center font-medium">{row.ma_cam_ket}</td>
                                        <td className="px-4 py-4 text-center">{row.ma_hoc_vien}</td>
                                        <td className="px-4 py-4 text-gray-900 capitalize whitespace-nowrap">
                                          {row.hoc_vien?.ho_ten || 'Không rõ'}
                                        </td>
                                        <td className="px-4 py-4 text-center text-gray-600">{new Date(row.ngay_ky).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-4 py-4 text-center text-gray-600">
                                            {row.ngay_het_han ? new Date(row.ngay_het_han).toLocaleDateString('vi-VN') : <span className="text-gray-400 italic">Vô thời hạn</span>}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="line-clamp-2" title={row.noi_dung_cam_ket}>{row.noi_dung_cam_ket}</div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                                row.trang_thai === 'Đang hiệu lực' ? 'bg-green-100 text-green-700' : 
                                                row.trang_thai === 'Đã hết hạn' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {row.trang_thai}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEditModal(row)} className="p-2 text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition" title="Sửa cam kết">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDeleteClick(row.ma_cam_ket)} className="p-2 text-red-600 bg-red-100 rounded hover:bg-red-200 transition" title="Xóa cam kết">
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

                {/* Phân trang */}
                {!isLoading && filteredData.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 font-medium text-gray-600 text-sm gap-4">
                        <div>
                            Hiển thị <span className="font-bold text-gray-800">{indexOfFirstItem + 1}</span> đến <span className="font-bold text-gray-800">{Math.min(indexOfLastItem, filteredData.length)}</span> trong tổng số <span className="font-bold text-gray-800">{filteredData.length}</span> cam kết
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-3 py-1.5 rounded border ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300'}`}>Trước</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button key={number} onClick={() => paginate(number)} className={`px-3 py-1.5 rounded border ${currentPage === number ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]' : 'hover:bg-gray-100 border-gray-300'}`}>{number}</button>
                            ))}
                            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded border ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300'}`}>Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* ========================================== */}
            {/* MODAL THÊM / SỬA CAM KẾT */}
            {/* ========================================== */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-lg">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingId ? 'Cập Nhật Bản Cam Kết' : 'Thêm Bản Cam Kết Mới'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition">
                                <FaTimes size={24} />
                            </button>
                        </div>

                      {/* Modal Body (Scrollable if needed) */}
                        <div className="p-6 space-y-5 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã học viên <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number" 
                                        name="ma_hoc_vien" 
                                        value={formData.ma_hoc_vien} 
                                        onChange={handleChange} 
                                        placeholder="Nhập mã..." 
                                       
                                        className="w-full border border-black rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
                                    <select 
                                        name="trang_thai" 
                                        value={formData.trang_thai} 
                                        onChange={handleChange} 
                                        
                                        className="w-full border border-black rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900 font-medium"
                                    >
                                        <option value="">-- Chọn trạng thái --</option>
                                        <option value="Đang hiệu lực">Đang hiệu lực</option>
                                        <option value="Đã hết hạn">Đã hết hạn</option>
                                        <option value="Đã hủy bỏ">Đã hủy bỏ</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày ký <span className="text-red-500">*</span></label>
                                    <input 
                                        type="date" 
                                        name="ngay_ky" 
                                        value={formData.ngay_ky} 
                                        onChange={handleChange} 
                                      
                                        className="w-full border border-black rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                                    <input 
                                        type="date" 
                                        name="ngay_het_han" 
                                        value={formData.ngay_het_han} 
                                        onChange={handleChange} 
                                        
                                        className="w-full border border-black rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Các trường hiển thị thêm thông tin (Chỉ đọc) khi Sửa */}
                            {editingId && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Mã cam kết (Hệ thống cấp)</label>
                                        {/* Ô khóa (disabled) tôi để viền xám đậm (border-gray-400) để phân biệt với ô đang nhập */}
                                        <input type="text" value={formData.ma_cam_ket} disabled className="w-full border border-gray-400 bg-gray-200 text-gray-800 font-semibold rounded p-2 text-sm cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Tên học viên</label>
                                        <input type="text" value={formData.ten_hoc_vien} disabled className="w-full border border-gray-400 bg-gray-200 text-gray-800 font-semibold rounded p-2 text-sm cursor-not-allowed" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung cam kết <span className="text-red-500">*</span></label>
                                <textarea 
                                    name="noi_dung_cam_ket" 
                                    value={formData.noi_dung_cam_ket} 
                                    onChange={handleChange} 
                                    rows={5}
                                    placeholder="Nhập chi tiết các điều khoản..."
                                    
                                    className="w-full border border-black rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none text-gray-900 font-medium"
                                ></textarea>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            <button 
                                onClick={closeModal} 
                                className="px-5 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-100 font-medium transition"
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                onClick={handleSaveCamKet} 
                                className="flex items-center gap-2 px-5 py-2 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm"
                            >
                                <FaSave /> {editingId ? 'Cập nhật' : 'Lưu cam kết'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}