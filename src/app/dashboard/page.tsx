'use client'

import { useSession, signOut } from 'next-auth/react'

export default function DashboardPage() {
    // Hook useSession giúp bạn lấy thông tin người dùng đang đăng nhập
    const { data: session, status } = useSession()

    // Trong lúc chờ check đăng nhập thì hiện chữ loading
    if (status === 'loading') return <p className="p-10">Đang kiểm tra quyền...</p>

    // Ép kiểu để TS không báo lỗi khi gọi user.role
    const user = session?.user as { name?: string; role?: string; email?: string } | undefined

    return (
        <div className="p-10 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <h1 className="text-2xl font-bold">Chào mừng, {user?.name}!</h1>
                <p className="text-gray-600 mt-2">
                    Chức vụ của bạn là:{' '}
                    <span className="font-bold text-blue-600">{user?.role}</span>
                </p>
                <p className="text-gray-600">Email liên hệ: {user?.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Nút này AI CŨNG THẤY */}
                <button className="p-4 bg-gray-200 rounded hover:bg-gray-300">
                    Xem thông báo chung
                </button>

                {/* PHÂN QUYỀN: Chỉ Admin mới thấy nút này */}
                {user?.role === 'Admin' && (
                    <button className="p-4 bg-red-100 text-red-700 font-bold rounded border border-red-500 hover:bg-red-200">
                        [Khu vực Admin] - Quản lý Tài khoản hệ thống
                    </button>
                )}

                {/* PHÂN QUYỀN: Chỉ Giảng viên mới thấy */}
                {user?.role === 'Giảng viên' && (
                    <button className="p-4 bg-green-100 text-green-700 font-bold rounded border border-green-500 hover:bg-green-200">
                        [Khu vực Giảng viên] - Xem lịch dạy
                    </button>
                )}
            </div>

            <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="mt-8 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
                Đăng xuất
            </button>
        </div>
    )
}
