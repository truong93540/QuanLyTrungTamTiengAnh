'use client'

import React, { useState } from 'react'
import { FaTimes, FaSave } from 'react-icons/fa'

interface ChangePasswordModalProps {
    account: any
    onClose: () => void
}

export default function ChangePasswordModal({ account, onClose }: ChangePasswordModalProps) {
    const [matKhauMoi, setMatKhauMoi] = useState('')
    const [xacNhanMatKhau, setXacNhanMatKhau] = useState('')
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')
        setSuccessMsg('')

        if (!matKhauMoi || !xacNhanMatKhau) {
            setErrorMsg('Vui lòng nhập đầy đủ thông tin')
            return
        }

        if (matKhauMoi !== xacNhanMatKhau) {
            setErrorMsg('Mật khẩu xác nhận không khớp')
            return
        }

        if (matKhauMoi.length < 6) {
            setErrorMsg('Mật khẩu phải dài ít nhất 6 ký tự')
            return
        }

        setIsSubmitting(true)

        try {
            // Sử dụng lại API PUT đã có
            const res = await fetch(`/api/admin/tai-khoan/${account.ma_tai_khoan}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mat_khau: matKhauMoi }),
            })

            const data = await res.json()

            if (!res.ok) {
                setErrorMsg(data.message || 'Có lỗi xảy ra')
            } else {
                setSuccessMsg('Đổi mật khẩu thành công!')
                setTimeout(() => {
                    onClose()
                }, 1500)
            }
        } catch (error) {
            setErrorMsg('Lỗi kết nối server')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Đổi mật khẩu</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 transition cursor-pointer">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                        Tài khoản: <span className="font-semibold text-blue-600">{account.ten_dang_nhap}</span> ({account.ho_ten})
                    </p>

                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100 font-medium">
                            {successMsg}
                        </div>
                    )}

                    <form id="pwdForm" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu mới <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={matKhauMoi}
                                onChange={(e) => setMatKhauMoi(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                                placeholder="Nhập mật khẩu mới..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nhập lại mật khẩu mới <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={xacNhanMatKhau}
                                onChange={(e) => setXacNhanMatKhau(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                                placeholder="Xác nhận mật khẩu..."
                            />
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer font-medium">
                        Hủy
                    </button>
                    <button
                        type="submit"
                        form="pwdForm"
                        disabled={isSubmitting || !!successMsg}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 cursor-pointer font-medium shadow-sm">
                        {isSubmitting ? 'Đang lưu...' : (
                            <>
                                <FaSave /> Cập nhật
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
