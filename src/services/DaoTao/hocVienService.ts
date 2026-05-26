import { prisma } from "@/lib/prisma";

export interface GetHocVienParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const hocVienService = {
  async getDanhSachHocVien(params: GetHocVienParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;
    const search = params.search || "";

    try {
      const whereCondition: any = { trang_thai: { not: "Đã xóa" } };
      if (search) {
        whereCondition.OR = [
          { ho_ten: { contains: search, mode: "insensitive" } },
          { so_dien_thoai: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      const [total, data] = await prisma.$transaction([
        prisma.hocVien.count({ where: whereCondition }),
        prisma.hocVien.findMany({
          where: whereCondition,
          skip,
          take: limit,
          include: {
            tham_gia_lop: { include: { lop_hoc: true } },
            phieu_thu: true,
            cam_ket: true,
            ket_qua_kt: { include: { bai_kiem_tra: true } },
            diem_danh: { include: { buoi_hoc: true } },
          },
          orderBy: { ma_hoc_vien: "desc" },
        }),
      ]);

      return {
        success: true,
        data,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error: any) {
      throw new Error(error.message || "Không thể lấy danh sách học viên.");
    }
  },

  async getChiTietHocVien(ma_hoc_vien: number) {
    try {
      const hocVien = await prisma.hocVien.findFirst({
        where: { ma_hoc_vien, trang_thai: { not: "Đã xóa" } },
        include: {
          tham_gia_lop: { include: { lop_hoc: true } },
          phieu_thu: true,
          cam_ket: true,
          ket_qua_kt: { include: { bai_kiem_tra: true } },
          diem_danh: { include: { buoi_hoc: true } },
        },
      });

      if (!hocVien) return { success: false, message: "Không tìm thấy hồ sơ học viên." };
      return { success: true, data: hocVien };
    } catch (error: any) {
      throw new Error(error.message || "Không thể lấy chi tiết học viên.");
    }
  },

  async getMetadataForForm() {
    try {
      const [lopHocs, khoaHocs, nhanSus, khuyenMais] = await prisma.$transaction([
        prisma.lopHoc.findMany({ select: { ma_lop_hoc: true, ten_lop: true } }),
        prisma.khoaHoc.findMany({ select: { ma_khoa_hoc: true, ten_khoa_hoc: true } }),
        prisma.nhanSu.findMany({ select: { ma_nhan_su: true, ho_ten: true } }),
        prisma.chuongTrinhKhuyenMai.findMany({ select: { ma_khuyen_mai: true, ten_chuong_trinh: true, phan_tram_giam: true } })
      ]);
      return { success: true, data: { lopHocs, khoaHocs, nhanSus, khuyenMais } };
    } catch (error: any) {
      return { success: false, message: "Lỗi tải dữ liệu danh mục." };
    }
  },

  async createHocVien(data: any) {
    try {
      const newHocVien = await prisma.hocVien.create({
        data: {
          ho_ten: data.ho_ten, ngay_sinh: data.ngay_sinh ? new Date(data.ngay_sinh) : null,
          gioi_tinh: data.gioi_tinh || null, so_dien_thoai: data.so_dien_thoai || null,
          email: data.email || null, dia_chi: data.dia_chi || null,
          dau_ra_chung_chi: data.dau_ra_chung_chi || null, trang_thai: data.trang_thai || "Đang học",
        },
      });
      return { success: true, data: newHocVien };
    } catch (error: any) {
      if (error.code === "P2002") throw new Error("Email này đã tồn tại.");
      throw new Error(error.message || "Lỗi tạo học viên.");
    }
  },

  async updateHocVien(ma_hoc_vien: number, data: any) {
    try {
      const updatedHocVien = await prisma.hocVien.update({
        where: { ma_hoc_vien },
        data: {
          ho_ten: data.ho_ten, ngay_sinh: data.ngay_sinh ? new Date(data.ngay_sinh) : null,
          gioi_tinh: data.gioi_tinh, so_dien_thoai: data.so_dien_thoai,
          email: data.email, dia_chi: data.dia_chi,
          dau_ra_chung_chi: data.dau_ra_chung_chi, trang_thai: data.trang_thai,
        },
      });
      return { success: true, data: updatedHocVien };
    } catch (error: any) {
      if (error.code === "P2002") throw new Error("Email trùng lặp.");
      throw new Error("Lỗi cập nhật học viên.");
    }
  },

  // Học viên chính vẫn giữ Xoá mềm để an toàn dữ liệu
  async softDeleteHocVien(ma_hoc_vien: number) {
    try {
      const deletedHocVien = await prisma.hocVien.update({
        where: { ma_hoc_vien }, data: { trang_thai: "Đã xóa" },
      });
      return { success: true, data: deletedHocVien };
    } catch (error: any) {
      throw new Error("Không thể xóa mềm học viên.");
    }
  },

  // ================= LỚP HỌC (ĐÃ ĐỔI SANG XOÁ CỨNG) =================
  async addThamGiaLop(data: any) {
    try {
      const result = await prisma.thamGiaLop.create({
        data: {
          ma_hoc_vien: parseInt(data.ma_hoc_vien, 10),
          ma_lop_hoc: parseInt(data.ma_lop_hoc, 10),
          ngay_dang_ky: data.ngay_dang_ky ? new Date(data.ngay_dang_ky) : new Date(),
          trang_thai: data.trang_thai || "Đang học",
        }
      });
      return { success: true, data: result };
    } catch (error: any) {
      if (error.code === "P2002") throw new Error("Học viên này đã được thêm vào lớp học này rồi.");
      throw new Error("Không thể thêm học viên vào lớp.");
    }
  },

  async updateThamGiaLop(ma_tham_gia_lop: number, data: any) {
    try {
      const existing = await prisma.thamGiaLop.findUnique({ where: { ma_tham_gia_lop } });
      if (!existing || existing.ma_hoc_vien !== parseInt(data.ma_hoc_vien, 10)) {
        throw new Error("Bản ghi này không thuộc về học viên hiện tại.");
      }
      const result = await prisma.thamGiaLop.update({
        where: { ma_tham_gia_lop },
        data: {
          ma_lop_hoc: parseInt(data.ma_lop_hoc, 10),
          ngay_dang_ky: data.ngay_dang_ky ? new Date(data.ngay_dang_ky) : undefined,
          trang_thai: data.trang_thai,
        }
      });
      return { success: true, data: result };
    } catch (error: any) {
      if (error.code === "P2002") throw new Error("Xung đột lớp học.");
      throw new Error(error.message || "Không thể cập nhật lớp học.");
    }
  },

  async deleteThamGiaLop(ma_tham_gia_lop: number, ma_hoc_vien: number) {
    try {
      const existing = await prisma.thamGiaLop.findUnique({ where: { ma_tham_gia_lop } });
      if (!existing || existing.ma_hoc_vien !== ma_hoc_vien) throw new Error("Hành động bị từ chối.");

      const result = await prisma.thamGiaLop.delete({
        where: { ma_tham_gia_lop }
      });
      return { success: true, data: result };
    } catch (error: any) {
      throw new Error(error.message || "Lỗi xóa lớp học.");
    }
  },

  // ================= CAM KẾT (ĐÃ ĐỔI SANG XOÁ CỨNG) =================
  async addCamKet(data: any) {
    try {
      const result = await prisma.camKet.create({
        data: {
          ma_hoc_vien: parseInt(data.ma_hoc_vien, 10),
          ma_khoa_hoc: parseInt(data.ma_khoa_hoc, 10),
          noi_dung_cam_ket: data.noi_dung,
          ngay_ky: data.ngay_ky ? new Date(data.ngay_ky) : new Date(),
          trang_thai: data.trang_thai || "Hiệu lực",
        }
      });
      return { success: true, data: result };
    } catch (error: any) {
      throw new Error(error.message || "Không thể thêm cam kết.");
    }
  },

  async updateCamKet(ma_cam_ket: number, data: any) {
    try {
      const existing = await prisma.camKet.findUnique({ where: { ma_cam_ket } });
      if (!existing || existing.ma_hoc_vien !== parseInt(data.ma_hoc_vien, 10)) {
        throw new Error("Bản ghi cam kết không hợp lệ.");
      }
      const result = await prisma.camKet.update({
        where: { ma_cam_ket },
        data: {
          ma_khoa_hoc: parseInt(data.ma_khoa_hoc, 10),
          noi_dung_cam_ket: data.noi_dung,
          ngay_ky: data.ngay_ky ? new Date(data.ngay_ky) : undefined,
          trang_thai: data.trang_thai,
        }
      });
      return { success: true, data: result };
    } catch (error: any) {
      throw new Error(error.message || "Không thể cập nhật cam kết.");
    }
  },

  async deleteCamKet(ma_cam_ket: number, ma_hoc_vien: number) {
    try {
      const existing = await prisma.camKet.findUnique({ where: { ma_cam_ket } });
      if (!existing || existing.ma_hoc_vien !== ma_hoc_vien) throw new Error("Hành động bị từ chối.");

      const result = await prisma.camKet.delete({
        where: { ma_cam_ket }
      });
      return { success: true, data: result };
    } catch (error: any) {
      throw new Error(error.message || "Lỗi xóa cam kết.");
    }
  },

  // ================= PHIẾU THU (ĐÃ ĐỔI SANG XOÁ CỨNG) =================
  async addPhieuThu(data: any) {
    try {
      const result = await prisma.phieuThu.create({
        data: {
          ma_hoc_vien: parseInt(data.ma_hoc_vien, 10),
          ma_khoa_hoc: parseInt(data.ma_khoa_hoc, 10),
          ma_nhan_su: parseInt(data.ma_nhan_su, 10),
          so_tien: data.so_tien,
          ngay_thu: data.ngay_thu ? new Date(data.ngay_thu) : new Date(),
          noi_dung: data.noi_dung,
          ma_khuyen_mai: data.ma_khuyen_mai ? parseInt(data.ma_khuyen_mai, 10) : null,
        }
      });
      return { success: true, data: result };
    } catch (error: any) {
      throw new Error(error.message || "Không thể thêm phiếu thu.");
    }
  },

  async updatePhieuThu(ma_phieu_thu: number, data: any) {
    try {
      const existing = await prisma.phieuThu.findUnique({ where: { ma_phieu_thu } });
      if (!existing || existing.ma_hoc_vien !== parseInt(data.ma_hoc_vien, 10)) {
        throw new Error("Dữ liệu phiếu thu không khớp với học viên.");
      }
      const result = await prisma.phieuThu.update({
        where: { ma_phieu_thu },
        data: {
          ma_khoa_hoc: parseInt(data.ma_khoa_hoc, 10),
          ma_nhan_su: parseInt(data.ma_nhan_su, 10),
          so_tien: data.so_tien,
          ngay_thu: data.ngay_thu ? new Date(data.ngay_thu) : undefined,
          noi_dung: data.noi_dung,
          ma_khuyen_mai: data.ma_khuyen_mai ? parseInt(data.ma_khuyen_mai, 10) : null,
        }
      });
      return { success: true, data: result };
    } catch (error: any) {
      throw new Error(error.message || "Không thể cập nhật phiếu thu.");
    }
  },

  async deletePhieuThu(ma_phieu_thu: number, ma_hoc_vien: number) {
    try {
      const existing = await prisma.phieuThu.findUnique({ where: { ma_phieu_thu } });
      if (!existing || existing.ma_hoc_vien !== ma_hoc_vien) throw new Error("Hành động bị từ chối.");

      const result = await prisma.phieuThu.delete({
        where: { ma_phieu_thu }
      });
      return { success: true, data: result };
    } catch (error: any) {
      throw new Error(error.message || "Không thể xóa phiếu thu.");
    }
  }
};