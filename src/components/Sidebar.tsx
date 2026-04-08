'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation' // Để highlight menu đang chọn
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
            { title: '1.1 Phân quyền', href: '/dashboard/he-thong/phan-quyen' },
            { title: '1.2 Quản lý tài khoản', href: '/dashboard/he-thong/tai-khoan' },
            { title: '1.3 Đổi mật khẩu', href: '/dashboard/he-thong/doi-mat-khau' },
        ],
    },
    {
        title: '2. Quản lý danh mục',
        icon: FaListUl,
        children: [
            { title: '2.1 DM Phòng ban', href: '/dashboard/danh-muc/phong-ban' },
            { title: '2.2 DM Khóa học', href: '/dashboard/danh-muc/khoa-hoc' },
            { title: '2.3 DM Chức vụ', href: '/dashboard/danh-muc/chuc-vu' },
            { title: '2.4 DM Chương trình học', href: '/dashboard/danh-muc/chuong-trinh' },
            { title: '2.5 DM Phòng học', href: '/dashboard/danh-muc/phong-hoc' },
        ],
    },
    {
        title: '3. Quản lý tuyển sinh',
        icon: FaBullhorn,
        children: [
            { title: '3.1 Chương trình Marketing', href: '/dashboard/tuyen-sinh/marketing' },
            { title: '3.2 Thông tin khóa học', href: '/dashboard/tuyen-sinh/thong-tin' },
            { title: '3.3 Hoạt động ngoại khóa', href: '/dashboard/tuyen-sinh/ngoai-khoa' },
            { title: '3.4 Chương trình khuyến mãi', href: '/dashboard/tuyen-sinh/khuyen-mai' },
            { title: '3.5 Quản lý cam kết', href: '/dashboard/tuyen-sinh/cam-ket' },
        ],
    },
    {
        title: '4. Quản lý dịch vụ đào tạo',
        icon: FaGraduationCap,
        children: [
            { title: '4.1 Kế hoạch giảng dạy', href: '/dashboard/dao-tao/ke-hoach' },
            { title: '4.2 Chương trình học', href: '/dashboard/dao-tao/chuong-trinh' },
            { title: '4.3 Thời khóa biểu', href: '/dashboard/dao-tao/thoi-khoa-bieu' },
            { title: '4.4 Quản lý nhân sự', href: '/dashboard/dao-tao/nhan-su' }, // Gộp 4.4.1 và 4.4.2 vào trang này
            { title: '4.5 Hồ sơ học viên', href: '/dashboard/dao-tao/hoc-vien' },
        ],
    },
    {
        title: '5. Quản lý tài chính',
        icon: FaFileInvoiceDollar,
        children: [
            { title: '5.1 Phiếu thu học phí', href: '/dashboard/tai-chinh/thu-hoc-phi' },
            { title: '5.2 Quản lý bảng lương', href: '/dashboard/tai-chinh/bang-luong' },
            { title: '5.3 Phiếu chi hoạt động', href: '/dashboard/tai-chinh/phieu-chi' },
            { title: '5.4 Quản lý thưởng', href: '/dashboard/tai-chinh/thuong' },
            { title: '5.5 Quản lý công nợ', href: '/dashboard/tai-chinh/cong-no' },
        ],
    },
    {
        title: '6. Báo cáo thống kê',
        icon: FaChartPie,
        children: [
            { title: '6.1 SL Học sinh theo tháng', href: '/dashboard/bao-cao/hoc-sinh' },
            { title: '6.2 Tổng lương chi trả', href: '/dashboard/bao-cao/tong-luong' },
            { title: '6.3 Hoạt động Marketing', href: '/dashboard/bao-cao/marketing' },
            { title: '6.4 Hoạt động Ngoại khóa', href: '/dashboard/bao-cao/ngoai-khoa' },
            { title: '6.5 Học phí theo khóa học', href: '/dashboard/bao-cao/hoc-phi' },
        ],
    },
]

export default function Sidebar() {
    const router = useRouter()
    const pathname = usePathname() // Lấy URL hiện tại để bôi đậm menu đang xem
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
        '1. Quản lý hệ thống': true, // Mặc định mở tab đầu tiên
    })

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }))
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/login')
    }

    return (
        <aside className="w-72 bg-[#0d47a1] text-white flex flex-col h-screen">
            <div className="p-6 text-center border-b border-blue-800/50">
                <h2 className="text-xl font-bold uppercase tracking-wider">HP English</h2>
                <p className="text-xs text-blue-300 mt-1">Campus Management</p>
            </div>

            {/* Danh sách Menu*/}
            <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                {menuItems.map((item) => (
                    <div key={item.title} className="border-b border-blue-800/30">
                        <button
                            onClick={() => toggleMenu(item.title)}
                            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-blue-800 transition-all">
                            <div className="flex items-center gap-3">
                                <item.icon className="text-lg text-blue-300" />
                                <span className="text-[14px] font-semibold tracking-wide">
                                    {item.title}
                                </span>
                            </div>
                            {openMenus[item.title] ? (
                                <FaChevronUp className="text-[10px] text-blue-300" />
                            ) : (
                                <FaChevronDown className="text-[10px] opacity-40" />
                            )}
                        </button>

                        {/* Render Menu Con */}
                        {openMenus[item.title] && item.children && (
                            <div className="bg-[#0a3578] py-2">
                                {item.children.map((child) => {
                                    const isActive = pathname === child.href // Kiểm tra xem có đang ở trang này không

                                    return (
                                        <Link
                                            key={child.title}
                                            href={child.href}
                                            className={`flex items-center gap-3 px-11 py-2.5 transition-colors text-[13px] ${
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
                ))}
            </nav>

            <div className="p-4 border-t border-blue-800/50">
                <button
                    className="flex items-center gap-3 w-full p-3 bg-red-600/90 rounded hover:bg-red-700 transition text-sm font-medium justify-center"
                    onClick={handleLogout}>
                    <FaSignOutAlt />
                    Đăng xuất (1.5)
                </button>
            </div>
        </aside>
    )
}
