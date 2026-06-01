import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BaoCaoThongKeService {
  static async getThongKeDangKyVaCamKet(nam?: number) {
    const currentYear = nam || new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    // 1. Lấy tất cả các bản ghi đăng ký lớp học trong năm
    const danhSachDangKy = await prisma.thamGiaLop.findMany({
      where: {
        ngay_dang_ky: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        ngay_dang_ky: true,
      },
    });

    // 2. Lấy tất cả các bản ghi ký cam kết trong năm
    const danhSachCamKet = await prisma.camKet.findMany({
      where: {
        ngay_ky: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        ngay_ky: true,
      },
    });

    // Khởi tạo mảng 12 tháng dữ liệu sạch
    const thongKeTheoThang = Array.from({ length: 12 }, (_, index) => ({
      thang: `Tháng ${index + 1}`,
      hocVienMoi: 0,
      camKetMoi: 0,
    }));

    // Phân bổ số liệu đăng ký học viên mới
    danhSachDangKy.forEach((item) => {
      const month = new Date(item.ngay_dang_ky).getMonth(); // 0 - 11
      thongKeTheoThang[month].hocVienMoi += 1;
    });

    // Phân bổ số liệu học viên lập cam kết
    danhSachCamKet.forEach((item) => {
      const month = new Date(item.ngay_ky).getMonth(); // 0 - 11
      thongKeTheoThang[month].camKetMoi += 1;
    });

    return thongKeTheoThang;
  }
}