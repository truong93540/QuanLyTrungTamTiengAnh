'use client'

import { useSession } from 'next-auth/react'
import { FaUserCircle } from 'react-icons/fa'

export default function Topbar() {
    const { data: session, status } = useSession()

    return (
        <div className="bg-white border-b border-gray-200 px-8 py-3 flex justify-end items-center shrink-0">
            {status === 'loading' ? (
                <div className="animate-pulse flex items-center gap-3">
                    <div className="text-right space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                        <div className="h-2 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                </div>
            ) : session?.user ? (
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-sm font-bold text-gray-800">{session.user.name || 'Người dùng'}</div>
                        <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5 uppercase tracking-wide">
                            {session.user.role || 'Nhân sự'}
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shadow-inner">
                        <FaUserCircle size={28} />
                    </div>
                </div>
            ) : null}
        </div>
    )
}
