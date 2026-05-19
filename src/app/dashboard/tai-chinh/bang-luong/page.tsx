'use client'
import { useState, useEffect, useMemo } from 'react';
import { 
    FaCalendarAlt, FaSearch, FaFileInvoiceDollar, FaCheckCircle, 
    FaLock, FaUnlock, FaCalculator, FaSave, FaArrowLeft, FaMoneyBillWave,
    FaUserTie, FaChalkboardTeacher, FaHistory, FaCog, FaSync, FaExclamationTriangle, FaEdit
} from 'react-icons/fa';
import Link from 'next/link';
import { formatCurrency } from "@/lib/utils";
import { CA_DAY_CONFIG } from '@/constants/caDay';
import Alert from '@/components/Alert';

interface PayrollData {
    ma_id: number;
    ma_chuc_vu?: number;
    loai: 'NS' | 'GV';
    ho_ten: string;
    chuc_vu: string;
    ten_phong_ban: string;
    chi_tiet_cham_cong?: any[];
    phan_cong_giang_day?: any[];
    luong_co_ban: number;
    so_ngay_cong: number;
    luong_theo_cong: number;
    phu_cap: number;
    hoa_hong: number;
    thuong_chuyen_can: number;
    thuong_nong: number;
    tong_thuong: number;
    bao_hiem: number;
    thuc_linh: number;
    ghi_chu: string;
    isLocked?: boolean;

    // Chi tiết chấm công
    so_lan_di_muon?: number;
    so_lan_ve_som?: number;
    so_gio_lam_viec_thuong?: number;
    so_gio_tang_ca_ngay_thuong?: number;
    so_gio_lam_viec_thuong_ngay_nghi?: number;
    so_gio_tang_ca_ngay_nghi?: number;
    tong_so_gio_lam_viec?: number;

    // Chi tiết cấu phần lương
    luong_lam_viec_ngay_thuong?: number;
    luong_tang_ca_ngay_thuong?: number;
    luong_lam_viec_ngay_nghi?: number;
    luong_tang_ca_ngay_nghi?: number;

    [key: string]: any;
}

const getExpectedShifts = (item: any, dayOfWeek: number) => {
    const thuValue = dayOfWeek === 0 ? 8 : dayOfWeek + 1;
    const schedules = item.phan_cong_giang_day || [];
    const expected = new Set<number>();
    schedules.forEach((pc: any) => {
        const lich = typeof pc.lop_hoc?.lich_hoc === 'string' ? JSON.parse(pc.lop_hoc.lich_hoc) : (pc.lop_hoc?.lich_hoc || []);
        lich.forEach((subItem: any) => {
            if (Number(subItem.thu) === thuValue) expected.add(Number(subItem.ca));
        });
    });
    return expected;
};

export default function QuanLyLuongPage() {
    const defaultDate = new Date();
    const prevMonthDate = new Date(defaultDate.getFullYear(), defaultDate.getMonth() - 1, 1);
    const [month, setMonth] = useState(prevMonthDate.getMonth() + 1);
    const [year, setYear] = useState(prevMonthDate.getFullYear());
    const [data, setData] = useState<PayrollData[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [hasPhieuChi, setHasPhieuChi] = useState(false);
    const [maPhieuChi, setMaPhieuChi] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showConfirmLockModal, setShowConfirmLockModal] = useState(false);
    const [showConfirmUnlockModal, setShowConfirmUnlockModal] = useState(false);
    const itemsPerPage = 10;

    const [coefNormal, setCoefNormal] = useState<number>(1.0);
    const [coefOtNormal, setCoefOtNormal] = useState<number>(1.5);
    const [coefWeekend, setCoefWeekend] = useState<number>(2.0);
    const [coefOtWeekend, setCoefOtWeekend] = useState<number>(2.5);

    // Form input states (percentage value, e.g. 100, 150, 200, 250)
    const [inputNormal, setInputNormal] = useState<number | string>(100);
    const [inputOtNormal, setInputOtNormal] = useState<number | string>(150);
    const [inputWeekend, setInputWeekend] = useState<number | string>(200);
    const [inputOtWeekend, setInputOtWeekend] = useState<number | string>(250);

    const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedNormal = localStorage.getItem('coefNormal');
            const savedOtNormal = localStorage.getItem('coefOtNormal');
            const savedWeekend = localStorage.getItem('coefWeekend');
            const savedOtWeekend = localStorage.getItem('coefOtWeekend');

            const valNormal = savedNormal ? parseFloat(savedNormal) : 1.0;
            const valOtNormal = savedOtNormal ? parseFloat(savedOtNormal) : 1.5;
            const valWeekend = savedWeekend ? parseFloat(savedWeekend) : 2.0;
            const valOtWeekend = savedOtWeekend ? parseFloat(savedOtWeekend) : 2.5;

            setCoefNormal(valNormal);
            setCoefOtNormal(valOtNormal);
            setCoefWeekend(valWeekend);
            setCoefOtWeekend(valOtWeekend);

            setInputNormal(Math.round(valNormal * 100));
            setInputOtNormal(Math.round(valOtNormal * 100));
            setInputWeekend(Math.round(valWeekend * 100));
            setInputOtWeekend(Math.round(valOtWeekend * 100));
        }
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/tai-chinh/luong?month=${month}&year=${year}&coefNormal=${coefNormal}&coefOtNormal=${coefOtNormal}&coefWeekend=${coefWeekend}&coefOtWeekend=${coefOtWeekend}&t=${Date.now()}`,
                { cache: 'no-store' }
            );
            const result = await res.json();
            if (result.results) {
                setData(result.results);
                setIsLocked(result.isLocked);
                setHasPhieuChi(!!result.hasPhieuChi);
                setMaPhieuChi(result.maPhieuChi || null);
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu lương:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLockPayroll = () => {
        if (data.length === 0 || isLocked) return;
        setShowConfirmLockModal(true);
    };

    const executeLockPayroll = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/tai-chinh/luong", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    month,
                    year,
                    data: data
                })
            });

            const result = await res.json();
            if (result.success) {
                setAlert({ message: `Đã chốt bảng lương tháng ${month}/${year} thành công!`, type: "success" });
                setIsLocked(true);
                setHasPhieuChi(false);
                setMaPhieuChi(null);
            } else {
                setAlert({ message: result.error || "Có lỗi xảy ra.", type: "error" });
            }
        } catch (error) {
            console.error("Lỗi khi chốt lương:", error);
            setAlert({ message: "Lỗi kết nối.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleUnlockPayroll = () => {
        setShowConfirmUnlockModal(true);
    };

    const executeUnlockPayroll = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/tai-chinh/luong?month=${month}&year=${year}`, {
                method: "DELETE"
            });

            const result = await res.json();
            if (result.success) {
                setAlert({ message: `Đã mở chốt bảng lương tháng ${month}/${year} thành công!`, type: "success" });
                setIsLocked(false);
                setHasPhieuChi(false);
                setMaPhieuChi(null);
                fetchData(); // Tải lại bảng tính xem trước
            } else {
                setAlert({ message: result.error || "Có lỗi xảy ra.", type: "error" });
            }
        } catch (error) {
            console.error("Lỗi khi mở chốt:", error);
            setAlert({ message: "Lỗi kết nối.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [month, year, coefNormal, coefOtNormal, coefWeekend, coefOtWeekend]);

    useEffect(() => {
        const handleRefresh = () => {
            fetchData();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                handleRefresh();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleRefresh);
        window.addEventListener('pageshow', handleRefresh);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleRefresh);
            window.removeEventListener('pageshow', handleRefresh);
        };
    }, [month, year, coefNormal, coefOtNormal, coefWeekend, coefOtWeekend]);

    const filteredData = data.filter(item => 
        item.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.chuc_vu.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, month, year]);

    const totalPayroll = data.reduce((acc, curr) => acc + curr.thuc_linh, 0);
    const totalStaff = data.filter(d => d.loai === 'NS').length;
    const totalTeachers = data.filter(d => d.loai === 'GV').length;

    const daysInMonth = useMemo(() => {
        return new Date(year, month, 0).getDate();
    }, [month, year]);

    const dayLabels = useMemo(() => {
        return [...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.getDay();
            const labels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            return { day, thu: labels[dayOfWeek], jsDay: dayOfWeek };
        });
    }, [daysInMonth, month, year]);

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                            <FaFileInvoiceDollar className="text-blue-600" /> Quản lý bảng lương
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium ml-9">Tổng hợp công, thưởng và tính lương hàng tháng</p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <div className="flex bg-white p-1.5 rounded-lg shadow-sm border border-slate-200">
                        <select 
                            value={month} 
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="bg-transparent px-3 py-1.5 font-bold text-slate-700 outline-none cursor-pointer border-r border-slate-100"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                            ))}
                        </select>
                        <select 
                            value={year} 
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="bg-transparent px-3 py-1.5 font-bold text-slate-700 outline-none cursor-pointer"
                        >
                            {[2024, 2025, 2026].map(y => (
                                <option key={y} value={y}>Năm {y}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        onClick={() => {
                            // Populate input states with current coef values before opening modal
                            setInputNormal(Math.round(coefNormal * 100));
                            setInputOtNormal(Math.round(coefOtNormal * 100));
                            setInputWeekend(Math.round(coefWeekend * 100));
                            setInputOtWeekend(Math.round(coefOtWeekend * 100));
                            setShowConfigModal(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-blue-600 font-bold rounded-lg hover:bg-blue-50/50 hover:border-blue-200 transition-all active:scale-95 shadow-sm"
                    >
                        <FaCog className="text-blue-500 animate-spin-slow" style={{ animationDuration: '6s' }} /> Công thức tính
                    </button>

                    <button 
                        onClick={fetchData}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-blue-600 font-bold rounded-lg hover:bg-blue-50/50 hover:border-blue-200 transition-all active:scale-95 shadow-sm"
                    >
                        <FaSync className={loading ? 'animate-spin' : ''} /> Cập nhật
                    </button>

                    {isLocked ? (
                        <button 
                            onClick={handleUnlockPayroll}
                            disabled={isSaving || data.length === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                        >
                            <FaEdit />
                            <span>{isSaving ? 'Đang xử lý...' : 'Chỉnh sửa bảng lương'}</span>
                        </button>
                    ) : (
                        <button 
                            onClick={handleLockPayroll}
                            disabled={isSaving || data.length === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                        >
                            <FaSave />
                            <span>{isSaving ? 'Đang xử lý...' : 'Chốt bảng lương'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Alert */}
            {alert && (
                <Alert 
                    type={alert.type} 
                    message={alert.message} 
                    onClose={() => setAlert(null)} 
                />
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <FaMoneyBillWave size={24} />
                        </div>
                        {isLocked ? <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full uppercase">Đã chốt</span> : <span className="text-[10px] font-bold px-2 py-1 bg-orange-100 text-orange-600 rounded-full uppercase">Tạm tính</span>}
                    </div>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Tổng lương</p>
                    <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(totalPayroll)}</h3>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                            <FaUserTie size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400">Nhân sự</span>
                    </div>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Tổng nhân viên</p>
                    <h3 className="text-2xl font-bold text-slate-800">{totalStaff} <span className="text-sm font-bold text-slate-400">người</span></h3>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                            <FaChalkboardTeacher size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400">Giáo viên</span>
                    </div>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Tổng giáo viên</p>
                    <h3 className="text-2xl font-bold text-slate-800">{totalTeachers} <span className="text-sm font-bold text-slate-400">người</span></h3>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex flex-col justify-between min-h-[200px]">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${isLocked ? (hasPhieuChi ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600') : 'bg-orange-50 text-orange-500'}`}>
                                <FaHistory size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-400">Kỳ {month}/{year}</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Trạng thái</span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isLocked ? (hasPhieuChi ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-amber-100 text-amber-700 font-bold') : 'bg-orange-100 text-orange-700 font-bold'}`}>
                                {isLocked ? (hasPhieuChi ? 'Đã chi trả' : 'Đã chốt') : 'Tạm tính'}
                            </span>
                        </div>
                    </div>
                    {isLocked && (
                        <div className="mt-4">
                            {hasPhieuChi ? (
                                <Link 
                                    href={`/dashboard/tai-chinh/phieu-chi?search=${maPhieuChi}`}
                                    className="w-full py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-all active:scale-95 text-sm flex items-center justify-center gap-2 border border-emerald-200 shadow-sm"
                                >
                                    <FaCheckCircle size={16} />
                                    <span>Xem phiếu chi liên kết</span>
                                </Link>
                            ) : (
                                <Link 
                                    href={`/dashboard/tai-chinh/phieu-chi?action=create_luong&month=${month}&year=${year}`}
                                    className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all active:scale-95 text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-100/50"
                                >
                                    <FaMoneyBillWave size={16} />
                                    <span>Lập phiếu chi lương</span>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Tìm kiếm nhân sự, chức vụ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm font-[500] text-gray-600 italic">
                        * Bảng lương tích hợp chi tiết chấm công và các khoản lương, phụ cấp
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar relative">
                    <table className="w-full text-left border-collapse table-fixed" style={{ minWidth: '3058px' }}>
                        <colgroup>
                            {/* Sticky Họ tên & Chức vụ */}
                            <col style={{ width: '240px' }} />
                            
                            {/* 31 days */}
                            {Array.from({ length: daysInMonth }).map((_, idx) => (
                                <col key={idx} style={{ width: '38px' }} />
                            ))}
                            
                            {/* Thông số công */}
                            <col style={{ width: '100px' }} />
                            <col style={{ width: '60px' }} />
                            <col style={{ width: '60px' }} />
                            <col style={{ width: '80px' }} />
                            <col style={{ width: '100px' }} />
                            <col style={{ width: '80px' }} />
                            <col style={{ width: '100px' }} />
                            <col style={{ width: '90px' }} />
                            
                            {/* Cấu phần tính lương */}
                            <col style={{ width: '120px' }} />
                            <col style={{ width: '130px' }} />
                            <col style={{ width: '140px' }} />
                            <col style={{ width: '130px' }} />
                            <col style={{ width: '140px' }} />
                            <col style={{ width: '100px' }} />
                            <col style={{ width: '100px' }} />
                            
                            {/* Sticky Tổng lương */}
                            <col style={{ width: '140px' }} />
                        </colgroup>
                        <thead>
                            <tr className="bg-slate-100 text-slate-600 text-sm font-bold tracking-widest border-b border-slate-200">
                                <th colSpan={1} className="py-1.5 px-3 sticky left-0 z-30 bg-slate-100 border-r border-slate-200 text-center w-[240px] min-w-[240px] max-w-[240px]">Nhân sự</th>
                                <th colSpan={daysInMonth} className="py-1.5 px-2 text-center border-r border-slate-200 bg-sky-50 text-sky-800">Số giờ làm việc các ngày trong tháng</th>
                                <th colSpan={8} className="py-1.5 px-2 text-center border-r border-slate-200 bg-orange-50 text-orange-800">Thông số công</th>
                                <th colSpan={8} className="py-1.5 px-2 text-center bg-blue-50 text-blue-800">Các khoản lương & phụ cấp</th>
                            </tr>
                            <tr className="bg-slate-50 text-slate-500 text-sm font-bold border-b border-slate-200">
                                {/* Sticky column */}
                                <th className="py-2 px-3 sticky left-0 z-20 bg-slate-50 border-r border-slate-200 w-[240px] min-w-[240px] max-w-[240px]">Họ tên & Chức vụ</th>
                                
                                {/* 31 days */}
                                {dayLabels.map((item, idx) => (
                                    <th key={idx} className={`p-1.5 text-center border-r border-slate-100 w-[38px] min-w-[38px] ${item.thu === 'CN' ? 'text-red-500 bg-red-50' : ''}`}>
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm opacity-90 font-semibold">{item.thu}</span>
                                            <span className="text-sm font-black">{item.day}</span>
                                        </div>
                                    </th>
                                ))}

                                {/* Thông số công */}
                                <th className="py-2 px-3 text-center border-r border-slate-200 bg-orange-50/50 text-orange-800 w-[100px] min-w-[100px]">Công</th>
                                <th className="py-2 px-3 text-center border-r border-slate-100 bg-orange-50/50 text-orange-700 w-[60px] min-w-[60px]">Muộn</th>
                                <th className="py-2 px-3 text-center border-r border-slate-100 bg-orange-50/50 text-orange-700 w-[60px] min-w-[60px]">Sớm</th>
                                <th className="py-2 px-3 text-center border-r border-slate-100 bg-orange-50/50 text-slate-700 w-[80px] min-w-[80px]">Giờ thường</th>
                                <th className="py-2 px-3 text-center border-r border-slate-100 bg-orange-50/50 text-slate-700 w-[100px] min-w-[100px] whitespace-normal leading-tight py-1.5">Tăng ca thường</th>
                                <th className="py-2 px-3 text-center border-r border-slate-100 bg-orange-50/50 text-slate-700 w-[80px] min-w-[80px]">Giờ nghỉ</th>
                                <th className="py-2 px-3 text-center border-r border-slate-100 bg-orange-50/50 text-slate-700 w-[100px] min-w-[100px] whitespace-normal leading-tight py-1.5">Tăng ca nghỉ</th>
                                <th className="py-2 px-3 text-center border-r border-slate-200 bg-orange-50/50 text-slate-800 w-[90px] min-w-[90px]">Tổng giờ</th>

                                {/* Lương & Thưởng */}
                                <th className="py-2 px-3 text-right border-r border-slate-100 bg-blue-50/50 text-slate-700 w-[120px] min-w-[120px] whitespace-normal leading-tight py-1.5">Lương cơ bản</th>
                                <th className="py-2 px-3 text-right border-r border-slate-100 bg-blue-50/50 text-slate-700 w-[130px] min-w-[130px] whitespace-normal leading-tight py-1.5">Lương ngày thường ({Math.round(coefNormal * 100)}%)</th>
                                <th className="py-2 px-3 text-right border-r border-slate-100 bg-blue-50/50 text-slate-700 w-[140px] min-w-[140px] whitespace-normal leading-tight py-1.5">Lương tăng ca ngày thường ({Math.round(coefOtNormal * 100)}%)</th>
                                <th className="py-2 px-3 text-right border-r border-slate-100 bg-blue-50/50 text-slate-700 w-[130px] min-w-[130px] whitespace-normal leading-tight py-1.5">Lương ngày nghỉ ({Math.round(coefWeekend * 100)}%)</th>
                                <th className="py-2 px-3 text-right border-r border-slate-100 bg-blue-50/50 text-slate-700 w-[140px] min-w-[140px] whitespace-normal leading-tight py-1.5">Lương tăng ca ngày nghỉ ({Math.round(coefOtWeekend * 100)}%)</th>
                                <th className="py-2 px-3 text-right border-r border-slate-100 bg-blue-50/50 text-emerald-700 w-[100px] min-w-[100px] whitespace-normal leading-tight py-1.5">Thưởng</th>
                                <th className="py-2 px-3 text-right border-r border-slate-200 bg-blue-50/50 text-purple-700 w-[100px] min-w-[100px] whitespace-normal leading-tight py-1.5">Phụ cấp</th>
                                <th className="py-2 px-4 text-right bg-blue-600 text-white font-bold sticky right-0 z-20 w-[140px] min-w-[140px] border-l border-blue-500">Tổng lương</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={17 + daysInMonth} className="p-12 text-center text-slate-400 font-bold italic animate-pulse">Đang xử lý dữ liệu bảng lương...</td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={17 + daysInMonth} className="p-12 text-center text-slate-400 font-bold italic">Không tìm thấy dữ liệu phù hợp.</td>
                                </tr>
                            ) : (
                                currentItems.map((item, rowIndex) => {
                                    const detailsMap: Record<number, any> = {};
                                    item.chi_tiet_cham_cong?.forEach((ct: any) => {
                                        const d = ct.day || (ct.ngay ? parseInt(String(ct.ngay).substring(8, 10)) : 0);
                                        if (d > 0) detailsMap[d] = ct;
                                    });

                                    return (
                                        <tr key={rowIndex} className="hover:bg-slate-50/80 transition-colors group text-sm text-slate-700">
                                            {/* Sticky Họ tên & Chức vụ */}
                                            <td className="py-2 px-3 sticky left-0 z-10 bg-white group-hover:bg-slate-50 border-r border-slate-200 w-[240px] min-w-[240px] max-w-[240px]">
                                                <div className="flex flex-col gap-1 w-full whitespace-normal">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-sm font-bold font-mono border border-blue-100 flex-shrink-0">
                                                            {item.loai}_{item.ma_id}
                                                        </span>
                                                        <span className="text-sm font-bold text-slate-800 truncate">{item.ho_ten}</span>
                                                    </div>
                                                    <span className="text-sm text-slate-500 font-semibold flex items-start gap-1 w-full whitespace-normal leading-tight">
                                                        {item.loai === 'GV' ? <FaChalkboardTeacher className="text-amber-500 flex-shrink-0 mt-0.5" /> : <FaUserTie className="text-purple-500 flex-shrink-0 mt-0.5" />}
                                                        <span>
                                                            {item.chuc_vu ? (
                                                                item.ma_chuc_vu && [2, 3, 4, 5].includes(item.ma_chuc_vu)
                                                                    ? `${item.chuc_vu.charAt(0).toUpperCase() + item.chuc_vu.slice(1).toLowerCase()} - ${item.ten_phong_ban}`
                                                                    : item.chuc_vu.charAt(0).toUpperCase() + item.chuc_vu.slice(1).toLowerCase()
                                                            ) : ''}
                                                        </span>
                                                    </span>
                                                </div>
                                            </td>

                                            {/* 31 days data */}
                                            {dayLabels.map((dayObj) => {
                                                const key = `ngay_${dayObj.day}`;
                                                const hourVal = item[key] || 0;
                                                const dayData = detailsMap[dayObj.day];
                                                const expectedShifts = item.loai === 'GV' ? getExpectedShifts(item, dayObj.jsDay) : new Set<number>();

                                                return (
                                                    <td key={dayObj.day} className={`p-1.5 text-center border-r border-slate-100 font-bold w-[38px] relative group/cell ${dayObj.thu === 'CN' ? 'bg-red-50/30' : ''} ${hourVal > 0 ? 'text-blue-600' : 'text-slate-300'}`}>
                                                        {hourVal ? (
                                                            <span>{hourVal}h</span>
                                                        ) : (
                                                            <span>0</span>
                                                        )}

                                                        {/* tooltip */}
                                                        {((dayData) || (expectedShifts.size > 0)) && (
                                                            <div className={`invisible group-hover/cell:visible absolute ${rowIndex < 4 ? 'top-full mt-2' : 'bottom-full mb-2'} left-1/2 -translate-x-1/2 z-30 w-80 rounded-lg bg-white text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 animate-in fade-in zoom-in duration-200`}>
                                                                <div className="p-4 max-h-[250px] overflow-y-auto custom-scrollbar overflow-x-hidden text-left font-normal">
                                                                    <div className="font-black border-b border-slate-100 pb-2 mb-3 text-blue-600 flex justify-between uppercase text-xs tracking-wider">
                                                                        <span>{dayObj.thu}, {dayObj.day}/{month}/{year}</span>
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        {item.loai === 'GV' ? (
                                                                            (() => {
                                                                                const ivs = []
                                                                                const seen = new Set()
                                                                                for(let c=1; c<=6; c++) {
                                                                                    const v = dayData?.[`gio_vao_${c}`]
                                                                                    const r = dayData?.[`gio_ra_${c}`]
                                                                                    if((v || r) && !seen.has(`${v}-${r}`)) {
                                                                                        ivs.push({v, r})
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
                                                                                            <div key={ca} className="p-3 rounded-lg bg-slate-50 border border-slate-100 mb-2 last:mb-0 text-slate-800">
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
                                                                                                <div key={i} className="flex justify-between py-2 border-b border-slate-50 last:border-0 text-slate-800">
                                                                                                    <span className="text-slate-400 font-bold">Lần chấm công {i+1}:</span>
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
                                                                                for(let c=1; c<=6; c++) {
                                                                                    const v = dayData?.[`gio_vao_${c}`]
                                                                                    const r = dayData?.[`gio_ra_${c}`]
                                                                                    if((v || r) && !seen.has(`${v}-${r}`)) {
                                                                                        ivs.push({v, r})
                                                                                        seen.add(`${v}-${r}`)
                                                                                    }
                                                                                }
                                                                                return ivs.map((inv, i) => {
                                                                                    const isLate = i === 0 && inv.v && inv.v > "08:00"
                                                                                    const isEarly = i === ivs.length - 1 && inv.r && inv.r < "17:30"
                                                                                    const isMissing = !inv.v || !inv.r
                                                                                    const isWarning = isMissing || isLate || isEarly

                                                                                    return (
                                                                                        <div key={i} className="flex justify-between py-2 border-b border-slate-50 last:border-0 text-slate-800">
                                                                                            <span className="text-slate-400 font-[500]">Lượt chấm công {i+1}:</span>
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
                                                );
                                            })}

                                        {/* Thông số công */}
                                        <td className="py-2 px-3 text-center border-r border-slate-200 bg-orange-50/10 w-[100px]">
                                            <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full font-bold text-sm">
                                                {item.loai === 'GV' ? `${item.tong_so_gio_lam_viec || 0}h` : `${item.so_ngay_cong || 0} công`}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3 text-center border-r border-slate-100 bg-orange-50/10 font-bold text-red-500 w-[60px]">{item.so_lan_di_muon || 0}</td>
                                        <td className="py-2 px-3 text-center border-r border-slate-100 bg-orange-50/10 font-bold text-red-400 w-[60px]">{item.so_lan_ve_som || 0}</td>
                                        <td className="py-2 px-3 text-center border-r border-slate-100 bg-orange-50/10 font-medium w-[80px]">{item.so_gio_lam_viec_thuong || 0}h</td>
                                        <td className="py-2 px-3 text-center border-r border-slate-100 bg-orange-50/10 font-medium text-emerald-600 w-[100px]">{item.so_gio_tang_ca_ngay_thuong || 0}h</td>
                                        <td className="py-2 px-3 text-center border-r border-slate-100 bg-orange-50/10 font-medium w-[80px]">{item.so_gio_lam_viec_thuong_ngay_nghi || 0}h</td>
                                        <td className="py-2 px-3 text-center border-r border-slate-100 bg-orange-50/10 font-medium text-purple-600 w-[100px]">{item.so_gio_tang_ca_ngay_nghi || 0}h</td>
                                        <td className="py-2 px-3 text-center border-r border-slate-200 bg-orange-50/20 font-bold text-slate-800 w-[90px]">{item.tong_so_gio_lam_viec || 0}h</td>

                                        {/* Cấu phần lương */}
                                        <td className="py-2 px-3 text-right border-r border-slate-100 font-bold text-slate-600 w-[120px]">{formatCurrency(item.luong_co_ban)}</td>
                                        <td className="py-2 px-3 text-right border-r border-slate-100 font-bold text-slate-700 w-[130px]">{formatCurrency(item.luong_lam_viec_ngay_thuong || 0)}</td>
                                        <td className="py-2 px-3 text-right border-r border-slate-100 font-bold text-emerald-600 w-[140px]">{formatCurrency(item.luong_tang_ca_ngay_thuong || 0)}</td>
                                        <td className="py-2 px-3 text-right border-r border-slate-100 font-bold text-slate-700 w-[130px]">{formatCurrency(item.luong_lam_viec_ngay_nghi || 0)}</td>
                                        <td className="py-2 px-3 text-right border-r border-slate-100 font-bold text-purple-600 w-[140px]">{formatCurrency(item.luong_tang_ca_ngay_nghi || 0)}</td>
                                        <td className={`py-2 px-3 text-right border-r border-slate-100 font-bold text-emerald-600 w-[100px] relative group/bonus ${item.tong_thuong > 0 ? 'cursor-pointer' : ''}`}>
                                            <span>{formatCurrency(item.tong_thuong || 0)}</span>
                                            
                                            {/* Tooltip thưởng */}
                                            {item.tong_thuong > 0 && (
                                                <div className={`invisible group-hover/bonus:visible absolute ${rowIndex < 4 ? 'top-full mt-2' : 'bottom-full mb-2'} right-0 z-30 w-72 rounded-lg bg-white text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 animate-in fade-in zoom-in duration-200 text-left font-normal`}>
                                                <div className="p-4">
                                                    <div className="font-bold border-b border-slate-100 pb-2 mb-3 text-emerald-600 flex justify-between text-sm tracking-wider">
                                                        <span>Chi tiết thưởng</span>
                                                        <span className="font-mono">{item.loai}_{item.ma_id}</span>
                                                    </div>
                                                    <div className="space-y-2.5 text-sm">
                                                        {item.tong_thuong > 0 ? (
                                                            <>
                                                                {item.hoa_hong > 0 && (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-slate-500 font-medium">Tiền hoa hồng:</span>
                                                                        <span className="font-bold text-slate-700">{formatCurrency(item.hoa_hong || 0)}</span>
                                                                    </div>
                                                                )}
                                                                {item.thuong_chuyen_can > 0 && (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-slate-500 font-medium">Thưởng chuyên cần:</span>
                                                                        <span className="font-bold text-slate-700">{formatCurrency(item.thuong_chuyen_can || 0)}</span>
                                                                    </div>
                                                                )}
                                                                {item.chi_tiet_thuong_nong && item.chi_tiet_thuong_nong.length > 0 ? (
                                                                    item.chi_tiet_thuong_nong.map((thuong: any, idx: number) => (
                                                                        <div key={`thuong_${idx}`} className="flex justify-between">
                                                                            <span className="text-slate-500 font-medium">{thuong.noi_dung || 'Thưởng nóng'}:</span>
                                                                            <span className="font-bold text-slate-700">{formatCurrency(thuong.so_tien || 0)}</span>
                                                                        </div>
                                                                    ))
                                                                ) : item.thuong_nong > 0 && (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-slate-500 font-medium">{item.noi_dung_thuong || 'Thưởng nóng'}:</span>
                                                                        <span className="font-bold text-slate-700">{formatCurrency(item.thuong_nong || 0)}</span>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="text-slate-400 italic py-2 text-center">Không có thưởng chi tiết</div>
                                                        )}
                                                        <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between font-bold">
                                                            <span className="text-slate-800">Tổng thưởng:</span>
                                                            <span className="text-emerald-600">{formatCurrency(item.tong_thuong || 0)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`absolute right-4 border-8 border-transparent ${rowIndex < 4 ? 'bottom-full border-b-white' : 'top-full border-t-white'}`}></div>
                                            </div>
                                            )}
                                        </td>
                                        <td className={`py-2 px-3 text-right border-r border-slate-200 font-bold text-purple-600 w-[100px] relative group/allowance ${item.phu_cap > 0 ? 'cursor-pointer' : ''}`}>
                                            <span>{formatCurrency(item.phu_cap || 0)}</span>

                                            {/* Tooltip phụ cấp */}
                                            {item.phu_cap > 0 && (
                                                <div className={`invisible group-hover/allowance:visible absolute ${rowIndex < 4 ? 'top-full mt-2' : 'bottom-full mb-2'} right-0 z-30 w-72 rounded-lg bg-white text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 animate-in fade-in zoom-in duration-200 text-left font-normal`}>
                                                <div className="p-4">
                                                    <div className="font-bold border-b border-slate-100 pb-2 mb-3 text-purple-600 flex justify-between text-sm tracking-wider">
                                                        <span>Chi tiết phụ cấp</span>
                                                        <span className="font-mono">{item.loai}_{item.ma_id}</span>
                                                    </div>
                                                    <div className="space-y-2.5 text-sm">
                                                        {item.chi_tiet_phu_cap && item.chi_tiet_phu_cap.filter((pc: any) => pc.ten !== "Chuyên cần").length > 0 ? (
                                                            item.chi_tiet_phu_cap.filter((pc: any) => pc.ten !== "Chuyên cần").map((pc: any, i: number) => (
                                                                <div key={i} className="flex justify-between">
                                                                    <span className="text-slate-500 font-medium">{pc.ten || 'Phụ cấp khác'}:</span>
                                                                    <span className="font-bold text-slate-700">{formatCurrency(Number(pc.soTien || 0))}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-slate-400 italic py-2 text-center">Không có phụ cấp chi tiết</div>
                                                        )}
                                                        <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between font-bold">
                                                            <span className="text-slate-800">Tổng phụ cấp:</span>
                                                            <span className="text-purple-600">{formatCurrency(item.phu_cap || 0)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`absolute right-4 border-8 border-transparent ${rowIndex < 4 ? 'bottom-full border-b-white' : 'top-full border-t-white'}`}></div>
                                            </div>
                                            )}
                                        </td>
                                        
                                        {/* Sticky Tổng lương */}
                                        <td className="py-2 px-4 text-right bg-blue-50 group-hover:bg-blue-100 sticky right-0 z-10 transition-colors border-l border-blue-200 w-[140px] font-black text-blue-600 text-sm">
                                            {formatCurrency(item.thuc_linh)}
                                        </td>
                                    </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && filteredData.length > 0 && (
                    <div className="p-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
                        <div className="text-sm font-medium text-slate-500">
                            Hiển thị <span className="text-blue-600 font-bold">{indexOfFirstItem + 1}</span> - <span className="text-blue-600 font-bold">{Math.min(indexOfLastItem, filteredData.length)}</span> trong tổng số <span className="text-slate-800 font-bold">{filteredData.length}</span> nhân sự
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold transition-all ${currentPage === 1 ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white text-slate-600 hover:border-blue-500 hover:text-blue-600 shadow-sm'}`}
                            >
                                Trước
                            </button>
                            
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => setCurrentPage(number)}
                                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === number ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-500 hover:text-blue-600 shadow-sm'}`}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold transition-all ${currentPage === totalPages ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white text-slate-600 hover:border-blue-500 hover:text-blue-600 shadow-sm'}`}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Cấu hình hệ số lương */}
            {showConfigModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                                <FaCog className="text-blue-600 animate-spin-slow" style={{ animationDuration: '8s' }} /> Cấu hình hệ số tính lương
                            </h3>
                            <button 
                                onClick={() => setShowConfigModal(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <span className="text-xl font-bold">×</span>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-xl text-sm text-blue-700 font-medium leading-relaxed">
                                Cấu hình hệ số tính lương cho các loại giờ làm việc. Giá trị này được áp dụng khi hệ thống tính toán bảng lương xem trước cho các nhân sự chưa chốt lương.
                            </div>

                            <div className="space-y-4">
                                {/* 1. Số giờ làm việc ngày thường */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                                        Số giờ làm việc ngày thường (Mặc định: 100%)
                                    </label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <input
                                            type="number"
                                            value={inputNormal}
                                            onChange={(e) => setInputNormal(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="100"
                                            className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <span className="text-slate-400 font-bold">%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Số giờ làm việc tăng ca ngày thường */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                                        Số giờ làm việc tăng ca ngày thường (Mặc định: 150%)
                                    </label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <input
                                            type="number"
                                            value={inputOtNormal}
                                            onChange={(e) => setInputOtNormal(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="150"
                                            className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <span className="text-slate-400 font-bold">%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Số giờ làm việc thường ngày nghỉ */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                                        Số giờ làm việc thường ngày nghỉ (Mặc định: 200%)
                                    </label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <input
                                            type="number"
                                            value={inputWeekend}
                                            onChange={(e) => setInputWeekend(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="200"
                                            className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <span className="text-slate-400 font-bold">%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Số giờ làm việc tăng ca ngày nghỉ */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                                        Số giờ làm việc tăng ca ngày nghỉ (Mặc định: 250%)
                                    </label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <input
                                            type="number"
                                            value={inputOtWeekend}
                                            onChange={(e) => setInputOtWeekend(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="250"
                                            className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <span className="text-slate-400 font-bold">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-3">
                            <button
                                onClick={() => {
                                    setInputNormal(100);
                                    setInputOtNormal(150);
                                    setInputWeekend(200);
                                    setInputOtWeekend(250);
                                }}
                                className="px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm uppercase tracking-wider active:scale-95"
                            >
                                <FaHistory className="text-slate-500" /> Đặt mặc định
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowConfigModal(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-100 transition-colors active:scale-95"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => {
                                        const numNormal = Number(inputNormal) || 0;
                                        const numOtNormal = Number(inputOtNormal) || 0;
                                        const numWeekend = Number(inputWeekend) || 0;
                                        const numOtWeekend = Number(inputOtWeekend) || 0;

                                        // Save to localStorage
                                        localStorage.setItem('coefNormal', String(numNormal / 100));
                                        localStorage.setItem('coefOtNormal', String(numOtNormal / 100));
                                        localStorage.setItem('coefWeekend', String(numWeekend / 100));
                                        localStorage.setItem('coefOtWeekend', String(numOtWeekend / 100));

                                        // Update state (triggers fetchData via useEffect)
                                        setCoefNormal(numNormal / 100);
                                        setCoefOtNormal(numOtNormal / 100);
                                        setCoefWeekend(numWeekend / 100);
                                        setCoefOtWeekend(numOtWeekend / 100);

                                        setShowConfigModal(false);
                                        setAlert({ message: "Đã cập nhật công thức và tính toán lại bảng lương thành công!", type: "success" });
                                    }}
                                    className="px-5 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                                >
                                    Lưu công thức
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xác nhận Chốt bảng lương */}
            {showConfirmLockModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 mx-auto mb-4 text-amber-500">
                                <FaExclamationTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">Chốt bảng lương chính thức</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Bạn có chắc chắn muốn <span className="font-bold text-slate-700">CHỐT</span> bảng lương tháng <span className="font-bold text-blue-600">{month}/{year}</span>? Sau khi chốt, dữ liệu sẽ được lưu chính thức và không thể chỉnh sửa.
                            </p>
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmLockModal(false)}
                                className="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmLockModal(false);
                                    executeLockPayroll();
                                }}
                                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95"
                            >
                                Xác nhận chốt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xác nhận Mở chốt bảng lương */}
            {showConfirmUnlockModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100 mx-auto mb-4 text-red-500 animate-pulse">
                                <FaExclamationTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">Chỉnh sửa bảng lương đã chốt</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Bạn có chắc chắn muốn <span className="font-bold text-red-600">CHỈNH SỬA</span> bảng lương tháng <span className="font-bold text-blue-600">{month}/{year}</span>? Để chỉnh sửa dữ liệu và tính toán lại, hệ thống sẽ tạm thời mở khóa bảng lương này.
                            </p>
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmUnlockModal(false)}
                                className="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmUnlockModal(false);
                                    executeUnlockPayroll();
                                }}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-amber-200 active:scale-95"
                            >
                                Xác nhận chỉnh sửa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}
