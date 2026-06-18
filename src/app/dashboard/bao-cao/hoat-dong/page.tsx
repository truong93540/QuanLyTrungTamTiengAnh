'use client'
import { useState, useEffect, useMemo } from 'react'
import { 
    FaChartBar, FaCalendarAlt, FaMoneyBillWave, FaRunning, FaChalkboardTeacher, 
    FaUsers, FaSearch, FaChevronDown, FaChevronUp, FaCheckCircle, FaUserGraduate,
    FaTimes, FaMapMarkerAlt, FaInfoCircle, FaClock
} from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface LopHoc { ma_lop_hoc: number; ten_lop: string }
interface ThamGiaLop { lop_hoc: LopHoc }
interface HocVien { ma_hoc_vien: number; ho_ten: string; tham_gia_lop: ThamGiaLop[] }
interface ThamGiaNgoaiKhoa { hoc_vien: HocVien }
interface GiaoVien { ma_giao_vien: number; ho_ten: string }
interface PhanCong { giao_vien: GiaoVien }

interface HoatDong {
    ma_hoat_dong_ngoai_khoa: number;
    ten_hoat_dong: string;
    mo_ta?: string;
    dia_diem?: string;
    chi_phi: number;
    ngay_to_chuc: string;
    phan_cong: PhanCong[];
    tham_gia_hoc_vien: ThamGiaNgoaiKhoa[];
}

type ModalType = 'hoat_dong' | 'giao_vien' | 'lop' | 'chi_phi' | null;

export default function BaoCaoHoatDongPage() {
    const [data, setData] = useState<HoatDong[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedMonth, setSelectedMonth] = useState('all')

    const [searchGiaoVien, setSearchGiaoVien] = useState('')
    const [searchLop, setSearchLop] = useState('')
    
    const [expandedGiaoVien, setExpandedGiaoVien] = useState<number | null>(null)
    const [expandedLop, setExpandedLop] = useState<number | null>(null)
    const [inputYear, setInputYear] = useState(String(new Date().getFullYear()))

    const [activeModal, setActiveModal] = useState<ModalType>(null)
    const [expandedModalItem, setExpandedModalItem] = useState<number | null>(null)

    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Chưa có';
        return new Date(dateString).toLocaleDateString('vi-VN');
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const res = await fetch(`/api/tuyen-sinh/bao-cao-hd?nam=${selectedYear}`)
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
        return data.filter(item => new Date(item.ngay_to_chuc).getMonth() + 1 === Number(selectedMonth));
    }, [data, selectedMonth]);

    const tongHoatDong = filteredData.length;
    const tongChiPhi = filteredData.reduce((sum, item) => sum + Number(item.chi_phi || 0), 0);
    const tongGiaoVien = new Set(filteredData.flatMap(item => item.phan_cong.map(pc => pc.giao_vien.ma_giao_vien))).size;
    const tongLop = new Set(filteredData.flatMap(hd => hd.tham_gia_hoc_vien.flatMap(tg => tg.hoc_vien.tham_gia_lop.map(tl => tl.lop_hoc.ma_lop_hoc)))).size;

    const chartData = useMemo(() => {
        const months = Array.from({ length: 12 }, (_, i) => ({
            name: `Tháng ${i + 1}`, monthNum: i + 1, chi_phi: 0, so_hoat_dong: 0
        }));
        data.forEach(item => {
            const m = new Date(item.ngay_to_chuc).getMonth();
            months[m].chi_phi += Number(item.chi_phi || 0);
            months[m].so_hoat_dong += 1;
        });
        return months;
    }, [data]);

    const baseGiaoVienStats = useMemo(() => {
        const stats: Record<number, { ma_giao_vien: number, ho_ten: string, activities: string[] }> = {};
        filteredData.forEach(hd => {
            hd.phan_cong.forEach(pc => {
                if (!stats[pc.giao_vien.ma_giao_vien]) {
                    stats[pc.giao_vien.ma_giao_vien] = { ma_giao_vien: pc.giao_vien.ma_giao_vien, ho_ten: pc.giao_vien.ho_ten, activities: [] };
                }
                stats[pc.giao_vien.ma_giao_vien].activities.push(hd.ten_hoat_dong);
            });
        });
        return Object.values(stats);
    }, [filteredData]);

    const giaoVienStats = useMemo(() => {
        if (searchGiaoVien.trim() !== '') return baseGiaoVienStats.filter(gv => gv.ho_ten.toLowerCase().includes(searchGiaoVien.toLowerCase()));
        return baseGiaoVienStats;
    }, [baseGiaoVienStats, searchGiaoVien]);

    const baseLopStats = useMemo(() => {
        const stats: Record<number, { lop_hoc: LopHoc, activities: string[], hoc_vien_list: HocVien[] }> = {};
        filteredData.forEach(hd => {
            hd.tham_gia_hoc_vien?.forEach(tg => {
                const hv = tg.hoc_vien;
                hv.tham_gia_lop?.forEach(tl => {
                    const lop = tl.lop_hoc;
                    if (lop) {
                        if (!stats[lop.ma_lop_hoc]) stats[lop.ma_lop_hoc] = { lop_hoc: lop, activities: [], hoc_vien_list: [] };
                        if (!stats[lop.ma_lop_hoc].activities.includes(hd.ten_hoat_dong)) stats[lop.ma_lop_hoc].activities.push(hd.ten_hoat_dong);
                        if (!stats[lop.ma_lop_hoc].hoc_vien_list.find(h => h.ma_hoc_vien === hv.ma_hoc_vien)) stats[lop.ma_lop_hoc].hoc_vien_list.push(hv);
                    }
                });
            });
        });
        return Object.values(stats);
    }, [filteredData]);

    const lopStats = useMemo(() => {
        if (searchLop.trim() !== '') {
            return baseLopStats.filter(ls => ls.lop_hoc.ten_lop.toLowerCase().includes(searchLop.toLowerCase()));
        }
        return baseLopStats;
    }, [baseLopStats, searchLop]);

    const handleCloseModal = () => {
        setActiveModal(null);
        setExpandedModalItem(null);
        setSearchLop(''); 
        setSearchGiaoVien('');
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 p-3 shadow-lg rounded-md outline-none">
                    <p className="text-gray-400 font-medium text-sm mb-1">{label}</p>
                    <p className="text-[#0d9488] font-bold text-sm">
                        chi phí : {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen p-6 relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-teal-600 p-2.5 rounded-lg text-white"><FaChartBar size={20} /></div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Báo cáo Hoạt động ngoại khóa</h1>
                        <p className="text-sm text-gray-500">Thống kê chi phí, giáo viên và lớp tham gia</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white border border-gray-200 p-1.5 rounded-md shadow-sm">
                    <FaCalendarAlt className="text-gray-400 ml-2" />
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="text-sm font-medium outline-none text-gray-700 bg-transparent border-r pr-2">
                        <option value="all">Cả năm</option>
                        {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>)}
                    </select>
                    <input
                    type="number"
                    value={inputYear}
                    onChange={(e) => {
                     setInputYear(e.target.value)
        
                            }}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                    const val = Number(inputYear)
                        if (val >= 1900 && val <= 2100) {
                        setSelectedYear(val)  
                     } else {
                        setInputYear(String(selectedYear)) 
                        }
                    }
                    }}
                    onBlur={() => {
                     const val = Number(inputYear)
                     if (val >= 1900 && val <= 2100) {
                         setSelectedYear(val)  
                    } else {
                            setInputYear(String(selectedYear)) 
                    }
                    }}
                    placeholder="Nhập năm..."
                    className="text-sm font-medium outline-none text-gray-700 bg-transparent px-2 w-[80px]"
                />
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Đang tải dữ liệu báo cáo...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                        <div onClick={() => setActiveModal('chi_phi')} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-red-300 hover:shadow-md transition-all group">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-hover:text-red-600 transition-colors">Tổng chi phí <span className="lowercase font-normal text-xs text-red-500 ml-1"></span></p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(tongChiPhi)}</p>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors"><FaMoneyBillWave size={24} /></div>
                        </div>
                        <div onClick={() => setActiveModal('hoat_dong')} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-teal-300 hover:shadow-md transition-all group">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-hover:text-teal-600 transition-colors">Hoạt động <span className="lowercase font-normal text-xs text-teal-500 ml-1"></span></p>
                                <p className="text-2xl font-bold text-gray-900">{tongHoatDong} <span className="text-sm font-normal text-gray-500">chương trình</span></p>
                            </div>
                            <div className="bg-teal-50 p-3 rounded-lg text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors"><FaRunning size={24} /></div>
                        </div>
                        <div onClick={() => setActiveModal('giao_vien')} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-orange-300 hover:shadow-md transition-all group">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-hover:text-orange-600 transition-colors">Giáo viên <span className="lowercase font-normal text-xs text-orange-500 ml-1"></span></p>
                                <p className="text-2xl font-bold text-gray-900">{tongGiaoVien} <span className="text-sm font-normal text-gray-500">người</span></p>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-lg text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors"><FaChalkboardTeacher size={24} /></div>
                        </div>
                        <div onClick={() => setActiveModal('lop')} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-hover:text-blue-600 transition-colors">Lớp tham gia <span className="lowercase font-normal text-xs text-blue-500 ml-1"></span></p>
                                <p className="text-2xl font-bold text-gray-900">{tongLop} <span className="text-sm font-normal text-gray-500">lớp</span></p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors"><FaUsers size={24} /></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-base font-bold text-gray-800">Biểu đồ Chi phí hoạt động ({selectedYear})</h3>
                        </div>
                        <div className="h-[250px] min-h-[250px] w-full bg-white">
                            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                    <YAxis tickFormatter={(val: any) => `${Number(val || 0) / 1000000}M`} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    
                                    <Bar dataKey="chi_phi" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-gray-100">
                                    <h3 className="text-base font-bold text-gray-800">Chi tiết chi phí các tháng</h3>
                                </div>
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-bold">
                                        <tr>
                                            <th className="px-5 py-4">Thời gian</th>
                                            <th className="px-5 py-4 text-center">Số hoạt động</th>
                                            <th className="px-5 py-4 text-right">Tổng chi phí</th>
                                            <th className="px-5 py-4 text-center">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chartData.map((row, idx) => (
                                            <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="px-5 py-4 font-bold text-gray-800">{row.name}</td>
                                                <td className="px-5 py-4 text-center font-medium text-gray-600">{row.so_hoat_dong}</td>
                                                <td className="px-5 py-4 text-right font-bold text-teal-600">{row.chi_phi > 0 ? formatCurrency(row.chi_phi) : '0 ₫'}</td>
                                                <td className="px-5 py-4 text-center">
                                                    {row.so_hoat_dong > 0 ? <span className="px-2.5 py-1 bg-teal-100 text-teal-700 rounded-md text-xs font-bold">Phát sinh</span> : <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-md text-xs font-bold">Chưa có</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-6">
                                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <h3 className="text-base font-bold text-gray-800 shrink-0">Lớp & Học viên tham gia {selectedMonth !== 'all' ? `(Tháng ${selectedMonth})` : ''}</h3>
                                    <div className="relative w-full sm:w-64">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FaSearch size={14} /></span>
                                        <input 
                                            type="text" 
                                            placeholder="Tìm tên lớp..." 
                                            value={searchLop} 
                                            onChange={(e) => setSearchLop(e.target.value)} 
                                            className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-gray-50 text-gray-800 font-medium" 
                                        />
                                    </div>
                                </div>
                                <div className="p-5 space-y-3 bg-gray-50/30 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {lopStats.length === 0 ? <div className="text-center text-gray-400 italic py-5 text-sm">Không tìm thấy lớp phù hợp</div> : lopStats.map((ls) => (
                                        <div key={ls.lop_hoc.ma_lop_hoc} className={`border rounded-lg overflow-hidden transition-all shadow-sm ${expandedLop === ls.lop_hoc.ma_lop_hoc ? 'border-teal-300 ring-1 ring-teal-100 bg-white' : 'border-gray-200 bg-white hover:border-teal-200'}`}>
                                            <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-teal-50/50 transition" onClick={() => setExpandedLop(expandedLop === ls.lop_hoc.ma_lop_hoc ? null : ls.lop_hoc.ma_lop_hoc)}>
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-teal-100 p-2 rounded text-teal-700"><FaUsers /></div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm">{ls.lop_hoc.ten_lop}</h4>
                                                        <p className="text-xs text-gray-500 font-medium mt-0.5">Tham gia <span className="text-teal-600 font-bold">{ls.activities.length}</span> hoạt động • <span className="font-bold">{ls.hoc_vien_list.length}</span> học viên</p>
                                                    </div>
                                                </div>
                                                <div className="text-gray-400">{expandedLop === ls.lop_hoc.ma_lop_hoc ? <FaChevronUp /> : <FaChevronDown />}</div>
                                            </div>
                                            {expandedLop === ls.lop_hoc.ma_lop_hoc && (
                                                <div className="p-4 bg-[#f8fafc] border-t border-gray-100 animate-fade-in-up">
                                                    <p className="text-xs font-bold text-gray-500 uppercase mb-3">Danh sách học viên tham gia:</p>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        {ls.hoc_vien_list.map(hv => (
                                                            <div key={hv.ma_hoc_vien} className="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                                                                <FaUserGraduate className="text-gray-400 shrink-0" size={12} />
                                                                <span className="text-sm font-medium text-gray-800 truncate" title={hv.ho_ten}>{hv.ho_ten}</span>
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

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col lg:h-[840px]">
                            <div className="p-5 border-b border-gray-100 pb-4 shrink-0">
                                <h3 className="text-base font-bold text-gray-800 mb-4">Thống kê Giáo viên {selectedMonth !== 'all' ? `(Tháng ${selectedMonth})` : ''}</h3>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FaSearch size={14} /></span>
                                    <input type="text" placeholder="Gõ tên giáo viên..." value={searchGiaoVien} onChange={(e) => setSearchGiaoVien(e.target.value)} className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition bg-gray-50 text-gray-800 font-medium" />
                                </div>
                            </div>
                            <div className="p-5 pt-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar bg-gray-50/30">
                                {giaoVienStats.length === 0 ? <div className="text-center text-gray-400 italic py-10 text-sm">Không tìm thấy giáo viên</div> : giaoVienStats.map((gv) => (
                                    <div key={gv.ma_giao_vien} className={`border rounded-lg overflow-hidden transition-all shadow-sm ${expandedGiaoVien === gv.ma_giao_vien ? 'border-orange-300 ring-1 ring-orange-100 bg-white' : 'border-gray-200 bg-white hover:border-orange-200'}`}>
                                        <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-orange-50/50 transition" onClick={() => setExpandedGiaoVien(expandedGiaoVien === gv.ma_giao_vien ? null : gv.ma_giao_vien)}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 flex items-center justify-center font-bold text-sm shadow-sm border border-white shrink-0">{gv.ho_ten.charAt(0)}</div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">{gv.ho_ten}</h4>
                                                    <p className="text-xs text-gray-500 font-medium mt-0.5 bg-gray-100 px-2 py-0.5 rounded-full inline-block">{gv.activities.length} hoạt động</p>
                                                </div>
                                            </div>
                                            <div className={`text-gray-400 transition-transform ${expandedGiaoVien === gv.ma_giao_vien ? 'text-orange-500' : ''}`}>{expandedGiaoVien === gv.ma_giao_vien ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}</div>
                                        </div>
                                        {expandedGiaoVien === gv.ma_giao_vien && (
                                            <div className="p-4 bg-[#f8fafc] border-t border-gray-100 animate-fade-in-up">
                                                <div className="space-y-4">
                                                    {gv.activities.map((act, i) => (
                                                        <div key={i} className="flex gap-3 relative">
                                                            <div className="flex flex-col items-center shrink-0">
                                                                <div className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-sm mt-1 z-10 border-2 border-white"></div>
                                                                {i !== gv.activities.length - 1 && <div className="w-[1.5px] h-full bg-orange-200 absolute top-3.5 left-[4.5px]"></div>}
                                                            </div>
                                                            <div className="pb-1 w-full">
                                                                <div className="bg-white border border-gray-200 p-2.5 rounded-md shadow-sm"><p className="text-sm font-bold text-gray-800 flex items-center gap-1.5"><FaCheckCircle className="text-green-500" size={12}/> {act}</p></div>
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

            
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-fade-in-up border border-gray-200 overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50/80">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                {activeModal === 'chi_phi' && <><FaMoneyBillWave className="text-red-600"/> Chi tiết Tổng chi phí hoạt động</>}
                                {activeModal === 'hoat_dong' && <><FaRunning className="text-teal-600"/> Chi tiết Danh sách Hoạt động</>}
                                {activeModal === 'giao_vien' && <><FaChalkboardTeacher className="text-orange-600"/> Chi tiết Giáo viên tham gia</>}
                                {activeModal === 'lop' && <><FaUsers className="text-blue-600"/> Chi tiết Lớp học tham gia</>}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><FaTimes size={20} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30">
                            {activeModal === 'chi_phi' && (
                                <div className="space-y-4">
                                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex justify-between items-center shadow-sm mb-4">
                                        <span className="font-bold text-red-800 text-sm uppercase">Tổng chi phí đã xuất:</span>
                                        <span className="text-xl font-bold text-red-700">{formatCurrency(tongChiPhi)}</span>
                                    </div>
                                    
                                    {filteredData.length === 0 ? <p className="text-center text-gray-500 italic">Không có dữ liệu chi phí</p> : filteredData.map(hd => (
                                        <div key={hd.ma_hoat_dong_ngoai_khoa} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-red-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-red-100 text-red-700 p-3 rounded-lg shrink-0"><FaMoneyBillWave size={20}/></div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-base">{hd.ten_hoat_dong}</h3>
                                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                        <FaClock className="text-gray-400"/> {formatDate(hd.ngay_to_chuc)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right bg-red-50/50 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                                                <span className="block text-xs text-gray-500 font-bold uppercase mb-0.5">Mức chi</span>
                                                <span className="font-bold text-red-600 text-lg">{formatCurrency(hd.chi_phi)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeModal === 'hoat_dong' && (
                                <div className="space-y-4">
                                    {filteredData.length === 0 ? <p className="text-center text-gray-500 italic">Không có dữ liệu</p> : filteredData.map(hd => (
                                        <div key={hd.ma_hoat_dong_ngoai_khoa} className={`bg-white border rounded-xl shadow-sm transition-all overflow-hidden ${expandedModalItem === hd.ma_hoat_dong_ngoai_khoa ? 'border-teal-400 ring-1 ring-teal-100' : 'border-gray-200 hover:border-teal-200'}`}>
                                            <div onClick={() => setExpandedModalItem(expandedModalItem === hd.ma_hoat_dong_ngoai_khoa ? null : hd.ma_hoat_dong_ngoai_khoa)} className="flex justify-between items-center p-4 cursor-pointer hover:bg-teal-50/30">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-teal-100 text-teal-700 p-3 rounded-lg"><FaRunning size={20}/></div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-base">{hd.ten_hoat_dong}</h3>
                                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                            <FaClock className="text-teal-500"/> {formatDate(hd.ngay_to_chuc)} 
                                                            <span className="text-gray-300">|</span> 
                                                            <FaMoneyBillWave className="text-red-400"/> <span className="font-semibold text-red-500">{formatCurrency(hd.chi_phi)}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-gray-400">{expandedModalItem === hd.ma_hoat_dong_ngoai_khoa ? <FaChevronUp /> : <FaChevronDown />}</div>
                                            </div>
                                            {expandedModalItem === hd.ma_hoat_dong_ngoai_khoa && (
                                                <div className="p-5 border-t border-gray-100 bg-[#f8fafc] animate-fade-in-up">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5"><FaMapMarkerAlt className="text-gray-400"/> Địa điểm</p>
                                                                <p className="font-medium text-gray-800 bg-white p-2.5 rounded-md border border-gray-200">{hd.dia_diem || 'Chưa cập nhật'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5"><FaInfoCircle className="text-gray-400"/> Mô tả</p>
                                                                <p className="font-medium text-gray-800 bg-white p-2.5 rounded-md border border-gray-200">{hd.mo_ta || 'Không có mô tả'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5"><FaChalkboardTeacher className="text-orange-400"/> Giáo viên phụ trách ({hd.phan_cong.length})</p>
                                                                <div className="bg-white p-2.5 rounded-md border border-gray-200 max-h-24 overflow-y-auto">
                                                                    {hd.phan_cong.length > 0 ? hd.phan_cong.map((pc, i) => <p key={i} className="font-medium text-gray-800 before:content-['•'] before:mr-1.5 before:text-orange-400">{pc.giao_vien.ho_ten}</p>) : <p className="italic text-gray-500">Chưa có</p>}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5"><FaUsers className="text-blue-400"/> Học viên tham gia</p>
                                                                <p className="font-bold text-blue-600 bg-white p-2.5 rounded-md border border-gray-200">{hd.tham_gia_hoc_vien.length} học viên</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeModal === 'giao_vien' && (
                                <div className="space-y-4">
                                    {baseGiaoVienStats.length === 0 ? <p className="text-center text-gray-500 italic">Không có dữ liệu</p> : baseGiaoVienStats.map(gv => (
                                        <div key={gv.ma_giao_vien} className={`bg-white border rounded-xl shadow-sm transition-all overflow-hidden ${expandedModalItem === gv.ma_giao_vien ? 'border-orange-400 ring-1 ring-orange-100' : 'border-gray-200 hover:border-orange-200'}`}>
                                            <div onClick={() => setExpandedModalItem(expandedModalItem === gv.ma_giao_vien ? null : gv.ma_giao_vien)} className="flex justify-between items-center p-4 cursor-pointer hover:bg-orange-50/30">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 flex items-center justify-center font-bold text-lg shadow-sm border border-white">{gv.ho_ten.charAt(0)}</div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-base">{gv.ho_ten}</h3>
                                                        <p className="text-sm text-gray-500 mt-0.5">Phụ trách <span className="font-bold text-orange-600">{gv.activities.length}</span> hoạt động</p>
                                                    </div>
                                                </div>
                                                <div className="text-gray-400">{expandedModalItem === gv.ma_giao_vien ? <FaChevronUp /> : <FaChevronDown />}</div>
                                            </div>
                                            {expandedModalItem === gv.ma_giao_vien && (
                                                <div className="p-5 border-t border-gray-100 bg-[#f8fafc] animate-fade-in-up">
                                                    <p className="text-xs font-bold text-gray-500 uppercase mb-3">Các hoạt động đã phụ trách:</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {gv.activities.map((act, i) => (
                                                            <div key={i} className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex items-center gap-2">
                                                                <FaCheckCircle className="text-green-500 shrink-0"/>
                                                                <span className="text-sm font-bold text-gray-800">{act}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeModal === 'lop' && (
                                <div className="space-y-4 flex flex-col h-full">
                                    <div className="relative shrink-0 mb-2">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FaSearch size={14} /></span>
                                        <input 
                                            type="text" 
                                            placeholder="Gõ tên lớp để tìm kiếm..." 
                                            value={searchLop} 
                                            onChange={(e) => setSearchLop(e.target.value)} 
                                            className="w-full border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white text-gray-800 font-medium shadow-sm" 
                                        />
                                    </div>
                                    
                                    {lopStats.length === 0 ? <p className="text-center text-gray-500 italic py-4">Không tìm thấy lớp phù hợp</p> : lopStats.map(ls => (
                                        <div key={ls.lop_hoc.ma_lop_hoc} className={`bg-white border rounded-xl shadow-sm transition-all overflow-hidden shrink-0 ${expandedModalItem === ls.lop_hoc.ma_lop_hoc ? 'border-blue-400 ring-1 ring-blue-100' : 'border-gray-200 hover:border-blue-200'}`}>
                                            <div onClick={() => setExpandedModalItem(expandedModalItem === ls.lop_hoc.ma_lop_hoc ? null : ls.lop_hoc.ma_lop_hoc)} className="flex justify-between items-center p-4 cursor-pointer hover:bg-blue-50/30">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-blue-100 text-blue-700 p-3 rounded-lg"><FaUsers size={20}/></div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-base">{ls.lop_hoc.ten_lop}</h3>
                                                        <p className="text-sm text-gray-500 mt-0.5">Có <span className="font-bold text-blue-600">{ls.hoc_vien_list.length}</span> học viên tham gia <span className="font-bold text-teal-600">{ls.activities.length}</span> hoạt động</p>
                                                    </div>
                                                </div>
                                                <div className="text-gray-400">{expandedModalItem === ls.lop_hoc.ma_lop_hoc ? <FaChevronUp /> : <FaChevronDown />}</div>
                                            </div>
                                            {expandedModalItem === ls.lop_hoc.ma_lop_hoc && (
                                                <div className="p-5 border-t border-gray-100 bg-[#f8fafc] animate-fade-in-up flex flex-col md:flex-row gap-6">
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-gray-500 uppercase mb-3">Hoạt động tham gia:</p>
                                                        <div className="space-y-2">
                                                            {ls.activities.map((act, i) => (
                                                                <div key={i} className="bg-white border border-gray-200 p-2.5 rounded-lg shadow-sm flex items-center gap-2">
                                                                    <FaRunning className="text-teal-500 shrink-0"/> <span className="text-sm font-bold text-gray-800">{act}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-gray-500 uppercase mb-3">Danh sách học viên:</p>
                                                        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm max-h-40 overflow-y-auto space-y-1.5">
                                                            {ls.hoc_vien_list.map((hv, i) => (
                                                                <div key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                                    <FaUserGraduate className="text-gray-400 shrink-0" size={12}/> {hv.ho_ten}
                                                                </div>
                                                            ))}
                                                        </div>
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