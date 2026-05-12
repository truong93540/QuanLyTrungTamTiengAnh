'use client'

import React, { useState } from 'react'
import { FaLock, FaKey, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Alert from '@/components/Alert'

export default function DoiMatKhauPage() {
    const router = useRouter()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [alertConfig, setAlertConfig] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setAlertConfig(null)

        if (newPassword !== confirmPassword) {
            setAlertConfig({ type: 'error', message: 'Mật khẩu mới và xác nhận không khớp!' })
            return
        }

        if (newPassword.length < 6) {
            setAlertConfig({ type: 'error', message: 'Mật khẩu mới phải từ 6 ký tự trở lên!' })
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            })

            const data = await res.json()
            if (res.ok) {
                setAlertConfig({ type: 'success', message: 'Chúc mừng! Bạn đã đổi mật khẩu thành công. Hệ thống sẽ chuyển hướng sau giây lát...' })
                // Đợi 2 giây để người dùng kịp đọc thông báo rồi mới chuyển trang
                setTimeout(() => {
                    router.push('/dashboard')
                }, 2000)
            } else {
                setAlertConfig({ type: 'error', message: data.message || 'Có lỗi xảy ra, vui lòng thử lại.' })
            }
        } catch (error) {
            setAlertConfig({ type: 'error', message: 'Lỗi kết nối server.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            {alertConfig && (
                <Alert 
                    type={alertConfig.type} 
                    message={alertConfig.message} 
                    onClose={() => setAlertConfig(null)} 
                    autoClose={alertConfig.type === 'success' ? 0 : 5000}
                />
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 px-8 py-6 text-white">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <FaLock /> Đổi mật khẩu cá nhân
                    </h1>
                    <p className="text-blue-100 mt-2 text-sm">
                        Vui lòng nhập mật khẩu hiện tại và mật khẩu mới để cập nhật bảo mật cho tài khoản.
                    </p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu hiện tại
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FaKey size={14} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
                                    placeholder="Nhập mật khẩu đang sử dụng..."
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
                                    placeholder="Tối thiểu 6 ký tự"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Xác nhận mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard')}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2"
                            >
                                <FaArrowLeft size={12} /> Quay lại
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isSubmitting ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
