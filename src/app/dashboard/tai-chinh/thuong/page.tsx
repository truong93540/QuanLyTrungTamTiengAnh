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
    FaTimes,
    FaEdit,
    FaTrash,
    FaCheck,
    FaLock,
    FaUnlock,
    FaExclamationTriangle
} from "react-icons/fa";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import Alert from "@/components/Alert";

interface ThuongData {
    ma_nhan_su: number;
    isTeacher?: boolean;
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
    chi_tiet_thuong_nong?: Array<{ ma_phieu_thuong: number, so_tien: number, noi_dung: string }>;
    tong_thuong: number;
    chi_tiet_cong: {
        has_data: boolean;
        di_muon: number;
        ve_som: number;
        so_ngay_cong: number;
        required_days: number;
    };
}

export default function ThuongPage() {
    const today = new Date();
    const defaultDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const [month, setMonth] = useState(defaultDate.getMonth() + 1);
    const [year, setYear] = useState(defaultDate.getFullYear());
    const [ngayLeText, setNgayLeText] = useState("");
    const [data, setData] = useState<ThuongData[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showThuongNongModal, setShowThuongNongModal] = useState(false);
    const [showNgayLeModal, setShowNgayLeModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // State cho Modal thưởng phát sinh
    const [selectedNS, setSelectedNS] = useState("");
    const [soTienThuongNong, setSoTienThuongNong] = useState("");
    const [noiDungThuongNong, setNoiDungThuongNong] = useState("");
    const [isSavingNong, setIsSavingNong] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // State cho Quản lý thưởng phát sinh đã nhập
    const [selectedManageNS, setSelectedManageNS] = useState<ThuongData | undefined>(undefined);
    const [editingPhieuId, setEditingPhieuId] = useState<number | undefined>(undefined);
    const [editSoTien, setEditSoTien] = useState("");
    const [editNoiDung, setEditNoiDung] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const [isSaved, setIsSaved] = useState(false);
    const [showConfirmLockModal, setShowConfirmLockModal] = useState(false);
    const [showConfirmUnlockModal, setShowConfirmUnlockModal] = useState(false);

    const fetchData = async (currentNgayLe = ngayLeText) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/tai-chinh/thuong?month=${month}&year=${year}&ngayLeText=${encodeURIComponent(currentNgayLe)}`);
            const result = await res.json();
            if (result && result.results) {
                setData(result.results);
                setIsSaved(result.isSaved || false);
            } else if (Array.isArray(result)) {
                setData(result);
                setIsSaved(false);
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu thưởng:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLockThuong = () => {
        if (data.length === 0 || isSaved) return;
        setShowConfirmLockModal(true);
    };

    const executeLockThuong = async () => {
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
                setAlert({ message: `Đã chốt bảng thưởng tháng ${month}/${year} thành công!`, type: "success" });
                setIsSaved(true);
            } else {
                setAlert({ message: result.error || "Có lỗi xảy ra khi chốt bảng thưởng.", type: "error" });
            }
        } catch (error) {
            console.error("Lỗi khi chốt thưởng:", error);
            setAlert({ message: "Không thể kết nối đến máy chủ.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleUnlockThuong = () => {
        setShowConfirmUnlockModal(true);
    };

    const executeUnlockThuong = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/tai-chinh/thuong?month=${month}&year=${year}`, {
                method: "DELETE"
            });

            const result = await res.json();
            if (result.success) {
                setAlert({ message: `Đã mở chốt bảng thưởng tháng ${month}/${year} thành công!`, type: "success" });
                setIsSaved(false);
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

    const handleDeletePhieu = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa phiếu thưởng này?")) return;

        try {
            const res = await fetch(`/api/tai-chinh/thuong/${id}`, { method: "DELETE" });
            const result = await res.json();
            if (result.success) {
                setAlert({ message: "Đã xóa phiếu thưởng thành công!", type: "success" });
                if (selectedManageNS) {
                    // Cập nhật local state của modal
                    const updatedChiTiet = selectedManageNS.chi_tiet_thuong_nong?.filter(p => p.ma_phieu_thuong !== id) || [];
                    const newTotal = updatedChiTiet.reduce((acc, p) => acc + p.so_tien, 0);
                    setSelectedManageNS({
                        ...selectedManageNS,
                        chi_tiet_thuong_nong: updatedChiTiet,
                        thuong_nong: newTotal,
                        tong_thuong: selectedManageNS.tong_thuong - (selectedManageNS.chi_tiet_thuong_nong?.find(p => p.ma_phieu_thuong === id)?.so_tien || 0)
                    });
                }
                fetchData();
            } else {
                setAlert({ message: result.error || "Lỗi khi xóa.", type: "error" });
            }
        } catch (error) {
            setAlert({ message: "Lỗi kết nối.", type: "error" });
        }
    };

    const handleUpdatePhieu = async (id: number) => {
        if (!editSoTien || !editNoiDung) return;

        setIsUpdating(true);
        try {
            const res = await fetch(`/api/tai-chinh/thuong/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ so_tien: editSoTien, noi_dung: editNoiDung })
            });
            const result = await res.json();
            if (result.success) {
                setAlert({ message: "Đã cập nhật phiếu thưởng!", type: "success" });
                setEditingPhieuId(undefined);
                fetchData();
                // Cập nhật local state của modal
                if (selectedManageNS) {
                    const updatedChiTiet = selectedManageNS.chi_tiet_thuong_nong?.map(p =>
                        p.ma_phieu_thuong === id ? { ...p, so_tien: parseFloat(editSoTien), noi_dung: editNoiDung } : p
                    ) || [];
                    const newTotal = updatedChiTiet.reduce((acc, p) => acc + p.so_tien, 0);
                    setSelectedManageNS({
                        ...selectedManageNS,
                        chi_tiet_thuong_nong: updatedChiTiet,
                        thuong_nong: newTotal
                    });
                }
            } else {
                setAlert({ message: result.error || "Lỗi khi cập nhật.", type: "error" });
            }
        } catch (error) {
            setAlert({ message: "Lỗi kết nối.", type: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        // Load ngày lễ đã lưu từ localStorage để giữ lại trạng thái khi F5 hoặc đổi tháng
        const savedNgayLe = typeof window !== 'undefined' ? (localStorage.getItem(`ngayLe_${month}_${year}`) || "") : "";
        setNgayLeText(savedNgayLe);
        fetchData(savedNgayLe);
    }, [month, year]);

    const handleCancelNgayLe = () => {
        const savedNgayLe = typeof window !== 'undefined' ? (localStorage.getItem(`ngayLe_${month}_${year}`) || "") : "";
        setNgayLeText(savedNgayLe);
        setShowNgayLeModal(false);
    };

    const filteredData = data.filter(item => {
        const matchesSearch = item.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.chuc_vu.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Nếu là giáo viên, chỉ hiện nếu có thưởng hoặc đang tìm kiếm cụ thể
        if (item.isTeacher) {
            return item.tong_thuong > 0 || searchTerm !== "";
        }

        return true;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, month, year]);

    const totalHoaHong = data.reduce((acc, curr) => acc + curr.tien_hoa_hong, 0);
    const totalChuyenCan = data.reduce((acc, curr) => acc + curr.thuong_chuyen_can, 0);

    // Tìm định mức ngày công của tháng (lấy từ nhân sự hành chính đầu tiên)
    const sampleOfficeStaff = data.find(item => !item.isTeacher && item.chi_tiet_cong.has_data);
    const requiredWorkingDays = sampleOfficeStaff?.chi_tiet_cong.required_days || 0;

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
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
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                            ))}
                        </select>
                        <select
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="bg-transparent font-bold text-slate-700 outline-none p-1"
                        >
                            {Array.from({ length: 5 }, (_, i) => (
                                <option key={i} value={new Date().getFullYear() - 2 + i}>{new Date().getFullYear() - 2 + i}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setShowNgayLeModal(true)}
                        className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg shadow-sm border transition-all active:scale-95 ${ngayLeText ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                    >
                        <FaCalendarAlt className={ngayLeText ? "text-orange-500" : "text-blue-500"} />
                        <span>Nhập ngày lễ/tết {ngayLeText && '(Đã nhập)'}</span>
                    </button>

                    <button
                        onClick={() => fetchData()}
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
                            disabled={isSaved}
                            className={`flex items-center gap-2 px-6 py-3 font-bold rounded-lg transition-all ${isSaved
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed opacity-70"
                                : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200 active:scale-95 cursor-pointer"
                                }`}
                        >
                            {isSaved ? <FaLock /> : <FaFire />}
                            <span>Thêm phiếu thưởng</span>
                        </button>
                        {isSaved ? (
                            <button
                                onClick={handleUnlockThuong}
                                disabled={isSaving || data.length === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 shadow-sm min-w-[220px] justify-center cursor-pointer"
                            >
                                <FaEdit />
                                <span>{isSaving ? 'Đang xử lý...' : 'Chỉnh sửa bảng thưởng'}</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleLockThuong}
                                disabled={isSaving || data.length === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 shadow-sm min-w-[220px] justify-center cursor-pointer"
                            >
                                <FaSave className={isSaving ? 'animate-pulse' : ''} />
                                <span>{isSaving ? 'Đang xử lý...' : 'Chốt bảng thưởng'}</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-sm font-bold tracking-wider border-b border-slate-100">
                                <th className="sticky left-0 z-20 bg-slate-50 py-3 px-3 pl-3 whitespace-nowrap border-r border-slate-100 w-[80px] min-w-[80px]">Mã NS</th>
                                <th className="sticky left-[80px] z-20 bg-slate-50 py-3 px-4 whitespace-nowrap border-r border-slate-100 min-w-[180px]">Họ tên</th>
                                <th className="py-3 px-4 whitespace-nowrap border-r border-slate-100">Chức vụ</th>
                                <th className="py-3 px-4 text-right whitespace-nowrap border-r border-slate-100">Doanh số thu</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap border-r border-slate-100">% Hoa hồng</th>
                                <th className="py-3 px-4 text-right whitespace-nowrap border-r border-slate-100">Tiền hoa hồng</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap border-r border-slate-100">Chuyên cần</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap border-r border-slate-100 text-orange-600">Thưởng phát sinh</th>
                                <th className="py-3 px-4 text-right pr-4 whitespace-nowrap border-r border-slate-100">Tổng cộng</th>
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
                                    <tr key={`${item.isTeacher ? 'GV' : 'NS'}-${item.ma_nhan_su}`} className="hover:bg-slate-50 transition-colors group">
                                        <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 py-1 px-3 pl-3 font-mono text-sm text-blue-600 font-[500] whitespace-nowrap border-r border-slate-100 w-[80px] min-w-[80px]">{item.isTeacher ? 'GV' : 'NS'}-{item.ma_nhan_su}</td>
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
                                                    <span className="text-xs text-slate-400 font-medium">{formatCurrency(item.tien_chuyen_can)}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-red-600 text-xs font-bold px-2 py-0.5 bg-red-50 rounded-full uppercase">KHÔNG ĐẠT</span>
                                                    {!item.chi_tiet_cong.has_data ? (
                                                        <span className="text-xs text-slate-400 italic">Chưa có dữ liệu công</span>
                                                    ) : (
                                                        <div className="flex flex-col items-center text-xs text-red-400 font-medium leading-tight">
                                                            {item.chi_tiet_cong.so_ngay_cong < item.chi_tiet_cong.required_days && <span>Thiếu công: {item.chi_tiet_cong.so_ngay_cong}/{item.chi_tiet_cong.required_days}</span>}
                                                            {item.chi_tiet_cong.di_muon > 0 && <span>Muộn: {item.chi_tiet_cong.di_muon} lần</span>}
                                                            {item.chi_tiet_cong.ve_som > 0 && <span>Sớm: {item.chi_tiet_cong.ve_som} lần</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td
                                            className="py-2 px-4 text-right font-bold text-orange-600 whitespace-nowrap border-r border-slate-100 relative group/tooltip cursor-pointer hover:bg-orange-50 transition-colors"
                                            onClick={() => setSelectedManageNS(item)}
                                        >
                                            {item.thuong_nong > 0 ? formatCurrency(item.thuong_nong) : formatCurrency(0)}

                                            {item.chi_tiet_thuong_nong && item.chi_tiet_thuong_nong.length > 0 && (
                                                <div className={`absolute ${index < 3 ? 'top-full mt-1' : 'bottom-full mb-1'} right-0 hidden group-hover/tooltip:block z-[100] min-w-[220px] max-w-[320px]`}>
                                                    <div className="bg-white text-slate-800 p-3 rounded-xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
                                                        <p className="text-sm font-bold text-gray-600 mb-2 border-b border-slate-100 pb-1">Chi tiết thưởng phát sinh</p>
                                                        <div className="space-y-2">
                                                            {item.chi_tiet_thuong_nong.map((detail, idx) => (
                                                                <div key={idx} className="flex flex-col gap-0.5">
                                                                    <div className="flex justify-between items-start gap-4">
                                                                        <span className="text-sm text-slate-500 leading-tight font-medium">{detail.noi_dung}</span>
                                                                        <span className="text-sm font-bold text-orange-600 whitespace-nowrap">{formatCurrency(detail.so_tien)}</span>
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
                                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === number ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-500 hover:text-blue-600 shadow-sm cursor-pointer'}`}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold transition-all ${currentPage === totalPages ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white text-slate-600 hover:border-blue-500 hover:text-blue-600 shadow-sm cursor-pointer'}`}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bảng điều hướng nhanh khi đã chốt thưởng */}
            {isSaved && (
                <div className="mt-6 p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 rounded-[8px] flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-sm text-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[8px] bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 shrink-0">
                            <FaCheck size={20} className="animate-bounce" />
                        </div>
                        <div>
                            <h4 className="text-emerald-800 font-bold text-lg">Bảng thưởng tháng {month}/{year} đã được chốt thành công!</h4>
                            <p className="text-slate-500 text-sm font-medium">Bạn có thể tiếp tục chuyển sang bước tính lương hoặc quay lại kiểm tra công.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                        <Link
                            href="/dashboard/tai-chinh/bang-luong"
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-[8px] hover:shadow-lg hover:shadow-blue-200 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95 text-sm"
                        >
                            <span>Tính lương</span> <FaArrowLeft className="rotate-180 text-blue-200" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Bảng điều hướng khi CHƯA chốt thưởng — nhắc kiểm tra chấm công trước */}
            {!isSaved && data.length > 0 && (
                <div className="mt-6 p-5 bg-gradient-to-r from-blue-500/8 via-indigo-500/8 to-purple-500/8 border border-blue-200/60 rounded-[8px] flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 text-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[8px] bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                            <FaCalendarAlt size={20} />
                        </div>
                        <div>
                            <h4 className="text-blue-800 font-bold text-base">Cần kiểm tra chấm công trước khi chốt thưởng?</h4>
                            <p className="text-slate-500 text-sm font-medium mt-0.5">Dữ liệu chuyên cần được tính dựa trên bảng chấm công của tháng {month}/{year}.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                        <Link
                            href="/dashboard/tai-chinh/cham-cong"
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-blue-200 text-blue-700 font-bold rounded-[8px] hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all active:scale-95 text-sm shadow-sm"
                        >
                            <FaCalendarAlt size={14} /> <span>Xem bảng chấm công</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Modal Thưởng Phát Sinh */}
            {showThuongNongModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-900">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-xl">
                                    <FaFire />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Tạo phiếu thưởng</h3>
                            </div>
                            <button onClick={() => setShowThuongNongModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
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
                                    <option value="">-- Chọn nhân sự --</option>
                                    <optgroup label="Nhân sự / Staff">
                                        {data.filter(ns => !ns.isTeacher).map(ns => (
                                            <option key={`NS_${ns.ma_nhan_su}`} value={ns.ma_nhan_su}>
                                                {ns.ho_ten} - {ns.chuc_vu}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Giáo viên / Teacher">
                                        {data.filter(ns => ns.isTeacher).map(gv => (
                                            <option key={`GV_${gv.ma_nhan_su}`} value={`GV_${gv.ma_nhan_su}`}>
                                                {gv.ho_ten} - {gv.chuc_vu}
                                            </option>
                                        ))}
                                    </optgroup>
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
                                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveThuongNong}
                                disabled={isSavingNong}
                                className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all active:scale-95 disabled:bg-slate-400 cursor-pointer"
                            >
                                {isSavingNong ? 'Đang xử lý...' : 'Xác nhận thưởng'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Quản Lý Thưởng Phát Sinh */}
            {selectedManageNS && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-900">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl">
                                    <FaAward />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Quản lý thưởng phát sinh</h3>
                                        {isSaved && (
                                            <span className="text-xs font-bold px-2 py-0.5 bg-red-50 text-red-600 rounded-full border border-red-100 flex items-center gap-1">
                                                <FaLock size={10} /> Đã khóa
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">{selectedManageNS.ho_ten} - Tháng {month}/{year}</p>
                                </div>
                            </div>
                            <button onClick={() => { setSelectedManageNS(undefined); setEditingPhieuId(undefined); }} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {(!selectedManageNS.chi_tiet_thuong_nong || selectedManageNS.chi_tiet_thuong_nong.length === 0) ? (
                                <div className="py-12 text-center">
                                    <p className="text-slate-400 italic">Nhân sự này chưa có phiếu thưởng phát sinh nào trong tháng.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedManageNS.chi_tiet_thuong_nong.map((phieu) => (
                                        <div key={phieu.ma_phieu_thuong} className={`p-4 rounded-xl border transition-all ${editingPhieuId === phieu.ma_phieu_thuong ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}>
                                            {editingPhieuId === phieu.ma_phieu_thuong ? (
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-sm font-bold text-slate-500 ml-1">Số tiền</label>
                                                            <input
                                                                type="number"
                                                                value={editSoTien}
                                                                onChange={(e) => setEditSoTien(e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-blue-700"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-sm font-bold text-slate-500 ml-1">Nội dung</label>
                                                            <input
                                                                type="text"
                                                                value={editNoiDung}
                                                                onChange={(e) => setEditNoiDung(e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end gap-2 pt-2">
                                                        <button
                                                            onClick={() => setEditingPhieuId(undefined)}
                                                            className="px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdatePhieu(phieu.ma_phieu_thuong)}
                                                            disabled={isUpdating}
                                                            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:bg-slate-400"
                                                        >
                                                            <FaCheck size={12} />
                                                            <span>Lưu</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex justify-between items-center gap-4">
                                                    <div className="flex-1">
                                                        <p className="font-bold text-slate-800">{phieu.noi_dung}</p>
                                                        <p className="text-lg font-[600] text-orange-600">{formatCurrency(phieu.so_tien)}</p>
                                                    </div>
                                                    {isSaved ? (
                                                        <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg flex items-center gap-1.5 border border-slate-200">
                                                            <FaLock size={10} /> Đã khóa
                                                        </span>
                                                    ) : (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingPhieuId(phieu.ma_phieu_thuong);
                                                                    setEditSoTien(phieu.so_tien.toString());
                                                                    setEditNoiDung(phieu.noi_dung);
                                                                }}
                                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Sửa"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePhieu(phieu.ma_phieu_thuong)}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Xóa"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 text-right">
                            <div className="flex justify-between items-center mb-4 px-2">
                                <span className="font-bold text-slate-500 text-lg">Tổng thưởng phát sinh hiện tại:</span>
                                <span className="text-xl font-[700] text-blue-700">{formatCurrency(selectedManageNS.thuong_nong)}</span>
                            </div>
                            <button
                                onClick={() => { setSelectedManageNS(undefined); setEditingPhieuId(undefined); }}
                                className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-sm cursor-pointer"
                            >
                                Đóng
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
            {/* Manage Nhập Ngày Lễ Modal */}
            {showNgayLeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-500" />
                                Cập nhật ngày lễ / Tết
                            </h3>
                            <button onClick={handleCancelNgayLe} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Các ngày lễ trong tháng {month}/{year}
                                </label>
                                <input
                                    type="text"
                                    placeholder="VD: 30/4, 1/5 hoặc 30, 1"
                                    value={ngayLeText}
                                    onChange={(e) => setNgayLeText(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                />
                                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                                    Nhập các ngày lễ cách nhau bởi dấu phẩy.<br />Hệ thống sẽ tự động loại trừ các ngày rơi vào Chủ Nhật.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
                            <button
                                onClick={handleCancelNgayLe}
                                className="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem(`ngayLe_${month}_${year}`, ngayLeText);
                                    }
                                    fetchData(ngayLeText);
                                    setShowNgayLeModal(false);
                                }}
                                className="px-6 py-2.5 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xác nhận Chốt bảng thưởng */}
            {showConfirmLockModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 text-center text-slate-900">
                            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 mx-auto mb-4 text-amber-500">
                                <FaExclamationTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Chốt bảng thưởng chính thức</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Bạn có chắc chắn muốn <span className="font-bold text-slate-700">CHỐT</span> bảng thưởng tháng <span className="font-bold text-blue-600">{month}/{year}</span>? Sau khi chốt, dữ liệu sẽ được lưu chính thức và không thể chỉnh sửa.
                            </p>
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmLockModal(false)}
                                className="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all active:scale-95 cursor-pointer"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmLockModal(false);
                                    executeLockThuong();
                                }}
                                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95 cursor-pointer"
                            >
                                Xác nhận chốt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xác nhận Mở chốt bảng thưởng */}
            {showConfirmUnlockModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 text-center text-slate-900">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100 mx-auto mb-4 text-red-500 animate-pulse">
                                <FaExclamationTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Chỉnh sửa bảng thưởng đã chốt</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Bạn có chắc chắn muốn <span className="font-bold text-red-600">CHỈNH SỬA</span> bảng thưởng tháng <span className="font-bold text-blue-600">{month}/{year}</span>? Để chỉnh sửa dữ liệu và tính toán lại, hệ thống sẽ tạm thời mở khóa bảng thưởng này.
                            </p>
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmUnlockModal(false)}
                                className="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all active:scale-95 cursor-pointer"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmUnlockModal(false);
                                    executeUnlockThuong();
                                }}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-red-200 active:scale-95 cursor-pointer"
                            >
                                Xác nhận chỉnh sửa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}