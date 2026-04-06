'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react' // Thêm dòng này
import { useRouter } from 'next/navigation' // Thêm dòng này

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('') // Thêm state để hiện lỗi
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Gọi hàm signIn của NextAuth
        const res = await signIn('credentials', {
            username: username,
            password: password,
            redirect: false, // Ngăn trình duyệt tự load lại trang
        })

        if (res?.error) {
            // Nếu trả về null ở hàm authorize, nó sẽ nhảy vào đây
            setError('Tên đăng nhập hoặc mật khẩu không chính xác!')
        } else {
            // Đăng nhập thành công, chuyển hướng vào trang chủ Dashboard
            router.push('/dashboard')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md">
                <h2 className="text-center text-3xl font-bold text-blue-600">HP English</h2>
                <p className="text-center text-gray-500">Đăng nhập để quản lý hệ thống</p>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded border p-3 outline-blue-500 text-gray-700"
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded border p-3 outline-blue-500 text-gray-700"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full rounded bg-blue-600 p-3 text-white hover:bg-blue-700">
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    )
}
