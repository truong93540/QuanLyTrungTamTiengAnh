'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { FaUserCircle, FaKey, FaChevronDown } from 'react-icons/fa'

export default function Topbar() {
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-white border-b border-gray-200 px-8 py-3 flex justify-end items-center shrink-0 relative">
            {status === 'loading' ? (
                <div className="animate-pulse flex items-center gap-3">
                    <div className="text-right space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                        <div className="h-2 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                </div>
            ) : session?.user ? (
                <div className="relative">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition cursor-pointer group"
                    >
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-gray-800">{session.user.name || 'Người dùng'}</div>
                            <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5 uppercase tracking-wide border border-blue-100">
                                {session.user.role || 'Nhân sự'}
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shadow-sm overflow-hidden group-hover:border-blue-300 transition-colors">
                            <FaUserCircle size={32} />
                        </div>
                        <FaChevronDown className={`text-[10px] text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in duration-200 origin-top-right">
                                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Tài khoản cá nhân</p>
                                </div>
                                <Link 
                                    href="/dashboard/ca-nhan/doi-mat-khau"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors mx-2 rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FaKey size={14} />
                                    </div>
                                    <span className="font-medium">Đổi mật khẩu</span>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            ) : null}
        </div>
    )
}
