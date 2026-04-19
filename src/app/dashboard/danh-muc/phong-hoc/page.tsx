// File: src/app/dashboard/danh-muc/phong-hoc/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaPlus, FaSave, FaTimes, FaTrash, FaSearch } from 'react-icons/fa'

interface PhongHoc {
    ma_phong_hoc: number
    ten_phong_hoc: string
    suc_chua: number
}

export default function DanhMucPhongHocPage() {
    const [data, setData] = useState<PhongHoc[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        ten_phong_hoc: '',
        suc_chua: '',
    })

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/danh-muc/phong-hoc')
            const result = await res.json()
            if (Array.isArray(result)) setData(result)
        } catch (error) {
            console.error(error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const filteredData = data.filter((item) =>
        item.ten_phong_hoc.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const method = editingId ? 'PUT' : 'POST'
        const body = editingId ? { ...formData, ma_phong_hoc: editingId } : formData

        const res = await fetch('/api/danh-muc/phong-hoc', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        if (res.ok) {
            alert('Thao tác thành công!')
            setEditingId(null)
            setFormData({ ten_phong_hoc: '', suc_chua: '' })
            setIsFormOpen(false)
            fetchData()
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc muốn xóa phòng này?')) {
            const res = await fetch(`/api/danh-muc/phong-hoc?id=${id}`, { method: 'DELETE' })
            if (res.ok) fetchData()
            else alert('Không thể xóa phòng học đang có lớp học!')
        }
    }

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-800">DANH MỤC PHÒNG HỌC</h1>
                <button
                    onClick={() => {
                        setIsFormOpen(true)
                        setEditingId(null)
                    }}
                    className="bg-green-600 text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition">
                    <FaPlus /> Thêm phòng học mới
                </button>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="mb-4 relative max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FaSearch />
                </span>
                <input
                    type="text"
                    placeholder="Tìm kiếm tên phòng..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Form Modal (Dạng inline đơn giản) */}
            {isFormOpen && (
                <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <h2 className="text-lg font-bold mb-4 text-blue-700">
                        {editingId ? 'Cập nhật phòng học' : 'Thêm phòng học mới'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-black font-semibold mb-1">
                                Tên phòng học
                            </label>
                            <input
                                required
                                className="w-full p-2 border rounded"
                                value={formData.ten_phong_hoc}
                                onChange={(e) =>
                                    setFormData({ ...formData, ten_phong_hoc: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-black font-semibold mb-1">
                                Sức chứa (học viên)
                            </label>
                            <input
                                type="number"
                                required
                                className="w-full p-2 border rounded"
                                value={formData.suc_chua}
                                onChange={(e) =>
                                    setFormData({ ...formData, suc_chua: e.target.value })
                                }
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                                <FaSave /> Lưu thông tin
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="bg-gray-400 text-white px-6 py-2 rounded flex items-center gap-2">
                                <FaTimes /> Hủy bỏ
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Bảng dữ liệu */}
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4">Mã phòng</th>
                            <th className="p-4">Tên phòng học</th>
                            <th className="p-4">Sức chứa tối đa</th>
                            <th className="p-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="text-center p-10">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item) => (
                                <tr
                                    key={item.ma_phong_hoc}
                                    className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4 font-mono text-gray-500">
                                        {item.ma_phong_hoc}
                                    </td>
                                    <td className="p-4 font-bold text-gray-700">
                                        {item.ten_phong_hoc}
                                    </td>
                                    <td className="p-4">{item.suc_chua} học viên</td>
                                    <td className="p-4 flex justify-center gap-3">
                                        <button
                                            onClick={() => {
                                                setEditingId(item.ma_phong_hoc)
                                                setFormData({
                                                    ten_phong_hoc: item.ten_phong_hoc,
                                                    suc_chua: item.suc_chua.toString(),
                                                })
                                                setIsFormOpen(true)
                                            }}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.ma_phong_hoc)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
