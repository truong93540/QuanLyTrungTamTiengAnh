'use client'

import React, { useState, useEffect } from 'react'
import { FaTimes, FaSave, FaSearch } from 'react-icons/fa'

interface AccountModalProps {
    account?: any | null
    onClose: (shouldRefresh?: boolean) => void
}

export default function AccountModal({ account, onClose }: AccountModalProps) {
    const isEditMode = !!account

    const [formData, setFormData] = useState({
        ma_nhan_su: '',
        ten_dang_nhap: '',
        email: '',
        mat_khau: '',
        trang_thai: 'Hoạt động',
    })

    const [nhanSuName, setNhanSuName] = useState('')
    const [nhanSuError, setNhanSuError] = useState('')
    const [isFetchingNhanSu, setIsFetchingNhanSu] = useState(false)

    const [quyenList, setQuyenList] = useState<any[]>([])
    const [selectedQuyenIds, setSelectedQuyenIds] = useState<number[]>([])

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // Khởi tạo dữ liệu
    useEffect(() => {
        fetchQuyenList()

        if (isEditMode && account) {
            setFormData({
                ma_nhan_su: account.ma_nhan_su.toString(),
                ten_dang_nhap: account.ten_dang_nhap,
                email: account.email,
                mat_khau: '', // Để trống mật khẩu khi sửa
                trang_thai: account.trang_thai || 'Hoạt động',
            })
            setNhanSuName(account.ho_ten)
            setSelectedQuyenIds(account.quyen_ids || [])
        }
    }, [isEditMode, account])

    const fetchQuyenList = async () => {
        try {
            const res = await fetch('/api/admin/quyen')
            if (res.ok) {
                const data = await res.json()
                setQuyenList(data)
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách quyền:', error)
        }
    }

    const checkMaNhanSu = async () => {
        if (!formData.ma_nhan_su) return
        if (isEditMode) return // Sửa thì không check lại mã nhân sự

        setIsFetchingNhanSu(true)
        setNhanSuName('')
        setNhanSuError('')

        try {
            const res = await fetch(`/api/admin/nhan-su?ma_nhan_su=${formData.ma_nhan_su}`)
            const data = await res.json()

            if (!res.ok) {
                setNhanSuError(data.message || 'Mã nhân sự không hợp lệ')
            } else if (data.hasAccount) {
                setNhanSuName(data.data.ho_ten)
                setNhanSuError('Nhân sự này đã có tài khoản')
            } else {
                setNhanSuName(data.data.ho_ten)
            }
        } catch (error) {
            setNhanSuError('Lỗi kết nối')
        } finally {
            setIsFetchingNhanSu(false)
        }
    }

    const handleQuyenToggle = (ma_quyen: number) => {
        setSelectedQuyenIds((prev) => {
            if (prev.includes(ma_quyen)) {
                return prev.filter((id) => id !== ma_quyen)
            } else {
                return [...prev, ma_quyen]
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')

        if (!isEditMode && (!formData.ten_dang_nhap || !formData.mat_khau || !formData.email || !formData.ma_nhan_su)) {
            setErrorMsg('Vui lòng điền đầy đủ các trường bắt buộc')
            return
        }

        if (!isEditMode && nhanSuError) {
            setErrorMsg('Vui lòng chọn mã nhân sự hợp lệ')
            return
        }

        setIsSubmitting(true)

        try {
            const url = isEditMode
                ? `/api/admin/tai-khoan/${account.ma_tai_khoan}`
                : '/api/admin/tai-khoan'
            
            const method = isEditMode ? 'PUT' : 'POST'

            const payload = {
                ...formData,
                quyen_ids: selectedQuyenIds,
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const data = await res.json()

            if (!res.ok) {
                setErrorMsg(data.message || 'Có lỗi xảy ra')
            } else {
                onClose(true) // Refresh lại danh sách
            }
        } catch (error) {
            setErrorMsg('Lỗi kết nối server')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">
                        {isEditMode ? 'Sửa thông tin & Phân quyền' : 'Tạo tài khoản mới'}
                    </h2>
                    <button
                        onClick={() => onClose()}
                        className="text-gray-400 hover:text-red-500 transition cursor-pointer">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Body - Có scroll */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                            {errorMsg}
                        </div>
                    )}

                    <form id="accountForm" onSubmit={handleSubmit} className="space-y-6">
                        {/* Khu vực thông tin cơ bản */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                Thông tin tài khoản
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mã nhân sự <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.ma_nhan_su}
                                            onChange={(e) =>
                                                setFormData({ ...formData, ma_nhan_su: e.target.value })
                                            }
                                            onBlur={checkMaNhanSu}
                                            disabled={isEditMode}
                                            placeholder="Nhập mã nhân sự..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 text-gray-900 bg-white"
                                        />
                                    </div>
                                    {isFetchingNhanSu ? (
                                        <p className="text-xs text-blue-500 mt-1">Đang kiểm tra...</p>
                                    ) : nhanSuError ? (
                                        <p className="text-xs text-red-500 mt-1">{nhanSuError}</p>
                                    ) : nhanSuName ? (
                                        <p className="text-sm text-green-600 mt-1 font-medium">
                                            Họ tên: {nhanSuName}
                                        </p>
                                    ) : null}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên đăng nhập <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ten_dang_nhap}
                                        onChange={(e) =>
                                            setFormData({ ...formData, ten_dang_nhap: e.target.value })
                                        }
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                                    />
                                </div>

                                {!isEditMode && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mật khẩu <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.mat_khau}
                                            onChange={(e) =>
                                                setFormData({ ...formData, mat_khau: e.target.value })
                                            }
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                                        />
                                    </div>
                                )}

                                {isEditMode && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Trạng thái
                                        </label>
                                        <select
                                            value={formData.trang_thai}
                                            onChange={(e) =>
                                                setFormData({ ...formData, trang_thai: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900">
                                            <option value="Hoạt động">Hoạt động</option>
                                            <option value="Bị khóa">Bị khóa</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Khu vực phân quyền */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">
                                Phân quyền chức năng
                            </h3>
                            {quyenList.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">Đang tải danh sách quyền...</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {quyenList.map((q) => (
                                        <label
                                            key={q.ma_quyen}
                                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition">
                                            <input
                                                type="checkbox"
                                                checked={selectedQuyenIds.includes(q.ma_quyen)}
                                                onChange={() => handleQuyenToggle(q.ma_quyen)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                            />
                                            <div className="ml-3">
                                                <span className="text-sm font-medium text-gray-800 block">
                                                    {q.ten_quyen}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={() => onClose()}
                        className="px-5 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer font-medium">
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        form="accountForm"
                        disabled={isSubmitting || (!!nhanSuError && !isEditMode)}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 cursor-pointer font-medium shadow-sm">
                        {isSubmitting ? 'Đang lưu...' : (
                            <>
                                <FaSave /> Lưu thông tin
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
