import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const yearParam = searchParams.get('year')
        const currentYear = yearParam ? parseInt(yearParam) : new Date().getFullYear()
        
        const limitParam = searchParams.get('limit')
        const limit = limitParam ? Math.max(1, parseInt(limitParam)) : 10

        // 1. Fetch all PhieuThu (Revenue)
        const phieuThu = await prisma.phieuThu.findMany({
            include: {
                hoc_vien: { select: { ho_ten: true } },
                nhan_su: { select: { ho_ten: true } },
                khoa_hoc: { select: { ten_khoa_hoc: true } }
            }
        })

        // 2. Fetch all PhieuChi (Expense)
        const phieuChi = await prisma.phieuChi.findMany({
            include: {
                nhan_su: { select: { ho_ten: true } }
            }
        })

        // 3. Calculate overall totals
        const totalRevenue = phieuThu.reduce((sum, item) => sum + Number(item.so_tien), 0)
        const totalExpense = phieuChi
            .filter(item => item.trang_thai === 'Đã chi')
            .reduce((sum, item) => sum + Number(item.tong_tien), 0)
        
        const pendingExpense = phieuChi
            .filter(item => item.trang_thai === 'Chờ duyệt')
            .reduce((sum, item) => sum + Number(item.tong_tien), 0)

        const netProfit = totalRevenue - totalExpense

        // 4. Calculate monthly data for selected year
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
            month: `Tháng ${i + 1}`,
            revenue: 0,
            expense: 0,
            net: 0
        }))

        // Filter and accumulate Revenue by month for the selected year
        phieuThu.forEach(item => {
            const date = new Date(item.ngay_thu)
            const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000)
            const year = vnDate.getUTCFullYear()
            const month = vnDate.getUTCMonth() // 0-11

            if (year === currentYear) {
                monthlyData[month].revenue += Number(item.so_tien)
            }
        })

        // Filter and accumulate Expense by month for the selected year
        phieuChi.forEach(item => {
            if (item.trang_thai !== 'Đã chi') return
            const date = new Date(item.ngay_chi)
            const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000)
            const year = vnDate.getUTCFullYear()
            const month = vnDate.getUTCMonth() // 0-11

            if (year === currentYear) {
                monthlyData[month].expense += Number(item.tong_tien)
            }
        })

        // Calculate Net for each month
        monthlyData.forEach(item => {
            item.net = item.revenue - item.expense
        })

        // 5. Combine and construct recent transactions (last 10 total)
        const unifiedTransactions: any[] = []

        phieuThu.forEach(item => {
            unifiedTransactions.push({
                id: `PT-${item.ma_phieu_thu}`,
                type: 'REVENUE',
                amount: Number(item.so_tien),
                date: item.ngay_thu,
                title: item.noi_dung || `Thu học phí khóa học ${item.khoa_hoc?.ten_khoa_hoc || ''}`,
                partner: item.hoc_vien?.ho_ten || 'Học viên',
                creator: item.nhan_su?.ho_ten || 'Không rõ'
            })
        })

        phieuChi.forEach(item => {
            unifiedTransactions.push({
                id: `PC-${item.ma_phieu_chi}`,
                type: 'EXPENSE',
                amount: Number(item.tong_tien),
                date: item.ngay_chi,
                title: item.noi_dung || `Phiếu chi ${item.loai_phieu_chi === 'LUONG' ? 'lương nhân viên' : item.loai_phieu_chi === 'MARKETING' ? 'chi phí Marketing' : 'chi phí khác'}`,
                partner: item.nguoi_nhan || 'Người nhận',
                creator: item.nhan_su?.ho_ten || 'Không rõ',
                status: item.trang_thai
            })
        })

        // Sort by date descending and take top N based on limit
        const recentTransactions = unifiedTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit)

        // 6. Calculate statistics by category for the selected year
        let salaryExpenseYear = 0
        let marketingExpenseYear = 0
        let otherExpenseYear = 0

        phieuChi.forEach(item => {
            if (item.trang_thai !== 'Đã chi') return
            const date = new Date(item.ngay_chi)
            const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000)
            if (vnDate.getUTCFullYear() === currentYear) {
                const amount = Number(item.tong_tien)
                if (item.loai_phieu_chi === 'LUONG') {
                    salaryExpenseYear += amount
                } else if (item.loai_phieu_chi === 'MARKETING') {
                    marketingExpenseYear += amount
                } else {
                    otherExpenseYear += amount
                }
            }
        })

        return NextResponse.json({
            totalRevenue,
            totalExpense,
            pendingExpense,
            netProfit,
            monthlyData,
            recentTransactions,
            categoryStats: {
                salary: salaryExpenseYear,
                marketing: marketingExpenseYear,
                other: otherExpenseYear
            }
        }, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate'
            }
        })
    } catch (error) {
        console.error('Lỗi API báo cáo tài chính:', error)
        return NextResponse.json(
            { error: 'Lỗi máy chủ khi tải báo cáo tài chính' },
            { status: 500 }
        )
    }
}
