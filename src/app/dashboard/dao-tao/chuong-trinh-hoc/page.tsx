"use client";

import React, { useState, useEffect, useCallback } from "react";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ChuongTrinhHocGopPage() {
  // --------------------------------------------------------
  // STATE ĐIỀU HƯỚNG GIAO DIỆN CHÍNH (Xem danh sách VS Xem chi tiết)
  // --------------------------------------------------------
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [chiTietData, setChiTietData] = useState<any>(null);
  const [loadingChiTiet, setLoadingChiTiet] = useState<boolean>(false);

  // States quản lý danh sách chương trình
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, totalPages: 1 });

  // States quản lý Modal Chương Trình Học
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState({ ma_chuong_trinh: "", ten_chuong_trinh: "", mo_ta: "", muc_tieu: "" });

  // States quản lý Modal Khóa Học Con (Nằm bên trong giao diện chi tiết)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(false);
  const [courseModalType, setCourseModalType] = useState<"add" | "edit">("add");
  const [courseFormData, setCourseFormData] = useState({
    courseId: "",
    ten_khoa_hoc: "",
    mo_ta: "",
    thoi_luong: "",
    hoc_phi: "",
    trinh_do: "",
    trang_thai: "Hoạt động",
  });

  // --------------------------------------------------------
  // LOGIC TRUY VẤN DỮ LIỆU (FETCH DATA)
  // --------------------------------------------------------
  const fetchDanhSach = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dao-tao/chuong-trinh-hoc?page=${page}&limit=10&search=${search}`);
      const result = await res.json();
      if (result.success) {
        setDataList(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const fetchChiTietChuongTrinh = useCallback(async (id: number) => {
    setLoadingChiTiet(true);
    try {
      const res = await fetch(`/api/dao-tao/chuong-trinh-hoc?id=${id}`);
      const result = await res.json();
      if (result.success) {
        setChiTietData(result.data);
      } else {
        alert(result.message || "Không thể tải thông tin chi tiết");
        setSelectedProgramId(null);
      }
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
    } finally {
      setLoadingChiTiet(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProgramId !== null) {
      fetchChiTietChuongTrinh(selectedProgramId);
    } else {
      fetchDanhSach();
    }
  }, [selectedProgramId, page, search, fetchDanhSach, fetchChiTietChuongTrinh]);

  // --------------------------------------------------------
  // HÀNH ĐỘNG: CRUD CHƯƠNG TRÌNH HỌC GỐC
  // --------------------------------------------------------
  const handleProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ten_chuong_trinh.trim()) return alert("Tên chương trình là bắt buộc");

    try {
      const isEdit = modalType === "edit";
      const url = isEdit 
        ? `/api/dao-tao/chuong-trinh-hoc?id=${formData.ma_chuong_trinh}` 
        : `/api/dao-tao/chuong-trinh-hoc`;
      
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ten_chuong_trinh: formData.ten_chuong_trinh,
          mo_ta: formData.mo_ta,
          muc_tieu: formData.muc_tieu,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setIsModalOpen(false);
        fetchDanhSach();
      } else {
        alert(result.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi xử lý form chương trình:", error);
    }
  };

  const handleProgramDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chương trình học này khỏi hệ thống?")) return;
    try {
      const res = await fetch(`/api/dao-tao/chuong-trinh-hoc?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        alert("Xóa chương trình học thành công!");
        fetchDanhSach();
      } else {
        alert(result.message || "Xóa thất bại. Chương trình này đang chứa khóa học con.");
      }
    } catch (error) {
      console.error("Lỗi xóa dữ liệu:", error);
    }
  };

  // --------------------------------------------------------
  // HÀNH ĐỘNG: CRUD KHÓA HỌC CON (SỬA MỀM AN TOÀN ĐÃ SỬA LỖI ĐỒNG BỘ)
  // --------------------------------------------------------
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormData.ten_khoa_hoc.trim()) return alert("Tên khóa học là bắt buộc.");

    try {
      const isEdit = courseModalType === "edit";
      
      // Payload được định cấu trúc hành động rõ ràng gửi thẳng lên API PUT gộp
      const payload = {
        action: isEdit ? "updateCourse" : "createCourse",
        courseId: courseFormData.courseId,
        ten_khoa_hoc: courseFormData.ten_khoa_hoc,
        mo_ta: courseFormData.mo_ta,
        thoi_luong: courseFormData.thoi_luong,
        hoc_phi: Number(courseFormData.hoc_phi) || 0, // Kiểm soát kiểu dữ liệu
        trinh_do: courseFormData.trinh_do,
        trang_thai: courseFormData.trang_thai, // Đẩy trạng thái trực tiếp lên database
      };

      const res = await fetch(`/api/dao-tao/chuong-trinh-hoc?id=${selectedProgramId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        alert(isEdit ? "Cập nhật trạng thái khóa học thành công!" : "Thêm khóa học thành công!");
        setIsCourseModalOpen(false);
        if (selectedProgramId) fetchChiTietChuongTrinh(selectedProgramId); // Reload tức thì dữ liệu chi tiết mới
      } else {
        alert(result.message || "Lỗi cập nhật thông tin khóa học");
      }
    } catch (error) {
      console.error("Lỗi gửi dữ liệu khóa học:", error);
    }
  };

  const handleCourseDelete = async (courseId: number) => {
    if (!confirm("Bạn có muốn xóa khóa học này? Các lớp học liên quan có thể bị ảnh hưởng.")) return;
    try {
      const res = await fetch(`/api/dao-tao/chuong-trinh-hoc?id=${selectedProgramId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteCourse",
          courseId: courseId,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Xóa khóa học thành công!");
        if (selectedProgramId) fetchChiTietChuongTrinh(selectedProgramId);
      } else {
        alert(result.message || "Không thể thực hiện hành động xóa");
      }
    } catch (error) {
      console.error("Lỗi xóa khóa học:", error);
    }
  };

  // --------------------------------------------------------
  // GIAO DIỆN RENDER CHÍNH
  // --------------------------------------------------------
  
  // NẾU CHỌN XEM CHI TIẾT CHƯƠNG TRÌNH HỌC KHÁCH HÀNG:
  if (selectedProgramId !== null) {
    if (loadingChiTiet) return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu hồ sơ chi tiết...</div>;
    if (!chiTietData) return null;

    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
        <button 
          onClick={() => { setChiTietData(null); setSelectedProgramId(null); }}
          className="text-sm text-blue-600 hover:underline flex items-center space-x-1 font-medium"
        >
          <span>← Quay lại danh sách chính</span>
        </button>

        {/* Khối hồ sơ tổng quan chương trình */}
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Hồ sơ tổng quát</span>
          <h1 className="text-2xl font-bold text-slate-800">{chiTietData.ten_chuong_trinh}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-sm">
            <div>
              <p className="font-semibold text-slate-400">Mô tả tổng quan:</p>
              <p className="text-slate-700 font-medium mt-1">{chiTietData.mo_ta || "Chưa thiết lập mô tả tổng quan."}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-400">Mục tiêu chuẩn đầu ra:</p>
              <p className="text-slate-700 font-medium mt-1">{chiTietData.muc_tieu || "Chưa có cấu hình mục tiêu."}</p>
            </div>
          </div>
        </div>

        {/* Khối quản lý danh sách khóa học liên quan */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Khóa Học Trực Thuộc Chương Trình</h2>
            <button
              onClick={() => {
                setCourseModalType("add");
                setCourseFormData({ courseId: "", ten_khoa_hoc: "", mo_ta: "", thoi_luong: "", hoc_phi: "", trinh_do: "", trang_thai: "Hoạt động" });
                setIsCourseModalOpen(true);
              }}
              className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              + Thêm Khóa Học Con
            </button>
          </div>

          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-600 uppercase">
                  <th className="p-4">Mã</th>
                  <th className="p-4">Tên khóa học</th>
                  <th className="p-4">Trình độ / Thời lượng</th>
                  <th className="p-4">Học phí</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-slate-700">
                {chiTietData.khoa_hoc?.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-400">Chưa có khóa học nào trực thuộc chương trình này.</td></tr>
                ) : (
                  chiTietData.khoa_hoc.map((course: any) => (
                    <tr key={course.ma_khoa_hoc} className="hover:bg-slate-50/40">
                      <td className="p-4 text-slate-400">#{course.ma_khoa_hoc}</td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-800">{course.ten_khoa_hoc}</p>
                        <p className="text-xs text-slate-400 truncate max-w-xs">{course.mo_ta || "Không có mô tả"}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{course.trinh_do || "Mọi cấp độ"}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{course.thoi_luong || "—"}</p>
                      </td>
                      <td className="p-4 font-semibold text-emerald-600">
                        {Number(course.hoc_phi).toLocaleString("vi-VN")} đ
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          course.trang_thai === "Hoạt động" 
                            ? "bg-emerald-50 text-emerald-700" 
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {course.trang_thai || "Hoạt động"}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-3">
                        <button
                          onClick={() => {
                            setCourseModalType("edit");
                            setCourseFormData({
                              courseId: course.ma_khoa_hoc.toString(),
                              ten_khoa_hoc: course.ten_khoa_hoc,
                              mo_ta: course.mo_ta || "",
                              thoi_luong: course.thoi_luong || "",
                              hoc_phi: course.hoc_phi.toString(),
                              trinh_do: course.trinh_do || "",
                              trang_thai: course.trang_thai || "Hoạt động",
                            });
                            setIsCourseModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-xs"
                        >
                          Sửa đổi / Trạng thái
                        </button>
                        <button
                          onClick={() => handleCourseDelete(course.ma_khoa_hoc)}
                          className="text-rose-600 hover:text-rose-700 font-medium text-xs"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL CRUD KHÓA HỌC CON */}
        {isCourseModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                {courseModalType === "add" ? "Thêm Khóa Học Mới" : "Cập Nhật Khóa Học & Trạng Thái"}
              </h2>
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tên khóa học *</label>
                  <input
                    type="text"
                    required
                    value={courseFormData.ten_khoa_hoc}
                    onChange={(e) => setCourseFormData({ ...courseFormData, ten_khoa_hoc: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Trình độ</label>
                    <input
                      type="text"
                      value={courseFormData.trinh_do}
                      onChange={(e) => setCourseFormData({ ...courseFormData, trinh_do: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Thời lượng</label>
                    <input
                      type="text"
                      value={courseFormData.thoi_luong}
                      onChange={(e) => setCourseFormData({ ...courseFormData, thoi_luong: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Học phí (VNĐ) *</label>
                    <input
                      type="number"
                      required
                      value={courseFormData.hoc_phi}
                      onChange={(e) => setCourseFormData({ ...courseFormData, hoc_phi: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Trạng thái khóa học</label>
                    <select
                      value={courseFormData.trang_thai}
                      onChange={(e) => setCourseFormData({ ...courseFormData, trang_thai: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                    >
                      <option value="Hoạt động">Hoạt động</option>
                      <option value="Tạm dừng">Tạm dừng</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mô tả ngắn</label>
                  <textarea
                    value={courseFormData.mo_ta}
                    onChange={(e) => setCourseFormData({ ...courseFormData, mo_ta: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-16 resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCourseModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-sm hover:bg-slate-50 text-slate-600"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  >
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MẶC ĐỊNH: RENDER TRANG DANH SÁCH CHƯƠNG TRÌNH HỌC CHÍNH (ĐÃ XÓA TRẠNG THÁI)
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Quản Lý Chương Trình Học Đào Tạo</h1>
        <button
          onClick={() => {
            setModalType("add");
            setFormData({ ma_chuong_trinh: "", ten_chuong_trinh: "", mo_ta: "", muc_tieu: "" });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
        >
          + Thêm Chương Trình Mới
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên chương trình..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full md:w-80 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">Mã</th>
              <th className="p-4">Tên chương trình đào tạo</th>
              <th className="p-4">Mô tả / Chuẩn đầu ra</th>
              <th className="p-4">Sức chứa liên kết</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm text-slate-700">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Đang đồng bộ dữ liệu hệ thống...</td></tr>
            ) : dataList.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Không tìm thấy bản ghi phù hợp.</td></tr>
            ) : (
              dataList.map((item) => (
                <tr key={item.ma_chuong_trinh} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 font-semibold text-slate-400">#{item.ma_chuong_trinh}</td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedProgramId(item.ma_chuong_trinh)}
                      className="text-left font-bold text-blue-600 hover:underline"
                    >
                      {item.ten_chuong_trinh}
                    </button>
                  </td>
                  <td className="p-4 max-w-xs truncate">
                    <p className="text-slate-800 font-medium">{item.mo_ta || "—"}</p>
                    <p className="text-xs text-slate-400 italic mt-0.5">{item.muc_tieu || ""}</p>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                      {item.khoa_hoc?.length || 0} khóa học con
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => {
                        setModalType("edit");
                        setFormData({
                          ma_chuong_trinh: item.ma_chuong_trinh,
                          ten_chuong_trinh: item.ten_chuong_trinh,
                          mo_ta: item.mo_ta || "",
                          muc_tieu: item.muc_tieu || "",
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-amber-600 hover:text-amber-700 font-semibold text-xs"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleProgramDelete(item.ma_chuong_trinh)}
                      className="text-rose-600 hover:text-rose-700 font-medium text-xs"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-slate-500">
          <p>Tổng cộng: {pagination.total} bản ghi</p>
          <div className="space-x-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded text-xs disabled:opacity-40">Trước</button>
            <span className="px-3 py-1 bg-slate-100 font-medium rounded text-xs">{page} / {pagination.totalPages}</span>
            <button disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded text-xs disabled:opacity-40">Sau</button>
          </div>
        </div>
      )}

      {/* MODAL CRUD CHƯƠNG TRÌNH HỌC */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              {modalType === "add" ? "Tạo Chương Trình Đào Tạo Mới" : "Cập Nhật Thông Tin"}
            </h2>
            <form onSubmit={handleProgramSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tên chương trình học *</label>
                <input
                  type="text"
                  required
                  value={formData.ten_chuong_trinh}
                  onChange={(e) => setFormData({ ...formData, ten_chuong_trinh: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mô tả ngắn</label>
                <textarea
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none h-20 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mục tiêu đầu ra</label>
                <input
                  type="text"
                  value={formData.muc_tieu}
                  onChange={(e) => setFormData({ ...formData, muc_tieu: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm text-slate-600">Đóng</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}