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
  // Thêm hoặc cập nhật các hàm sau vào object nhanSuService trong file nhanSuService.ts của bạn:

  /**
   * Lấy chi tiết nhân sự kèm Hợp đồng và Bằng cấp
   */
  async getChiTietNhanSu(ma_nhan_su: number) {
    try {
      const nhanSu = await prisma.nhanSu.findUnique({
        where: { ma_nhan_su },
        include: {
          chuc_vu: true,
          phong_ban: true,
          hop_dong: true,        // Khớp với tên quan hệ trong schema
          ho_so_bang: {
            include: {
              bang_cap: true,
            },
          },
        },
      });

      if (!nhanSu) {
        return { success: false, message: "Không tìm thấy hồ sơ nhân sự." };
      }

      const formattedHsBangCap = nhanSu.ho_so_bang.map((item) => ({
        ma_ho_so: item.ma_ho_so_bang_cap,
        ten_bang_cap: item.bang_cap?.ten_bang_cap || "",
        noi_cap: item.noi_cap,
        ngay_cap: item.ngay_cap ? item.ngay_cap.toISOString() : null,
        loai_bang_cap: null,
      }));

      return {
        success: true,
        data: {
          ...nhanSu,
          ho_so_bang_cap: formattedHsBangCap,
        },
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Lỗi khi lấy thông tin hồ sơ chi tiết.";
      throw new Error(msg);
    }
  },

  // ================= CÁC HÀM CRUD HỢP ĐỒNG =================
  async createHopDong(data: any) {
    try {
      const newHd = await prisma.hopDongLaoDong.create({
        data: {
          so_hop_dong: data.so_hop_dong,
          luong_co_ban: data.luong_co_ban ? Number(data.luong_co_ban) : null,
          ten_cong_viec: data.ten_cong_viec || null,
          tg_thu_viec: data.tg_thu_viec || null,
          tg_het_hop_dong: data.tg_het_hop_dong ? new Date(data.tg_het_hop_dong) : null,
          ma_nhan_su: Number(data.ma_nhan_su),
          // Bổ sung các trường mới theo Schema
          ngay_ky: data.ngay_ky ? new Date(data.ngay_ky) : null,
          dong_bao_hiem: data.dong_bao_hiem === true || data.dong_bao_hiem === "true",
          phan_tram_hoa_hong: data.phan_tram_hoa_hong ? Number(data.phan_tram_hoa_hong) : 0,
          chi_tiet_phu_cap: data.chi_tiet_phu_cap ? data.chi_tiet_phu_cap : null, // data đã được parse JSON ở route hoặc client
        }
      });
      return { success: true, data: newHd };
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Không thể thêm hợp đồng.");
    }
  },

  async updateHopDong(ma_hop_dong: number, data: any) {
    try {
      const updatedHd = await prisma.hopDongLaoDong.update({
        where: { ma_hop_dong },
        data: {
          so_hop_dong: data.so_hop_dong,
          luong_co_ban: data.luong_co_ban ? Number(data.luong_co_ban) : null,
          ten_cong_viec: data.ten_cong_viec || null,
          tg_thu_viec: data.tg_thu_viec || null,
          tg_het_hop_dong: data.tg_het_hop_dong ? new Date(data.tg_het_hop_dong) : null,
          // Bổ sung các trường mới theo Schema
          ngay_ky: data.ngay_ky ? new Date(data.ngay_ky) : null,
          dong_bao_hiem: data.dong_bao_hiem === true || data.dong_bao_hiem === "true",
          phan_tram_hoa_hong: data.phan_tram_hoa_hong ? Number(data.phan_tram_hoa_hong) : 0,
          chi_tiet_phu_cap: data.chi_tiet_phu_cap ? data.chi_tiet_phu_cap : null,
        }
      });
      return { success: true, data: updatedHd };
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Không thể cập nhật hợp đồng.");
    }
  },

  async deleteHopDong(ma_hop_dong: number) {
    try {
      await prisma.hopDongLaoDong.delete({ where: { ma_hop_dong } });
      return { success: true, message: "Xóa hợp đồng thành công." };
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Không thể xóa hợp đồng.");
    }
  },

  // ================= CÁC HÀM CRUD BẰNG CẤP =================
  async createBangCap(data: any) {
    try {
      const newBc = await prisma.hoSoBangCap.create({
        data: {
          bang_cap: {
            connectOrCreate: {
              where: { ten_bang_cap: data.ten_bang_cap },
              create: { ten_bang_cap: data.ten_bang_cap },
            },
          },
          nhan_su: data.ma_nhan_su ? { connect: { ma_nhan_su: Number(data.ma_nhan_su) } } : undefined,
          giao_vien: data.ma_giao_vien ? { connect: { ma_giao_vien: Number(data.ma_giao_vien) } } : undefined,
          noi_cap: data.noi_cap || null,
          ngay_cap: data.ngay_cap ? new Date(data.ngay_cap) : null,
        }
      });
      return { success: true, data: newBc };
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Không thể thêm bằng cấp.");
    }
  },

  async updateBangCap(ma_ho_so: number, data: any) {
    try {
      const updatedBc = await prisma.hoSoBangCap.update({
        where: { ma_ho_so_bang_cap: ma_ho_so },
        data: {
          bang_cap: data.ten_bang_cap ? {
            connectOrCreate: {
              where: { ten_bang_cap: data.ten_bang_cap },
              create: { ten_bang_cap: data.ten_bang_cap },
            },
          } : undefined,
          nhan_su: data.ma_nhan_su !== undefined ? { connect: { ma_nhan_su: Number(data.ma_nhan_su) } } : undefined,
          giao_vien: data.ma_giao_vien !== undefined ? { connect: { ma_giao_vien: Number(data.ma_giao_vien) } } : undefined,
          noi_cap: data.noi_cap !== undefined ? data.noi_cap || null : undefined,
          ngay_cap: data.ngay_cap !== undefined ? (data.ngay_cap ? new Date(data.ngay_cap) : null) : undefined,
        }
      });
      return { success: true, data: updatedBc };
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Không thể cập nhật bằng cấp.");
    }
  },

  async deleteBangCap(ma_ho_so: number) {
    try {
      await prisma.hoSoBangCap.delete({ where: { ma_ho_so_bang_cap: ma_ho_so } });
      return { success: true, message: "Xóa bằng cấp thành công." };
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Không thể xóa bằng cấp.");
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

  async deleteNhanSu(ma_nhan_su: number) {
    try {
      // Thực hiện lệnh xóa trực tiếp bản ghi nhân sự
      await prisma.nhanSu.delete({
        where: { ma_nhan_su },
      });
      
      return { success: true, message: "Xóa hồ sơ nhân sự thành công." };
    } catch (error: any) {
      console.error("Lỗi hệ thống khi xóa nhân sự:", error);
      
      // Chuyển đổi toàn bộ log lỗi từ database thành dạng chuỗi văn bản để quét từ khóa
      const errorLog = error?.message || String(error);
      
      if (errorLog.includes("PhieuThu")) {
        throw new Error("Không thể xóa nhân sự này vì đang có dữ liệu liên kết tại phân hệ [Phiếu Thu]. Vui lòng xử lý phiếu thu trước.");
      }
      
      if (errorLog.includes("HopDongLaoDong") || errorLog.includes("hopDongLaoDong")) {
        throw new Error("Không thể xóa nhân sự này vì đang tồn tại [Hợp đồng lao động] đi kèm.");
      }
      
      if (errorLog.includes("HoSoBangCap") || errorLog.includes("hoSoBangCap")) {
        throw new Error("Không thể xóa nhân sự này vì đang tồn tại dữ liệu văn bằng trong [Hồ sơ bằng cấp].");
      }
      
      // Dự phòng nếu phát sinh khóa ngoại từ các bảng khác sau này chưa khai báo ở trên
      if (errorLog.includes("foreign key constraint") || errorLog.includes("violates RESTRICT")) {
        throw new Error("Không thể xóa nhân sự này vì đang có dữ liệu liên kết ở các phân hệ khác trong hệ thống.");
      }
      
      // Nếu là các lỗi hệ thống thông thường khác thì giữ nguyên
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
  },
  
};