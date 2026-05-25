import { prisma } from "@/lib/prisma";

export interface GetNhanSuParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface NhanSuInput {
  ho_ten: string;
  ngay_sinh?: string | null;
  gioi_tinh?: string | null;
  so_dien_thoai?: string | null;
  email?: string | null;
  dia_chi?: string | null;
  ma_chuc_vu: number;
  ma_phong_ban: number;
}

export const nhanSuService = {
  /**
   * Lấy danh sách nhân sự phân trang, tìm kiếm và đầy đủ quan hệ
   */
  async getDanhSachNhanSu(params: GetNhanSuParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;
    const search = params.search || "";

    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        { ho_ten: { contains: search, mode: "insensitive" } },
        { so_dien_thoai: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    try {
      const [total, data] = await prisma.$transaction([
        prisma.nhanSu.count({ where: whereCondition }),
        prisma.nhanSu.findMany({
          where: whereCondition,
          skip,
          take: limit,
          include: {
            chuc_vu: true,
            phong_ban: true,
            hop_dong: true,
          },
          orderBy: {
            ma_nhan_su: "desc",
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
      const msg = error instanceof Error ? error.message : "Không thể lấy danh sách nhân sự.";
      console.error("Error tại getDanhSachNhanSu Service:", error);
      throw new Error(msg);
    }
  },

  /**
   * Lấy chi tiết thông tin một nhân sự
   */
  async getChiTietNhanSu(ma_nhan_su: number) {
    try {
      const nhanSu = await prisma.nhanSu.findUnique({
        where: { ma_nhan_su },
        include: {
          chuc_vu: true,
          phong_ban: true,
          hop_dong: true,
        },
      });

      if (!nhanSu) {
        return { success: false, message: "Không tìm thấy hồ sơ nhân sự." };
      }

      return { success: true, data: nhanSu };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Lỗi truy xuất dữ liệu nhân sự.";
      throw new Error(msg);
    }
  },

  /**
   * Thêm mới nhân sự
   */
  async createNhanSu(data: NhanSuInput) {
    try {
      const newNhanSu = await prisma.nhanSu.create({
        data: {
          ho_ten: data.ho_ten,
          ngay_sinh: data.ngay_sinh ? new Date(data.ngay_sinh) : null,
          gioi_tinh: data.gioi_tinh,
          so_dien_thoai: data.so_dien_thoai,
          email: data.email,
          dia_chi: data.dia_chi,
          ma_chuc_vu: Number(data.ma_chuc_vu),
          ma_phong_ban: Number(data.ma_phong_ban),
        },
      });
      return { success: true, data: newNhanSu };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Không thể tạo hồ sơ nhân sự.";
      throw new Error(msg);
    }
  },

  /**
   * Cập nhật thông tin nhân sự
   */
  async updateNhanSu(ma_nhan_su: number, data: NhanSuInput) {
    try {
      const updated = await prisma.nhanSu.update({
        where: { ma_nhan_su },
        data: {
          ho_ten: data.ho_ten,
          ngay_sinh: data.ngay_sinh ? new Date(data.ngay_sinh) : null,
          gioi_tinh: data.gioi_tinh,
          so_dien_thoai: data.so_dien_thoai,
          email: data.email,
          dia_chi: data.dia_chi,
          ma_chuc_vu: Number(data.ma_chuc_vu),
          ma_phong_ban: Number(data.ma_phong_ban),
        },
      });
      return { success: true, data: updated };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Không thể cập nhật hồ sơ nhân sự.";
      throw new Error(msg);
    }
  },

  /**
   * Xóa nhân sự (Bản chất schema gốc không có trường flag Soft Delete riêng biệt cho nhân sự, 
   * ta sử dụng giải pháp xóa hoặc lọc nghiệp vụ theo quy chuẩn dự án)
   */
  async deleteNhanSu(ma_nhan_su: number) {
    try {
      await prisma.nhanSu.delete({
        where: { ma_nhan_su },
      });
      return { success: true, message: "Xóa hồ sơ nhân sự thành công." };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Không thể thực hiện xóa nhân sự.";
      throw new Error(msg);
    }
  },

  /**
   * Tiện ích lấy danh mục để bind dữ liệu dropdown vào Form
   */
  async getFormMetadata() {
    try {
      const [phongBans, chucVus] = await prisma.$transaction([
        prisma.phongBan.findMany(),
        prisma.chucVu.findMany(),
      ]);
      return { success: true, phongBans, chucVus };
    } catch (error: unknown) {
      return { success: false, phongBans: [], chucVus: [] };
    }
  }
};