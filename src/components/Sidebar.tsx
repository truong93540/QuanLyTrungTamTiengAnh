'use client'

import { useState, useEffect } from 'react'
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
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa'

const menuItems = [
    {
        title: '1. Quản lý hệ thống',
        icon: FaCogs,
        children: [
            {
                title: '1.1 Quản lý tài khoản',
                href: '/dashboard/he-thong/tai-khoan',
                role: 'Quản lý tài khoản',
            },
        ],
    },
    {
        title: '2. Quản lý danh mục',
        icon: FaListUl,
        children: [
            {
                title: '2.1 DM Phòng ban',
                href: '/dashboard/danh-muc/phong-ban',
                role: 'Danh mục phòng ban',
            },

            {
                title: '2.2 DM Chức vụ',
                href: '/dashboard/danh-muc/chuc-vu',
                role: 'Danh mục chức vụ',
            },
            {
                title: '2.3 DM Chương trình học',
                href: '/dashboard/danh-muc/chuong-trinh',
                role: 'Danh mục chương trình học',
            },
            {
                title: '2.4 DM Phòng học',
                href: '/dashboard/danh-muc/phong-hoc',
                role: 'Danh mục phòng học',
            },
        ],
    },
    {
        title: '3. Quản lý tuyển sinh',
        icon: FaBullhorn,
        children: [
            {
                title: '3.1 Chương trình Marketing',
                href: '/dashboard/tuyen-sinh/marketing',
                role: 'Chương trình Marketing',
            },
            {
                title: '3.2 Thông tin khóa học',
                href: '/dashboard/tuyen-sinh/thong-tin',
                role: 'Thông tin khóa học',
            },
            {
                title: '3.3 Hoạt động ngoại khóa',
                href: '/dashboard/tuyen-sinh/ngoai-khoa',
                role: 'Hoạt động ngoại khóa',
            },
            {
                title: '3.4 Chương trình khuyến mãi',
                href: '/dashboard/tuyen-sinh/khuyen-mai',
                role: 'Chương trình khuyến mãi',
            },
            {
                title: '3.5 Quản lý cam kết',
                href: '/dashboard/tuyen-sinh/cam-ket',
                role: 'Quản lý cam kết',
            },
        ],
    },
    {
        title: '4. Quản lý dịch vụ đào tạo',
        icon: FaGraduationCap,
        children: [
            {
                title: '4.1 Kế hoạch giảng dạy',
                href: '/dashboard/dao-tao/ke-hoach-giang-day',
                role: 'Kế hoạch giảng dạy',
            },
            {
                title: '4.2 Chương trình học',
                href: '/dashboard/dao-tao/chuong-trinh',
                role: 'Quản lý chương trình học',
            },
            {
                title: '4.3 Quản lý nhân sự',
                href: '/dashboard/dao-tao/nhan-su',
                role: 'Quản lý nhân sự',
            },
            {
                title: '4.4 Hồ sơ học viên',
                href: '/dashboard/dao-tao/hoc-vien',
                role: 'Hồ sơ học viên',
            },
            {
                title: '4.5 Quản lý lớp học',
                href: '/dashboard/dao-tao/lop-hoc',
                role: 'Quản lý lớp học',
            },
            {
                title: '4.6 Quản lý giáo viên',
                href: '/dashboard/dao-tao/giao-vien',
                role: 'Quản lý lớp học',
            },
        ],
    },
    {
        title: '5. Quản lý tài chính',
        icon: FaFileInvoiceDollar,
        children: [
            {
                title: '5.1 Phiếu thu học phí',
                href: '/dashboard/tai-chinh/thu-hoc-phi',
                role: 'Quản lý phiếu thu học phí',
            },
            {
                title: '5.2 Quản lý bảng lương',
                href: '/dashboard/tai-chinh/bang-luong',
                role: 'Quản lý bảng lương',
            },
            {
                title: '5.3 Quản lý phiếu chi',
                href: '/dashboard/tai-chinh/phieu-chi',
                role: 'Quản lý phiếu chi',
            },
            {
                title: '5.4 Quản lý thưởng',
                href: '/dashboard/tai-chinh/thuong',
                role: 'Quản lý thưởng',
            },
            {
                title: '5.5 Quản lý công nợ',
                href: '/dashboard/tai-chinh/cong-no',
                role: 'Quản lý công nợ',
            },
            {
                title: '5.6 Quản lý chấm công',
                href: '/dashboard/tai-chinh/cham-cong',
                role: 'Quản lý chấm công',
            },
        ],
    },
    {
        title: '6. Báo cáo thống kê',
        icon: FaChartPie,
        children: [
            {
                title: '6.1 Thống kê tài chính',
                href: '/dashboard/bao-cao/tai-chinh',
                role: 'Báo cáo thống kê',
            },
        ],
    },
]

export default function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
    const [isMounted, setIsMounted] = useState<boolean>(false)

    // Load state from localStorage on client-side mount
    useEffect(() => {
        setIsMounted(true)
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebar-collapsed')
            if (saved === 'true') {
                setIsCollapsed(true)
            }
        }
    }, [])

    const handleToggleCollapse = () => {
        const next = !isCollapsed
        setIsCollapsed(next)
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar-collapsed', String(next))
        }
    }

    // Lấy danh sách quyền của user từ session
    const userRoles = session?.user?.allRoles || []
    const isAdmin = userRoles.includes('ADMIN')

    // Lọc menu dựa trên quyền
    const filteredMenuItems = menuItems
        .map((item) => {
            if (isAdmin) return item // Admin thấy tất cả

            // Nếu là menu trực tiếp (không có con)
            if (!item.children && (item as any).role) {
                return userRoles.includes((item as any).role) ? item : null
            }

            // Nếu là menu có con
            const filteredChildren = item.children?.filter((child) =>
                userRoles.includes(child.role),
            )
            if (filteredChildren && filteredChildren.length > 0) {
                return { ...item, children: filteredChildren }
            }
            return null
        })
        .filter((item) => item !== null) as typeof menuItems

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
        <aside className={`bg-[#0d47a1] text-white flex flex-col h-screen transition-all duration-300 ease-in-out select-none relative ${
            isCollapsed ? 'w-[72px]' : 'w-72'
        }`}>
            {/* Logo/Brand Area */}
            <div className="border-b border-blue-800/50 flex items-center h-20 px-4 relative transition-all duration-300 shrink-0">
                <div className="flex items-center overflow-hidden w-full">
                    {/* Compact logo shown as the permanent core */}
                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center border border-blue-400/20 shadow-inner font-extrabold text-base text-yellow-400 tracking-wider shrink-0 transition-all duration-300">
                        HP
                    </div>
                    
                    {/* Brand details sliding and fading out smoothly */}
                    <div className={`flex flex-col items-start transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                        isCollapsed ? 'opacity-0 w-0 ml-0 pointer-events-none' : 'opacity-100 w-auto ml-3'
                    }`}>
                        <h2 className="text-lg font-bold uppercase tracking-wider text-white leading-none">HP English</h2>
                        <p className="text-[10px] text-blue-300 mt-1 font-medium tracking-wide leading-none">Campus Management</p>
                    </div>
                </div>

                {/* Collapsible toggle button */}
                <button
                    onClick={handleToggleCollapse}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#0d47a1] shadow-md hover:scale-110 flex items-center justify-center transition-all duration-200 z-50 cursor-pointer"
                    title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
                >
                    {isCollapsed ? <FaChevronRight size={8} className="font-bold" /> : <FaChevronLeft size={8} className="font-bold" />}
                </button>
            </div>

            {/* Danh sách Menu*/}
            <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar overflow-x-hidden">
                {filteredMenuItems.map((item) => {
                    const hasChildren = item.children && item.children.length > 0
                    const isLink = (item as any).href
                    const isActive = isLink ? (pathname === (item as any).href) : false

                    // If clicked and collapsed, we auto-expand
                    const handleItemClick = () => {
                        if (isCollapsed) {
                            handleToggleCollapse()
                            // Also make sure the menu is open when we expand
                            if (!isLink) {
                                setOpenMenus(prev => ({ ...prev, [item.title]: true }))
                            }
                        } else {
                            if (!isLink) {
                                toggleMenu(item.title)
                            }
                        }
                    }

                    const content = (
                        <div className="flex items-center w-full min-w-0">
                            {/* Icon wrapper - perfectly sized to fit the collapsed space */}
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 select-none">
                                <item.icon className={`text-lg transition-all duration-300 shrink-0 ${
                                    isActive ? 'text-yellow-400 scale-110' : 'text-blue-300 hover:text-white'
                                }`} />
                            </div>

                            {/* Label text sliding and fading out smoothly */}
                            <span className={`text-[14px] font-semibold tracking-wide transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                                isCollapsed ? 'opacity-0 w-0 ml-0 pointer-events-none' : 'opacity-100 w-auto ml-3'
                            }`}>
                                {item.title}
                            </span>
                        </div>
                    )

                    return (
                        <div key={item.title} className="border-b border-blue-800/10 group relative transition-all duration-300">
                            {/* Hover Tooltip in collapsed mode */}
                            {isCollapsed && isMounted && (
                                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900/95 backdrop-blur-sm text-white text-xs font-semibold rounded-[6px] shadow-xl border border-slate-700/50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none translate-x-2 group-hover:translate-x-0">
                                    {item.title}
                                </div>
                            )}

                            {isLink ? (
                                <Link
                                    href={(item as any).href}
                                    className={`w-full flex items-center justify-between px-4 py-2 hover:bg-blue-800/50 transition-all duration-300 cursor-pointer ${
                                        isActive
                                            ? 'bg-blue-600/50 border-l-4 border-yellow-400'
                                            : 'border-l-4 border-transparent'
                                    }`}>
                                    {content}
                                </Link>
                            ) : (
                                <button
                                    onClick={handleItemClick}
                                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-blue-800/50 transition-all duration-300 border-l-4 border-transparent cursor-pointer">
                                    {content}

                                    {/* Chevron - slides out of viewport when collapsed */}
                                    <div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${
                                        isCollapsed ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100 w-auto ml-2'
                                    }`}>
                                        {openMenus[item.title] ? (
                                            <FaChevronUp className="text-[10px] text-blue-300 transition-transform duration-200" />
                                        ) : (
                                            <FaChevronDown className="text-[10px] opacity-40 transition-transform duration-200" />
                                        )}
                                    </div>
                                </button>
                            )}

                            {/* Render Menu Con */}
                            {hasChildren && openMenus[item.title] && !isCollapsed && (
                                <div className="bg-[#0a3578] py-1.5 transition-all duration-300">
                                    {item.children!.map((child) => {
                                        const isChildActive = pathname === child.href

                                        return (
                                            <Link
                                                key={child.title}
                                                href={child.href}
                                                className={`flex items-center gap-3 px-11 py-2.5 transition-colors text-[13px] cursor-pointer ${
                                                    isChildActive
                                                        ? 'text-white font-bold bg-blue-600/50 border-l-4 border-yellow-400'
                                                        : 'text-blue-100 hover:text-white hover:bg-blue-800/50'
                                                }`}>
                                                <FaAngleRight
                                                    className={`text-xs ${isChildActive ? 'text-yellow-400' : 'opacity-50'}`}
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

            <div className="p-4 border-t border-blue-800/50 transition-all duration-300 shrink-0">
                <button
                    className="flex items-center p-3 bg-red-600/90 rounded-[6px] hover:bg-red-700 transition-all duration-300 text-sm font-medium cursor-pointer w-full justify-center min-w-0 overflow-hidden whitespace-nowrap"
                    onClick={handleLogout}
                    title="Đăng xuất"
                >
                    <div className="w-10 h-5 flex items-center justify-center shrink-0">
                        <FaSignOutAlt className="text-base" />
                    </div>
                    <span className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isCollapsed ? 'opacity-0 w-0 ml-0 pointer-events-none' : 'opacity-100 w-auto ml-2'
                    }`}>
                        Đăng xuất
                    </span>
                </button>
            </div>
        </aside>
    )
}
