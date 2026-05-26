'use client'

import { useState, useEffect } from 'react'
import { FaSearch, FaUserCircle, FaMoneyBillWave, FaCoins, FaExclamationCircle, FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'

interface CongNoRecord {
    ma_hoc_vien: number
    ho_ten: string
    so_dien_thoai: string | null
    email: string | null
    ma_khoa_hoc: number
    ten_khoa_hoc: string
    ten_lop: string | null
    hoc_phi_goc: number
    khuyen_mai: {
        ten_chuong_trinh: string
        phan_tram_giam: number
    } | null
    hoc_phi_phai_nop: number
    da_dong: number
    con_thieu: number
    trang_thai_hoc: string
}

export default function CongNoPage() {
    const [data, setData] = useState<CongNoRecord[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        const fetchCongNo = async () => {
            try {
                const response = await fetch('/api/tai-chinh/cong-no', {
                    cache: 'no-store'
                })
                if (response.ok) {
                    const result = await response.json()
                    setData(result)
                }
            } catch (error) {
                console.error('Lỗi fetch dữ liệu công nợ:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCongNo()
    }, [])

    // Lọc theo từ khóa tìm kiếm (Tên học viên hoặc Số điện thoại)
    const filteredData = data.filter(item => {
        const matchName = item.ho_ten.toLowerCase().includes(searchTerm.toLowerCase())
        const matchPhone = item.so_dien_thoai?.includes(searchTerm) || false
        return matchName || matchPhone
    })

    // Phân trang
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    // Tính toán số liệu tổng hợp
    const totalDebtors = filteredData.length
    const totalTuition = filteredData.reduce((sum, item) => sum + item.hoc_phi_phai_nop, 0)
    const totalPaid = filteredData.reduce((sum, item) => sum + item.da_dong, 0)
    const totalOwed = filteredData.reduce((sum, item) => sum + item.con_thieu, 0)

    return (
        <div className="bg-slate-50 min-h-screen p-6 rounded-lg">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-800">
                    Quản lý công nợ học viên
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Theo dõi danh sách các học viên chưa hoàn thành học phí và thực hiện thu học phí nhanh.
                </p>
            </div>

            {/* Thống kê chi tiết (Stats Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Tổng số học viên nợ */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-3.5 bg-amber-50 rounded-lg text-amber-600 flex-shrink-0">
                        <FaUserCircle size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Học viên chưa hoàn tất</p>
                        <h3 className="text-xl font-bold text-slate-800 mt-0.5">{totalDebtors} học viên</h3>
                    </div>
                </div>

                {/* Tổng học phí sau giảm */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-3.5 bg-blue-50 rounded-lg text-blue-600 flex-shrink-0">
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tổng học phí phải thu</p>
                        <h3 className="text-xl font-bold text-slate-800 mt-0.5">{new Intl.NumberFormat('vi-VN').format(totalTuition)} đ</h3>
                    </div>
                </div>

                {/* Đã thu */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-3.5 bg-emerald-50 rounded-lg text-emerald-600 flex-shrink-0">
                        <FaCoins size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Đã thu trước đó</p>
                        <h3 className="text-xl font-bold text-emerald-600 mt-0.5">{new Intl.NumberFormat('vi-VN').format(totalPaid)} đ</h3>
                    </div>
                </div>

                {/* Còn thiếu (Tổng nợ) */}
                <div className="bg-white p-5 rounded-xl border border-rose-100 shadow-sm bg-gradient-to-r from-rose-50/20 to-white flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-3.5 bg-rose-50 rounded-lg text-rose-600 flex-shrink-0">
                        <FaExclamationCircle size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tổng công nợ còn thiếu</p>
                        <h3 className="text-xl font-bold text-rose-600 mt-0.5">{new Intl.NumberFormat('vi-VN').format(totalOwed)} đ</h3>
                    </div>
                </div>
            </div>

            {/* Tìm kiếm & hành động */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <FaSearch size={14} />
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm theo tên học viên, số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-800 transition"
                    />
                </div>
                <div className="text-sm text-slate-500 font-medium">
                    Hiển thị danh sách tự động cập nhật từ hệ thống phiếu thu.
                </div>
            </div>

            {/* Bảng công nợ */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="text-center py-12 text-slate-500 font-medium">
                        Đang tải dữ liệu công nợ học viên...
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 font-medium">
                        Không tìm thấy học viên nào còn thiếu học phí.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                                <tr>
                                    <th className="px-4 py-3.5 text-center whitespace-nowrap">Mã HV</th>
                                    <th className="px-4 py-3.5 text-left whitespace-nowrap">Tên học viên</th>
                                    <th className="px-4 py-3.5 text-center whitespace-nowrap">Số điện thoại</th>
                                    <th className="px-4 py-3.5 text-left whitespace-nowrap">Khóa học đăng ký</th>
                                    <th className="px-4 py-3.5 text-left whitespace-nowrap">Lớp học</th>
                                    <th className="px-4 py-3.5 text-right whitespace-nowrap">Học phí gốc</th>
                                    <th className="px-4 py-3.5 text-center whitespace-nowrap">Khuyến mãi</th>
                                    <th className="px-4 py-3.5 text-right whitespace-nowrap">Học phí phải nộp</th>
                                    <th className="px-4 py-3.5 text-right whitespace-nowrap text-emerald-600">Đã đóng</th>
                                    <th className="px-4 py-3.5 text-right whitespace-nowrap text-rose-600">Còn thiếu</th>
                                    <th className="px-4 py-3.5 text-center whitespace-nowrap">Trạng thái</th>
                                    <th className="px-4 py-3.5 text-center whitespace-nowrap">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {currentItems.map((row) => (
                                    <tr key={`${row.ma_hoc_vien}-${row.ma_khoa_hoc}`} className="hover:bg-slate-50/50 transition">
                                        <td className="px-4 py-4 text-center font-medium text-slate-500 whitespace-nowrap">
                                            {row.ma_hoc_vien}
                                        </td>
                                        <td className="px-4 py-4 font-bold text-slate-900 whitespace-nowrap text-left">
                                            {row.ho_ten}
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap text-slate-600 font-medium">
                                            {row.so_dien_thoai || 'Chưa cập nhật'}
                                        </td>
                                        <td className="px-4 py-4 font-medium text-slate-800 whitespace-nowrap text-left">
                                            {row.ten_khoa_hoc}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-left">
                                            {row.ten_lop ? (
                                                <span className="font-semibold text-slate-800 text-sm">
                                                    {row.ten_lop}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                    ⚠️ Chưa xếp lớp
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-right whitespace-nowrap text-slate-600">
                                            {new Intl.NumberFormat('vi-VN').format(row.hoc_phi_goc)} đ
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            {row.khuyen_mai ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                    -{row.khuyen_mai.phan_tram_giam}%
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">Không áp dụng</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-right whitespace-nowrap font-medium text-slate-800">
                                            {new Intl.NumberFormat('vi-VN').format(row.hoc_phi_phai_nop)} đ
                                        </td>
                                        <td className="px-4 py-4 text-right whitespace-nowrap font-bold text-emerald-600">
                                            {new Intl.NumberFormat('vi-VN').format(row.da_dong)} đ
                                        </td>
                                        <td className="px-4 py-4 text-right whitespace-nowrap font-bold text-rose-600">
                                            {new Intl.NumberFormat('vi-VN').format(row.con_thieu)} đ
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-semibold ${row.trang_thai_hoc === 'Đang học'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                                }`}>
                                                {row.trang_thai_hoc}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            <Link
                                                href={`/dashboard/tai-chinh/thu-hoc-phi?ma_hoc_vien=${row.ma_hoc_vien}`}
                                                className="inline-flex items-center gap-1 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 hover:shadow transition-all px-3 py-1.5 rounded-lg cursor-pointer"
                                            >
                                                Thu học phí <FaArrowRight size={10} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Phân trang */}
                {!isLoading && filteredData.length > 0 && (
                    <div className="bg-slate-50 px-4 py-3.5 border-t border-slate-200 flex justify-between items-center text-sm font-medium text-slate-500">
                        <div>
                            Hiển thị <span className="font-bold text-slate-700">{indexOfFirstItem + 1}</span> đến{' '}
                            <span className="font-bold text-slate-700">{Math.min(indexOfLastItem, filteredData.length)}</span> trong tổng số{' '}
                            <span className="font-bold text-slate-700">{filteredData.length}</span> học viên còn nợ học phí
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-2.5 py-1 rounded border border-slate-300 bg-white ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'
                                    }`}
                            >
                                Trước
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                <button
                                    key={num}
                                    onClick={() => paginate(num)}
                                    className={`px-2.5 py-1 rounded border ${currentPage === num
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'border-slate-300 bg-white hover:bg-slate-50 cursor-pointer'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-2.5 py-1 rounded border border-slate-300 bg-white ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'
                                    }`}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
