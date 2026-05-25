import { prisma } from "@/lib/prisma"; // Giả định instance Prisma Client của project đặt tại đây

export interface GetHocVienParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const hocVienService = {
  /**
   * Lấy danh sách học viên phân trang, tìm kiếm và include đầy đủ quan hệ
   */
  async getDanhSachHocVien(params: GetHocVienParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;
    const search = params.search || "";

    try {
      // Điều kiện lọc mặc định: Loại bỏ các học viên đã bị xóa mềm
      const whereCondition: any = {
        trang_thai: { not: "Đã xóa" },
      };

      // Xử lý tìm kiếm đa tiêu chí: Tên, Số điện thoại, Email
      if (search) {
        whereCondition.OR = [
          { ho_ten: { contains: search, mode: "insensitive" } },
          { so_dien_thoai: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      // Đếm tổng số và truy vấn dữ liệu đồng thời qua $transaction
      const [total, data] = await prisma.$transaction([
        prisma.hocVien.count({ where: whereCondition }),
        prisma.hocVien.findMany({
          where: whereCondition,
          skip,
          take: limit,
          include: {
            // 1. Include Lớp Học thông qua bảng trung gian ThamGiaLop
            tham_gia_lop: {
              include: {
                lop_hoc: true,
              },
            },
            // 2. Include Phiếu thu học phí
            phieu_thu: true,
            // 3. Include Cam kết học viên
            cam_ket: true,
            // 4. Include Bài kiểm tra qua bảng kết quả kiểm tra
            ket_qua_kt: {
              include: {
                bai_kiem_tra: true,
              },
            },
            // 5. Include Buổi học thông qua dữ liệu điểm danh
            diem_danh: {
              include: {
                buoi_hoc: true,
              },
            },
          },
          orderBy: {
            ma_hoc_vien: "desc",
          },
        }),
      ]);

      return {
        success: true,
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      console.error("Error tại getDanhSachHocVien Service:", error);
      throw new Error(error.message || "Không thể lấy danh sách học viên.");
    }
  },

  /**
   * Lấy chi tiết một học viên kèm tất cả lịch sử đào tạo & tài chính liên quan
   */
  async getChiTietHocVien(ma_hoc_vien: number) {
    try {
      const hocVien = await prisma.hocVien.findFirst({
        where: {
          ma_hoc_vien,
          trang_thai: { not: "Đã xóa" },
        },
        include: {
          tham_gia_lop: {
            include: {
              lop_hoc: true,
            },
          },
          phieu_thu: true,
          cam_ket: true,
          ket_qua_kt: {
            include: {
              bai_kiem_tra: true,
            },
          },
          diem_danh: {
            include: {
              buoi_hoc: true,
            },
          },
        },
      });

      if (!hocVien) {
        return { success: false, message: "Không tìm thấy hồ sơ học viên này hoặc dữ liệu đã bị xóa." };
      }

      return { success: true, data: hocVien };
    } catch (error: any) {
      console.error("Error tại getChiTietHocVien Service:", error);
      throw new Error(error.message || "Không thể lấy chi tiết học viên.");
    }
  },

  /**
   * Thêm mới một học viên
   */
  async createHocVien(data: any) {
    try {
      const newHocVien = await prisma.hocVien.create({
        data: {
          ho_ten: data.ho_ten,
          ngay_sinh: data.ngay_sinh ? new Date(data.ngay_sinh) : null,
          gioi_tinh: data.gioi_tinh || null,
          so_dien_thoai: data.so_dien_thoai || null,
          email: data.email || null,
          dia_chi: data.dia_chi || null,
          dau_ra_chung_chi: data.dau_ra_chung_chi || null,
          trang_thai: data.trang_thai || "Đang học",
        },
      });
      return { success: true, data: newHocVien };
    } catch (error: any) {
      console.error("Error tại createHocVien Service:", error);
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        throw new Error("Email này đã tồn tại trên hệ thống.");
      }
      throw new Error(error.message || "Không thể tạo học viên mới.");
    }
  },

  /**
   * Cập nhật thông tin học viên
   */
  async updateHocVien(ma_hoc_vien: number, data: any) {
    try {
      const updatedHocVien = await prisma.hocVien.update({
        where: { ma_hoc_vien },
        data: {
          ho_ten: data.ho_ten,
          ngay_sinh: data.ngay_sinh ? new Date(data.ngay_sinh) : null,
          gioi_tinh: data.gioi_tinh,
          so_dien_thoai: data.so_dien_thoai,
          email: data.email,
          dia_chi: data.dia_chi,
          dau_ra_chung_chi: data.dau_ra_chung_chi,
          trang_thai: data.trang_thai,
        },
      });
      return { success: true, data: updatedHocVien };
    } catch (error: any) {
      console.error("Error tại updateHocVien Service:", error);
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        throw new Error("Email này đã trùng với một học viên khác.");
      }
      throw new Error(error.message || "Không thể cập nhật thông tin học viên.");
    }
  },

  /**
   * Xóa mềm bằng cách thay đổi trạng thái sang "Đã xóa"
   */
  async softDeleteHocVien(ma_hoc_vien: number) {
    try {
      const deletedHocVien = await prisma.hocVien.update({
        where: { ma_hoc_vien },
        data: {
          trang_thai: "Đã xóa",
        },
      });
      return { success: true, data: deletedHocVien };
    } catch (error: any) {
      console.error("Error tại softDeleteHocVien Service:", error);
      throw new Error(error.message || "Không thể thực hiện xóa mềm học viên.");
    }
  },
};