import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface GetChuongTrinhHocParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ChuongTrinhHocInput {
  ten_chuong_trinh: string;
  mo_ta?: string | null;
  muc_tieu?: string | null;
}

export interface KhoaHocLienKetInput {
  ten_khoa_hoc?: string;
  mo_ta?: string | null;
  thoi_luong?: string | null;
  hoc_phi?: number;
  trinh_do?: string | null;
  trang_thai?: string | null;
}

export const chuongTrinhHocService = {
  /**
   * 1. LẤY DANH SÁCH CHƯƠNG TRÌNH HỌC (Phân trang + Tìm kiếm)
   * Không lọc trạng thái vì Schema không định nghĩa cột trang_thai cho ChuongTrinhHoc
   */
  async getDanhSachChuongTrinhHoc(params: GetChuongTrinhHocParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;
    const search = params.search || "";

    try {
      const whereCondition: Prisma.ChuongTrinhHocWhereInput = {};

      if (search) {
        whereCondition.OR = [
          { ten_chuong_trinh: { contains: search, mode: "insensitive" } },
          { mo_ta: { contains: search, mode: "insensitive" } },
        ];
      }

      const [total, data] = await prisma.$transaction([
        prisma.chuongTrinhHoc.count({ where: whereCondition }),
        prisma.chuongTrinhHoc.findMany({
          where: whereCondition,
          skip,
          take: limit,
          include: {
            khoa_hoc: {
              include: {
                lop_hoc: true, // Thống kê số lượng lớp học gián tiếp thuộc khóa học
              },
            },
          },
          orderBy: {
            ma_chuong_trinh: "desc",
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
    } catch (error: unknown) {
      console.error("Error tại getDanhSachChuongTrinhHoc Service:", error);
      throw new Error(error instanceof Error ? error.message : "Không thể lấy danh sách chương trình học.");
    }
  },

  /**
   * 2. LẤY CHI TIẾT CHƯƠNG TRÌNH HỌC kèm các Khóa học liên thuộc
   */
  async getChiTietChuongTrinhHoc(ma_chuong_trinh: number) {
    try {
      const chuongTrinh = await prisma.chuongTrinhHoc.findUnique({
        where: { ma_chuong_trinh },
        include: {
          khoa_hoc: {
            include: {
              lop_hoc: true,
            },
            orderBy: { ma_khoa_hoc: "asc" }
          },
        },
      });

      if (!chuongTrinh) {
        return { success: false, message: "Không tìm thấy hồ sơ chương trình học này." };
      }

      return { success: true, data: chuongTrinh };
    } catch (error: unknown) {
      console.error("Error tại getChiTietChuongTrinhHoc Service:", error);
      throw new Error(error instanceof Error ? error.message : "Không thể lấy chi tiết chương trình học.");
    }
  },

  /**
   * 3. TẠO MỚI CHƯƠNG TRÌNH HỌC
   */
  async createChuongTrinhHoc(data: ChuongTrinhHocInput) {
    try {
      const newProgram = await prisma.chuongTrinhHoc.create({
        data: {
          ten_chuong_trinh: data.ten_chuong_trinh,
          mo_ta: data.mo_ta || null,
          muc_tieu: data.muc_tieu || null,
        },
      });
      return { success: true, data: newProgram };
    } catch (error: unknown) {
      console.error("Error tại createChuongTrinhHoc Service:", error);
      throw new Error(error instanceof Error ? error.message : "Không thể tạo chương trình học mới.");
    }
  },

  /**
   * 4. CẬP NHẬT CHƯƠNG TRÌNH HỌC
   */
  async updateChuongTrinhHoc(ma_chuong_trinh: number, data: Partial<ChuongTrinhHocInput>) {
    try {
      const updatedProgram = await prisma.chuongTrinhHoc.update({
        where: { ma_chuong_trinh },
        data: {
          ...(data.ten_chuong_trinh !== undefined && { ten_chuong_trinh: data.ten_chuong_trinh }),
          ...(data.mo_ta !== undefined && { mo_ta: data.mo_ta }),
          ...(data.muc_tieu !== undefined && { muc_tieu: data.muc_tieu }),
        },
      });
      return { success: true, data: updatedProgram };
    } catch (error: unknown) {
      console.error("Error tại updateChuongTrinhHoc Service:", error);
      throw new Error(error instanceof Error ? error.message : "Không thể cập nhật chương trình học.");
    }
  },

  /**
   * 5. XÓA CỨNG CHƯƠNG TRÌNH HỌC (Hard Delete khỏi hệ thống)
   */
  async deleteChuongTrinhHoc(ma_chuong_trinh: number) {
    try {
      await prisma.chuongTrinhHoc.delete({
        where: { ma_chuong_trinh },
      });
      return { success: true, message: "Xóa chương trình học thành công." };
    } catch (error: unknown) {
      console.error("Error tại deleteChuongTrinhHoc Service:", error);
      throw new Error(error instanceof Error ? error.message : "Xóa thất bại. Kiểm tra dữ liệu khóa học liên kết.");
    }
  },

  // ========================================================
  // CÁC HÀM PHỤ TRỢ XỬ LÝ KHÓA HỌC THUỘC CHƯƠNG TRÌNH NÀY
  // ========================================================

  async createKhoaHocLienKet(ma_chuong_trinh: number, data: KhoaHocLienKetInput) {
    try {
      if (!data.ten_khoa_hoc) throw new Error("Tên khóa học liên kết là bắt buộc.");
      
      const newCourse = await prisma.khoaHoc.create({
        data: {
          ten_khoa_hoc: data.ten_khoa_hoc,
          mo_ta: data.mo_ta || null,
          thoi_luong: data.thoi_luong || null,
          hoc_phi: new Prisma.Decimal(data.hoc_phi || 0),
          trinh_do: data.trinh_do || null,
          trang_thai: data.trang_thai || "Hoạt động",
          ma_chuong_trinh,
        },
      });
      return { success: true, data: newCourse };
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Lỗi tạo khóa học liên kết.");
    }
  },

  async updateKhoaHocLienKet(ma_khoa_hoc: number, data: KhoaHocLienKetInput) {
    try {
      const updateData: any = {
        ...(data.ten_khoa_hoc !== undefined && { ten_khoa_hoc: data.ten_khoa_hoc }),
        ...(data.mo_ta !== undefined && { mo_ta: data.mo_ta }),
        ...(data.thoi_luong !== undefined && { thoi_luong: data.thoi_luong }),
        ...(data.trinh_do !== undefined && { trinh_do: data.trinh_do }),
        ...(data.trang_thai !== undefined && { trang_thai: data.trang_thai }),
      };

      if (data.hoc_phi !== undefined && data.hoc_phi !== null) {
        updateData.hoc_phi = new Prisma.Decimal(data.hoc_phi);
      }

      const updatedCourse = await prisma.khoaHoc.update({
        where: { ma_khoa_hoc },
        data: updateData,
      });
      return { success: true, data: updatedCourse };
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Lỗi sửa khóa học liên kết.");
    }
  },

  async deleteKhoaHocLienKet(ma_khoa_hoc: number) {
    try {
      await prisma.khoaHoc.delete({
        where: { ma_khoa_hoc },
      });
      return { success: true, message: "Xóa khóa học liên kết khỏi hệ thống." };
    } catch (error: unknown) {
      throw new Error("Không thể xóa khóa học. Vui lòng kiểm tra lại liên kết lớp học.");
    }
  },
};