"use client";

import { useState, useEffect } from "react";
import { 
    FaCoins, 
    FaAward, 
    FaChartLine, 
    FaSave, 
    FaSync, 
    FaSearch,
    FaArrowLeft,
    FaCalendarAlt,
    FaFire,
    FaTimes
} from "react-icons/fa";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import Alert from "@/components/Alert";

interface ThuongData {
    ma_nhan_su: number;
    ho_ten: string;
    ma_chuc_vu: number;
    chuc_vu: string;
    ten_phong_ban: string;
    tong_doanh_so: number;
    phan_tram: number;
    tien_hoa_hong: number;
    tien_chuyen_can: number;
    duoc_thuong_chuyen_can: boolean;
    thuong_chuyen_can: number;
    thuong_nong: number;
    chi_tiet_thuong_nong?: Array<{ so_tien: number, noi_dung: string }>;
    tong_thuong: number;
    chi_tiet_cong: {
        has_data: boolean;
        di_muon: number;
        ve_som: number;
    };
}

export default function ThuongPage() {
    const today = new Date();
    const defaultDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const [month, setMonth] = useState(defaultDate.getMonth() + 1);
    const [year, setYear] = useState(defaultDate.getFullYear());
    const [data, setData] = useState<ThuongData[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showThuongNongModal, setShowThuongNongModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    
    // State cho Modal thưởng phát sinh
    const [selectedNS, setSelectedNS] = useState("");
    const [soTienThuongNong, setSoTienThuongNong] = useState("");
    const [noiDungThuongNong, setNoiDungThuongNong] = useState("");
    const [isSavingNong, setIsSavingNong] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/tai-chinh/thuong?month=${month}&year=${year}`);
            const result = await res.json();
            if (Array.isArray(result)) {
                setData(result);
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu thưởng:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (data.length === 0) return;
        
        setIsSaving(true);
        try {
            const res = await fetch("/api/tai-chinh/thuong", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    month,
                    year,
                    data: data // Gửi toàn bộ dữ liệu hiện tại
                })
            });

            const result = await res.json();
            if (result.success) {
                setAlert({ message: `Đã lưu kết quả thưởng kỳ ${month}/${year} thành công!`, type: "success" });
            } else {
                setAlert({ message: result.error || "Có lỗi xảy ra khi lưu.", type: "error" });
            }
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
            setAlert({ message: "Không thể kết nối đến máy chủ.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveThuongNong = async () => {
        if (!selectedNS || !soTienThuongNong || !noiDungThuongNong) {
            setAlert({ message: "Vui lòng nhập đầy đủ thông tin thưởng phát sinh.", type: "error" });
            return;
        }

        setIsSavingNong(true);
        try {
            const res = await fetch("/api/tai-chinh/thuong", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    month,
                    year,
                    isThuongNong: true,
                    ma_nhan_su: selectedNS,
                    so_tien: soTienThuongNong,
                    noi_dung: noiDungThuongNong
                })
            });

            const result = await res.json();
            if (result.success) {
                setAlert({ message: "Đã tạo phiếu thưởng phát sinh thành công!", type: "success" });
                setShowThuongNongModal(false);
                setSoTienThuongNong("");
                setNoiDungThuongNong("");
                fetchData(); // Tải lại bảng để cập nhật số liệu
            } else {
                setAlert({ message: result.error || "Có lỗi xảy ra.", type: "error" });
            }
        } catch (error) {
            setAlert({ message: "Lỗi kết nối.", type: "error" });
        } finally {
            setIsSavingNong(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [month, year]);

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

    const totalHoaHong = data.reduce((acc, curr) => acc + curr.tien_hoa_hong, 0);
    const totalChuyenCan = data.reduce((acc, curr) => acc + curr.thuong_chuyen_can, 0);

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard/tai-chinh/cham-cong" className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-blue-600 transition-colors">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Tính Thưởng & Hoa Hồng</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Đối soát doanh số và chuyên cần tháng {month}/{year}</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
                        <FaCalendarAlt className="text-blue-500 ml-2" />
                        <select 
                            value={month} 
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                            className="bg-transparent font-bold text-slate-700 outline-none p-1"
                        >
                            {Array.from({length: 12}, (_, i) => (
                                <option key={i+1} value={i+1}>Tháng {i+1}</option>
                            ))}
                        </select>
                        <select 
                            value={year} 
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="bg-transparent font-bold text-slate-700 outline-none p-1"
                        >
                            {[2024, 2025, 2026].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={fetchData}
                        className="p-3 bg-white text-blue-600 rounded-lg shadow-sm border border-slate-200 hover:bg-blue-50 transition-all active:scale-90"
                    >
                        <FaSync className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-lg shadow-xl shadow-blue-100 text-white overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-md">
                            <FaCoins size={24} />
                        </div>
                        <p className="text-blue-100 font-medium text-sm mb-1 uppercase tracking-wider">Tổng Hoa Hồng</p>
                        <h3 className="text-3xl font-bold">{formatCurrency(totalHoaHong)}</h3>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-lg shadow-xl shadow-purple-200 text-white overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-md">
                            <FaAward size={24} />
                        </div>
                        <p className="text-purple-100 font-medium text-sm mb-1 uppercase tracking-wider">Tổng Chuyên Cần</p>
                        <h3 className="text-3xl font-bold">{formatCurrency(totalChuyenCan)}</h3>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg shadow-xl shadow-orange-200 text-white overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-md">
                            <FaFire size={24} />
                        </div>
                        <p className="text-orange-100 font-medium text-sm mb-1 uppercase tracking-wider">Tổng Thưởng Phát Sinh</p>
                        <h3 className="text-3xl font-bold">{formatCurrency(data.reduce((acc, curr) => acc + curr.thuong_nong, 0))}</h3>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm nhân sự..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-400 shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setShowThuongNongModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-95"
                        >
                            <FaFire />
                            <span>Thưởng phát sinh</span>
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving || data.length === 0}
                            className={`flex items-center gap-2 px-6 py-3 text-white font-bold rounded-lg shadow-lg transition-all active:scale-95 ${isSaving || data.length === 0 ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                        >
                            <FaSave className={isSaving ? 'animate-pulse' : ''} />
                            <span>{isSaving ? 'Đang lưu...' : 'Lưu kết quả thưởng'}</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                                <th className="sticky left-0 z-20 bg-slate-50 py-2 px-3 pl-3 whitespace-nowrap border-r border-slate-100 w-[80px] min-w-[80px]">Mã NS</th>
                                <th className="sticky left-[80px] z-20 bg-slate-50 py-2 px-4 whitespace-nowrap border-r border-slate-100 min-w-[180px]">Họ tên</th>
                                <th className="py-2 px-4 whitespace-nowrap border-r border-slate-100">Chức vụ</th>
                                <th className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-100">Doanh số thu</th>
                                <th className="py-2 px-4 text-center whitespace-nowrap border-r border-slate-100">% Hoa hồng</th>
                                <th className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-100">Tiền hoa hồng</th>
                                <th className="py-2 px-4 text-center whitespace-nowrap border-r border-slate-100">Chuyên cần</th>
                                <th className="py-2 px-4 text-center whitespace-nowrap border-r border-slate-100 text-orange-600">Thưởng phát sinh</th>
                                <th className="py-2 px-4 text-right pr-4 whitespace-nowrap border-r border-slate-100">Tổng cộng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-slate-400 font-bold italic">Đang tính toán dữ liệu...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-12 text-center">
                                        <p className="text-slate-400 font-medium italic">Không tìm thấy dữ liệu thưởng phù hợp.</p>
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => (
                                    <tr key={item.ma_nhan_su} className="hover:bg-slate-50 transition-colors group">
                                        <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 py-1 px-3 pl-3 font-mono text-sm text-blue-600 font-[500] whitespace-nowrap border-r border-slate-100 w-[80px] min-w-[80px]">NS-{item.ma_nhan_su}</td>
                                        <td className="sticky left-[80px] z-10 bg-white group-hover:bg-slate-50 py-2 px-4 whitespace-nowrap border-r border-slate-100">
                                            <p className="font-bold text-slate-800">{item.ho_ten}</p>
                                        </td>
                                        <td className="py-2 px-4 text-slate-500 font-medium whitespace-nowrap text-sm border-r border-slate-100">
                                            {[2, 3, 4, 5].includes(item.ma_chuc_vu) 
                                                ? `${item.chuc_vu} - ${item.ten_phong_ban}` 
                                                : item.chuc_vu
                                            }
                                        </td>
                                        <td className="py-2 px-4 text-right font-bold text-slate-700 whitespace-nowrap border-r border-slate-100">{formatCurrency(item.tong_doanh_so)}</td>
                                        <td className="py-2 px-4 text-center whitespace-nowrap border-r border-slate-100">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm">
                                                {item.phan_tram}%
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 text-right font-bold text-emerald-600 whitespace-nowrap border-r border-slate-100">{formatCurrency(item.tien_hoa_hong)}</td>
                                        <td className="py-2 px-4 text-center whitespace-nowrap border-r border-slate-100">
                                            {item.duoc_thuong_chuyen_can ? (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-emerald-500 text-xs font-bold mb-1 px-2 py-0.5 bg-emerald-50 rounded-full">ĐẠT</span>
                                                    <span className="text-xs text-slate-400 font-medium">+{formatCurrency(item.tien_chuyen_can)}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-red-600 text-[11px] font-bold px-2 py-0.5 bg-red-50 rounded-full uppercase">KHÔNG ĐẠT</span>
                                                    {!item.chi_tiet_cong.has_data ? (
                                                        <span className="text-[10px] text-slate-400 italic">Chưa có dữ liệu công</span>
                                                    ) : (
                                                        <div className="flex flex-col items-center text-[10px] text-red-400 font-medium leading-tight">
                                                            {item.chi_tiet_cong.di_muon > 0 && <span>Muộn: {item.chi_tiet_cong.di_muon} lần</span>}
                                                            {item.chi_tiet_cong.ve_som > 0 && <span>Sớm: {item.chi_tiet_cong.ve_som} lần</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 text-right font-bold text-orange-600 whitespace-nowrap border-r border-slate-100 relative group/tooltip cursor-pointer">
                                            {item.thuong_nong > 0 ? `+${formatCurrency(item.thuong_nong)}` : formatCurrency(0)}
                                            
                                            {item.chi_tiet_thuong_nong && item.chi_tiet_thuong_nong.length > 0 && (
                                                <div className={`absolute ${index < 3 ? 'top-full mt-1' : 'bottom-full mb-1'} right-0 hidden group-hover/tooltip:block z-[100] min-w-[220px] max-w-[320px]`}>
                                                    <div className="bg-white text-slate-800 p-3 rounded-xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Chi tiết thưởng phát sinh</p>
                                                        <div className="space-y-2">
                                                            {item.chi_tiet_thuong_nong.map((detail, idx) => (
                                                                <div key={idx} className="flex flex-col gap-0.5">
                                                                    <div className="flex justify-between items-start gap-4">
                                                                        <span className="text-[11px] text-slate-500 leading-tight font-medium">{detail.noi_dung}</span>
                                                                        <span className="text-xs font-bold text-orange-600 whitespace-nowrap">{formatCurrency(detail.so_tien)}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className={`absolute ${index < 3 ? '-top-1 border-t border-l' : '-bottom-1 border-b border-r'} right-6 w-2.5 h-2.5 bg-white rotate-45 border-slate-200`}></div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 text-right pr-4 whitespace-nowrap border-r border-slate-100">
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-blue-700">{formatCurrency(item.tong_thuong)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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

            {/* Modal Thưởng Phát Sinh */}
            {showThuongNongModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-900">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-xl">
                                    <FaFire />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Tạo phiếu thưởng phát sinh</h3>
                            </div>
                            <button onClick={() => setShowThuongNongModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-600 ml-1">Chọn nhân sự</label>
                                <select 
                                    value={selectedNS}
                                    onChange={(e) => setSelectedNS(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-slate-800"
                                >
                                    <option value="">-- Chọn nhân viên --</option>
                                    {data.map(ns => (
                                        <option key={ns.ma_nhan_su} value={ns.ma_nhan_su}>
                                            {ns.ho_ten} - {ns.chuc_vu}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-600 ml-1">Số tiền thưởng (VNĐ)</label>
                                <input 
                                    type="number"
                                    value={soTienThuongNong}
                                    onChange={(e) => setSoTienThuongNong(e.target.value)}
                                    placeholder="Ví dụ: 500000"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-mono font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-600 ml-1">Nội dung / Lý do</label>
                                <textarea 
                                    value={noiDungThuongNong}
                                    onChange={(e) => setNoiDungThuongNong(e.target.value)}
                                    placeholder="Nhập lý do thưởng phát sinh..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium resize-none text-slate-800 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button 
                                onClick={() => setShowThuongNongModal(false)}
                                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={handleSaveThuongNong}
                                disabled={isSavingNong}
                                className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all active:scale-95 disabled:bg-slate-400"
                            >
                                {isSavingNong ? 'Đang xử lý...' : 'Xác nhận thưởng'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert Notification */}
            {alert && (
                <Alert 
                    message={alert.message} 
                    type={alert.type} 
                    onClose={() => setAlert(null)} 
                    autoClose={3000} 
                />
            )}
        </div>
    );
}