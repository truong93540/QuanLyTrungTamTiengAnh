import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* 1. Cột trái là Component Sidebar đã tách riêng */}
            <Sidebar />

            {/* 2. Cột phải là Nội dung chính thay đổi theo URL */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 p-8 overflow-auto">{children}</main>
            </div>
        </div>
    )
}
