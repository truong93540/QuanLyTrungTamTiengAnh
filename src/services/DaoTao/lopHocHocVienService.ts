import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AddHocVienInput {
  ma_lop_hoc: number;
  ma_hoc_vien: number;
  trang_thai?: string;
}

export const lopHocHocVienService = {
  // Lấy danh sách học viên hiện tại thuộc lớp học
  async getHocVienByLopHoc(maLopHoc: number) {
    return await prisma.thamGiaLop.findMany({
      where: { ma_lop_hoc: maLopHoc },
      include: {
        hoc_vien: true,
      },
      orderBy: { ngay_dang_ky: 'desc' },
    });
  },

  // Thêm học viên vào lớp (Sử dụng bảng trung gian ThamGiaLop)
  async addHocVienToLop(data: AddHocVienInput) {
    return await prisma.thamGiaLop.create({
      data: {
        ma_lop_hoc: data.ma_lop_hoc,
        ma_hoc_vien: data.ma_hoc_vien,
        trang_thai: data.trang_thai || 'Đang học',
      },
      include: {
        hoc_vien: true,
      },
    });
  },

  // Xóa học viên khỏi lớp thông qua composite unique key hoặc ID bản ghi trung gian
  async removeHocVienFromLop(maLopHoc: number, maHocVien: number) {
    return await prisma.thamGiaLop.delete({
      where: {
        ma_hoc_vien_ma_lop_hoc: {
          ma_hoc_vien: maHocVien,
          ma_lop_hoc: maLopHoc,
        },
      },
    });
  },

  // Lấy danh sách học viên chưa tham gia lớp này để phục vụ tính năng tìm kiếm và thêm mới
  async getHocVienKhaDung(maLopHoc: number, searchKeyword?: string) {
    const studentsInClass = await prisma.thamGiaLop.findMany({
      where: { ma_lop_hoc: maLopHoc },
      select: { ma_hoc_vien: true },
    });

    const excludedIds = studentsInClass.map((s) => s.ma_hoc_vien);

    return await prisma.hocVien.findMany({
      where: {
        ma_hoc_vien: { notIn: excludedIds },
        OR: searchKeyword
          ? [
              { ho_ten: { contains: searchKeyword, mode: 'insensitive' } },
              { so_dien_thoai: { contains: searchKeyword, mode: 'insensitive' } },
            ]
          : undefined,
      },
      take: 10,
    });
  },
};