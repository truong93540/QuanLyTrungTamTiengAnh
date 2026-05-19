'use client'

import React, { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import AccountModal from '@/components/admin/AccountModal'
import ChangePasswordModal from '@/components/admin/ChangePasswordModal'

export default function QuanLyTaiKhoan() {
    const [accounts, setAccounts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<any | null>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = accounts.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(accounts.length / itemsPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    const fetchAccounts = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/admin/tai-khoan')
            if (res.ok) {
                const data = await res.json()
                setAccounts(data)
                setCurrentPage(1)
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách tài khoản:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAccounts()
    }, [])

    const handleOpenAddModal = () => {
        setSelectedAccount(null)
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (account: any) => {
        setSelectedAccount(account)
        setIsModalOpen(true)
    }

    const handleCloseModal = (shouldRefresh?: boolean) => {
        setIsModalOpen(false)
        setIsPasswordModalOpen(false)
        setSelectedAccount(null)
        if (shouldRefresh) {
            fetchAccounts()
        }
    }

    const handleOpenPasswordModal = (account: any) => {
        setSelectedAccount(account)
        setIsPasswordModalOpen(true)
    }

    const handleDeleteAccount = async (account: any) => {
        if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${account.ten_dang_nhap}" của nhân sự ${account.ho_ten}?`)) {
            try {
                const res = await fetch(`/api/admin/tai-khoan/${account.ma_tai_khoan}`, {
                    method: 'DELETE',
                })
                if (res.ok) {
                    fetchAccounts()
                } else {
                    const data = await res.json()
                    alert(data.message || 'Lỗi khi xóa tài khoản')
                }
            } catch (error) {
                console.error('Lỗi kết nối', error)
            }
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý tài khoản</h1>
                    <p className="text-gray-500 mt-1">Quản lý thông tin đăng nhập và phân quyền cho nhân sự</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer shadow-sm">
                    <FaPlus />
                    Thêm tài khoản
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="p-2 border border-gray-100 text-center">Mã NS</th>
                                <th className="p-2 border border-gray-100">Tên nhân sự</th>
                                <th className="p-2 border border-gray-100">Tên đăng nhập</th>
                                <th className="p-2 border border-gray-100 max-w-[300px]">Các quyền hiện tại</th>
                                <th className="p-2 border border-gray-100">Trạng thái</th>
                                <th className="p-2 border border-gray-100 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500 border border-gray-100">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500 border border-gray-100">
                                        Chưa có tài khoản nào trong hệ thống.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((acc) => (
                                    <tr key={acc.ma_tai_khoan} className="hover:bg-blue-50/50 transition">
                                        <td className="p-2 border border-gray-100 font-medium text-gray-900 text-center whitespace-nowrap">
                                            {acc.loai === 'Giáo viên'
                                                ? `GV-${acc.ma_giao_vien || ''}`
                                                : `NS-${acc.ma_nhan_su ?? acc.ma_nhan_vien ?? ''}`}
                                        </td>
                                        <td className="p-2 border border-gray-100 font-medium text-gray-900">
                                            {acc.ho_ten}
                                        </td>
                                        <td className="p-2 border border-gray-100">
                                            {acc.ten_dang_nhap}
                                        </td>
                                        <td className="p-2 border border-gray-100 min-w-[280px]">
                                            <div className="flex flex-wrap gap-1 max-w-[300px]">
                                                {acc.quyen && acc.quyen.length > 0 ? (
                                                    acc.quyen.map((q: string, idx: number) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-blue-50 text-blue-700 text-[14px] rounded border border-blue-100 font-medium text-center flex items-center justify-center leading-tight">
                                                            {q}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs">Chưa có quyền</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-2 border border-gray-100">
                                            {acc.trang_thai === 'Hoạt động' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-xs font-medium bg-green-100 text-green-700">
                                                    <FaCheckCircle className="text-[10px]" /> Hoạt động
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-xs font-medium bg-red-100 text-red-700">
                                                    <FaTimesCircle className="text-[10px]" /> Bị khóa
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-2 border border-gray-100">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleOpenPasswordModal(acc)}
                                                    className="text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2 py-1 rounded transition cursor-pointer">
                                                    Đổi mật khẩu
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEditModal(acc)}
                                                    className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                                                    title="Sửa & Phân quyền">
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAccount(acc)}
                                                    className="text-red-500 hover:text-red-700 transition cursor-pointer"
                                                    title="Xóa tài khoản">
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang tài khoản giống danh mục chức vụ */}
                {!isLoading && accounts.length > 0 && (
                    <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50/50 font-medium text-gray-600">
                        <div className="text-sm">
                            Hiển thị{' '}
                            <span className="font-bold text-gray-800">{indexOfFirstItem + 1}</span> đến{' '}
                            <span className="font-bold text-gray-800">
                                {Math.min(indexOfLastItem, accounts.length)}
                            </span>{' '}
                            trong tổng số <span className="font-bold text-gray-800">{accounts.length}</span>{' '}
                            tài khoản
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-[8px] border text-xs font-medium transition ${
                                    currentPage === 1 
                                        ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' 
                                        : 'hover:bg-gray-100 hover:cursor-pointer border-gray-300 bg-white text-gray-700'
                                }`}>
                                Trước
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`px-3 py-1 rounded-[8px] border text-xs font-bold transition ${
                                        currentPage === number
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                            : 'hover:bg-gray-100 border-gray-300 hover:cursor-pointer bg-white text-gray-700'
                                    }`}>
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-[8px] border text-xs font-medium transition ${
                                    currentPage === totalPages 
                                        ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' 
                                        : 'hover:bg-gray-100 hover:cursor-pointer border-gray-300 bg-white text-gray-700'
                                }`}>
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <AccountModal
                    account={selectedAccount}
                    onClose={handleCloseModal}
                />
            )}

            {isPasswordModalOpen && selectedAccount && (
                <ChangePasswordModal
                    account={selectedAccount}
                    onClose={() => handleCloseModal(true)}
                />
            )}
        </div>
    )
}
