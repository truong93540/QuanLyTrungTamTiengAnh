'use client'

import { useState, useEffect, useMemo } from 'react'
import { IoIosCloseCircle, IoIosCloudUpload, IoIosInformationCircle } from 'react-icons/io'
import { FaExclamationTriangle, FaCheckCircle, FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'
import Alert from '@/components/Alert'
import { CA_DAY_CONFIG } from '@/constants/caDay'

const getDefaultMonth = () => {
    const today = new Date()
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const year = previousMonth.getFullYear()
    const month = String(previousMonth.getMonth() + 1).padStart(2, '0')
    return `${month}/${year}`
}

const convertToApiFormat = (displayFormat: string): string => {
    const match = displayFormat.match(/^(\d{1,2})\/(\d{4})$/)
    if (!match) return ''
    const [, month, year] = match
    return `T${String(month).padStart(2, '0')}-${year}`
}

export default function ChamCongPage() {
    const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth())
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [attendanceData, setAttendanceData] = useState<any[]>([])
    const [isPreview, setIsPreview] = useState(false)
    const [alertConfig, setAlertConfig] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)

    useEffect(() => {
        fetchAttendance()
    }, [selectedMonth])

    const fetchAttendance = async () => {
        const apiMonth = convertToApiFormat(selectedMonth)
        if (!apiMonth) return
        setLoading(true)
        try {
            const response = await fetch(`/api/tai-chinh/cham-cong?month=${apiMonth}`)
            const result = await response.json()
            if (response.ok) setAttendanceData(result.data || [])
        } catch (error) {
            console.error('Error fetching attendance:', error)
        }
        setLoading(false)
    }

    const daysInMonth = useMemo(() => {
        const [mm, yyyy] = selectedMonth.split('/').map(Number)
        return new Date(yyyy, mm, 0).getDate()
    }, [selectedMonth])

    const dayLabels = useMemo(() => {
        const [mm, yyyy] = selectedMonth.split('/').map(Number)
        return [...Array(daysInMonth)].map((_, i) => {
            const day = i + 1
            const date = new Date(yyyy, mm - 1, day)
            const dayOfWeek = date.getDay()
            const labels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
            return { day, thu: labels[dayOfWeek], jsDay: dayOfWeek }
        })
    }, [daysInMonth, selectedMonth])

    const groupedData = useMemo(() => {
        return attendanceData.map((phieu) => {
            const isGV = !!phieu.ma_giao_vien
            const id = isGV ? `GV-${phieu.ma_giao_vien}` : `NS-${phieu.ma_nhan_su}`
            const detailsMap: Record<number, any> = {}
            phieu.chi_tiet_cham_cong?.forEach((ct: any) => {
                // Ưu tiên dùng ct.day, nếu không có (dữ liệu từ DB) thì trích xuất trực tiếp từ chuỗi ISO
                const d = ct.day || (ct.ngay ? parseInt(String(ct.ngay).substring(8, 10)) : 0)
                if (d > 0) detailsMap[d] = ct
            })
            let totalGio = 0
            for (let i = 1; i <= 31; i++) {
                const val = phieu[`ngay_${i}`] || 0
                totalGio += isGV ? val : Math.min(val, 8)
            }

            // Giáo viên tính theo giờ, Nhân sự tính theo ngày
            const displayCong = isGV ? totalGio : Number((totalGio / 8).toFixed(2))
            const suffix = isGV ? ' giờ' : ' ngày'

            return { id, name: phieu.ho_ten || 'N/A', type: isGV ? 'Giáo viên' : 'Nhân sự', phieu, detailsMap, displayCong, suffix }
        }).sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name))
    }, [attendanceData])

    const getExpectedShifts = (phieu: any, dayOfWeek: number) => {
        const thuValue = dayOfWeek === 0 ? 8 : dayOfWeek + 1
        const schedules = phieu.giao_vien?.phan_cong_giang_day || phieu.phan_cong_giang_day || []
        const expected = new Set<number>()
        schedules.forEach((pc: any) => {
            const lich = typeof pc.lop_hoc?.lich_hoc === 'string' ? JSON.parse(pc.lop_hoc.lich_hoc) : (pc.lop_hoc?.lich_hoc || [])
            lich.forEach((item: any) => {
                if (Number(item.thu) === thuValue) expected.add(Number(item.ca))
            })
        })
        return expected
    }

    const handleMonthChange = (mm: string, yyyy: string) => setSelectedMonth(`${mm}/${yyyy}`)

    const handleImport = async () => {
        if (!selectedFile) return

        // Kiểm tra định dạng file
        if (!selectedFile.name.match(/\.(xlsx|xls)$/i)) {
            setAlertConfig({ type: 'error', message: 'Vui lòng chọn đúng định dạng file Excel (.xlsx hoặc .xls)' })
            return
        }

        const apiMonth = convertToApiFormat(selectedMonth)
        setLoading(true)
        setAttendanceData([]) // Xóa dữ liệu cũ ngay lập tức
        try {
            const formData = new FormData()
            formData.append('file', selectedFile)
            formData.append('month', apiMonth)
            formData.append('isPreview', 'true')

            const response = await fetch('/api/tai-chinh/cham-cong', {
                method: 'POST',
                body: formData
            })

            const result = await response.json()
            if (response.ok) {
                setAttendanceData(result.data || [])
                setIsPreview(true)
                setSelectedFile(null)
                setShowUploadModal(false)
                setAlertConfig({ type: 'success', message: 'Tải dữ liệu xem trước thành công' })
            } else {
                setAlertConfig({ type: 'error', message: result.error || 'Lỗi khi tải file' })
            }
        } catch (error) {
            console.error(error)
            setAlertConfig({ type: 'error', message: 'Lỗi kết nối máy chủ' })
        }
        setLoading(false)
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const apiMonth = convertToApiFormat(selectedMonth)
            const response = await fetch(`/api/tai-chinh/cham-cong/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ month: apiMonth, data: attendanceData })
            })
            const result = await response.json()
            if (response.ok) {
                setAlertConfig({ type: 'success', message: 'Đã duyệt và lưu bảng công chính thức!' })
                setIsPreview(false)
                fetchAttendance()
            } else {
                setAlertConfig({ type: 'error', message: 'Lỗi khi lưu: ' + (result.error || 'Không xác định') })
            }
        } catch (error) {
            console.error(error)
            setAlertConfig({ type: 'error', message: 'Lỗi kết nối máy chủ' })
        }
        setLoading(false)
    }

    return (
        <div className="text-gray-800 p-6 w-full max-w-[1600px] mx-auto">
            <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-1">Quản lý chấm công</h1>
                    <p className="text-sm text-slate-500">Đối soát tự động giữa Máy chấm công và Phân công giảng dạy.</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-amber-800 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100 w-fit shadow-sm">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-black text-[11px]">!</span>
                        <span className="text-[13px]">Lưu ý: Phải kiểm tra đúng theo mẫu trước khi nhập vào.</span>
                        <a
                            href="/templates/MauChamCong.xlsx"
                            download
                            className="ml-2 px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all text-xs tracking-wider shadow-md shadow-amber-100"
                        >
                            Xem file mẫu
                        </a>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowUploadModal(true)} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center gap-2 transition-all cursor-pointer">
                        <IoIosCloudUpload size={20} /> Nhập file
                    </button>
                </div>
            </div>


            <div className="mb-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 p-6 bg-slate-50/50">
                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 ml-2 uppercase tracking-wider">Tháng</span>
                        <input type="number" min="1" max="12" value={selectedMonth.split('/')[0]} onChange={(e) => handleMonthChange(e.target.value.padStart(2, '0'), selectedMonth.split('/')[1])} className="w-12 p-1 font-bold text-blue-600 outline-none" />
                        <span className="text-slate-300">/</span>
                        <input type="number" value={selectedMonth.split('/')[1]} onChange={(e) => handleMonthChange(selectedMonth.split('/')[0], e.target.value)} className="w-16 p-1 font-bold text-blue-600 outline-none" />
                    </div>
                </div>

                {groupedData.length === 0 ? (
                    <div className="p-20 text-center bg-white border-t border-slate-100">
                        <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-700">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
                                <IoIosCloudUpload size={40} className="text-slate-300" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-slate-400">Chưa có dữ liệu chấm công</p>
                                <p className="text-sm text-slate-400 italic">Tháng {selectedMonth} hiện đang trống, vui lòng nhập file để đối soát.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left text-sm border-collapse min-w-max">
                            <thead>
                                <tr className="bg-slate-100/50 text-sm text-slate-500 uppercase font-bold border-b border-slate-200">
                                    <th className="sticky left-0 z-20 bg-slate-50 p-2 border-r border-slate-200"></th>
                                    <th className="sticky left-[100px] z-20 bg-slate-50 p-2 border-r border-slate-200 text-center">Thứ</th>
                                    {dayLabels.map((item, idx) => (
                                        <th key={idx} className={`p-1 text-center border-r border-slate-100 ${item.thu === 'CN' ? 'text-red-500 bg-red-50' : ''}`}>{item.thu}</th>
                                    ))}
                                    <th colSpan={8} className="bg-slate-200/30 border-l-2 border-slate-200"></th>
                                </tr>
                                <tr className="bg-slate-50 text-slate-600 text-sm font-bold border-b border-slate-200">
                                    <th className="sticky left-0 z-20 bg-slate-50 p-4 border-r border-slate-200 min-w-[100px]">Mã NS</th>
                                    <th className="sticky left-[100px] z-20 bg-slate-50 p-4 border-r border-slate-200 min-w-[180px]">Họ tên</th>
                                    {dayLabels.map((item, idx) => (
                                        <th key={idx} className="p-2 text-center border-r border-slate-100 min-w-[40px]">{item.day}</th>
                                    ))}
                                    <th className="p-4 text-center border-l-2 border-slate-200 bg-blue-50 text-blue-700 min-w-[80px]">Công</th>
                                    <th className="p-4 text-center bg-orange-50 text-orange-700 border-l border-slate-200 min-w-[60px]">Số lần đi muộn</th>
                                    <th className="p-4 text-center bg-orange-50 text-orange-700 border-l border-slate-100 min-w-[60px]">Số lần về sớm</th>
                                    <th className="p-4 text-center bg-green-50 text-green-700 border-l border-slate-200 min-w-[80px]">Giờ ngày thường</th>
                                    <th className="p-4 text-center bg-green-50 text-green-700 border-l border-slate-100 min-w-[80px]">Tăng ca ngày thường</th>
                                    <th className="p-4 text-center bg-purple-50 text-purple-700 border-l border-slate-200 min-w-[80px]">Giờ Ngày nghỉ</th>
                                    <th className="p-4 text-center bg-purple-50 text-purple-700 border-l border-slate-100 min-w-[80px]">Tăng ca ngày nghỉ</th>
                                    <th className="p-4 text-center bg-blue-600 text-white border-l border-slate-200 min-w-[100px]">Tổng Giờ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {groupedData.map((row, rowIndex) => (
                                    <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 p-4 font-mono text-sm text-blue-600 border-r border-slate-200">{row.id}</td>
                                        <td className="sticky left-[100px] z-10 bg-white group-hover:bg-slate-50 p-4 font-bold border-r border-slate-200 truncate">
                                            {row.name}
                                        </td>
                                        {dayLabels.map((labelObj, idx) => {
                                            const day = idx + 1
                                            const soCong = row.phieu[`ngay_${day}`]
                                            const dayData = row.detailsMap[day]
                                            const expectedShifts = row.type === 'Giáo viên' ? getExpectedShifts(row.phieu, labelObj.jsDay) : new Set<number>()

                                            return (
                                                <td key={idx} className="p-2 text-center border-r border-slate-100 relative group/cell">
                                                    {soCong ? (
                                                        <span className="font-bold text-slate-700">
                                                            {soCong}h
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300">0</span>
                                                    )}
                                                    {/* tooltip */}
                                                    {((dayData) || (expectedShifts.size > 0)) && (
                                                        <div className={`invisible group-hover/cell:visible absolute ${rowIndex < 4 ? 'top-full mt-2' : 'bottom-full mb-2'} left-1/2 -translate-x-1/2 z-30 w-80 rounded-lg bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 animate-in fade-in zoom-in duration-200`}>
                                                            <div className="p-4 max-h-[250px] overflow-y-auto custom-scrollbar overflow-x-hidden">
                                                                <div className="font-black border-b border-slate-100 pb-2 mb-3 text-blue-600 flex justify-between uppercase text-xs tracking-wider">
                                                                    <span>{labelObj.thu}, {day}/{selectedMonth}</span>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {row.type === 'Giáo viên' ? (
                                                                        (() => {
                                                                            const ivs = []
                                                                            const seen = new Set()
                                                                            for (let c = 1; c <= 6; c++) {
                                                                                const v = dayData?.[`gio_vao_${c}`]
                                                                                const r = dayData?.[`gio_ra_${c}`]
                                                                                if ((v || r) && !seen.has(`${v}-${r}`)) {
                                                                                    ivs.push({ v, r })
                                                                                    seen.add(`${v}-${r}`)
                                                                                }
                                                                            }

                                                                            if (expectedShifts.size > 0) {
                                                                                return CA_DAY_CONFIG.map(config => {
                                                                                    const ca = config.ca
                                                                                    const isExpected = expectedShifts.has(ca)
                                                                                    if (!isExpected) return null
                                                                                    const vao = dayData?.[`gio_vao_${ca}`]
                                                                                    const ra = dayData?.[`gio_ra_${ca}`]
                                                                                    return (
                                                                                        <div key={ca} className="p-3 rounded-lg bg-slate-50 border border-slate-100 mb-2 last:mb-0">
                                                                                            <div className="flex justify-between mb-2">
                                                                                                <span className="font-[600] text-slate-800 underline decoration-blue-200 decoration-2 underline-offset-4">Ca {ca}</span>
                                                                                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold text-[10px]">LỊCH DẠY</span>
                                                                                            </div>
                                                                                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                                                                                <span className="font-medium">Giờ quy định:</span>
                                                                                                <span className="font-bold text-slate-900">{config.vao} - {config.ra}</span>
                                                                                            </div>
                                                                                            <div className="flex justify-between text-xs">
                                                                                                <span className="font-medium text-slate-500">Giờ chấm công:</span>
                                                                                                <span className={(!vao || !ra) ? 'text-red-600 font-black' : (vao > config.vao || ra < config.ra) ? 'text-orange-600 font-black' : 'text-green-700 font-black'}>
                                                                                                    {vao || '__:__'} - {ra || '__:__'}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            } else {
                                                                                if (ivs.length === 0) return <p className="text-center py-4 text-slate-400 italic">Không có dữ liệu quét thẻ</p>
                                                                                return (
                                                                                    <div className="space-y-2">
                                                                                        <p className="text-[10px] font-bold text-orange-600 uppercase mb-2">Quét thẻ tự do (Không lịch)</p>
                                                                                        {ivs.map((inv, i) => (
                                                                                            <div key={i} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
                                                                                                <span className="text-slate-400 font-bold">Lần chấm công {i + 1}:</span>
                                                                                                <span className={`font-black ${(!inv.v || !inv.r) ? 'text-red-600' : 'text-slate-700'}`}>
                                                                                                    {inv.v || '__:__'} - {inv.r || '__:__'}
                                                                                                </span>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        })()
                                                                    ) : (
                                                                        (() => {
                                                                            const ivs = []
                                                                            const seen = new Set()
                                                                            for (let c = 1; c <= 6; c++) {
                                                                                const v = dayData?.[`gio_vao_${c}`]
                                                                                const r = dayData?.[`gio_ra_${c}`]
                                                                                if ((v || r) && !seen.has(`${v}-${r}`)) {
                                                                                    ivs.push({ v, r })
                                                                                    seen.add(`${v}-${r}`)
                                                                                }
                                                                            }
                                                                            return ivs.map((inv, i) => {
                                                                                const isLate = i === 0 && inv.v && inv.v > "08:00"
                                                                                const isEarly = i === ivs.length - 1 && inv.r && inv.r < "17:30"
                                                                                const isMissing = !inv.v || !inv.r
                                                                                const isWarning = isMissing || isLate || isEarly

                                                                                return (
                                                                                    <div key={i} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
                                                                                        <span className="text-slate-400 font-[500]">Lượt chấm công {i + 1}:</span>
                                                                                        <span className={`font-bold ${isWarning ? 'text-red-600' : 'text-slate-700'}`}>
                                                                                            {inv.v || '__:__'} - {inv.r || '__:__'}
                                                                                        </span>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        })()
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className={`absolute left-1/2 -translate-x-1/2 border-8 border-transparent ${rowIndex < 4 ? 'bottom-full border-b-white' : 'top-full border-t-white'}`}></div>
                                                        </div>
                                                    )}
                                                </td>
                                            )
                                        })}
                                        <td className="p-4 text-center font-bold text-blue-700 border-l-2 border-slate-200 bg-blue-50/30 whitespace-nowrap">{row.displayCong}{row.suffix}</td>
                                        <td className="p-4 text-center border-l border-slate-200">{row.phieu.so_lan_di_muon || 0} lần</td>
                                        <td className="p-4 text-center border-l border-slate-200">{row.phieu.so_lan_ve_som || 0} lần</td>
                                        <td className="p-4 text-center border-l border-slate-200">{row.phieu.so_gio_lam_viec_thuong || 0}h</td>
                                        <td className="p-4 text-center border-l border-slate-200">{row.phieu.so_gio_tang_ca_ngay_thuong || 0}h</td>
                                        <td className="p-4 text-center border-l border-slate-200">{row.phieu.so_gio_lam_viec_thuong_ngay_nghi || 0}h</td>
                                        <td className="p-4 text-center border-l border-slate-200">{row.phieu.so_gio_tang_ca_ngay_nghi || 0}h</td>
                                        <td className="p-4 text-center font-bold border-l border-slate-200 bg-blue-600 text-white">{row.phieu.tong_so_gio_lam_viec || 0}h</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {groupedData.length > 0 && !isPreview && (
                <div className="flex justify-end animate-in fade-in slide-in-from-right duration-700">
                    <Link
                        href="/dashboard/tai-chinh/thuong"
                        className="group flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <span>Tính thưởng</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            )}

            {isPreview && (
                <div className="mb-8 p-6 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between shadow-xl shadow-orange-100/50 animate-in slide-in-from-bottom duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg rotate-3">
                            <FaExclamationTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-lg font-black text-orange-800 tracking-tight">Xác nhận dữ liệu chấm công</p>
                            <p className="text-sm text-orange-600 font-medium">Vui lòng kiểm tra kỹ các chỉ số trước khi nhấn Duyệt & Lưu chính thức.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => { setIsPreview(false); fetchAttendance(); }} className="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Hủy bỏ</button>
                        <button onClick={handleSave} className="px-10 py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-black rounded-lg shadow-xl shadow-orange-200 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                            <FaCheckCircle size={20} /> Xác nhận
                        </button>
                    </div>
                </div>
            )}


            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                        Quy định giờ hành chính
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Ca Sáng</p>
                            <p className="text-lg font-black text-slate-700">08:00 - 12:00</p>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Ca Chiều</p>
                            <p className="text-lg font-black text-slate-700">13:30 - 17:30</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 italic flex items-center gap-2">
                        <IoIosInformationCircle className="text-blue-500" size={16} />
                        Đi muộn/Về sớm vượt quá 5 phút sẽ bị ghi nhận vi phạm.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                        Công thức tính giờ làm việc
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0 font-bold text-green-600 text-xs">GV</div>
                            <div>
                                <p className="text-xs font-bold text-slate-700">Giáo viên & Trợ giảng</p>
                                <p className="text-xs text-slate-500">Tính cố định 2h cho mỗi ca dạy có quét vân tay khớp lịch.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 font-bold text-orange-600 text-xs">NS</div>
                            <div>
                                <p className="text-xs font-bold text-slate-700">Nhân sự văn phòng</p>
                                <p className="text-xs text-slate-500">Tính theo tổng thời gian (Vào - Ra) thực tế từ máy chấm công.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showUploadModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">Import Dữ Liệu</h2>
                            <button onClick={() => setShowUploadModal(false)} className="text-slate-300 hover:text-red-500"><IoIosCloseCircle size={32} /></button>
                        </div>
                        <div className="mb-6 p-10 border-2 border-dashed border-slate-200 rounded-lg text-center bg-slate-50 cursor-pointer" onClick={() => document.getElementById('file-up')?.click()}>
                            <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="hidden" id="file-up" />
                            <IoIosCloudUpload size={48} className="mx-auto text-blue-500 mb-2" />
                            <p className="text-sm font-bold text-slate-700">{selectedFile ? selectedFile.name : 'Chọn file Excel'}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowUploadModal(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Hủy</button>
                            <button onClick={handleImport} disabled={!selectedFile || loading} className="flex-1 py-3 text-sm font-bold bg-blue-600 text-white rounded-lg shadow-lg disabled:bg-slate-300">
                                {loading ? 'Đang xử lý...' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {alertConfig && (
                <Alert
                    type={alertConfig.type}
                    message={alertConfig.message}
                    onClose={() => setAlertConfig(null)}
                />
            )}
        </div>
    )
}
