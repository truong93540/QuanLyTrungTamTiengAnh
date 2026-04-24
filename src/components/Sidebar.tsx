'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
    FaCogs,
    FaListUl,
    FaBullhorn,
    FaGraduationCap,
    FaFileInvoiceDollar,
    FaChartPie,
    FaChevronDown,
    FaChevronUp,
    FaAngleRight,
    FaSignOutAlt,
} from 'react-icons/fa'

const menuItems = [
    {
        title: '1. Quản lý hệ thống',
        icon: FaCogs,
        children: [
            { title: '1.1 Quản lý tài khoản', href: '/dashboard/he-thong/tai-khoan', role: 'ADMIN' },
        ],
    },
    {
        title: '2. Quản lý danh mục',
        icon: FaListUl,
        children: [
            { title: '2.1 DM Phòng ban', href: '/dashboard/danh-muc/phong-ban', role: 'Danh mục phòng ban' },
            { title: '2.2 DM Khóa học', href: '/dashboard/danh-muc/khoa-hoc', role: 'Danh mục khóa học' },
            { title: '2.3 DM Chức vụ', href: '/dashboard/danh-muc/chuc-vu', role: 'Danh mục chức vụ' },
            { title: '2.4 DM Chương trình học', href: '/dashboard/danh-muc/chuong-trinh', role: 'Danh mục chương trình học' },
            { title: '2.5 DM Phòng học', href: '/dashboard/danh-muc/phong-hoc', role: 'Danh mục phòng học' },
        ],
    },
    {
        title: '3. Quản lý tuyển sinh',
        icon: FaBullhorn,
        children: [
            { title: '3.1 Chương trình Marketing', href: '/dashboard/tuyen-sinh/marketing', role: 'Chương trình Marketing' },
            { title: '3.2 Thông tin khóa học', href: '/dashboard/tuyen-sinh/thong-tin', role: 'Thông tin khóa học' },
            { title: '3.3 Hoạt động ngoại khóa', href: '/dashboard/tuyen-sinh/ngoai-khoa', role: 'Hoạt động ngoại khóa' },
            { title: '3.4 Chương trình khuyến mãi', href: '/dashboard/tuyen-sinh/khuyen-mai', role: 'Chương trình khuyến mãi' },
            { title: '3.5 Quản lý cam kết', href: '/dashboard/tuyen-sinh/cam-ket', role: 'Quản lý cam kết' },
        ],
    },
    {
        title: '4. Quản lý dịch vụ đào tạo',
        icon: FaGraduationCap,
        children: [
            { title: '4.1 Kế hoạch giảng dạy', href: '/dashboard/dao-tao/ke-hoach', role: 'Kế hoạch giảng dạy' },
            { title: '4.2 Chương trình học', href: '/dashboard/dao-tao/chuong-trinh', role: 'Quản lý chương trình học' },
            { title: '4.3 Quản lý nhân sự', href: '/dashboard/dao-tao/nhan-su', role: 'Quản lý hợp đồng lao động' }, // Map tạm sang HĐLĐ
            { title: '4.4 Hồ sơ học viên', href: '/dashboard/dao-tao/hoc-vien', role: 'Hồ sơ học viên' },
            { title: '4.5 Quản lý lớp học', href: '/dashboard/dao-tao/lop-hoc', role: 'Quản lý lớp học' },
        ],
    },
    {
        title: '5. Quản lý tài chính',
        icon: FaFileInvoiceDollar,
        children: [
            { title: '5.1 Phiếu thu học phí', href: '/dashboard/tai-chinh/thu-hoc-phi', role: 'Quản lý phiếu thu học phí' },
            { title: '5.2 Quản lý bảng lương', href: '/dashboard/tai-chinh/bang-luong', role: 'Quản lý bảng lương' },
            { title: '5.3 Phiếu chi hoạt động', href: '/dashboard/tai-chinh/phieu-chi', role: 'Phiếu chi hoạt động' },
            { title: '5.4 Quản lý thưởng', href: '/dashboard/tai-chinh/thuong', role: 'Quản lý thưởng' },
            { title: '5.5 Quản lý công nợ', href: '/dashboard/tai-chinh/cong-no', role: 'Quản lý công nợ' },
        ],
    },
    {
        title: '6. Báo cáo thống kê',
        icon: FaChartPie,
        href: '/dashboard/bao-cao',
        role: 'Báo cáo thống kê',
    }
]

export default function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})

    // Lấy danh sách quyền của user từ session
    const userRoles = session?.user?.allRoles || []
    const isAdmin = userRoles.includes('ADMIN')

    // Lọc menu dựa trên quyền
    const filteredMenuItems = menuItems.map((item) => {
        if (isAdmin) return item // Admin thấy tất cả

        // Nếu là menu trực tiếp (không có con)
        if (!item.children && (item as any).role) {
            return userRoles.includes((item as any).role) ? item : null
        }

        // Nếu là menu có con
        const filteredChildren = item.children?.filter((child) => userRoles.includes(child.role))
        if (filteredChildren && filteredChildren.length > 0) {
            return { ...item, children: filteredChildren }
        }
        return null
    }).filter((item) => item !== null) as typeof menuItems

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }))
    }

    const handleLogout = () => {
        signOut({ callbackUrl: '/login' })
    }

    return (
        <aside className="w-72 bg-[#0d47a1] text-white flex flex-col h-screen">
            <div className="p-6 text-center border-b border-blue-800/50">
                <h2 className="text-xl font-bold uppercase tracking-wider">HP English</h2>
                <p className="text-xs text-blue-300 mt-1">Campus Management</p>
            </div>

            {/* Danh sách Menu*/}
            <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                {filteredMenuItems.map((item) => {
                    const hasChildren = item.children && item.children.length > 0
                    const isLink = (item as any).href

                    const content = (
                        <div className="flex items-center gap-3">
                            <item.icon className="text-lg text-blue-300" />
                            <span className="text-[14px] font-semibold tracking-wide">
                                {item.title}
                            </span>
                        </div>
                    )

                    return (
                        <div key={item.title} className="border-b border-blue-800/30 ">
                            {isLink ? (
                                <Link
                                    href={(item as any).href}
                                    className={`w-full flex items-center justify-between px-5 py-3.5 hover:bg-blue-800 transition-all cursor-pointer ${
                                        pathname === (item as any).href ? 'bg-blue-600/50 border-l-4 border-yellow-400' : ''
                                    }`}>
                                    {content}
                                </Link>
                            ) : (
                                <button
                                    onClick={() => toggleMenu(item.title)}
                                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-blue-800 transition-all cursor-pointer">
                                    {content}

                                    {openMenus[item.title] ? (
                                        <FaChevronUp className="text-[10px] text-blue-300" />
                                    ) : (
                                        <FaChevronDown className="text-[10px] opacity-40" />
                                    )}
                                </button>
                            )}

                            {/* Render Menu Con */}
                            {hasChildren && openMenus[item.title] && (
                                <div className="bg-[#0a3578] py-2 ">
                                    {item.children!.map((child) => {
                                        const isActive = pathname === child.href

                                        return (
                                            <Link
                                                key={child.title}
                                                href={child.href}
                                                className={`flex items-center gap-3 px-11 py-2.5 transition-colors text-[13px] cursor-pointer ${
                                                    isActive
                                                        ? 'text-white font-bold bg-blue-600/50 border-l-4 border-yellow-400'
                                                        : 'text-blue-100 hover:text-white hover:bg-blue-800/50'
                                                }`}>
                                                <FaAngleRight
                                                    className={`text-xs ${isActive ? 'text-yellow-400' : 'opacity-50'}`}
                                                />
                                                {child.title}
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-blue-800/50">
                <button
                    className="flex items-center gap-3 w-full p-3 bg-red-600/90 rounded hover:bg-red-700 transition text-sm font-medium justify-center cursor-pointer"
                    onClick={handleLogout}>
                    <FaSignOutAlt />
                    Đăng xuất
                </button>
            </div>
        </aside>
    )
}
