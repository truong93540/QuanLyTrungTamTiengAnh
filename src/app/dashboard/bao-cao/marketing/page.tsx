'use client'
import { useState, useEffect, useMemo } from 'react'
import { 
    FaChartPie, FaCalendarAlt, FaMoneyBillWave, FaBullhorn, FaUsers, 
    FaSearch, FaChevronDown, FaChevronUp, FaCheckCircle, FaTimes, 
    FaInfoCircle, FaClock 
} from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface NhanSu { ma_nhan_su: number; ho_ten: string }
interface PhanCong { vai_tro: string; nhan_su: NhanSu }
interface ChuongTrinh {
    ma_chuong_trinh_marketing: number;
    ten_chuong_trinh_marketing: string;
    ngan_sach: number;
    ngay_bat_dau: string;
    ngay_ket_thuc: string;
    noi_dung?: string;
    phan_cong: PhanCong[];
}

// Bổ sung thêm 'ngan_sach' vào các loại Modal
type ModalType = 'chuong_trinh' | 'nhan_su' | 'ngan_sach' | null;

export default function BaoCaoMarketingPage() {
    const [data, setData] = useState<ChuongTrinh[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedMonth, setSelectedMonth] = useState('all')

    const [searchNhanSu, setSearchNhanSu] = useState('')
    const [expandedNhanSu, setExpandedNhanSu] = useState<number | null>(null)

    // State quản lý Modal
    const [activeModal, setActiveModal] = useState<ModalType>(null)
    const [expandedModalItem, setExpandedModalItem] = useState<number | null>(null)

    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Chưa rõ';
        return new Date(dateString).toLocaleDateString('vi-VN');
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const res = await fetch(`/api/tuyen-sinh/bao-cao?nam=${selectedYear}`)
                if (res.ok) setData(await res.json())
            } catch (error) {
                console.error("Lỗi fetch data")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [selectedYear])

    const filteredData = useMemo(() => {
        if (selectedMonth === 'all') return data;
        return data.filter(item => new Date(item.ngay_bat_dau).getMonth() + 1 === Number(selectedMonth));
    }, [data, selectedMonth]);

    // 1. Chỉ số tổng quan
    const tongChuongTrinh = filteredData.length;
    const tongNganSach = filteredData.reduce((sum, item) => sum + Number(item.ngan_sach || 0), 0);
    const danhSachNhanSuUnique = new Set(filteredData.flatMap(item => item.phan_cong.map(pc => pc.nhan_su.ma_nhan_su)));
    const tongNhanSuThamGia = danhSachNhanSuUnique.size;

    // 2. Dữ liệu Biểu đồ
    const chartData = useMemo(() => {
        const months = Array.from({ length: 12 }, (_, i) => ({
            name: `Tháng ${i + 1}`,
            monthNum: i + 1,
            ngan_sach: 0,
            so_chuong_trinh: 0
        }));

        data.forEach(item => {
            const m = new Date(item.ngay_bat_dau).getMonth();
            months[m].ngan_sach += Number(item.ngan_sach || 0);
            months[m].so_chuong_trinh += 1;
        });
        return months;
    }, [data]);

    // 3. Dữ liệu Nhân sự tham gia
    const baseNhanSuStats = useMemo(() => {
        const stats: Record<number, { ma_nhan_su: number, ho_ten: string, programs: { ten: string, vai_tro: string }[] }> = {};
        filteredData.forEach(ct => {
            ct.phan_cong.forEach(pc => {
                if (!stats[pc.nhan_su.ma_nhan_su]) {
                    stats[pc.nhan_su.ma_nhan_su] = { ma_nhan_su: pc.nhan_su.ma_nhan_su, ho_ten: pc.nhan_su.ho_ten, programs: [] };
                }
                stats[pc.nhan_su.ma_nhan_su].programs.push({
                    ten: ct.ten_chuong_trinh_marketing,
                    vai_tro: pc.vai_tro
                });
            });
        });
        return Object.values(stats);
    }, [filteredData]);

    const nhanSuStats = useMemo(() => {
        if (searchNhanSu.trim() !== '') return baseNhanSuStats.filter(ns => ns.ho_ten.toLowerCase().includes(searchNhanSu.toLowerCase()));
        return baseNhanSuStats;
    }, [baseNhanSuStats, searchNhanSu]);

    const handleCloseModal = () => {
        setActiveModal(null);
        setExpandedModalItem(null);
    }

    // Giao diện custom Tooltip cho Biểu đồ
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 p-3 shadow-lg rounded-md outline-none">
                    <p className="text-gray-400 font-medium text-sm mb-1">{label}</p>
                    <p className="text-[#0d9488] font-bold text-sm">
                        chi_phí : {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen p-6 relative">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-[#1d4ed8] p-2.5 rounded-lg text-white">
                        <FaChartPie size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Báo cáo thống kê Marketing</h1>
                        <p className="text-sm text-gray-500">Biểu đồ, phân tích ngân sách và hiệu suất nhân sự</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white border border-gray-200 p-1.5 rounded-md shadow-sm">
                    <FaCalendarAlt className="text-gray-400 ml-2" />
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="text-sm font-medium outline-none text-gray-700 bg-transparent border-r pr-2">
                        <option value="all">Cả năm</option>
                        {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>)}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="text-sm font-medium outline-none text-gray-700 bg-transparent px-2">
                        {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Đang tải dữ liệu báo cáo...</div>
            ) : (
                <>
                    {/* THẺ TỔNG QUAN (CÓ CLICK MỞ MODAL) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                        {/* Ngân sách */}
                        <div onClick={() => setActiveModal('ngan_sach')} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-green-300 hover:shadow-md transition-all group">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-hover:text-green-600 transition-colors">Tổng ngân sách chi <span className="lowercase font-normal text-xs text-green-500 ml-1"></span></p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(tongNganSach)}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors"><FaMoneyBillWave size={24} /></div>
                        </div>
                        {/* Chương trình Marketing */}
                        <div onClick={() => setActiveModal('chuong_trinh')} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-hover:text-blue-600 transition-colors">Số lượng chiến dịch <span className="lowercase font-normal text-xs text-blue-500 ml-1"></span></p>
                                <p className="text-2xl font-bold text-gray-900">{tongChuongTrinh} <span className="text-sm font-normal text-gray-500 lowercase">chương trình</span></p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg text-[#1d4ed8] group-hover:bg-[#1d4ed8] group-hover:text-white transition-colors"><FaBullhorn size={24} /></div>
                        </div>
                        {/* Nhân sự */}
                        <div onClick={() => setActiveModal('nhan_su')} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-purple-300 hover:shadow-md transition-all group">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-hover:text-purple-600 transition-colors">Nhân sự tham gia <span className="lowercase font-normal text-xs text-purple-500 ml-1"></span></p>
                                <p className="text-2xl font-bold text-gray-900">{tongNhanSuThamGia} <span className="text-sm font-normal text-gray-500 lowercase">người</span></p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"><FaUsers size={24} /></div>
                        </div>
                    </div>

                    {/* BIỂU ĐỒ VỚI HIỆU ỨNG HOVER CHUẨN */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-base font-bold text-gray-800">Biểu đồ Ngân sách Marketing ({selectedYear})</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="w-3 h-3 rounded-full bg-[#0d9488]"></span> Ngân sách chi tiêu
                            </div>
                        </div>
                        <div className="h-[250px] min-h-[250px] w-full bg-white">
                            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                    <YAxis tickFormatter={(val: any) => `${Number(val || 0) / 1000000}M`} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    
                                    {/* Sử dụng Custom Tooltip và nền xám khi Hover */}
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    
                                    <Bar dataKey="ngan_sach" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* GRID BẢNG CHI TIẾT & NHÂN SỰ BÊN DƯỚI */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-gray-100">
                                <h3 className="text-base font-bold text-gray-800">Chi tiết ngân sách các tháng trong năm</h3>
                            </div>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 font-bold">
                                    <tr>
                                        <th className="px-5 py-4">Thời gian</th>
                                        <th className="px-5 py-4 text-center">Số chương trình</th>
                                        <th className="px-5 py-4 text-right">Tổng ngân sách</th>
                                        <th className="px-5 py-4 text-center">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chartData.map((row, idx) => (
                                        <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="px-5 py-4 font-bold text-gray-800">{row.name}</td>
                                            <td className="px-5 py-4 text-center font-medium text-gray-600">{row.so_chuong_trinh}</td>
                                            <td className="px-5 py-4 text-right font-bold text-[#0d9488]">
                                                {row.ngan_sach > 0 ? formatCurrency(row.ngan_sach) : '0 ₫'}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                {row.so_chuong_trinh > 0 
                                                    ? <span className="px-2.5 py-1 bg-teal-100 text-teal-700 rounded-md text-xs font-bold">Đã chi</span>
                                                    : <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-md text-xs font-bold">Chưa phát sinh</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-[600px]">
                            <div className="p-5 border-b border-gray-100 pb-4">
                                <h3 className="text-base font-bold text-gray-800 mb-4">
                                    Hiệu suất nhân sự {selectedMonth !== 'all' ? `(Tháng ${selectedMonth})` : ''}
                                </h3>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FaSearch size={14} /></span>
                                    <input 
                                        type="text" placeholder="Gõ tên nhân sự..." value={searchNhanSu} onChange={(e) => setSearchNhanSu(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm outline-none focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] transition bg-gray-50 text-gray-800 font-medium placeholder-gray-400"
                                    />
                                </div>
                            </div>
                            <div className="p-5 pt-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar bg-gray-50/30">
                                {nhanSuStats.length === 0 ? <div className="text-center text-gray-400 italic py-10 text-sm">Không tìm thấy nhân sự phù hợp</div> : nhanSuStats.map((ns) => (
                                    <div key={ns.ma_nhan_su} className={`border rounded-lg overflow-hidden transition-all shadow-sm ${expandedNhanSu === ns.ma_nhan_su ? 'border-blue-300 ring-1 ring-blue-100 bg-white' : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                                        <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-blue-50/50 transition" onClick={() => setExpandedNhanSu(expandedNhanSu === ns.ma_nhan_su ? null : ns.ma_nhan_su)}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-sm border border-white shrink-0">{ns.ho_ten.charAt(0)}</div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">{ns.ho_ten}</h4>
                                                    <p className="text-xs text-gray-500 font-medium mt-0.5 bg-gray-100 px-2 py-0.5 rounded-full inline-block">Tham gia {ns.programs.length} chiến dịch</p>
                                                </div>
                                            </div>
                                            <div className={`text-gray-400 transition-transform ${expandedNhanSu === ns.ma_nhan_su ? 'text-blue-600' : ''}`}>{expandedNhanSu === ns.ma_nhan_su ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}</div>
                                        </div>
                                        {expandedNhanSu === ns.ma_nhan_su && (
                                            <div className="p-4 bg-[#f8fafc] border-t border-gray-100 animate-fade-in-up">
                                                <div className="space-y-4">
                                                    {ns.programs.map((prog, i) => (
                                                        <div key={i} className="flex gap-3 relative">
                                                            <div className="flex flex-col items-center shrink-0">
                                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm mt-1 z-10 border-2 border-white"></div>
                                                                {i !== ns.programs.length - 1 && <div className="w-[1.5px] h-full bg-blue-200 absolute top-3.5 left-[4.5px]"></div>}
                                                            </div>
                                                            <div className="pb-1 w-full">
                                                                <p className="text-sm font-bold text-gray-800 leading-tight mb-1">{prog.ten}</p>
                                                                <div className="bg-white border border-gray-200 p-2.5 rounded-md shadow-sm"><p className="text-xs text-gray-600 flex items-center gap-1.5 font-medium"><FaCheckCircle className="text-green-500" size={12} /> Vai trò: <span className="text-gray-900 font-bold">{prog.vai_tro || 'Chưa rõ'}</span></p></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* =========================================
                MODAL CHI TIẾT TỪ CÁC THẺ TỔNG QUAN
            ========================================= */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-fade-in-up border border-gray-200 overflow-hidden">
                        
                        {/* HEADER MODAL */}
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50/80">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                {activeModal === 'chuong_trinh' && <><FaBullhorn className="text-blue-600"/> Chi tiết Chương trình Marketing</>}
                                {activeModal === 'nhan_su' && <><FaUsers className="text-purple-600"/> Chi tiết Nhân sự tham gia</>}
                                {activeModal === 'ngan_sach' && <><FaMoneyBillWave className="text-green-600"/> Chi tiết Tổng ngân sách chi</>}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><FaTimes size={20} /></button>
                        </div>

                        {/* BODY MODAL */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30">
                            
                            {/* --- CONTENT 1: NGÂN SÁCH --- */}
                            {activeModal === 'ngan_sach' && (
                                <div className="space-y-4">
                                    <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex justify-between items-center shadow-sm mb-4">
                                        <span className="font-bold text-green-800 text-sm uppercase">Tổng ngân sách đã chi:</span>
                                        <span className="text-xl font-bold text-green-700">{formatCurrency(tongNganSach)}</span>
                                    </div>
                                    
                                    {filteredData.length === 0 ? <p className="text-center text-gray-500 italic">Không có dữ liệu chi phí</p> : filteredData.map(ct => (
                                        <div key={ct.ma_chuong_trinh_marketing} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-green-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-green-100 text-green-700 p-3 rounded-lg shrink-0"><FaMoneyBillWave size={20}/></div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-base">{ct.ten_chuong_trinh_marketing}</h3>
                                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                        <FaClock className="text-gray-400"/> {formatDate(ct.ngay_bat_dau)} - {formatDate(ct.ngay_ket_thuc)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right bg-green-50/50 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                                                <span className="block text-xs text-gray-500 font-bold uppercase mb-0.5">Mức chi</span>
                                                <span className="font-bold text-green-600 text-lg">{formatCurrency(ct.ngan_sach)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* --- CONTENT 2: CHƯƠNG TRÌNH MARKETING --- */}
                            {activeModal === 'chuong_trinh' && (
                                <div className="space-y-4">
                                    {filteredData.length === 0 ? <p className="text-center text-gray-500 italic">Không có dữ liệu</p> : filteredData.map(ct => (
                                        <div key={ct.ma_chuong_trinh_marketing} className={`bg-white border rounded-xl shadow-sm transition-all overflow-hidden ${expandedModalItem === ct.ma_chuong_trinh_marketing ? 'border-blue-400 ring-1 ring-blue-100' : 'border-gray-200 hover:border-blue-200'}`}>
                                            <div onClick={() => setExpandedModalItem(expandedModalItem === ct.ma_chuong_trinh_marketing ? null : ct.ma_chuong_trinh_marketing)} className="flex justify-between items-center p-4 cursor-pointer hover:bg-blue-50/30">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-blue-100 text-blue-700 p-3 rounded-lg"><FaBullhorn size={20}/></div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-base">{ct.ten_chuong_trinh_marketing}</h3>
                                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                            <FaClock className="text-blue-400"/> {formatDate(ct.ngay_bat_dau)} - {formatDate(ct.ngay_ket_thuc)}
                                                            <span className="text-gray-300">|</span> 
                                                            <FaMoneyBillWave className="text-green-500"/> <span className="font-bold text-green-600">{formatCurrency(ct.ngan_sach)}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-gray-400">{expandedModalItem === ct.ma_chuong_trinh_marketing ? <FaChevronUp /> : <FaChevronDown />}</div>
                                            </div>
                                            {expandedModalItem === ct.ma_chuong_trinh_marketing && (
                                                <div className="p-5 border-t border-gray-100 bg-[#f8fafc] animate-fade-in-up">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5"><FaInfoCircle className="text-blue-400"/> Nội dung chi tiết</p>
                                                                <p className="font-medium text-gray-800 bg-white p-3 rounded-md border border-gray-200 leading-relaxed">{ct.noi_dung || 'Không có mô tả nội dung.'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5"><FaUsers className="text-purple-400"/> Đội ngũ nhân sự ({ct.phan_cong.length})</p>
                                                                <div className="bg-white p-3 rounded-md border border-gray-200 max-h-40 overflow-y-auto space-y-2">
                                                                    {ct.phan_cong.length > 0 ? ct.phan_cong.map((pc, i) => (
                                                                        <div key={i} className="flex flex-col pb-2 mb-2 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
                                                                            <span className="font-bold text-gray-800">{pc.nhan_su.ho_ten}</span>
                                                                            <span className="text-xs text-gray-500 font-medium mt-0.5">Vai trò: <span className="text-gray-700">{pc.vai_tro || 'N/A'}</span></span>
                                                                        </div>
                                                                    )) : <p className="italic text-gray-500">Chưa phân công nhân sự</p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* --- CONTENT 3: NHÂN SỰ --- */}
                            {activeModal === 'nhan_su' && (
                                <div className="space-y-4">
                                    {baseNhanSuStats.length === 0 ? <p className="text-center text-gray-500 italic">Không có dữ liệu</p> : baseNhanSuStats.map(ns => (
                                        <div key={ns.ma_nhan_su} className={`bg-white border rounded-xl shadow-sm transition-all overflow-hidden ${expandedModalItem === ns.ma_nhan_su ? 'border-purple-400 ring-1 ring-purple-100' : 'border-gray-200 hover:border-purple-200'}`}>
                                            <div onClick={() => setExpandedModalItem(expandedModalItem === ns.ma_nhan_su ? null : ns.ma_nhan_su)} className="flex justify-between items-center p-4 cursor-pointer hover:bg-purple-50/30">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 flex items-center justify-center font-bold text-lg shadow-sm border border-white">{ns.ho_ten.charAt(0)}</div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-base">{ns.ho_ten}</h3>
                                                        <p className="text-sm text-gray-500 mt-0.5">Đã tham gia <span className="font-bold text-purple-600">{ns.programs.length}</span> chiến dịch</p>
                                                    </div>
                                                </div>
                                                <div className="text-gray-400">{expandedModalItem === ns.ma_nhan_su ? <FaChevronUp /> : <FaChevronDown />}</div>
                                            </div>
                                            {expandedModalItem === ns.ma_nhan_su && (
                                                <div className="p-5 border-t border-gray-100 bg-[#f8fafc] animate-fade-in-up">
                                                    <p className="text-xs font-bold text-gray-500 uppercase mb-3">Các chiến dịch tham gia:</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {ns.programs.map((prog, i) => (
                                                            <div key={i} className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                                                                <p className="text-sm font-bold text-gray-800 mb-1 flex items-start gap-1.5"><FaBullhorn className="text-blue-500 mt-0.5 shrink-0"/> {prog.ten}</p>
                                                                <p className="text-xs text-gray-600 font-medium ml-5 bg-gray-50 inline-block px-2 py-1 rounded">Vai trò: <span className="font-bold text-gray-900">{prog.vai_tro || 'N/A'}</span></p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}