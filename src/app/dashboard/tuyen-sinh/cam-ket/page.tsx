'use client'
import { useState, useEffect } from 'react'
import { FaEdit, FaSearch, FaPlus, FaSave, FaTimes, FaTrash, FaUserGraduate, FaEye, FaCheckCircle, FaSpinner, FaQuestionCircle, FaUserPlus, FaExclamationTriangle, FaShieldAlt, FaSync, FaTasks, FaClock, FaFileAlt } from 'react-icons/fa'

interface KhoaHoc { ma_khoa_hoc: number; ten_khoa_hoc: string }

interface CamKet {
    ma_cam_ket: number; ngay_ky: string; ngay_het_han?: string | null; noi_dung_cam_ket: string;
    trang_thai: string; ma_hoc_vien: number; ma_khoa_hoc?: number | null;
    so_buoi_vang_cho_phep?: number | null; tham_gia_thi_day_du?: boolean | null;
    so_buoi_di_muon?: number | null; so_lan_thieu_bai_tap?: number | null;
    bi_vi_pham?: boolean; ly_do_vi_pham?: string | null;
    hoc_vien?: { ho_ten: string }; khoa_hoc?: { ten_khoa_hoc: string };
    so_buoi_vang_thuc_te?: number | null; so_buoi_di_muon_thuc_te?: number | null;
    so_lan_thieu_bai_tap_thuc_te?: number | null; da_bo_thi?: boolean | null;
}

export default function QuanLyCamKetPage() {
    const [data, setData] = useState<CamKet[]>([])
    const [danhSachKhoaHoc, setDanhSachKhoaHoc] = useState<KhoaHoc[]>([]) 
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isViewMode, setIsViewMode] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    
    const [activeTab, setActiveTab] = useState<'info' | 'violation'>('info')
    const [violationStats, setViolationStats] = useState({ vang: 0, muon: 0, thieu_bt: 0, bo_thi: false })

    const [formData, setFormData] = useState({
        ma_cam_ket: '', ngay_ky: '', ngay_het_han: '',
        noi_dung_cam_ket: 'Cam kết tuân thủ nội quy lớp học, đi học đầy đủ và hoàn thành bài tập về nhà.',
        trang_thai: 'Đang hiệu lực', ma_hoc_vien: '', ten_hoc_vien: '', ma_khoa_hoc: '', 
        so_buoi_vang_cho_phep: 3, tham_gia_thi_day_du: true, so_buoi_di_muon: 3, so_lan_thieu_bai_tap: 3,
        bi_vi_pham: false, ly_do_vi_pham: ''
    })
    
    const [isAskStudentModalOpen, setIsAskStudentModalOpen] = useState(false)
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
    const [isSubmittingStudent, setIsSubmittingStudent] = useState(false)
    const [studentFormError, setStudentFormError] = useState('')
    const [newStudentData, setNewStudentData] = useState({ ho_ten: '', ngay_sinh: '', gioi_tinh: 'Nam', so_dien_thoai: '', email: '', dia_chi: '', trang_thai: 'Đang học' })

    const [studentSuggestions, setStudentSuggestions] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [dateError, setDateError] = useState('')
    const [formError, setFormError] = useState('')

    const [studentDetails, setStudentDetails] = useState<any>(null)
    const [showStudentDetails, setShowStudentDetails] = useState(false)
    const [isLoadingStudent, setIsLoadingStudent] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
    
    const showToast = (message: string, type: 'success' | 'error' = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000) }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCamKet = await fetch('/api/tuyen-sinh/cam-ket'); if (resCamKet.ok) setData(await resCamKet.json())
                const resKhoaHoc = await fetch('/api/tuyen-sinh/khoa-hoc'); if (resKhoaHoc.ok) setDanhSachKhoaHoc(await resKhoaHoc.json())
            } catch (error) { console.error('Lỗi fetch API:', error) } finally { setIsLoading(false) }
        }
        fetchData()
    }, [])

    const handleStartAddWorkflow = () => setIsAskStudentModalOpen(true)
    const handleHasStudent = () => { setIsAskStudentModalOpen(false); openAddModal() }
    const handleNoStudent = () => { setIsAskStudentModalOpen(false); setNewStudentData({ ho_ten: '', ngay_sinh: '', gioi_tinh: 'Nam', so_dien_thoai: '', email: '', dia_chi: '', trang_thai: 'Đang học' }); setStudentFormError(''); setIsAddStudentModalOpen(true) }

    const handleNewStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setNewStudentData({ ...newStudentData, [e.target.name]: e.target.value }); if (studentFormError) setStudentFormError('') }

    const handleSaveNewStudent = async () => {
        if (!newStudentData.ho_ten || !newStudentData.ngay_sinh) { setStudentFormError('Vui lòng nhập Họ và tên và Ngày sinh bắt buộc (*)'); return }
        setIsSubmittingStudent(true)
        try {
            const payload = { ...newStudentData, ngay_sinh: new Date(newStudentData.ngay_sinh).toISOString() }
            const response = await fetch('/api/tuyen-sinh/hoc-vien', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

            if (response.ok) {
                const createdStudent = await response.json()
                showToast('Tạo hồ sơ học viên thành công!', 'success')
                setIsAddStudentModalOpen(false); setIsViewMode(false); setEditingId(null)
                setFormData({
                    ma_cam_ket: '', ngay_ky: new Date().toISOString().split('T')[0], ngay_het_han: '', noi_dung_cam_ket: 'Cam kết tuân thủ nội quy lớp học, đi học đầy đủ và hoàn thành bài tập về nhà.',
                    trang_thai: 'Đang hiệu lực', ma_hoc_vien: createdStudent.ma_hoc_vien.toString(), ten_hoc_vien: createdStudent.ho_ten, ma_khoa_hoc: '',
                    so_buoi_vang_cho_phep: 3, tham_gia_thi_day_du: true, so_buoi_di_muon: 3, so_lan_thieu_bai_tap: 3, bi_vi_pham: false, ly_do_vi_pham: ''
                })
                setFormError(''); setDateError(''); setShowStudentDetails(false); setActiveTab('info'); setIsModalOpen(true) 
            } else setStudentFormError('Có lỗi xảy ra khi lưu.')
        } catch (error) { setStudentFormError('Lỗi kết nối máy chủ.') } finally { setIsSubmittingStudent(false) }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        if (type === 'checkbox') setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
        else setFormData({ ...formData, [name]: value })
        if (name === 'ngay_het_han' || name === 'trang_thai') setDateError('')
    }

    const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const nameValue = e.target.value
        setFormData({ ...formData, ten_hoc_vien: nameValue, ma_hoc_vien: '' }) 
        if (nameValue.trim().length < 2) { setStudentSuggestions([]); setShowSuggestions(false); return }
        setIsSearching(true)
        try {
            const response = await fetch(`/api/tuyen-sinh/hoc-vien?search=${nameValue}`)
            if (response.ok) { setStudentSuggestions(await response.json()); setShowSuggestions(true) }
        } catch (error) {} finally { setIsSearching(false) }
    }

    const selectStudent = (student: any) => { setFormData({ ...formData, ten_hoc_vien: student.ho_ten, ma_hoc_vien: student.ma_hoc_vien.toString() }); setShowSuggestions(false) }

    const handleNameBlur = () => { setTimeout(async () => { setShowSuggestions(false); if (!formData.ma_hoc_vien && formData.ten_hoc_vien.trim().length >= 2) { try { const response = await fetch(`/api/tuyen-sinh/hoc-vien?search=${formData.ten_hoc_vien}`); if (response.ok) { const data = await response.json(); const exactMatches = data.filter((sv: any) => sv.ho_ten.toLowerCase() === formData.ten_hoc_vien.trim().toLowerCase()); if (exactMatches.length === 1) setFormData(prev => ({ ...prev, ten_hoc_vien: exactMatches[0].ho_ten, ma_hoc_vien: exactMatches[0].ma_hoc_vien.toString() })) } } catch (error) {} } }, 200) }

    const handleIdBlur = async () => { if (!formData.ma_hoc_vien) return; try { const response = await fetch(`/api/tuyen-sinh/hoc-vien?id=${formData.ma_hoc_vien}`); if (response.ok) { const data = await response.json(); const student = Array.isArray(data) ? data[0] : data; if (student) setFormData(prev => ({ ...prev, ten_hoc_vien: student.ho_ten })); else setFormData(prev => ({ ...prev, ten_hoc_vien: 'Không tìm thấy học viên' })) } } catch (error) {} }

    const handleViewStudentDetails = async () => { if (showStudentDetails) { setShowStudentDetails(false); return } if (!formData.ma_hoc_vien) return; setIsLoadingStudent(true); setShowStudentDetails(true); try { const response = await fetch(`/api/tuyen-sinh/hoc-vien?id=${formData.ma_hoc_vien}`); if (response.ok) { const data = await response.json(); setStudentDetails(Array.isArray(data) ? data[0] : data) } } catch (error) {} finally { setIsLoadingStudent(false) } }

    const fillFormData = (row: CamKet) => {
        setFormData({
            ma_cam_ket: row.ma_cam_ket.toString(),
            ngay_ky: new Date(row.ngay_ky).toISOString().split('T')[0],
            ngay_het_han: row.ngay_het_han ? new Date(row.ngay_het_han).toISOString().split('T')[0] : '',
            noi_dung_cam_ket: row.noi_dung_cam_ket || '', trang_thai: row.trang_thai || 'Đang hiệu lực',
            ma_hoc_vien: row.ma_hoc_vien.toString(), ten_hoc_vien: row.hoc_vien?.ho_ten || '', 
            ma_khoa_hoc: row.ma_khoa_hoc ? row.ma_khoa_hoc.toString() : '',
            so_buoi_vang_cho_phep: row.so_buoi_vang_cho_phep ?? 3, tham_gia_thi_day_du: row.tham_gia_thi_day_du ?? true,
            so_buoi_di_muon: row.so_buoi_di_muon ?? 3, so_lan_thieu_bai_tap: row.so_lan_thieu_bai_tap ?? 3,
            bi_vi_pham: row.bi_vi_pham || false, ly_do_vi_pham: row.ly_do_vi_pham || ''
        })
        setViolationStats({ 
            vang: row.so_buoi_vang_thuc_te || 0, 
            muon: row.so_buoi_di_muon_thuc_te || 0, 
            thieu_bt: row.so_lan_thieu_bai_tap_thuc_te || 0, 
            bo_thi: row.da_bo_thi || false 
        })
    }

    const openViewModal = (row: CamKet) => { 
        fillFormData(row); setIsViewMode(true); setEditingId(row.ma_cam_ket); 
        setShowSuggestions(false); setDateError(''); setFormError(''); setShowStudentDetails(false); 
        setActiveTab('info'); 
        setIsModalOpen(true);
    }
    
    const openAddModal = () => {
        setIsViewMode(false); setEditingId(null)
        setFormData({ ma_cam_ket: '', ngay_ky: new Date().toISOString().split('T')[0], ngay_het_han: '', noi_dung_cam_ket: 'Cam kết tuân thủ nội quy lớp học, đi học đầy đủ và hoàn thành bài tập về nhà.', trang_thai: 'Đang hiệu lực', ma_hoc_vien: '', ten_hoc_vien: '', ma_khoa_hoc: '', so_buoi_vang_cho_phep: 3, tham_gia_thi_day_du: true, so_buoi_di_muon: 3, so_lan_thieu_bai_tap: 3, bi_vi_pham: false, ly_do_vi_pham: '' })
        setViolationStats({ vang: 0, muon: 0, thieu_bt: 0, bo_thi: false }); setShowSuggestions(false); setDateError(''); setFormError(''); setShowStudentDetails(false); 
        setActiveTab('info'); setIsModalOpen(true)
    }

    const openEditModal = (row: CamKet) => { 
        fillFormData(row); setIsViewMode(false); setEditingId(row.ma_cam_ket); 
        setShowSuggestions(false); setDateError(''); setShowStudentDetails(false); 
        setActiveTab('info'); 
        setIsModalOpen(true);
    }

    const closeModal = () => { setIsModalOpen(false); setEditingId(null); setIsViewMode(false); setShowSuggestions(false); setShowStudentDetails(false); setDateError('') }
    const openDeleteModal = (id: number) => { setDeletingId(id); setIsDeleteModalOpen(true) }
    const closeDeleteModal = () => { setIsDeleteModalOpen(false); setDeletingId(null) }

    const confirmDelete = async () => { if (!deletingId) return; try { const response = await fetch(`/api/tuyen-sinh/cam-ket?id=${deletingId}`, { method: 'DELETE' }); if (response.ok) { setData(data.filter((item) => item.ma_cam_ket !== deletingId)); showToast('Đã xóa bản cam kết thành công!', 'success') } else showToast('Có lỗi xảy ra khi xóa.', 'error') } catch (error) { showToast('Không thể kết nối đến máy chủ.', 'error') } finally { closeDeleteModal() } }

    const handleSaveCamKet = async () => {
        setFormError(''); setDateError('') 
        if (!formData.ngay_ky || !formData.noi_dung_cam_ket || !formData.trang_thai || !formData.ma_hoc_vien || !formData.ma_khoa_hoc) { setFormError('Vui lòng nhập đầy đủ các thông tin bắt buộc (bao gồm Khóa học)!'); return }
        if (formData.ngay_het_han) { const today = new Date(); today.setHours(0, 0, 0, 0); const expirationDate = new Date(formData.ngay_het_han); expirationDate.setHours(0, 0, 0, 0); if (formData.trang_thai === 'Đang hiệu lực' && expirationDate < today) { setDateError('Cảnh báo: Cam kết đã quá hạn'); return } if (formData.trang_thai === 'Đã hết hạn' && expirationDate >= today) { setDateError('Cảnh báo: Cam kết vẫn còn hạn'); return } }
        try {
            const method = editingId ? 'PUT' : 'POST'
            const payload = { ...formData, ngay_het_han: formData.ngay_het_han || null, ma_khoa_hoc: parseInt(formData.ma_khoa_hoc), so_buoi_vang_cho_phep: parseInt(formData.so_buoi_vang_cho_phep.toString()), so_buoi_di_muon: parseInt(formData.so_buoi_di_muon.toString()), so_lan_thieu_bai_tap: parseInt(formData.so_lan_thieu_bai_tap.toString()) }
            const response = await fetch('/api/tuyen-sinh/cam-ket', { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            if (response.ok) { const savedData = await response.json(); if (editingId) setData(data.map((item) => (item.ma_cam_ket === savedData.ma_cam_ket ? savedData : item))); else setData([...data, savedData]); showToast(editingId ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success'); closeModal() } else showToast(`Có lỗi xảy ra khi lưu.`, 'error')
        } catch (error) { showToast('Lỗi máy chủ.', 'error') }
    }

    const handleCheckViolation = async () => {
        if (!editingId) return;
        setIsChecking(true);
        try {
            const response = await fetch('/api/tuyen-sinh/cam-ket', { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ action: 'check_violation', ma_cam_ket: editingId }) 
            });

            if (response.ok) {
                const dataRes = await response.json();
                const { updatedCamKet, stats } = dataRes;

                setViolationStats(stats);
                setFormData(prev => ({ ...prev, bi_vi_pham: updatedCamKet.bi_vi_pham, ly_do_vi_pham: updatedCamKet.ly_do_vi_pham || '' }));
                setData(data.map((item) => (item.ma_cam_ket === editingId ? updatedCamKet : item)));
                
                showToast('Hệ thống đã quét và phân tích điểm danh thành công!', 'success');
            } else { showToast('Không thể kết nối đến dữ liệu điểm danh', 'error'); }
        } catch (error) { showToast('Lỗi mạng khi kiểm tra', 'error') } finally { setIsChecking(false); }
    }

    const filteredData = data.filter(item => (item.hoc_vien?.ho_ten || '').toLowerCase().includes(searchTerm.toLowerCase()) || item.ma_hoc_vien.toString().includes(searchTerm))
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    return (
        <div className="bg-gray-50 min-h-screen p-6 relative">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-7xl mx-auto border border-gray-200">
                
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-[#1d4ed8] flex items-center gap-3 uppercase">
                        <FaShieldAlt className="text-blue-600" /> Quản lý Bản Cam Kết
                    </h1>
                    <button onClick={handleStartAddWorkflow} className="flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-medium transition shadow-sm">
                        <FaPlus /> Thêm cam kết
                    </button>
                </div>

                <div className="mb-6 w-full md:w-1/2 lg:w-1/3">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><FaSearch /></span>
                        <input type="text" placeholder="Tìm theo tên hoặc mã học viên..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} className="w-full border border-gray-300 rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] transition shadow-sm text-black" />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-t-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#1d4ed8] text-white uppercase font-semibold text-xs border-b">
                            <tr>
                                <th className="px-4 py-4 text-center">Mã CK</th>
                                <th className="px-4 py-4">Học Viên</th>
                                <th className="px-4 py-4 min-w-[200px]">Khóa Học</th>
                                <th className="px-4 py-4 text-center">Ngày Ký</th>
                                <th className="px-4 py-4 text-center">Trạng Thái</th>
                                <th className="px-4 py-4 text-center">Vi Phạm</th>
                                <th className="px-4 py-4 text-center w-28">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center py-8 font-medium">Đang tải dữ liệu...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Không tìm thấy cam kết nào.</td></tr>
                            ) : (
                                currentItems.map((row, index) => (
                                    <tr key={row.ma_cam_ket} className={`border-b hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-4 py-4 text-center text-gray-600 font-medium">{row.ma_cam_ket}</td>
                                        <td className="px-4 py-4 font-bold text-[#1d4ed8]">{row.hoc_vien?.ho_ten || `Mã HV: ${row.ma_hoc_vien}`}</td>
                                        <td className="px-4 py-4 font-medium text-gray-800">{row.khoa_hoc?.ten_khoa_hoc || <span className="text-gray-400 italic">Chưa liên kết</span>}</td>
                                        <td className="px-4 py-4 text-center text-gray-600">{new Date(row.ngay_ky).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${row.trang_thai === 'Đang hiệu lực' ? 'bg-green-100 text-green-700 border-green-200' : row.trang_thai === 'Đã hết hạn' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                                {row.trang_thai}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {row.bi_vi_pham ? (
                                                <span className="px-3 py-1 rounded bg-red-100 border border-red-200 text-red-600 text-xs font-bold inline-flex items-center gap-1"><FaExclamationTriangle/> Có</span>
                                            ) : (
                                                <span className="px-3 py-1 rounded bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold">Không</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openViewModal(row)} className="p-2 text-green-600 bg-green-100 rounded hover:bg-green-200 transition" title="Xem chi tiết & vi phạm"><FaEye /></button>
                                                <button onClick={() => openEditModal(row)} className="p-2 text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition" title="Sửa cam kết"><FaEdit /></button>
                                                <button onClick={() => openDeleteModal(row.ma_cam_ket)} className="p-2 text-red-600 bg-red-100 rounded hover:bg-red-200 transition" title="Xóa cam kết"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && filteredData.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 font-medium text-gray-600 text-sm gap-4">
                        <div>Hiển thị <span className="font-bold text-gray-800">{indexOfFirstItem + 1}</span> đến <span className="font-bold text-gray-800">{Math.min(indexOfLastItem, filteredData.length)}</span> trong tổng số <span className="font-bold text-gray-800">{filteredData.length}</span> cam kết</div>
                        <div className="flex gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className={`px-3 py-1.5 rounded border ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300 text-gray-700'}`}>Trước</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button key={number} onClick={() => setCurrentPage(number)} className={`px-3 py-1.5 rounded border ${currentPage === number ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]' : 'hover:bg-gray-100 border-gray-300 text-gray-700'}`}>{number}</button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded border ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-300 text-gray-700'}`}>Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL THÊM HỌC VIÊN */}
            {isAskStudentModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up text-center border border-gray-200">
                        <div className="flex justify-center mb-4"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><FaQuestionCircle size={32} /></div></div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Thông tin học viên</h3>
                        <p className="text-gray-600 mb-8 font-medium">Học viên này đã có hồ sơ trong hệ thống chưa?</p>
                        <div className="flex flex-col gap-3">
                            <button onClick={handleHasStudent} className="w-full py-3 bg-[#1d4ed8] text-white rounded-md font-semibold hover:bg-blue-700 transition">Đã có hồ sơ</button>
                            <button onClick={handleNoStudent} className="w-full py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"><FaUserPlus /> Chưa có (Thêm mới)</button>
                            <button onClick={() => setIsAskStudentModalOpen(false)} className="w-full py-2.5 mt-2 text-gray-500 hover:bg-gray-100 rounded-md font-medium transition">Hủy bỏ</button>
                        </div>
                    </div>
                </div>
            )}

            {isAddStudentModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl animate-fade-in-up flex flex-col border border-gray-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2"><FaUserPlus /> Đăng ký hồ sơ học viên mới</h2>
                            <button onClick={() => setIsAddStudentModalOpen(false)} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label><input type="text" name="ho_ten" value={newStudentData.ho_ten} onChange={handleNewStudentChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-black" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh <span className="text-red-500">*</span></label><input type="date" name="ngay_sinh" value={newStudentData.ngay_sinh} onChange={handleNewStudentChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-black" /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Giới tính</label><select name="gioi_tinh" value={newStudentData.gioi_tinh} onChange={handleNewStudentChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none bg-white text-black"><option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option></select></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label><input type="text" name="so_dien_thoai" value={newStudentData.so_dien_thoai} onChange={handleNewStudentChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-black" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Email</label><input type="email" name="email" value={newStudentData.email} onChange={handleNewStudentChange} placeholder="ví dụ: nguyenvana@gmail.com" className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-black" /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label><input type="text" name="dia_chi" value={newStudentData.dia_chi} onChange={handleNewStudentChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-black" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái</label><select name="trang_thai" value={newStudentData.trang_thai} onChange={handleNewStudentChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none bg-white text-black"><option value="Đang học">Đang học</option><option value="Nghỉ học">Nghỉ học</option><option value="Bảo lưu">Bảo lưu</option></select></div>
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            <button onClick={() => setIsAddStudentModalOpen(false)} className="px-5 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-100 font-medium transition">Hủy bỏ</button>
                            <button onClick={handleSaveNewStudent} disabled={isSubmittingStudent} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition disabled:opacity-50">{isSubmittingStudent ? <FaSpinner className="animate-spin" /> : <FaSave />} Lưu và Tiếp tục</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 3: GIAO DIỆN TAB */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl animate-fade-in-up flex flex-col max-h-[95vh] overflow-hidden border border-gray-200">
                        
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white rounded-t-lg shrink-0">
                            <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center gap-2">
                                <FaShieldAlt /> {isViewMode ? 'Chi Tiết Bản Cam Kết & Vi Phạm' : editingId ? 'Cập Nhật Bản Cam Kết' : 'Tạo Bản Cam Kết Mới'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={24} /></button>
                        </div>

                        <div className="flex px-6 pt-2 bg-gray-50 border-b border-gray-200 shrink-0">
                            <button onClick={() => setActiveTab('info')} className={`py-2 px-4 font-bold border-b-2 outline-none transition-colors ${activeTab === 'info' ? 'border-[#1d4ed8] text-[#1d4ed8]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                Hồ sơ & Điều khoản
                            </button>
                            {editingId && (
                                <button onClick={() => setActiveTab('violation')} className={`py-2 px-4 font-bold border-b-2 outline-none transition-colors ${activeTab === 'violation' ? 'border-[#1d4ed8] text-[#1d4ed8]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                    Tra cứu Vi phạm
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-white">
                            
                            {/* TAB 1: THÔNG TIN VÀ ĐIỀU KHOẢN */}
                            {activeTab === 'info' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="relative">
                                            <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Tên học viên <span className="text-red-500">*</span></label>
                                            <input type="text" name="ten_hoc_vien" value={formData.ten_hoc_vien} onChange={handleNameChange} onFocus={() => !isViewMode && studentSuggestions.length > 0 && setShowSuggestions(true)} onBlur={handleNameBlur} onClick={() => isViewMode && handleViewStudentDetails()} placeholder="Nhập tên học viên..." readOnly={isViewMode} className={`w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-black transition ${isViewMode ? 'bg-gray-50 cursor-pointer hover:underline disabled:opacity-100 disabled:text-black' : 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`} />
                                            {showSuggestions && !isViewMode && (
                                                <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                                    {isSearching ? <li className="p-3 text-sm text-gray-500 text-center">Đang tìm kiếm...</li> : studentSuggestions.length > 0 ? studentSuggestions.map((sv) => (
                                                        <li key={sv.ma_hoc_vien} onMouseDown={() => selectStudent(sv)} className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0">
                                                            <div className="font-bold text-gray-800">{sv.ho_ten}</div>
                                                            <div className="text-xs text-gray-500 mt-1">Mã HV: <span className="text-blue-600 font-semibold">{sv.ma_hoc_vien}</span></div>
                                                        </li>
                                                    )) : <li className="p-3 text-sm text-red-500 text-center">Không tìm thấy học viên</li>}
                                                </ul>
                                            )}
                                            {isViewMode && showStudentDetails && (
                                                <div className="absolute z-50 w-full mt-2 bg-white border border-blue-200 rounded-lg shadow-xl p-4 animate-fade-in-down">
                                                    <div className="flex justify-between items-center mb-3 border-b pb-2">
                                                        <h4 className="font-bold text-[#1d4ed8] text-sm flex items-center gap-2"><FaUserGraduate /> Hồ sơ học viên</h4>
                                                        <button onClick={(e) => { e.stopPropagation(); setShowStudentDetails(false); }} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
                                                    </div>
                                                    {isLoadingStudent ? <div className="flex justify-center items-center py-4 text-blue-500"><FaSpinner className="animate-spin text-xl" /></div> : studentDetails ? (
                                                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                                                            <div><span className="text-gray-500 block text-xs">Giới tính</span> <span className="font-semibold text-gray-800">{studentDetails.gioi_tinh || 'N/A'}</span></div>
                                                            <div><span className="text-gray-500 block text-xs">Ngày sinh</span> <span className="font-semibold text-gray-800">{studentDetails.ngay_sinh ? new Date(studentDetails.ngay_sinh).toLocaleDateString('vi-VN') : 'N/A'}</span></div>
                                                            <div className="col-span-2"><span className="text-gray-500 block text-xs">Số điện thoại</span> <span className="font-semibold text-gray-800">{studentDetails.so_dien_thoai || 'N/A'}</span></div>
                                                        </div>
                                                    ) : <p className="text-center text-red-500 text-sm py-2">Không tải được thông tin.</p>}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Mã học viên <span className="text-red-500">*</span></label>
                                            <input type="number" name="ma_hoc_vien" value={formData.ma_hoc_vien} onChange={handleChange} onBlur={handleIdBlur} disabled={isViewMode} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-black disabled:opacity-100" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Khóa học cam kết <span className="text-red-500">*</span></label>
                                            <select name="ma_khoa_hoc" value={formData.ma_khoa_hoc} onChange={handleChange} disabled={isViewMode} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-black disabled:opacity-100">
                                                <option value="">-- Chọn khóa học --</option>
                                                {danhSachKhoaHoc.map(kh => <option key={kh.ma_khoa_hoc} value={kh.ma_khoa_hoc}>{kh.ten_khoa_hoc}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Trạng thái</label>
                                            <select name="trang_thai" value={formData.trang_thai} onChange={handleChange} disabled={isViewMode} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-black disabled:opacity-100">
                                                <option value="Đang hiệu lực">Đang hiệu lực</option>
                                                <option value="Đã hết hạn">Đã hết hạn</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Ngày ký</label>
                                            <input type="date" name="ngay_ky" value={formData.ngay_ky} onChange={handleChange} disabled={isViewMode} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-black disabled:opacity-100" />
                                        </div>
                                        <div>
                                            <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Ngày hết hạn</label>
                                            <input type="date" name="ngay_het_han" value={formData.ngay_het_han} onChange={handleChange} disabled={isViewMode} className={`w-full border rounded-md px-3 py-2.5 outline-none text-black disabled:bg-gray-50 disabled:text-black disabled:opacity-100 ${dateError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} />
                                            {dateError && <p className="text-red-500 text-xs italic mt-1 font-medium">{dateError}</p>}
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Thiết lập Điều kiện & Nội quy</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1 font-bold">Tối đa VẮNG</label>
                                                <div className="flex">
                                                    <input type="number" name="so_buoi_vang_cho_phep" value={formData.so_buoi_vang_cho_phep} onChange={handleChange} disabled={isViewMode} className="w-16 border border-gray-300 rounded-l px-2 py-2 text-center text-blue-600 font-bold text-[15px] disabled:bg-gray-50 disabled:opacity-100 outline-none" />
                                                    <span className="bg-gray-50 border border-l-0 border-gray-300 rounded-r px-3 py-2 text-sm text-gray-600 font-medium">buổi</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1 font-bold">Tối đa ĐI MUỘN</label>
                                                <div className="flex">
                                                    <input type="number" name="so_buoi_di_muon" value={formData.so_buoi_di_muon} onChange={handleChange} disabled={isViewMode} className="w-16 border border-gray-300 rounded-l px-2 py-2 text-center text-blue-600 font-bold text-[15px] disabled:bg-gray-50 disabled:opacity-100 outline-none" />
                                                    <span className="bg-gray-50 border border-l-0 border-gray-300 rounded-r px-3 py-2 text-sm text-gray-600 font-medium">buổi</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1 font-bold">Thiếu BÀI TẬP</label>
                                                <div className="flex">
                                                    <input type="number" name="so_lan_thieu_bai_tap" value={formData.so_lan_thieu_bai_tap} onChange={handleChange} disabled={isViewMode} className="w-16 border border-gray-300 rounded-l px-2 py-2 text-center text-blue-600 font-bold text-[15px] disabled:bg-gray-50 disabled:opacity-100 outline-none" />
                                                    <span className="bg-gray-50 border border-l-0 border-gray-300 rounded-r px-3 py-2 text-sm text-gray-600 font-medium">lần</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center pt-3">
                                                <label className="flex items-center cursor-pointer">
                                                    <input type="checkbox" name="tham_gia_thi_day_du" checked={formData.tham_gia_thi_day_du} onChange={handleChange} disabled={isViewMode} className="w-4 h-4 text-blue-600 rounded border-gray-300 disabled:opacity-100" />
                                                    <span className="ml-2 text-xs font-bold text-gray-600 uppercase">Bắt buộc thi</span>
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-[14px] font-medium text-gray-700 mb-1.5 uppercase">Nội dung hợp đồng chi tiết</label>
                                            <textarea name="noi_dung_cam_ket" value={formData.noi_dung_cam_ket} onChange={handleChange} disabled={isViewMode} rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-black disabled:opacity-100 resize-none"></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: KIỂM TRA VI PHẠM */}
                            {activeTab === 'violation' && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className={`p-5 rounded-xl border relative overflow-hidden ${formData.bi_vi_pham ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-1 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${formData.bi_vi_pham ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {formData.bi_vi_pham ? <FaExclamationTriangle size={18} /> : <FaCheckCircle size={18} />}
                                                </div>
                                                <div>
                                                    <h3 className={`font-bold text-lg uppercase tracking-wide ${formData.bi_vi_pham ? 'text-red-600' : 'text-gray-800'}`}>
                                                        {formData.bi_vi_pham ? 'Đã vi phạm cam kết' : 'Chưa ghi nhận vi phạm'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">Dữ liệu được tổng hợp từ điểm danh và nhận xét của giáo viên.</p>
                                                </div>
                                            </div>
                                            
                                            {editingId && !isViewMode && (
                                                <button onClick={handleCheckViolation} disabled={isChecking} className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition shadow-sm disabled:opacity-70">
                                                    <FaSync className={isChecking ? 'animate-spin' : ''} /> {isChecking ? 'Đang phân tích...' : 'Cập nhật dữ liệu mới'}
                                                </button>
                                            )}
                                        </div>
                                        {formData.bi_vi_pham && formData.ly_do_vi_pham && (
                                            <div className="mt-5 bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                                                <span className="font-bold text-red-600 block mb-2 text-sm">Chi tiết vi phạm hệ thống phát hiện:</span>
                                                <span className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{formData.ly_do_vi_pham}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1 mt-8 mb-3">Thống kê chi tiết quá trình học</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center p-5 relative overflow-hidden">
                                            <div className={`absolute top-0 left-0 w-full h-1.5 ${violationStats.thieu_bt > (formData.so_lan_thieu_bai_tap || 0) ? 'bg-blue-500' : 'bg-blue-500'}`}></div>
                                            <FaTasks className="text-2xl mb-3 text-blue-400" />
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Thiếu bài tập</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-gray-800">{violationStats.thieu_bt}</span>
                                                <span className="text-sm font-medium text-gray-500">lần</span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 mt-3 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">Cho phép: {formData.so_lan_thieu_bai_tap}</span>
                                        </div>
                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center p-5 relative overflow-hidden">
                                            <div className={`absolute top-0 left-0 w-full h-1.5 ${violationStats.vang > (formData.so_buoi_vang_cho_phep || 0) ? 'bg-amber-500' : 'bg-amber-500'}`}></div>
                                            <FaUserGraduate className="text-2xl mb-3 text-amber-500" />
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Vắng học</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-gray-800">{violationStats.vang}</span>
                                                <span className="text-sm font-medium text-gray-500">buổi</span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 mt-3 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">Cho phép: {formData.so_buoi_vang_cho_phep}</span>
                                        </div>
                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center p-5 relative overflow-hidden">
                                            <div className={`absolute top-0 left-0 w-full h-1.5 ${violationStats.muon > (formData.so_buoi_di_muon || 0) ? 'bg-purple-500' : 'bg-purple-500'}`}></div>
                                            <FaClock className="text-2xl mb-3 text-purple-500" />
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Đi muộn</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-gray-800">{violationStats.muon}</span>
                                                <span className="text-sm font-medium text-gray-500">buổi</span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 mt-3 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">Cho phép: {formData.so_buoi_di_muon}</span>
                                        </div>
                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center p-5 relative overflow-hidden">
                                            <div className={`absolute top-0 left-0 w-full h-1.5 ${(formData.tham_gia_thi_day_du && violationStats.bo_thi) ? 'bg-green-500' : 'bg-green-500'}`}></div>
                                            <FaFileAlt className="text-2xl mb-3 text-green-500" />
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Bỏ thi / test</span>
                                            <div className="flex items-baseline gap-1 mt-1 mb-1">
                                                <span className="text-3xl font-black text-gray-800">
                                                    {violationStats.bo_thi ? 'Có' : 'Không'}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 mt-3 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">Bắt buộc: {formData.tham_gia_thi_day_du ? 'Có' : 'Không'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Modal */}
                        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3 shrink-0">
                            {formError && <div className="mr-auto text-red-600 font-medium self-center">{formError}</div>}
                            <button onClick={closeModal} className="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-100 font-semibold transition">Đóng</button>
                            {(!isViewMode && activeTab === 'info') && (
                                <button onClick={handleSaveCamKet} className="flex items-center gap-2 px-8 py-2.5 bg-[#1d4ed8] text-white rounded-md hover:bg-blue-700 font-semibold transition shadow-sm">
                                    <FaSave /> {editingId ? 'Lưu cập nhật' : 'Tạo cam kết'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Delete & Toasts... */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up">
                        <button onClick={closeDeleteModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><FaTimes size={20} /></button>
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mr-4"><span className="text-red-600 font-bold text-2xl">!</span></div>
                            <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa</h3>
                        </div>
                        <p className="text-gray-600 mb-6 ml-16 text-base">Bạn có chắc chắn muốn xóa bản cam kết này? Hành động này sẽ không thể khôi phục lại dữ liệu.</p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={closeDeleteModal} className="px-5 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors">Hủy bỏ</button>
                            <button onClick={confirmDelete} className="px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors shadow-sm">Xác nhận xóa</button>
                        </div>
                    </div>
                </div>
            )}
            {toast && (
                <div className="fixed top-5 right-5 z-[70] animate-fade-in-down transition-all duration-300">
                    <div className={`flex items-center min-w-[300px] p-4 bg-white rounded shadow-lg border-l-4 ${toast.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
                        <div className="flex-shrink-0 mr-3">{toast.type === 'success' ? <FaCheckCircle className="text-green-500 text-2xl" /> : <div className="bg-red-100 rounded-full p-1"><FaTimes className="text-red-500 text-lg" /></div>}</div>
                        <div className="flex-1 text-gray-800 font-medium">{toast.message}</div>
                        <button onClick={() => setToast(null)} className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"><FaTimes /></button>
                    </div>
                </div>
            )}
        </div>
    )
}