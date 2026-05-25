'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt, FaFileSignature, 
  FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaSave, FaUserPlus, 
  FaClipboardList, FaGraduationCap, FaArrowLeft, FaExclamationTriangle 
} from 'react-icons/fa'

// ==========================================
// INTERFACES ĐỒNG BỘ CHUẨN SCHEMA.PRISMA
// ==========================================
interface HocVien {
  ma_hoc_vien: number; ho_ten: string; so_dien_thoai: string | null; email: string | null;
}
interface GiaoVien {
  ma_giao_vien: number; ho_ten: string; so_dien_thoai: string | null; email: string | null;
}
interface ThamGiaLop {
  ma_tham_gia_lop: number; ma_hoc_vien: number; ngay_dang_ky: string; trang_thai: string | null; hoc_vien: HocVien;
}
interface PhanCongGiangDay {
  ma_phan_cong_giang_day: number; ma_giao_vien: number; giao_vien: GiaoVien;
}
interface DiemDanh {
  ma_diem_danh?: number; ma_hoc_vien: number; trang_thai: string; ghi_chu: string | null;
}
interface NhanXet {
  ma_nhan_xet?: number; ma_hoc_vien: number; da_lam_bai_tap: boolean; noi_dung_nhan_xet: string | null;
}
interface BuoiHoc {
  ma_buoi_hoc: number; ngay_hoc: string; noi_dung_hoc: string | null; ma_giao_vien: number; giao_vien: { ho_ten: string };
  diem_danh?: DiemDanh[]; nhan_xet?: NhanXet[];
}
interface BaiKiemTra {
  ma_bai_kiem_tra: number; ten_bai_kiem_tra: string; ngay_kiem_tra: string; ma_khoa_hoc: number;
}
interface KetQuaKiemTra {
  ma_ket_qua_kiem_tra?: number; ma_bai_kiem_tra: number; ma_hoc_vien: number; diem_so: number; trang_thai: string | null; nhan_xet: string | null;
}

interface ClassFullDetails {
  ma_lop_hoc: number; ten_lop: string; si_so_toi_da: number | null; ngay_khai_giang: string | null; ngay_ket_thuc: string | null; lich_hoc: any; ma_phong_hoc: number; ma_khoa_hoc: number;
  phong_hoc: { ten_phong_hoc: string; suc_chua: number | null };
  khoa_hoc: { ten_khoa_hoc: string; hoc_phi: number };
  tham_gia: ThamGiaLop[];
  phan_cong_giang_day: PhanCongGiangDay[];
  buoi_hoc: BuoiHoc[];
}

export default function ChiTietLopHocToanDienPage() {
  const params = useParams()
  const router = useRouter()
  const classId = Number(params?.id)

  // Quản lý Tabs điều hướng chính
  const [activeTab, setActiveTab] = useState<'tong-quan' | 'hoc-vien' | 'giang-vien' | 'buoi-hoc' | 'kiem-tra'>('tong-quan')
  const [loading, setLoading] = useState<boolean>(true)
  const [classData, setClassData] = useState<ClassFullDetails | null>(null)

  // Danh sách mọc bổ trợ cho việc thêm mới/lựa chọn (Simulation từ Database)
  const [availableStudents, setAvailableStudents] = useState<HocVien[]>([])
  const [availableTeachers, setAvailableTeachers] = useState<GiaoVien[]>([])
  const [courseTests, setCourseTests] = useState<BaiKiemTra[]>([])
  const [testResults, setTestResults] = useState<KetQuaKiemTra[]>([])

  // State các Modals chức năng
  const [modalType, setModalType] = useState<null | 'edit-class' | 'add-student' | 'assign-teacher' | 'session' | 'diem-danh-nhan-xet' | 'nhap-diem'>(null)
  
  // State lưu dữ liệu form tạm thời
  const [formData, setFormData] = useState<any>({})
  const [selectedSession, setSelectedSession] = useState<BuoiHoc | null>(null)
  const [selectedTest, setSelectedTest] = useState<BaiKiemTra | null>(null)

  // Giả lập Fetch Data từ Prisma API Client
  useEffect(() => {
    if (!classId) return
    const initData = async () => {
      setLoading(true)
      try {
        // Mock data chi tiết quan hệ thực tế tương thích DB
        const mockClass: ClassFullDetails = {
          ma_lop_hoc: classId,
          ten_lop: "Lớp Học Tiếng Anh Giao Tiếp IELTS K206",
          si_so_toi_da: 25,
          ngay_khai_giang: "2026-05-20T18:30:00.000Z",
          ngay_ket_thuc: "2026-08-20T21:00:00.000Z",
          lich_hoc: [{ thu: 2, ca: 3 }, { thu: 6, ca: 3 }],
          ma_phong_hoc: 10,
          ma_khoa_hoc: 4,
          phong_hoc: { ten_phong_hoc: "Phòng VIP 102", suc_chua: 30 },
          khoa_hoc: { ten_khoa_hoc: "Khóa luyện thi IELTS cam kết chuẩn đầu ra", hoc_phi: 8500000 },
          tham_gia: [
            { ma_tham_gia_lop: 1, ma_hoc_vien: 201, ngay_dang_ky: "2026-05-10", trang_thai: "Đang học", hoc_vien: { ma_hoc_vien: 201, ho_ten: "Lê Minh Hoàng", so_dien_thoai: "0911223344", email: "hoanglm@gmail.com" } },
            { ma_tham_gia_lop: 2, ma_hoc_vien: 202, ngay_dang_ky: "2026-05-11", trang_thai: "Đang học", hoc_vien: { ma_hoc_vien: 202, ho_ten: "Nguyễn Thị Mai", so_dien_thoai: "0988776655", email: "maintt@gmail.com" } }
          ],
          phan_cong_giang_day: [
            { ma_phan_cong_giang_day: 1, ma_giao_vien: 51, giao_vien: { ma_giao_vien: 51, ho_ten: "Cô Nguyễn Thu Hà", so_dien_thoai: "0904555666", email: "hant@center.edu.vn" } }
          ],
          buoi_hoc: [
            { 
              ma_buoi_hoc: 1001, ngay_hoc: "2026-05-22T18:30:00.000Z", noi_dung_hoc: "Phát âm chuẩn IPA & Kỹ năng làm bài Nghe", ma_giao_vien: 51, giao_vien: { ho_ten: "Cô Nguyễn Thu Hà" },
              diem_danh: [
                { ma_hoc_vien: 201, trang_thai: "Có mặt", ghi_chu: "Đi học đúng giờ" },
                { ma_hoc_vien: 202, trang_thai: "Vắng", ghi_chu: "Ốm có phép" }
              ],
              nhan_xet: [
                { ma_hoc_vien: 201, da_lam_bai_tap: true, noi_dung_nhan_xet: "Tiếp thu tốt, bài tập hoàn thành xuất sắc" },
                { ma_hoc_vien: 202, da_lam_bai_tap: false, noi_dung_nhan_xet: "Nghỉ học" }
              ]
            }
          ]
        }
        setClassData(mockClass)

        // Mock danh sách thực thể hệ thống bổ trợ tuyển chọn
        setAvailableStudents([
          { ma_hoc_vien: 203, ho_ten: "Phạm Tiến Đạt", so_dien_thoai: "0934123456", email: "datpt@gmail.com" },
          { ma_hoc_vien: 204, ho_ten: "Vũ Hoàng Yến", so_dien_thoai: "0975654321", email: "yenvh@gmail.com" }
        ])
        setAvailableTeachers([
          { ma_giao_vien: 52, ho_ten: "Thầy Johnathan Smith", so_dien_thoai: "0944000111", email: "john@center.edu.vn" },
          { ma_giao_vien: 53, ho_ten: "Thầy Trần Đức Anh", so_dien_thoai: "0922333444", email: "anhtd@center.edu.vn" }
        ])
        setCourseTests([
          { ma_bai_kiem_tra: 15, ten_bai_kiem_tra: "Đánh giá Năng lực Giữa kỳ (Mid-term Test)", ngay_kiem_tra: "2026-07-05", ma_khoa_hoc: 4 },
          { ma_bai_kiem_tra: 16, ten_bai_kiem_tra: "Khảo sát Chất lượng Đầu ra (Final Exam)", ngay_kiem_tra: "2026-08-18", ma_khoa_hoc: 4 }
        ])
        setTestResults([
          { ma_ket_qua_kiem_tra: 1, ma_bai_kiem_tra: 15, ma_hoc_vien: 201, diem_so: 7.5, trang_thai: "Đạt", nhan_xet: "Kỹ năng Viết khá tốt, cần cải thiện Nói" },
          { ma_ket_qua_kiem_tra: 2, ma_bai_kiem_tra: 15, ma_hoc_vien: 202, diem_so: 8.5, trang_thai: "Xuất sắc", nhan_xet: "Toàn diện các kỹ năng" }
        ])
      } catch (err) {
        console.error("Lỗi đồng bộ dữ liệu:", err)
      } finally {
        setLoading(false)
      }
    }
    initData()
  }, [classId])

  // ==========================================
  // LOGIC XỬ LÝ NGHIỆP VỤ (CRUD & TRANSACTION)
  // ==========================================

  // 1. Chỉnh sửa Lớp học (Model LopHoc)
  const handleEditClass = (e: React.FormEvent) => {
    e.preventDefault()
    if (!classData) return
    setClassData({
      ...classData,
      ten_lop: formData.ten_lop,
      si_so_toi_da: Number(formData.si_so_toi_da),
      ngay_khai_giang: formData.ngay_khai_giang,
      ngay_ket_thuc: formData.ngay_ket_thuc,
    })
    setModalType(null)
  }

  // 2. Thêm học viên vào lớp (Model ThamGiaLop)
  const handleAddStudent = (student: HocVien) => {
    if (!classData) return
    const isExist = classData.tham_gia.some(item => item.ma_hoc_vien === student.ma_hoc_vien)
    if (isExist) return alert("Học viên này đã tham gia lớp học từ trước!")
    
    const newParticipant: ThamGiaLop = {
      ma_tham_gia_lop: Date.now(),
      ma_hoc_vien: student.ma_hoc_vien,
      ngay_dang_ky: new Date().toISOString().split('T')[0],
      trang_thai: "Đang học",
      hoc_vien: student
    }
    setClassData({ ...classData, tham_gia: [...classData.tham_gia, newParticipant] })
    setAvailableStudents(availableStudents.filter(s => s.ma_hoc_vien !== student.ma_hoc_vien))
  }

  // 3. Xoá học viên khỏi lớp
  const handleRemoveStudent = (ma_tham_gia_lop: number, student: HocVien) => {
    if (!classData || !confirm("Bạn có chắc chắn muốn loại học viên này khỏi danh sách lớp?")) return
    setClassData({
      ...classData,
      tham_gia: classData.tham_gia.filter(item => item.ma_tham_gia_lop !== ma_tham_gia_lop)
    })
    setAvailableStudents([...availableStudents, student])
  }

  // 4. Phân công Giáo viên (Model PhanCongGiangDay)
  const handleAssignTeacher = (e: React.FormEvent) => {
    e.preventDefault()
    if (!classData) return
    const selectedTeacherId = Number(formData.ma_giao_vien)
    const teacher = availableTeachers.find(t => t.ma_giao_vien === selectedTeacherId)
    if (!teacher) return

    const newAssignment: PhanCongGiangDay = {
      ma_phan_cong_giang_day: Date.now(),
      ma_giao_vien: teacher.ma_giao_vien,
      giao_vien: teacher
    }
    setClassData({ ...classData, phan_cong_giang_day: [...classData.phan_cong_giang_day, newAssignment] })
    setAvailableTeachers(availableTeachers.filter(t => t.ma_giao_vien !== selectedTeacherId))
    setModalType(null)
  }

  // 5. Gỡ phân công giáo viên
  const handleUnassignTeacher = (ma_phan_cong: number, teacher: GiaoVien) => {
    if (!classData || !confirm("Bạn có chắc muốn hủy quyền giảng dạy của giáo viên này tại lớp?")) return
    setClassData({
      ...classData,
      phan_cong_giang_day: classData.phan_cong_giang_day.filter(p => p.ma_phan_cong_giang_day !== ma_phan_cong)
    })
    setAvailableTeachers([...availableTeachers, teacher])
  }

  // 6. Thêm hoặc Sửa buổi học (Model BuoiHoc)
  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault()
    if (!classData) return
    
    if (formData.ma_buoi_hoc) {
      // Sửa buổi học
      setClassData({
        ...classData,
        buoi_hoc: classData.buoi_hoc.map(b => b.ma_buoi_hoc === formData.ma_buoi_hoc ? { 
          ...b, 
          ngay_hoc: formData.ngay_hoc, 
          noi_dung_hoc: formData.noi_dung_hoc,
          ma_giao_vien: Number(formData.ma_giao_vien),
          giao_vien: { ho_ten: classData.phan_cong_giang_day.find(p => p.ma_giao_vien === Number(formData.ma_giao_vien))?.giao_vien.ho_ten || "Giảng viên" }
        } : b)
      })
    } else {
      // Thêm mới buổi học
      const newSession: BuoiHoc = {
        ma_buoi_hoc: Date.now(),
        ngay_hoc: formData.ngay_hoc,
        noi_dung_hoc: formData.noi_dung_hoc,
        ma_giao_vien: Number(formData.ma_giao_vien),
        giao_vien: { ho_ten: classData.phan_cong_giang_day.find(p => p.ma_giao_vien === Number(formData.ma_giao_vien))?.giao_vien.ho_ten || "Giảng viên" },
        diem_danh: [],
        nhan_xet: []
      }
      setClassData({ ...classData, buoi_hoc: [...classData.buoi_hoc, newSession] })
    }
    setModalType(null)
  }

  // 7. Xoá buổi học
  const handleDeleteSession = (ma_buoi_hoc: number) => {
    if (!classData || !confirm("Xóa buổi học sẽ làm mất toàn bộ dữ liệu điểm danh liên quan. Bạn chắc chắn chứ?")) return
    setClassData({ ...classData, buoi_hoc: classData.buoi_hoc.filter(b => b.ma_buoi_hoc !== ma_buoi_hoc) })
  }

  // 8. Lưu Điểm danh & Nhận xét thật (Model DiemDanh & NhanXet song song)
  const handleSaveDiemDanhNhanXet = (e: React.FormEvent) => {
    e.preventDefault()
    if (!classData || !selectedSession) return

    const updatedBuoiHoc = classData.buoi_hoc.map(b => {
      if (b.ma_buoi_hoc === selectedSession.ma_buoi_hoc) {
        return {
          ...b,
          diem_danh: formData.diem_danh,
          nhan_xet: formData.nhan_xet
        }
      }
      return b
    })

    setClassData({ ...classData, buoi_hoc: updatedBuoiHoc })
    setModalType(null)
    alert("Cập nhật sổ điểm danh và nhận xét buổi học thành công!")
  }

  // 9. Lưu Điểm số bài kiểm tra (Model KetQuaKiemTra)
  const handleSaveGrades = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Toàn bộ bảng điểm kiểm tra đã được đồng bộ hóa lên hệ thống!")
    setModalType(null)
  }

  if (loading) return <div className="p-8 text-center font-medium text-gray-500 animate-pulse">Đang nạp dữ liệu phân hệ đào tạo phase 2...</div>
  if (!classData) return <div className="p-8 text-center text-red-500">Thực thể lớp học không tồn tại!</div>

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-800">
      {/* HEADER QUẢN LÝ TẬP TRUNG */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div className="space-y-1">
          <button onClick={() => router.push('/dashboard/dao-tao/lop-hoc')} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition mb-1">
            <FaArrowLeft className="mr-1.5 text-xs" /> Danh sách quản lý lớp học
          </button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{classData.ten_lop}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 font-medium">
            <span>Khóa: <span className="text-gray-700 font-semibold">{classData.khoa_hoc.ten_khoa_hoc}</span></span>
            <span>•</span>
            <span>Địa điểm: <span className="text-gray-700 font-semibold">{classData.phong_hoc.ten_phong_hoc}</span></span>
          </div>
        </div>
        <button onClick={() => { setFormData({ ten_lop: classData.ten_lop, si_so_toi_da: classData.si_so_toi_da, ngay_khai_giang: classData.ngay_khai_giang?.split('T')[0], ngay_ket_thuc: classData.ngay_ket_thuc?.split('T')[0] }); setModalType('edit-class') }} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 transition">
          <FaEdit className="mr-2" /> Cấu hình lớp học
        </button>
      </div>

      {/* TABS CHUYỂN ĐỔI CHỨC NĂNG TÍCH HỢP */}
      <div className="flex border-b border-gray-200 bg-white px-4 pt-2 rounded-t-xl shadow-sm border-x border-t">
        {[
          { id: 'tong-quan', label: 'Thông tin chung', icon: FaClipboardList },
          { id: 'hoc-vien', label: `Học viên tham gia (${classData.tham_gia.length})`, icon: FaUserGraduate },
          { id: 'giang-vien', label: `Phân công giảng dạy (${classData.phan_cong_giang_day.length})`, icon: FaChalkboardTeacher },
          { id: 'buoi-hoc', label: `Nhật ký buổi học (${classData.buoi_hoc.length})`, icon: FaCalendarAlt },
          { id: 'kiem-tra', label: 'Khảo thí & Nhập điểm', icon: FaGraduationCap },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center space-x-2 pb-3.5 px-4 text-sm font-semibold transition-all border-b-2 -mb-px ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <tab.icon className="text-base" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* KHU VỰC THỂ HIỆN NỘI DUNG TABS CHÍNH */}
      <div className="bg-white p-6 rounded-b-xl shadow-sm border-x border-b">
        
        {/* TAB 1: THÔNG TIN TỔNG QUAN */}
        {activeTab === 'tong-quan' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 uppercase tracking-wider text-indigo-600">Thông số vận hành lớp</h3>
              <div className="grid grid-cols-3 gap-y-3 text-sm font-medium">
                <span className="text-gray-400">Sĩ số tối đa:</span>
                <span className="col-span-2 text-gray-800 font-semibold">{classData.si_so_toi_da} Học viên quy định</span>
                <span className="text-gray-400">Sức chứa phòng:</span>
                <span className="col-span-2 text-gray-800">{classData.phong_hoc.suc_chua} người</span>
                <span className="text-gray-400">Ngày khai giảng:</span>
                <span className="col-span-2 text-gray-800">{classData.ngay_khai_giang ? new Date(classData.ngay_khai_giang).toLocaleDateString('vi-VN') : 'Chưa thiết lập'}</span>
                <span className="text-gray-400">Ngày kết thúc:</span>
                <span className="col-span-2 text-gray-800">{classData.ngay_ket_thuc ? new Date(classData.ngay_ket_thuc).toLocaleDateString('vi-VN') : 'Chưa thiết lập'}</span>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 uppercase tracking-wider text-indigo-600">Lịch học gốc tuần</h3>
              <div className="grid grid-cols-1 gap-2">
                {classData.lich_hoc?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border text-sm font-semibold">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">Thứ {item.thu}</span>
                    <span className="text-gray-600">Ca học số: {item.ca}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: THÀNH VIÊN HỌC VIÊN (THÊM / XOÁ) */}
        {activeTab === 'hoc-vien' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Danh sách học viên chính thức</h3>
              <button onClick={() => setModalType('add-student')} className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition">
                <FaUserPlus className="mr-1.5" /> Biên chế học viên vào lớp
              </button>
            </div>
            <div className="overflow-x-auto border rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 font-bold text-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Mã số</th>
                    <th className="px-6 py-3 text-left">Họ và Tên</th>
                    <th className="px-6 py-3 text-left">Số điện thoại</th>
                    <th className="px-6 py-3 text-left">Email cá nhân</th>
                    <th className="px-6 py-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {classData.tham_gia.map((tg) => (
                    <tr key={tg.ma_tham_gia_lop} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3 font-mono font-bold text-gray-500">{tg.ma_hoc_vien}</td>
                      <td className="px-6 py-3 font-semibold text-gray-900">{tg.hoc_vien.ho_ten}</td>
                      <td className="px-6 py-3 text-gray-600">{tg.hoc_vien.so_dien_thoai || '-'}</td>
                      <td className="px-6 py-3 text-gray-600">{tg.hoc_vien.email || '-'}</td>
                      <td className="px-6 py-3 text-center">
                        <button onClick={() => handleRemoveStudent(tg.ma_tham_gia_lop, tg.hoc_vien)} className="text-red-600 hover:text-red-900 font-semibold inline-flex items-center text-xs">
                          <FaTrash className="mr-1" /> Trục xuất khỏi lớp
                        </button>
                      </td>
                    </tr>
                  ))}
                  {classData.tham_gia.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-6 text-gray-400 italic">Lớp học hiện chưa có học viên đăng ký tham gia.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PHÂN CÔNG GIẢNG VIÊN */}
        {activeTab === 'giang-vien' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Giáo viên phụ trách lớp học</h3>
              <button onClick={() => { setFormData({ ma_giao_vien: availableTeachers[0]?.ma_giao_vien || '' }); setModalType('assign-teacher') }} className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition">
                <FaPlus className="mr-1.5" /> Chỉ định giảng viên đứng lớp
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classData.phan_cong_giang_day.map((pc) => (
                <div key={pc.ma_phan_cong_giang_day} className="flex justify-between items-center p-4 border rounded-xl bg-gray-50 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">GV</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{pc.giao_vien.ho_ten}</h4>
                      <p className="text-xs text-gray-500">Liên hệ: {pc.giao_vien.so_dien_thoai || 'Trống'} | {pc.giao_vien.email}</p>
                    </div>
                  </div>
                  <button onClick={() => handleUnassignTeacher(pc.ma_phan_cong_giang_day, pc.giao_vien)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hủy phân công">
                    <FaTrash />
                  </button>
                </div>
              ))}
              {classData.phan_cong_giang_day.length === 0 && (
                <p className="text-sm text-gray-400 italic">Chưa thực hiện phân công nhân sự đứng lớp.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: BUỔI HỌC, ĐIỂM DANH & NHẬN XÉT THỰC TẾ */}
        {activeTab === 'buoi-hoc' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Chi tiết chuỗi ngày học thực tế</h3>
              <button onClick={() => { 
                if(classData.phan_cong_giang_day.length === 0) return alert("Vui lòng phân công ít nhất một giáo viên trước khi tạo buổi học!")
                setFormData({ ma_buoi_hoc: null, ngay_hoc: "", noi_dung_hoc: "", ma_giao_vien: classData.phan_cong_giang_day[0].ma_giao_vien })
                setModalType('session') 
              }} className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition">
                <FaPlus className="mr-1.5" /> Khởi tạo buổi học đơn lẻ
              </button>
            </div>
            <div className="space-y-3">
              {classData.buoi_hoc.map((buoi, idx) => (
                <div key={buoi.ma_buoi_hoc} className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 border rounded-xl hover:shadow-md transition bg-white gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-bold text-xs rounded">Buổi {idx + 1}</span>
                      <span className="text-sm text-gray-500 font-medium">{new Date(buoi.ngay_hoc).toLocaleString('vi-VN')}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-base">{buoi.noi_dung_hoc || "Chưa thiết lập trọng tâm bài học"}</h4>
                    <p className="text-xs text-gray-400 font-medium">Giáo viên phụ trách đứng lớp: <span className="text-gray-700 font-semibold">{buoi.giao_vien.ho_ten}</span></p>
                  </div>
                  
                  {/* CÁC HÀNH ĐỘNG PHASE 2: ĐIỂM DANH / SỬA / XÓA BUỔI HỌC */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                    <button onClick={() => {
                      setSelectedSession(buoi)
                      // Khởi tạo form dữ liệu điểm danh và nhận xét từ trước hoặc tạo mới
                      const initialDiemDanh = classData.tham_gia.map(tg => {
                        const existing = buoi.diem_danh?.find(d => d.ma_hoc_vien === tg.ma_hoc_vien)
                        return { ma_hoc_vien: tg.ma_hoc_vien, trang_thai: existing?.trang_thai || "Có mặt", ghi_chu: existing?.ghi_chu || "" }
                      })
                      const initialNhanXet = classData.tham_gia.map(tg => {
                        const existing = buoi.nhan_xet?.find(n => n.ma_hoc_vien === tg.ma_hoc_vien)
                        return { ma_hoc_vien: tg.ma_hoc_vien, da_lam_bai_tap: existing ? existing.da_lam_bai_tap : true, noi_dung_nhan_xet: existing?.noi_dung_nhan_xet || "" }
                      })
                      setFormData({ diem_danh: initialDiemDanh, nhan_xet: initialNhanXet })
                      setModalType('diem-danh-nhan-xet')
                    }} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition inline-flex items-center shadow-sm">
                      <FaFileSignature className="mr-1" /> Điểm danh & Nhận xét thật
                    </button>
                    <button onClick={() => { setFormData({ ma_buoi_hoc: buoi.ma_buoi_hoc, ngay_hoc: buoi.ngay_hoc.split('T')[0] + 'T' + buoi.ngay_hoc.split('T')[1].substring(0,5), noi_dung_hoc: buoi.noi_dung_hoc, ma_giao_vien: buoi.ma_giao_vien }); setModalType('session') }} className="p-2 border text-gray-500 hover:bg-gray-50 rounded-lg transition" title="Cập nhật buổi học">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteSession(buoi.ma_buoi_hoc)} className="p-2 border text-red-600 hover:bg-red-50 rounded-lg transition" title="Hủy bỏ buổi học">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              {classData.buoi_hoc.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-6">Lớp học chưa thiết lập danh sách chuỗi ngày học chi tiết.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: BÀI KIỂM TRA & NHẬP ĐIỂM (KHẢO THÍ) */}
        {activeTab === 'kiem-tra' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Các bài thi/kiểm tra thuộc chương trình khóa học</h3>
            <div className="grid grid-cols-1 gap-3">
              {courseTests.map((test) => (
                <div key={test.ma_bai_kiem_tra} className="flex justify-between items-center p-4 border rounded-xl bg-white shadow-sm hover:border-indigo-300 transition">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm md:text-base">{test.ten_bai_kiem_tra}</h4>
                    <p className="text-xs text-gray-500 font-medium">Lịch thi thiết lập: {new Date(test.ngay_kiem_tra).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <button onClick={() => { setSelectedTest(test); setModalType('nhap-diem') }} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm">
                    Nhập/Sửa điểm số học viên
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          HỆ THỐNG MODALS TOÀN DIỆN (POPUP INTERACTIVE FORMS)
      ========================================================================= */}

      {/* 1. Modal Sửa thông tin lớp */}
      {modalType === 'edit-class' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEditClass} className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Chỉnh sửa thông số vận hành lớp</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tên định danh lớp học</label>
                <input type="text" required value={formData.ten_lop || ''} onChange={(e) => setFormData({...formData, ten_lop: e.target.value})} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Sĩ số tối đa quy chuẩn</label>
                <input type="number" required value={formData.si_so_toi_da || ''} onChange={(e) => setFormData({...formData, si_so_toi_da: e.target.value})} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Ngày bắt đầu khai giảng</label>
                <input type="date" value={formData.ngay_khai_giang || ''} onChange={(e) => setFormData({...formData, ngay_khai_giang: e.target.value})} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Ngày dự kiến bế giảng</label>
                <input type="date" value={formData.ngay_ket_thuc || ''} onChange={(e) => setFormData({...formData, ngay_ket_thuc: e.target.value})} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Cập nhật</button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Modal Thêm học viên vào biên chế lớp */}
      {modalType === 'add-student' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-bold text-gray-900">Biên chế thêm học viên mới</h3>
              <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <p className="text-xs text-amber-600 font-semibold flex items-center"><FaExclamationTriangle className="mr-1" /> Chỉ hiển thị các học viên đang có trạng thái tự do trong hệ thống.</p>
            <div className="divide-y max-h-60 overflow-y-auto border rounded-lg">
              {availableStudents.map((student) => (
                <div key={student.ma_hoc_vien} className="flex justify-between items-center p-3 text-sm hover:bg-gray-50">
                  <div>
                    <h4 className="font-bold text-gray-900">{student.ho_ten}</h4>
                    <p className="text-xs text-gray-500">SĐT: {student.so_dien_thoai} | Email: {student.email}</p>
                  </div>
                  <button onClick={() => handleAddStudent(student)} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs rounded transition flex items-center">
                    <FaPlus className="mr-1" /> Biên chế lớp
                  </button>
                </div>
              ))}
              {availableStudents.length === 0 && <p className="p-4 text-center text-gray-400 italic text-sm">Không còn học viên khả dụng để bổ sung.</p>}
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Chỉ định giảng viên dạy học */}
      {modalType === 'assign-teacher' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAssignTeacher} className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Chọn giảng viên giảng dạy phụ trách</h3>
            <div className="text-sm">
              <label className="block font-semibold text-gray-700 mb-1">Giảng viên hệ thống khả dụng</label>
              <select value={formData.ma_giao_vien || ''} onChange={(e) => setFormData({ma_giao_vien: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500">
                {availableTeachers.map(t => (
                  <option key={t.ma_giao_vien} value={t.ma_giao_vien}>{t.ho_ten} ({t.email})</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
              <button type="submit" disabled={availableTeachers.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:bg-gray-300">Phân công đứng lớp</button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Modal Thêm / Sửa buổi học cụ thể */}
      {modalType === 'session' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveSession} className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{formData.ma_buoi_hoc ? "Cập nhật dữ liệu ngày học" : "Tạo buổi học thực tế mới"}</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Thời gian học chi tiết</label>
                <input type="datetime-local" required value={formData.ngay_hoc || ''} onChange={(e) => setFormData({...formData, ngay_hoc: e.target.value})} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nội dung bài giảng / Tiêu điểm</label>
                <textarea rows={3} placeholder="Ví dụ: Luyện đề Listening part 3 & Sửa bài viết dạng Task 1" value={formData.noi_dung_hoc || ''} onChange={(e) => setFormData({...formData, noi_dung_hoc: e.target.value})} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Giảng viên phụ trách dạy buổi này</label>
                <select value={formData.ma_giao_vien || ''} onChange={(e) => setFormData({...formData, ma_giao_vien: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500">
                  {classData.phan_cong_giang_day.map(p => (
                    <option key={p.ma_giao_vien} value={p.ma_giao_vien}>{p.giao_vien.ho_ten}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Lưu buổi học</button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Modal ĐIỂM DANH THẬT & NHẬN XÉT HỌC VIÊN ĐỒNG THỜI */}
      {modalType === 'diem-danh-nhan-xet' && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveDiemDanhNhanXet} className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full flex flex-col max-h-[90vh]">
            <div className="border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Sổ điểm danh & Đánh giá chi tiết buổi học</h3>
              <p className="text-xs text-gray-500 font-medium">Buổi ngày: {new Date(selectedSession.ngay_hoc).toLocaleString('vi-VN')} | Nội dung: {selectedSession.noi_dung_hoc}</p>
            </div>
            
            <div className="overflow-y-auto flex-1 space-y-4 border rounded-xl p-2 bg-gray-50">
              {classData.tham_gia.map((tg, idx) => {
                const currentDd = formData.diem_danh?.find((d: any) => d.ma_hoc_vien === tg.ma_hoc_vien)
                const currentNx = formData.nhan_xet?.find((n: any) => n.ma_hoc_vien === tg.ma_hoc_vien)

                return (
                  <div key={tg.ma_hoc_vien} className="p-4 bg-white border rounded-xl shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-bold text-gray-900 text-sm">{idx + 1}. {tg.hoc_vien.ho_ten}</span>
                      <span className="text-xs text-gray-400 font-mono">ID: {tg.ma_hoc_vien}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Cột 1: Nghiệp vụ điểm danh thực tế */}
                      <div className="space-y-1">
                        <label className="block font-bold text-gray-600">Trạng thái điểm danh</label>
                        <div className="flex space-x-3 pt-1">
                          {['Có mặt', 'Vắng'].map(status => (
                            <label key={status} className="flex items-center space-x-1.5 font-semibold cursor-pointer">
                              <input type="radio" checked={currentDd?.trang_thai === status} onChange={() => {
                                const newDd = formData.diem_danh.map((d: any) => d.ma_hoc_vien === tg.ma_hoc_vien ? { ...d, trang_thai: status } : d)
                                setFormData({ ...formData, diem_danh: newDd })
                              }} className="text-indigo-600 focus:ring-indigo-500" />
                              <span className={status === 'Có mặt' ? 'text-green-600' : 'text-red-500'}>{status}</span>
                            </label>
                          ))}
                        </div>
                        <input type="text" placeholder="Lý do đi muộn / nghỉ học..." value={currentDd?.ghi_chu || ''} onChange={(e) => {
                          const newDd = formData.diem_danh.map((d: any) => d.ma_hoc_vien === tg.ma_hoc_vien ? { ...d, ghi_chu: e.target.value } : d)
                          setFormData({ ...formData, diem_danh: newDd })
                        }} className="w-full border rounded p-1.5 mt-1 outline-none text-xs" />
                      </div>

                      {/* Cột 2 & 3: Kiểm tra bài tập & Ghi nhận học tập */}
                      <div className="md:col-span-2 space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="block font-bold text-gray-600">Kiểm tra bài tập & Đánh giá sư phạm</label>
                          <label className="inline-flex items-center space-x-1 font-semibold text-gray-700 cursor-pointer">
                            <input type="checkbox" checked={currentNx?.da_lam_bai_tap || false} onChange={(e) => {
                              const newNx = formData.nhan_xet.map((n: any) => n.ma_hoc_vien === tg.ma_hoc_vien ? { ...n, da_lam_bai_tap: e.target.checked } : n)
                              setFormData({ ...formData, nhan_xet: newNx })
                            }} className="rounded text-indigo-600 focus:ring-indigo-500" />
                            <span>Đã hoàn thành BTVN</span>
                          </label>
                        </div>
                        <textarea placeholder="Cô nhận xét thái độ học, mức độ tương tác và lỗi cần khắc phục..." rows={2} value={currentNx?.noi_dung_nhan_xet || ''} onChange={(e) => {
                          const newNx = formData.nhan_xet.map((n: any) => n.ma_hoc_vien === tg.ma_hoc_vien ? { ...n, noi_dung_nhan_xet: e.target.value } : n)
                          setFormData({ ...formData, nhan_xet: newNx })
                        }} className="w-full border rounded p-1.5 outline-none resize-none text-xs" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end space-x-2 pt-3 mt-4 border-t">
              <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg text-sm hover:bg-amber-700 transition flex items-center">
                <FaSave className="mr-1.5" /> Hoàn thành biểu điểm danh
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. Modal KHẢO THÍ: NHẬP ĐIỂM SỐ BÀI KIỂM TRA (KetQuaKiemTra) */}
      {modalType === 'nhap-diem' && selectedTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveGrades} className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full flex flex-col max-h-[85vh]">
            <div className="border-b pb-2 mb-3">
              <h3 className="text-lg font-bold text-gray-900">Bảng nhập điểm khảo thí học viên</h3>
              <p className="text-xs text-indigo-600 font-semibold">Bài kiểm tra: {selectedTest.ten_bai_kiem_tra}</p>
            </div>

            <div className="overflow-y-auto flex-1 border rounded-lg text-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 font-bold text-gray-700">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Học viên</th>
                    <th className="px-4 py-2.5 text-left" style={{ width: '120px' }}>Điểm số (Thang 10)</th>
                    <th className="px-4 py-2.5 text-left" style={{ width: '130px' }}>Trạng thái</th>
                    <th className="px-4 py-2.5 text-left">Nhận xét chi tiết bài thi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {classData.tham_gia.map((tg) => {
                    const result = testResults.find(r => r.ma_hoc_vien === tg.ma_hoc_vien && r.ma_bai_kiem_tra === selectedTest.ma_bai_kiem_tra)
                    return (
                      <tr key={tg.ma_hoc_vien}>
                        <td className="px-4 py-2 font-semibold text-gray-900">{tg.hoc_vien.ho_ten}</td>
                        <td className="px-4 py-2">
                          <input type="number" step="0.1" min="0" max="10" defaultValue={result?.diem_so || 0} className="w-full border rounded p-1 font-bold text-center outline-none focus:ring-1 focus:ring-indigo-500" />
                        </td>
                        <td className="px-4 py-2">
                          <select defaultValue={result?.trang_thai || "Đạt"} className="w-full border rounded p-1 outline-none text-xs">
                            <option value="Đạt">Đạt tiêu chuẩn</option>
                            <option value="Xuất sắc">Xuất sắc</option>
                            <option value="Cần thi lại">Cần thi lại</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input type="text" placeholder="Nhận xét ưu nhược điểm bài thi..." defaultValue={result?.nhan_xet || ''} className="w-full border rounded p-1 text-xs outline-none" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-2 pt-3 mt-4 border-t">
              <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition">Đồng bộ bảng điểm</button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}