'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
    FaChartPie, FaWallet, FaHourglassHalf, FaCalendarAlt, 
    FaArrowUp, FaArrowDown, FaInfoCircle, FaFileInvoiceDollar,
    FaArrowLeft, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa'
import { formatCurrency } from '@/lib/utils'

interface MonthlyData {
    month: string
    revenue: number
    expense: number
    net: number
}

interface RecentTransaction {
    id: string
    type: 'REVENUE' | 'EXPENSE'
    amount: number
    date: string
    title: string
    partner: string
    creator: string
    status?: string
}

interface CategoryStats {
    salary: number
    marketing: number
    other: number
}

interface ReportData {
    totalRevenue: number
    totalExpense: number
    pendingExpense: number
    netProfit: number
    monthlyData: MonthlyData[]
    recentTransactions: RecentTransaction[]
    categoryStats: CategoryStats
}

export default function FinancialReportPage() {
    const today = useMemo(() => new Date(), [])
    const [selectedYear, setSelectedYear] = useState<string>(today.getFullYear().toString())
    const [data, setData] = useState<ReportData | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [activeTab, setActiveTab] = useState<'ALL' | 'REVENUE' | 'EXPENSE'>('ALL')
    const [hoveredMonth, setHoveredMonth] = useState<number | null>(null)
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    
    // States for custom transaction log limit
    const [limitInput, setLimitInput] = useState<string>('10')
    const [transactionLimit, setTransactionLimit] = useState<number>(10)

    const fetchReportData = async (year: string, limit: number) => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/tai-chinh/bao-cao?year=${year}&limit=${limit}`, { cache: 'no-store' })
            if (res.ok) {
                const json = await res.json()
                setData(json)
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu báo cáo:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReportData(selectedYear, transactionLimit)
    }, [selectedYear, transactionLimit])

    // Filtered transactions for the tabs
    const filteredTransactions = useMemo(() => {
        if (!data) return []
        if (activeTab === 'ALL') return data.recentTransactions
        return data.recentTransactions.filter(t => t.type === activeTab)
    }, [data, activeTab])

    // Max value in monthly data for SVG scaling
    const maxMonthlyVal = useMemo(() => {
        if (!data || data.monthlyData.length === 0) return 1000000
        const values = data.monthlyData.flatMap(m => [m.revenue, m.expense])
        const max = Math.max(...values)
        return max > 0 ? max * 1.15 : 1000000 // Add padding to top of chart
    }, [data])

    if (isLoading && !data) {
        return (
            <div className="bg-slate-50 min-h-screen p-8 text-slate-800 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold text-lg">Đang tổng hợp dữ liệu tài chính từ hệ thống...</p>
            </div>
        )
    }

    const {
        totalRevenue = 0,
        totalExpense = 0,
        pendingExpense = 0,
        netProfit = 0,
        monthlyData = [],
        categoryStats = { salary: 0, marketing: 0, other: 0 }
    } = data || {}

    const totalCategoryExpense = categoryStats.salary + categoryStats.marketing + categoryStats.other

    return (
        <div className="bg-slate-50 min-h-screen p-6 md:p-8 text-slate-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-200">
                            <FaChartPie size={20} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                            Báo cáo thống kê tài chính
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium ml-12">
                        Biểu đồ, phân tích doanh thu học phí, các khoản chi phí và dòng tiền trung tâm
                    </p>
                </div>
                
                {/* Year Filter */}
                <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm focus-within:border-blue-500 transition-all shrink-0">
                    <FaCalendarAlt className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Xem năm:</span>
                    <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-sm"
                    >
                        {[2024, 2025, 2026, 2027, 2028].map(y => (
                            <option key={y} value={y.toString()}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-100/80 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-200/50">
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1.5">Tổng thu học phí</p>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrency(totalRevenue)}</h3>
                    </div>
                    <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600 flex-shrink-0 shadow-sm shadow-emerald-100/50">
                        <FaWallet size={22} />
                    </div>
                </div>

                {/* Total Expense */}
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-100/80 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-200/50">
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1.5">Tổng chi</p>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrency(totalExpense)}</h3>
                    </div>
                    <div className="p-3.5 bg-rose-50 rounded-xl text-rose-600 flex-shrink-0 shadow-sm shadow-rose-100/50">
                        <FaFileInvoiceDollar size={22} />
                    </div>
                </div>

                {/* Net Cashflow */}
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-100/80 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-200/50">
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1.5">Lợi nhuận ròng</p>
                        <h3 className={`text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis ${netProfit >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                            {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
                        </h3>
                    </div>
                    <div className={`p-3.5 rounded-xl flex-shrink-0 shadow-sm ${netProfit >= 0 ? 'bg-blue-50 text-blue-600 shadow-blue-100/50' : 'bg-rose-50 text-rose-600 shadow-rose-100/50'}`}>
                        {netProfit >= 0 ? <FaArrowUp size={22} /> : <FaArrowDown size={22} />}
                    </div>
                </div>

                {/* Pending Expense */}
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-100/80 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-200/50">
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1.5">Chi phí chờ duyệt</p>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrency(pendingExpense)}</h3>
                    </div>
                    <div className="p-3.5 bg-amber-50 rounded-xl text-amber-600 flex-shrink-0 shadow-sm shadow-amber-100/50">
                        <FaHourglassHalf size={22} />
                    </div>
                </div>
            </div>

            {/* Charts & Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* 1. Bar Chart Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight">So sánh Thu - Chi theo các tháng ({selectedYear})</h2>
                            <div className="flex gap-4 items-center text-xs font-bold">
                                <span className="flex items-center gap-1.5 text-slate-600">
                                    <span className="w-3.5 h-3.5 bg-emerald-500 rounded"></span> Doanh thu
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-600">
                                    <span className="w-3.5 h-3.5 bg-rose-500 rounded"></span> Chi tiêu
                                </span>
                            </div>
                        </div>

                        {/* Beautiful Custom SVG bar chart */}
                        <div className="relative h-72 w-full mt-4">
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold bg-white/70">
                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                                    <span>Đang nạp biểu đồ...</span>
                                </div>
                            ) : (
                                <svg className="w-full h-full" viewBox="0 0 700 240" preserveAspectRatio="none">
                                    {/* Grid Lines */}
                                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                                        const y = 20 + ratio * 180
                                        const labelVal = maxMonthlyVal * (1 - ratio)
                                        return (
                                            <g key={index}>
                                                <line 
                                                    x1="50" y1={y} x2="680" y2={y} 
                                                    stroke="#f1f5f9" strokeWidth="1" 
                                                    strokeDasharray="4 4" 
                                                />
                                                <text 
                                                    x="45" y={y + 4} 
                                                    textAnchor="end" 
                                                    className="fill-slate-400 font-bold" 
                                                    style={{ fontSize: '12px' }}
                                                >
                                                    {labelVal >= 1000000 ? `${(labelVal / 1000000).toFixed(1)}M` : formatCurrency(labelVal)}
                                                </text>
                                            </g>
                                        )
                                    })}

                                    {/* Bars */}
                                    {monthlyData.map((m, idx) => {
                                        const barWidth = 14
                                        const gap = 3
                                        const groupWidth = barWidth * 2 + gap
                                        const groupSpacing = 52
                                        const xStart = 65 + idx * groupSpacing

                                        const revHeight = (m.revenue / maxMonthlyVal) * 180
                                        const expHeight = (m.expense / maxMonthlyVal) * 180

                                        const revY = 200 - revHeight
                                        const expY = 200 - expHeight

                                        const isHovered = hoveredMonth === idx

                                        return (
                                            <g 
                                                key={idx}
                                                onMouseEnter={(e) => {
                                                    setHoveredMonth(idx)
                                                    const rect = e.currentTarget.getBoundingClientRect()
                                                    setTooltipPos({
                                                        x: rect.left + rect.width / 2,
                                                        y: rect.top - 60
                                                    })
                                                }}
                                                onMouseLeave={() => setHoveredMonth(null)}
                                                className="cursor-pointer group"
                                            >
                                                {/* Background Highlight on Hover */}
                                                <rect 
                                                    x={xStart - 8} y="15" 
                                                    width={groupWidth + 16} height="195" 
                                                    fill={isHovered ? '#f8fafc' : 'transparent'} 
                                                    rx="6" 
                                                    className="transition-all duration-200"
                                                />

                                                {/* Revenue Bar */}
                                                <rect 
                                                    x={xStart} y={revY} 
                                                    width={barWidth} height={Math.max(revHeight, 2)} 
                                                    fill="url(#revGrad)" 
                                                    rx="3"
                                                    className="transition-all duration-300"
                                                />

                                                {/* Expense Bar */}
                                                <rect 
                                                    x={xStart + barWidth + gap} y={expY} 
                                                    width={barWidth} height={Math.max(expHeight, 2)} 
                                                    fill="url(#expGrad)" 
                                                    rx="3"
                                                    className="transition-all duration-300"
                                                />

                                                {/* Month Label */}
                                                <text 
                                                    x={xStart + groupWidth / 2} y="222" 
                                                    textAnchor="middle" 
                                                    className={`font-bold transition-all ${isHovered ? 'fill-blue-600 scale-105' : 'fill-slate-400'}`}
                                                    style={{ fontSize: '12px' }}
                                                >
                                                    {`T${idx + 1}`}
                                                </text>
                                            </g>
                                        )
                                    })}

                                    {/* Gradients */}
                                    <defs>
                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" />
                                            <stop offset="100%" stopColor="#34d399" />
                                        </linearGradient>
                                        <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f43f5e" />
                                            <stop offset="100%" stopColor="#fb7185" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            )}

                            {/* Dynamic Custom Chart Tooltip */}
                            {!isLoading && hoveredMonth !== null && monthlyData[hoveredMonth] && (
                                <div 
                                    className="fixed bg-slate-900/95 text-white p-3 rounded-lg text-xs shadow-xl pointer-events-none z-50 border border-slate-800 -translate-x-1/2 flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150"
                                    style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
                                >
                                    <p className="font-bold text-center border-b border-slate-700/50 pb-1 mb-1 text-slate-300">
                                        {monthlyData[hoveredMonth].month}
                                    </p>
                                    <div className="flex justify-between gap-5">
                                        <span className="text-emerald-400 font-medium">Thu học phí:</span>
                                        <span className="font-bold">{formatCurrency(monthlyData[hoveredMonth].revenue)}</span>
                                    </div>
                                    <div className="flex justify-between gap-5">
                                        <span className="text-rose-400 font-medium">Tổng chi:</span>
                                        <span className="font-bold">{formatCurrency(monthlyData[hoveredMonth].expense)}</span>
                                    </div>
                                    <div className="flex justify-between gap-5 border-t border-slate-700/50 pt-1 mt-0.5">
                                        <span className="text-slate-300 font-medium">Lợi nhuận:</span>
                                        <span className={`font-bold ${monthlyData[hoveredMonth].net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {formatCurrency(monthlyData[hoveredMonth].net)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Category Pie Chart Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-2">Tổng quan chi phí trong năm</h2>
                        <p className="text-gray-600 text-sm font-[600] mb-6 tracking-wider">Tổng chi trong năm: <span className='font-[800] text-red-500'>{formatCurrency(totalCategoryExpense)}</span></p>

                        {totalCategoryExpense === 0 ? (
                            <div className="h-48 flex flex-col items-center justify-center text-slate-400 italic text-sm">
                                <FaInfoCircle className="mb-2 text-slate-300" size={24} />
                                <span>Chưa phát sinh phiếu chi đã duyệt</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {/* Beautiful Horizontal Segmented Bar */}
                                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                                    <div 
                                        style={{ width: `${(categoryStats.salary / totalCategoryExpense) * 100}%` }} 
                                        className="h-full bg-blue-500 transition-all duration-500"
                                        title={`Lương: ${((categoryStats.salary / totalCategoryExpense) * 100).toFixed(1)}%`}
                                    ></div>
                                    <div 
                                        style={{ width: `${(categoryStats.marketing / totalCategoryExpense) * 100}%` }} 
                                        className="h-full bg-purple-500 transition-all duration-500"
                                        title={`Marketing: ${((categoryStats.marketing / totalCategoryExpense) * 100).toFixed(1)}%`}
                                    ></div>
                                    <div 
                                        style={{ width: `${(categoryStats.other / totalCategoryExpense) * 100}%` }} 
                                        className="h-full bg-amber-500 transition-all duration-500"
                                        title={`Chi khác: ${((categoryStats.other / totalCategoryExpense) * 100).toFixed(1)}%`}
                                    ></div>
                                </div>

                                {/* Dynamic Legend List */}
                                <div className="flex flex-col gap-3.5">
                                    {/* Category 1 */}
                                    <div className="flex items-start justify-between text-sm">
                                        <div className="flex items-start gap-2.5">
                                            <span className="w-3.5 h-3.5 bg-blue-500 rounded mt-0.5 shrink-0"></span>
                                            <span className="font-bold text-slate-700 leading-tight">Chi lương nhân viên</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-red-600 block leading-tight">{formatCurrency(categoryStats.salary)}</span>
                                            <span className="text-xs font-bold text-gray-600 mt-0.5 block">{((categoryStats.salary / totalCategoryExpense) * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>

                                    {/* Category 2 */}
                                    <div className="flex items-start justify-between text-sm">
                                        <div className="flex items-start gap-2.5">
                                            <span className="w-3.5 h-3.5 bg-purple-500 rounded mt-0.5 shrink-0"></span>
                                            <span className="font-bold text-slate-700 leading-tight">Chi phí Marketing</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-red-600 block leading-tight">{formatCurrency(categoryStats.marketing)}</span>
                                            <span className="text-xs font-bold text-gray-600 mt-0.5 block">{((categoryStats.marketing / totalCategoryExpense) * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>

                                    {/* Category 3 */}
                                    <div className="flex items-start justify-between text-sm">
                                        <div className="flex items-start gap-2.5">
                                            <span className="w-3.5 h-3.5 bg-amber-500 rounded mt-0.5 shrink-0"></span>
                                            <span className="font-bold text-slate-700 leading-tight">Các chi phí khác</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-red-600 block leading-tight">{formatCurrency(categoryStats.other)}</span>
                                            <span className="text-xs font-bold text-gray-600 mt-0.5 block">{((categoryStats.other / totalCategoryExpense) * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Monthly Table & Recent Transactions */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* 1. Monthly Breakdown Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 xl:col-span-2">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-4">Chi tiết kết quả theo tháng</h2>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 text-slate-700 font-bold text-sm border-b border-slate-100">
                                    <th className="py-3.5 px-4 text-left whitespace-nowrap">Thời gian</th>
                                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Doanh thu thu học phí</th>
                                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Tổng chi</th>
                                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Lợi nhuận ròng</th>
                                    <th className="py-3.5 px-4 text-center whitespace-nowrap">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-slate-600 text-sm font-medium">
                                {monthlyData.map((row) => (
                                    <tr key={row.month} className="hover:bg-slate-50/40 transition-colors">
                                        <td className="py-3.5 px-4 text-left font-bold text-slate-700">{row.month}</td>
                                        <td className="py-3.5 px-4 text-right font-bold text-emerald-600">{formatCurrency(row.revenue)}</td>
                                        <td className="py-3.5 px-4 text-right font-bold text-rose-500">{formatCurrency(row.expense)}</td>
                                        <td className={`py-3.5 px-4 text-right font-bold ${row.net >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                                            {row.net >= 0 ? '+' : ''}{formatCurrency(row.net)}
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            {row.revenue === 0 && row.expense === 0 ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-[8px]">Chưa phát sinh</span>
                                            ) : row.net >= 0 ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-[8px]">Lãi</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-[8px]">Thâm hụt</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. Recent Transactions combined stream */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Nhật ký giao dịch gần đây</h2>
                            
                            {/* Interactive Transaction Limit Input */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold text-slate-500">Số lượng:</span>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="200"
                                    className="w-16 px-2 py-1 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-[6px] text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white text-center transition-all duration-150"
                                    value={limitInput}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        setLimitInput(val)
                                        const parsed = parseInt(val)
                                        if (!isNaN(parsed) && parsed > 0) {
                                            setTransactionLimit(parsed)
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!limitInput || isNaN(parseInt(limitInput)) || parseInt(limitInput) <= 0) {
                                            setLimitInput('10')
                                            setTransactionLimit(10)
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Transaction Tabs */}
                        <div className="flex bg-slate-100 p-0.5 rounded-lg mb-4 text-sm font-bold">
                            <button 
                                onClick={() => setActiveTab('ALL')}
                                className={`flex-1 py-2 text-center rounded-md cursor-pointer transition ${activeTab === 'ALL' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Tất cả
                            </button>
                            <button 
                                onClick={() => setActiveTab('REVENUE')}
                                className={`flex-1 py-2 text-center rounded-md cursor-pointer transition ${activeTab === 'REVENUE' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-emerald-600'}`}
                            >
                                Thu học phí
                            </button>
                            <button 
                                onClick={() => setActiveTab('EXPENSE')}
                                className={`flex-1 py-2 text-center rounded-md cursor-pointer transition ${activeTab === 'EXPENSE' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-rose-600'}`}
                            >
                                Chi tiêu
                            </button>
                        </div>

                        {/* Log Stream */}
                        {filteredTransactions.length === 0 ? (
                            <div className="h-72 flex flex-col items-center justify-center text-slate-400 italic text-sm">
                                <FaInfoCircle className="mb-2 text-slate-300" size={24} />
                                <span>Chưa ghi nhận giao dịch nào</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                                {filteredTransactions.map((tx) => (
                                    <div 
                                        key={tx.id} 
                                        className="p-4 bg-white hover:bg-slate-50/70 rounded-xl border border-slate-100 flex flex-col gap-3 transition-all duration-200 shadow-sm"
                                    >
                                        {/* Row 1: Status Tags, Date & Amount (Amount placed directly below the THU/CHI badge) */}
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 justify-between">
                                                {tx.type === 'REVENUE' ? (
                                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-[6px] font-bold uppercase tracking-wider text-xs border border-emerald-100">THU</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-[6px] font-bold uppercase tracking-wider text-xs border border-rose-100">CHI</span>
                                                )}
                                                <span className="text-sm font-bold text-slate-400">
                                                    {new Date(tx.date).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`font-bold text-lg ${tx.type === 'REVENUE' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                    {tx.type === 'REVENUE' ? '+' : '-'}{formatCurrency(tx.amount)}
                                                </span>
                                                {tx.type === 'EXPENSE' && (
                                                    <span className={`px-2 py-0.5 text-xs font-bold rounded-[6px] ${tx.status === 'Đã chi' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : tx.status === 'Chờ duyệt' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                                        {tx.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Row 2: Title - No truncate so it wraps naturally */}
                                        <p className="text-base font-bold text-slate-800 leading-snug">
                                            {tx.title}
                                        </p>

                                        {/* Row 3: Metadata Stack - Clean vertical stack to guarantee no squishing */}
                                        <div className="flex flex-col gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100/50 text-sm">
                                            <div className="text-slate-600">
                                                <span className="text-slate-500 font-semibold">{tx.type === 'REVENUE' ? 'Học viên: ' : 'Người nhận: '}</span>
                                                <span className="text-slate-800 font-bold">{tx.partner}</span>
                                            </div>
                                            <div className="text-slate-600 border-t border-slate-200/50 pt-1.5 mt-0.5">
                                                <span className="text-slate-500 font-semibold">Người lập: </span>
                                                <span className="text-slate-700 font-semibold">{tx.creator}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
