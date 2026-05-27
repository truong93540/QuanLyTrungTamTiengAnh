import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const lopHocService = {
  // ... (Giữ nguyên các hàm getMetadata, getAllLopHoc, getLopHocDetail, createLopHoc, updateLopHoc, deleteLopHoc, assign/remove GiaoVien/HocVien, BuoiHoc, DiemDanh, NhanXet như cũ) ...

  async getMetadata() {
    const [khoaHocs, phongHocs, giaoViens, hocViens] = await Promise.all([
      prisma.khoaHoc.findMany({ select: { ma_khoa_hoc: true, ten_khoa_hoc: true, thoi_luong: true } }),
      prisma.phongHoc.findMany({ select: { ma_phong_hoc: true, ten_phong_hoc: true, suc_chua: true } }),
      prisma.giaoVien.findMany({ select: { ma_giao_vien: true, ho_ten: true } }),
      prisma.hocVien.findMany({ select: { ma_hoc_vien: true, ho_ten: true, so_dien_thoai: true } })
    ]);
    return { khoaHocs, phongHocs, giaoViens, hocViens };
  },

  async getAllLopHoc(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = search ? { ten_lop: { contains: search, mode: 'insensitive' } } : {};

    const [items, total] = await Promise.all([
      prisma.lopHoc.findMany({
        where,
        include: { khoa_hoc: true, phong_hoc: true, _count: { select: { tham_gia: true } } },
        skip,
        take: limit,
        orderBy: { ma_lop_hoc: 'desc' }
      }),
      prisma.lopHoc.count({ where })
    ]);
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getLopHocDetail(ma_lop_hoc: number) {
    return prisma.lopHoc.findUnique({
      where: { ma_lop_hoc },
      include: {
        khoa_hoc: true,
        phong_hoc: true,
        phan_cong_giang_day: { include: { giao_vien: true } },
        tham_gia: { include: { hoc_vien: true } },
        buoi_hoc: { include: { giao_vien: true }, orderBy: { ngay_hoc: 'asc' } },
        bai_kiem_tra: { orderBy: { ngay_kiem_tra: 'asc' } }
      }
    });
  },

  async createLopHoc(data: any) {
    return prisma.lopHoc.create({
      data: {
        ten_lop: data.ten_lop,
        si_so_toi_da: data.si_so_toi_da ? Number(data.si_so_toi_da) : null,
        ngay_khai_giang: data.ngay_khai_giang ? new Date(data.ngay_khai_giang) : null,
        ngay_ket_thuc: data.ngay_ket_thuc ? new Date(data.ngay_ket_thuc) : null,
        ma_phong_hoc: Number(data.ma_phong_hoc),
        ma_khoa_hoc: Number(data.ma_khoa_hoc),
        lich_hoc: data.lich_hoc || null
      }
    });
  },

  async updateLopHoc(ma_lop_hoc: number, data: any) {
    return prisma.lopHoc.update({
      where: { ma_lop_hoc },
      data: {
        ten_lop: data.ten_lop,
        si_so_toi_da: data.si_so_toi_da ? Number(data.si_so_toi_da) : null,
        ngay_khai_giang: data.ngay_khai_giang ? new Date(data.ngay_khai_giang) : null,
        ngay_ket_thuc: data.ngay_ket_thuc ? new Date(data.ngay_ket_thuc) : null,
        ma_phong_hoc: Number(data.ma_phong_hoc),
        ma_khoa_hoc: Number(data.ma_khoa_hoc),
        lich_hoc: data.lich_hoc || undefined
      }
    });
  },

  async deleteLopHoc(ma_lop_hoc: number) {
    return prisma.lopHoc.delete({ where: { ma_lop_hoc } });
  },

  async assignGiaoVien(ma_lop_hoc: number, ma_giao_vien: number) {
    return prisma.phanCongGiangDay.create({ data: { ma_lop_hoc, ma_giao_vien } });
  },
  async removeGiaoVien(ma_lop_hoc: number, ma_giao_vien: number) {
    return prisma.phanCongGiangDay.deleteMany({ where: { ma_lop_hoc, ma_giao_vien } });
  },
  async addHocVien(ma_lop_hoc: number, ma_hoc_vien: number) {
    return prisma.thamGiaLop.create({ data: { ma_lop_hoc, ma_hoc_vien, trang_thai: 'Đang học' } });
  },
  async removeHocVien(ma_lop_hoc: number, ma_hoc_vien: number) {
    return prisma.thamGiaLop.deleteMany({ where: { ma_lop_hoc, ma_hoc_vien } });
  },

  async createBuoiHoc(data: { ngay_hoc: string, noi_dung_hoc?: string, ma_giao_vien: number, ma_lop_hoc: number }) {
    return prisma.buoiHoc.create({
      data: {
        ngay_hoc: new Date(data.ngay_hoc),
        noi_dung_hoc: data.noi_dung_hoc,
        ma_giao_vien: Number(data.ma_giao_vien),
        ma_lop_hoc: Number(data.ma_lop_hoc)
      }
    });
  },

  async getDanhSachDiemDanh(ma_buoi_hoc: number, ma_lop_hoc: number) {
    const hocViens = await prisma.thamGiaLop.findMany({
      where: { ma_lop_hoc },
      include: { hoc_vien: true }
    });
    const diemDanhs = await prisma.diemDanh.findMany({ where: { ma_buoi_hoc } });
    return hocViens.map(hv => {
      const dd = diemDanhs.find(d => d.ma_hoc_vien === hv.ma_hoc_vien);
      return {
        ma_hoc_vien: hv.ma_hoc_vien, ho_ten: hv.hoc_vien.ho_ten,
        ma_diem_danh: dd?.ma_diem_danh, trang_thai: dd?.trang_thai || 'Chưa điểm danh', ghi_chu: dd?.ghi_chu || ''
      };
    });
  },

  async upsertDiemDanh(ma_buoi_hoc: number, ma_hoc_vien: number, trang_thai: string, ghi_chu?: string) {
    const exist = await prisma.diemDanh.findFirst({ where: { ma_buoi_hoc, ma_hoc_vien } });
    if (exist) return prisma.diemDanh.update({ where: { ma_diem_danh: exist.ma_diem_danh }, data: { trang_thai, ghi_chu } });
    return prisma.diemDanh.create({ data: { ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu } });
  },

  async upsertNhanXet(ma_buoi_hoc: number, ma_hoc_vien: number, da_lam_bai_tap: boolean, noi_dung_nhan_xet: string) {
    const exist = await prisma.nhanXet.findFirst({ where: { ma_buoi_hoc, ma_hoc_vien } });
    if (exist) return prisma.nhanXet.update({ where: { ma_nhan_xet: exist.ma_nhan_xet }, data: { da_lam_bai_tap, noi_dung_nhan_xet } });
    return prisma.nhanXet.create({ data: { ma_buoi_hoc, ma_hoc_vien, da_lam_bai_tap, noi_dung_nhan_xet } });
  },

  async createBaiKiemTra(data: { ten_bai_kiem_tra: string, ngay_kiem_tra: string, ma_lop_hoc: number }) {
    return prisma.baiKiemTra.create({
      data: {
        ten_bai_kiem_tra: data.ten_bai_kiem_tra, ngay_kiem_tra: new Date(data.ngay_kiem_tra), ma_lop_hoc: Number(data.ma_lop_hoc)
      }
    });
  },

  // THÊM MỚI: Lấy danh sách điểm bài kiểm tra
  async getKetQuaKiemTra(ma_bai_kiem_tra: number) {
    return prisma.ketQuaKiemTra.findMany({ where: { ma_bai_kiem_tra } });
  },

  async upsertKetQuaKiemTra(ma_bai_kiem_tra: number, ma_hoc_vien: number, diem_so: number, nhan_xet?: string) {
    const exist = await prisma.ketQuaKiemTra.findFirst({ where: { ma_bai_kiem_tra, ma_hoc_vien } });
    if (exist) return prisma.ketQuaKiemTra.update({ where: { ma_ket_qua_kiem_tra: exist.ma_ket_qua_kiem_tra }, data: { diem_so, nhan_xet } });
    return prisma.ketQuaKiemTra.create({ data: { ma_bai_kiem_tra, ma_hoc_vien, diem_so, nhan_xet } });
  },

  async getKeHoachGiangDay(ma_khoa_hoc: number) {
    return prisma.keHoachGiangDay.findMany({
      where: { ma_khoa_hoc },
      include: { giao_vien: true },
      orderBy: { ma_ke_hoach_giang_day: 'desc' }
    });
  },
  
  // THÊM MỚI: Lấy tất cả kế hoạch để làm mẫu
  async getAllKeHoachGiangDayMau() {
    return prisma.keHoachGiangDay.findMany({
      take: 20, orderBy: { ma_ke_hoach_giang_day: 'desc' }, include: { khoa_hoc: { select: { ten_khoa_hoc: true } } }
    });
  },

  async createKeHoach(data: { noi_dung: string, lich_day: string, thoi_gian: string, ma_giao_vien: number, ma_khoa_hoc: number }) {
    return prisma.keHoachGiangDay.create({
      data: {
        noi_dung: data.noi_dung, lich_day: data.lich_day, thoi_gian: data.thoi_gian,
        ma_giao_vien: Number(data.ma_giao_vien), ma_khoa_hoc: Number(data.ma_khoa_hoc)
      }
    });
  },
  async deleteKeHoach(id: number) { return prisma.keHoachGiangDay.delete({ where: { ma_ke_hoach_giang_day: id } }); }
};