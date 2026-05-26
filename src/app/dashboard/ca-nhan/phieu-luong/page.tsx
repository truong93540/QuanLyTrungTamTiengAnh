'use client'

import { useState, useEffect } from 'react'
import {
    FaLock,
    FaUnlock,
    FaCalendarAlt,
    FaPrint,
    FaEye,
    FaEyeSlash,
    FaUserCircle,
    FaBuilding,
    FaBriefcase,
    FaArrowRight,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaCoins,
    FaUserCheck,
    FaFilePdf,
} from 'react-icons/fa'
import { IoIosInformationCircle } from 'react-icons/io'
import Alert from '@/components/Alert'

const formatCurrency = (value: any) => {
    if (value === undefined || value === null) return '0đ'
    const num = typeof value === 'string' ? parseFloat(value) : Number(value)
    if (isNaN(num)) return '0đ'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
}

const getWorkingDaysInMonth = (m: number, y: number) => {
    const daysInMonth = new Date(y, m, 0).getDate();
    let workingDays = 0;
    for (let i = 1; i <= daysInMonth; i++) {
        const dayOfWeek = new Date(y, m - 1, i).getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) workingDays++; // Bỏ Thứ 7 và Chủ Nhật
    }
    return workingDays;
}

export default function CaNhanPhieuLuongPage() {
    const today = new Date()
    const defaultDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)

    const [month, setMonth] = useState(defaultDate.getMonth() + 1)
    const [year, setYear] = useState(defaultDate.getFullYear())
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [verified, setVerified] = useState(false)
    const [loading, setLoading] = useState(false)
    const [payslipData, setPayslipData] = useState<any>(null)
    const [alertConfig, setAlertConfig] = useState<{
        type: 'success' | 'error'
        message: string
    } | null>(null)

    // Reset verification when changing month or year to re-secure the page
    useEffect(() => {
        setVerified(false)
        setPayslipData(null)
        setPassword('')
    }, [month, year])

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!password) {
            setAlertConfig({ type: 'error', message: 'Vui lòng nhập mật khẩu tài khoản!' })
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/ca-nhan/phieu-luong', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, month, year }),
            })

            const result = await response.json()
            if (response.ok) {
                setPayslipData(result.data)
                setVerified(true)
                setAlertConfig({ type: 'success', message: 'Xác minh thành công!' })
            } else {
                setAlertConfig({
                    type: 'error',
                    message: result.message || 'Mật khẩu không chính xác.',
                })
            }
        } catch (error) {
            console.error('Error verifying payslip:', error)
            setAlertConfig({ type: 'error', message: 'Lỗi kết nối máy chủ.' })
        }
        setLoading(false)
    }

    const handlePrint = () => {
        window.print()
    }

    const employeeInfo = payslipData?.nhan_su || payslipData?.giao_vien
    const isTeacher = !!payslipData?.ma_giao_vien

    const phuCapList =
        typeof payslipData?.chi_tiet_phu_cap === 'string'
            ? JSON.parse(payslipData.chi_tiet_phu_cap)
            : payslipData?.chi_tiet_phu_cap || []

    // Exclude 'Chuyên cần' from phụ cấp display because it's counted as a bonus
    const phuCapListFiltered = Array.isArray(phuCapList)
        ? phuCapList.filter((pc: any) => String(pc.ten).trim() !== 'Chuyên cần')
        : []

    const totalPhuCap = Array.isArray(phuCapListFiltered)
        ? phuCapListFiltered.reduce((acc: number, curr: any) => acc + (Number(curr.soTien) || 0), 0)
        : 0

    const luongCoBan = Number(payslipData?.luong_co_ban || 0)
    const so_gio_lam_viec_thuong = payslipData?.phieu_cham_cong?.so_gio_lam_viec_thuong || 0
    const so_gio_tang_ca_ngay_thuong = payslipData?.phieu_cham_cong?.so_gio_tang_ca_ngay_thuong || 0
    const so_gio_lam_viec_thuong_ngay_nghi =
        payslipData?.phieu_cham_cong?.so_gio_lam_viec_thuong_ngay_nghi || 0
    const so_gio_tang_ca_ngay_nghi = payslipData?.phieu_cham_cong?.so_gio_tang_ca_ngay_nghi || 0

    const standardDays = getWorkingDaysInMonth(month, year)
    const hourlyRate = isTeacher ? luongCoBan : luongCoBan / standardDays / 8

    const luongNgayThuong = Math.round(so_gio_lam_viec_thuong * hourlyRate * 1.0)
    const luongOtNgayThuong = Math.round(so_gio_tang_ca_ngay_thuong * hourlyRate * 1.5)
    const luongNgayNghi = Math.round(so_gio_lam_viec_thuong_ngay_nghi * hourlyRate * 2.0)
    const luongOtNgayNghi = Math.round(so_gio_tang_ca_ngay_nghi * hourlyRate * 2.0)
    const tongLuongTheoCong = luongNgayThuong + luongOtNgayThuong + luongNgayNghi + luongOtNgayNghi

    // Thưởng chi tiết
    const dsThuong = payslipData?.danh_sach_thuong || []
    const hoaHong =
        dsThuong
            .filter((t: any) => t.loai_thuong === 'Tiền hoa hồng')
            .reduce((acc: number, t: any) => acc + Number(t.so_tien), 0) ||
        Number(payslipData?.tien_hoa_hong || 0)
    const thuongChuyenCan = dsThuong
        .filter((t: any) => t.loai_thuong === 'Chuyên cần')
        .reduce((acc: number, t: any) => acc + Number(t.so_tien), 0)

    // Lọc ra các khoản thưởng phát sinh chi tiết (bao gồm Thưởng nóng và các loại thưởng tự định nghĩa khác)
    const dsThuongKhac = dsThuong.filter(
        (t: any) => t.loai_thuong !== 'Tiền hoa hồng' && t.loai_thuong !== 'Chuyên cần',
    )
    const tongThuongKhac = dsThuongKhac.reduce((acc: number, t: any) => acc + Number(t.so_tien), 0)

    // Chênh lệch tổng thưởng thực tế nếu có
    const thuongChuyenLech = Math.max(
        0,
        Number(payslipData?.tong_thuong || 0) - hoaHong - thuongChuyenCan - tongThuongKhac,
    )
    const otherBonusNote = String(
        payslipData?.ghi_chu || payslipData?.bang_luong?.ghi_chu || '',
    ).trim()
    const otherBonusTotal = tongThuongKhac + thuongChuyenLech
    const hasDetailedOtherBonuses = dsThuongKhac.length > 0

    // Giảm trừ chi tiết
    const baoHiemXaHoi = Number(payslipData?.bao_hiem_xa_hoi || 0)
    const soLanDiMuon = payslipData?.phieu_cham_cong?.so_lan_di_muon || 0
    const soLanVeSom = payslipData?.phieu_cham_cong?.so_lan_ve_som || 0
    const phatChuyenCan = payslipData?.tien_phat !== undefined && payslipData?.tien_phat !== null
        ? Number(payslipData.tien_phat)
        : (soLanDiMuon + soLanVeSom) * 50000
    const singlePhatRate = (soLanDiMuon + soLanVeSom) > 0
        ? Math.round(phatChuyenCan / (soLanDiMuon + soLanVeSom))
        : 50000
    const actualBhxhPercent = luongCoBan > 0 && baoHiemXaHoi > 0
        ? Math.round((baoHiemXaHoi / luongCoBan) * 1000) / 10
        : 10.5

    // Calendar grid generation
    const daysInMonth = new Date(year, month, 0).getDate()
    const dayLabels = [...Array(daysInMonth)].map((_, i) => {
        const day = i + 1
        const date = new Date(year, month - 1, day)
        const dayOfWeek = date.getDay()
        const labels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
        return { day, thu: labels[dayOfWeek] }
    })

    return (
        <div className="text-gray-800 p-6 w-full max-w-[1200px] mx-auto min-h-[90vh] flex flex-col justify-start">
            {/* Header controls (Screen only) */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border border-slate-100 shadow-sm print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                        <FaCoins className="text-blue-600" /> Tra cứu phiếu lương
                    </h1>
                    <p className="text-sm text-slate-500">
                        Xem và tải phiếu lương chính thức của bạn hàng tháng.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm w-full sm:w-auto justify-between">
                        <FaCalendarAlt className="text-blue-500 ml-2" />
                        <select
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="bg-transparent font-bold text-slate-700 outline-none p-1 text-sm">
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    Tháng {i + 1}
                                </option>
                            ))}
                        </select>
                        <span className="text-slate-300">/</span>
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="bg-transparent font-bold text-slate-700 outline-none p-1 text-sm">
                            {Array.from({ length: 5 }, (_, i) => (
                                <option key={i} value={new Date().getFullYear() - 2 + i}>
                                    {new Date().getFullYear() - 2 + i}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Lock Screen (Password verification) */}
            {!verified && (
                <div className="flex-1 flex items-center justify-center p-4 print:hidden">
                    <div className="w-full max-w-md rounded-2xl bg-white border border-slate-150 p-8 shadow-xl text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100 shadow-inner mb-6 relative group">
                            <FaLock
                                size={32}
                                className="group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-ping opacity-75"></div>
                        </div>

                        <h2 className="text-xl font-extrabold text-slate-800 mb-2">
                            Xác minh danh tính
                        </h2>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            Vì lý do bảo mật thông tin nhạy cảm, vui lòng nhập mật khẩu tài khoản
                            của bạn để xem phiếu lương tháng {month}/{year}.
                        </p>

                        <form onSubmit={handleVerify} className="w-full space-y-4">
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mật khẩu của bạn"
                                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-150 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:shadow-none">
                                {loading ? (
                                    'Đang xác minh...'
                                ) : (
                                    <>
                                        <FaUserCheck size={18} /> Xác nhận danh tính
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Payslip View */}
            {verified && payslipData && (
                <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                    {/* Main Payslip Document Card */}
                    <div
                        id="print-section"
                        className="bg-white border border-slate-200 rounded-lg shadow-xl p-8 sm:p-12 relative overflow-hidden print:border-none print:shadow-none print:p-0">
                        {/* Elegant background glassmorphic decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 print:hidden"></div>

                        {/* 1. Header Payslip */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-8 mb-8 gap-4">
                            <div>
                                <h2 className="text-xl font-black text-blue-600 tracking-wider uppercase mb-1">
                                    HP ENGLISH HOMESTAY
                                </h2>
                                <p className="text-xs text-gray-500 font-bold leading-normal uppercase">
                                    Hệ thống Đào tạo & Quản lý Chuyên nghiệp
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Website: hpenglish.edu.vn | Hotline: 1900 xxxx
                                </p>
                            </div>
                            <div className="text-left md:text-right">
                                <h3 className="text-2xl font-bold text-slate-800 uppercase">
                                    PHIẾU THANH TOÁN LƯƠNG
                                </h3>
                                <p className="text-sm text-slate-500 font-semibold mt-1">
                                    Kỳ lương: Tháng {month}/{year}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 italic">
                                    Ngày lập: {new Date().toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>

                        {/* 2. Employee Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-lg border border-slate-100 mb-8 print:bg-slate-50/50">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
                                    <FaBriefcase /> Thông tin nhân sự
                                </div>
                                <p className="text-lg font-[700] text-slate-800">
                                    {employeeInfo?.ho_ten || 'N/A'}
                                </p>
                                <p className="text-sm font-semibold text-slate-500">
                                    Mã số:{' '}
                                    <span className="font-mono text-blue-600">
                                        {isTeacher
                                            ? `GV-${payslipData.ma_giao_vien}`
                                            : `NS-${payslipData.ma_nhan_su}`}
                                    </span>
                                </p>
                                <p className="text-sm text-slate-500 font-medium">
                                    Chức vụ: {employeeInfo?.chuc_vu?.ten_chuc_vu || 'Nhân sự'}
                                </p>
                                <p className="text-sm text-slate-500 font-medium">
                                    Bộ phận: {employeeInfo?.phong_ban?.ten_phong_ban || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-2 md:text-right flex flex-col justify-end">
                                <div className="flex items-center md:justify-end gap-2 text-sm text-slate-600 font-bold uppercase tracking-wider">
                                    <FaClock /> Đối soát chuyên cần
                                </div>
                                <p className="text-sm text-slate-700 font-bold">
                                    {isTeacher ? (
                                        <>
                                            Tổng số giờ dạy:{' '}
                                            <span className="text-blue-600 font-[700]">
                                                {payslipData.phieu_cham_cong
                                                    ?.tong_so_gio_lam_viec || 0}{' '}
                                                giờ
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Số ngày công đạt:{' '}
                                            <span className="text-blue-600 font-[700]">
                                                {(
                                                    Number(
                                                        payslipData.phieu_cham_cong
                                                            ?.tong_so_gio_lam_viec || 0,
                                                    ) / 8
                                                ).toFixed(1)}{' '}
                                                ngày
                                            </span>
                                        </>
                                    )}
                                </p>
                                {payslipData.ngay_le_so_tien > 0 && (
                                    <p className="text-xs text-slate-600 mt-1">
                                        Số ngày nghỉ lễ:{' '}
                                        <span className="text-blue-650 font-bold">
                                            {payslipData.ngay_le_so_tien} ngày
                                        </span>{' '}
                                        ({payslipData.ngay_le_noi_dung})
                                    </p>
                                )}
                                <p className="text-xs text-slate-600">
                                    Số lần đi muộn:{' '}
                                    <span className="text-orange-600 font-bold">
                                        {payslipData.phieu_cham_cong?.so_lan_di_muon || 0} lần
                                    </span>
                                </p>
                                <p className="text-xs text-slate-600">
                                    Số lần về sớm:{' '}
                                    <span className="text-orange-600 font-bold">
                                        {payslipData.phieu_cham_cong?.so_lan_ve_som || 0} lần
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* 3. Salary Breakdown Table */}
                        <div className="space-y-6">
                            <h4 className="text-base font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
                                Chi tiết Thu nhập & Giảm trừ
                            </h4>

                            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                                            <th className="p-4 uppercase">Chi tiết lương</th>
                                            <th className="p-4 text-right uppercase">Số tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-150">
                                        {/* 1. LƯƠNG */}
                                        <tr className="bg-slate-50/50">
                                            <td className="p-4" colSpan={2}>
                                                <span className="font-bold text-slate-800 uppercase text-sm">
                                                    1. Lương theo công làm việc
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 pl-8">
                                                <span className="font-semibold text-slate-700">
                                                    Lương cơ bản
                                                </span>
                                                <span className="block text-xs text-slate-600 mt-0.5">
                                                    {isTeacher
                                                        ? 'Đơn giá/giờ (Giáo viên)'
                                                        : 'Lương theo hợp đồng'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-bold text-slate-700">
                                                {formatCurrency(luongCoBan)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 pl-8">
                                                <span className="font-semibold text-slate-700">
                                                    Lương ngày thường
                                                </span>
                                                <span className="block text-xs text-slate-600 mt-0.5">
                                                    Số giờ làm việc: {so_gio_lam_viec_thuong} giờ{' '}
                                                    {isTeacher ? '' : `(Công chuẩn: ${getWorkingDaysInMonth(month, year)} ngày)`}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-bold text-emerald-700">
                                                +{formatCurrency(luongNgayThuong)}
                                            </td>
                                        </tr>
                                        {so_gio_tang_ca_ngay_thuong > 0 && (
                                            <tr>
                                                <td className="p-4 pl-8">
                                                    <span className="font-semibold text-slate-700">
                                                        Lương tăng ca ngày thường
                                                    </span>
                                                    <span className="block text-xs text-slate-600 mt-0.5">
                                                        Số giờ làm việc:{' '}
                                                        {so_gio_tang_ca_ngay_thuong} giờ (Hệ số 1.5)
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-bold text-emerald-700">
                                                    +{formatCurrency(luongOtNgayThuong)}
                                                </td>
                                            </tr>
                                        )}
                                        {so_gio_lam_viec_thuong_ngay_nghi > 0 && (
                                            <tr>
                                                <td className="p-4 pl-8">
                                                    <span className="font-semibold text-slate-700">
                                                        Lương ngày nghỉ (Chủ nhật)
                                                    </span>
                                                    <span className="block text-xs text-slate-600 mt-0.5">
                                                        Số giờ làm việc:{' '}
                                                        {so_gio_lam_viec_thuong_ngay_nghi} giờ (Hệ
                                                        số 2.0)
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-bold text-emerald-700">
                                                    +{formatCurrency(luongNgayNghi)}
                                                </td>
                                            </tr>
                                        )}
                                        {so_gio_tang_ca_ngay_nghi > 0 && (
                                            <tr>
                                                <td className="p-4 pl-8">
                                                    <span className="font-semibold text-slate-700">
                                                        Lương tăng ca ngày nghỉ (Chủ nhật)
                                                    </span>
                                                    <span className="block text-xs text-slate-600 mt-0.5">
                                                        Số giờ làm việc: {so_gio_tang_ca_ngay_nghi}{' '}
                                                        giờ (Hệ số 2.0)
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-bold text-emerald-700">
                                                    +{formatCurrency(luongOtNgayNghi)}
                                                </td>
                                            </tr>
                                        )}

                                        {/* 2. THƯỞNG */}
                                        {(hoaHong > 0 ||
                                            thuongChuyenCan > 0 ||
                                            dsThuongKhac.length > 0 ||
                                            thuongChuyenLech > 0) && (
                                                <>
                                                    <tr className="bg-slate-50/50">
                                                        <td className="p-4" colSpan={2}>
                                                            <span className="font-bold text-slate-800 uppercase text-sm">
                                                                2. Thưởng & Hoa hồng
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    {hoaHong > 0 && (
                                                        <tr>
                                                            <td className="p-4 pl-8">
                                                                <span className="font-semibold text-slate-700">
                                                                    Hoa hồng doanh số tuyển sinh
                                                                </span>
                                                                <span className="block text-xs text-slate-600 mt-0.5">
                                                                    Trích theo tỷ lệ % doanh số đăng ký
                                                                    mới
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right font-bold text-emerald-700">
                                                                +{formatCurrency(hoaHong)}
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {thuongChuyenCan > 0 && (
                                                        <tr>
                                                            <td className="p-4 pl-8">
                                                                <span className="font-semibold text-slate-700">
                                                                    Thưởng chuyên cần
                                                                </span>
                                                                <span className="block text-xs text-slate-600 mt-0.5">
                                                                    Thưởng đạt chuẩn chuyên cần của
                                                                    tháng
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right font-bold text-emerald-700">
                                                                +{formatCurrency(thuongChuyenCan)}
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {dsThuongKhac.map((t: any, idx: number) => (
                                                        <tr key={`other-bonus-${idx}`}>
                                                            <td className="p-4 pl-8">
                                                                <span className="font-semibold text-slate-700">
                                                                    {t.noi_dung ||
                                                                        t.loai_thuong ||
                                                                        'Thưởng khác'}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right font-bold text-emerald-700">
                                                                +{formatCurrency(Number(t.so_tien))}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {thuongChuyenLech > 0 && (
                                                        <tr>
                                                            <td className="p-4 pl-8">
                                                                <span className="font-semibold text-slate-700">
                                                                    {otherBonusNote || 'Thưởng khác'}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right font-bold text-emerald-700">
                                                                +{formatCurrency(thuongChuyenLech)}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            )}

                                        {/* 3. PHỤ CẤP */}
                                        {totalPhuCap > 0 && (
                                            <>
                                                <tr className="bg-slate-50/50">
                                                    <td className="p-4" colSpan={2}>
                                                        <span className="font-bold text-slate-800 uppercase text-sm">
                                                            3. Các khoản phụ cấp lao động
                                                        </span>
                                                    </td>
                                                </tr>
                                                {phuCapListFiltered.map((pc: any, idx: number) => (
                                                    <tr key={idx}>
                                                        <td className="p-4 pl-8">
                                                            <span className="font-semibold text-slate-700">
                                                                {pc.ten}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right font-bold text-emerald-700">
                                                            +{formatCurrency(pc.soTien)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        )}

                                        {/* 4. GIẢM TRỪ */}
                                        {(baoHiemXaHoi > 0 || phatChuyenCan > 0) && (
                                            <>
                                                <tr className="bg-slate-50/50">
                                                    <td className="p-4" colSpan={2}>
                                                        <span className="font-bold text-slate-800 uppercase text-sm">
                                                            4. Các khoản giảm trừ
                                                        </span>
                                                    </td>
                                                </tr>
                                                {baoHiemXaHoi > 0 && (
                                                    <tr>
                                                        <td className="p-4 pl-8">
                                                            <span className="font-semibold text-slate-700">
                                                                Khấu trừ Bảo hiểm xã hội (BHXH)
                                                            </span>
                                                            <span className="block text-xs text-slate-600 mt-0.5">
                                                                Trích đóng theo quy định ({actualBhxhPercent}% lương HĐ)
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right font-bold text-rose-600">
                                                            -{formatCurrency(baoHiemXaHoi)}
                                                        </td>
                                                    </tr>
                                                )}
                                                {phatChuyenCan > 0 && (
                                                    <tr>
                                                        <td className="p-4 pl-8">
                                                            <span className="font-semibold text-slate-700">
                                                                Khấu trừ chuyên cần (Đi muộn / Về
                                                                sớm)
                                                            </span>
                                                            <span className="block text-xs text-slate-600 mt-0.5">
                                                                Đi muộn {soLanDiMuon} lần, về sớm{' '}
                                                                {soLanVeSom} lần ({formatCurrency(singlePhatRate)}/lần)
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right font-bold text-rose-600">
                                                            -{formatCurrency(phatChuyenCan)}
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 4. Net Pay Summary */}
                        <div className="mt-8 flex justify-end">
                            <div className="w-full sm:w-96 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg shadow-blue-150 flex flex-col justify-between items-end">
                                <span className="text-xs uppercase font-bold text-blue-50 tracking-widest mb-1">
                                    THỰC LĨNH CUỐI CÙNG
                                </span>
                                <h3 className="text-3xl font-black">
                                    {formatCurrency(payslipData.thuc_linh)}
                                </h3>
                                <p className="text-[12px] italic mt-2 text-right">
                                    Lưu ý: Số tiền thực nhận sẽ được chuyển khoản trực tiếp qua ngân
                                    hàng liên kết.
                                </p>
                            </div>
                        </div>

                        {/* 5. Attendance Grid Detail (Self-verification) */}
                        {payslipData.phieu_cham_cong && (
                            <div className="mt-12 space-y-4 print:hidden">
                                <h4 className="text-base font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
                                    Bảng đối soát công hằng ngày
                                </h4>
                                <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg bg-slate-50/50 p-4">
                                    <table className="text-center text-xs font-semibold border-collapse">
                                        <thead>
                                            <tr className="text-slate-400 font-bold uppercase border-b border-slate-200">
                                                <th className="p-2 border-r border-slate-200">
                                                    Thứ
                                                </th>
                                                {dayLabels.map((item, idx) => (
                                                    <th
                                                        key={idx}
                                                        className={`p-2 border-r border-slate-100 min-w-[32px] ${item.thu === 'CN' ? 'text-red-500' : ''}`}>
                                                        {item.thu}
                                                    </th>
                                                ))}
                                            </tr>
                                            <tr className="text-slate-600 font-bold border-b border-slate-200">
                                                <th className="p-2 border-r border-slate-200">
                                                    Ngày
                                                </th>
                                                {dayLabels.map((item, idx) => (
                                                    <th
                                                        key={idx}
                                                        className="p-2 border-r border-slate-100">
                                                        {item.day}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="text-slate-800">
                                                <td className="p-2 font-bold border-r border-slate-200 text-blue-600">
                                                    Giờ
                                                </td>
                                                {dayLabels.map((item, idx) => {
                                                    const value =
                                                        payslipData.phieu_cham_cong[
                                                        `ngay_${item.day}`
                                                        ] || 0
                                                    return (
                                                        <td
                                                            key={idx}
                                                            className={`p-2 border-r border-slate-100 ${value > 0 ? 'bg-blue-50 text-blue-600 font-black' : 'text-slate-300'}`}>
                                                            {value > 0 ? `${value}h` : '0'}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-xs text-gray-500 italic flex items-center gap-1.5 ml-1">
                                    <IoIosInformationCircle className="text-blue-500" size={16} />
                                    Nếu có bất kỳ thắc mắc nào về công hoặc giờ dạy, vui lòng liên
                                    hệ Bộ phận Tài chính để được hỗ trợ kiểm tra.
                                </p>
                            </div>
                        )}

                    </div>

                    {/* Action buttons at the bottom (Screen only) */}
                    <div className="flex justify-center gap-3 print:hidden mt-6">
                        <button
                            onClick={handlePrint}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-sm">
                            <FaFilePdf size={16} /> Xuất phiếu lương (PDF/In)
                        </button>
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

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    #print-section,
                    #print-section * {
                        visibility: visible;
                    }
                    #print-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    )
}
