import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateBuoiHocInput {
  ngay_hoc: Date;
  noi_dung_hoc?: string;
  ma_giao_vien: number;
  ma_lop_hoc: number;
}

export interface UpdateBuoiHocInput {
  ma_buoi_hoc: number;
  ngay_hoc?: Date;
  noi_dung_hoc?: string;
  ma_giao_vien?: number;
}

export const buoiHocService = {
  // Lấy danh sách buổi học của một lớp học cụ thể
  async getBuoiHocByLop(maLopHoc: number) {
    return await prisma.buoiHoc.findMany({
      where: { ma_lop_hoc: maLopHoc },
      include: {
        giao_vien: {
          select: { ma_giao_vien: true, ho_ten: true, so_dien_thoai: true },
        },
      },
      orderBy: { ngay_hoc: 'asc' },
    });
  },

  // Lấy chi tiết buổi học đồng thời nạp thông tin danh sách học viên của lớp phục vụ layout điểm danh
  async getBuoiHocChiTiet(maBuoiHoc: number) {
    const buoiHoc = await prisma.buoiHoc.findUnique({
      where: { ma_buoi_hoc: maBuoiHoc },
      include: {
        giao_vien: true,
        lop_hoc: {
          include: {
            tham_gia: {
              include: {
                hoc_vien: true,
              },
            },
          },
        },
      },
    });
    return buoiHoc;
  },

  // Tạo mới một buổi học
  async createBuoiHoc(data: CreateBuoiHocInput) {
    return await prisma.buoiHoc.create({
      data: {
        ngay_hoc: data.ngay_hoc,
        noi_dung_hoc: data.noi_dung_hoc,
        ma_giao_vien: data.ma_giao_vien,
        ma_lop_hoc: data.ma_lop_hoc,
      },
    });
  },

  // Cập nhật thông tin buổi học
  async updateBuoiHoc(data: UpdateBuoiHocInput) {
    return await prisma.buoiHoc.update({
      where: { ma_buoi_hoc: data.ma_buoi_hoc },
      data: {
        ngay_hoc: data.ngay_hoc,
        noi_dung_hoc: data.noi_dung_hoc,
        ma_giao_vien: data.ma_giao_vien,
      },
    });
  },

  // Xóa buổi học
  async deleteBuoiHoc(maBuoiHoc: number) {
    return await prisma.buoiHoc.delete({
      where: { ma_buoi_hoc: maBuoiHoc },
    });
  },

  // Lấy danh sách tất cả giáo viên phục vụ dropdown combobox khi CRUD buổi học
  async getAllGiaoVienIdAndName() {
    return await prisma.giaoVien.findMany({
      select: {
        ma_giao_vien: true,
        ho_ten: true,
      },
      orderBy: { ho_ten: 'asc' },
    });
  },
};