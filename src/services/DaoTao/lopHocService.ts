import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Định nghĩa Interface chuẩn cho cấu trúc dữ liệu bên trong Json lịch học
interface ILichHoc {
  thu: number;
  ca: number;
}

/**
 * Hàm Helper chuyển đổi chuỗi văn bản người dùng nhập sang cấu trúc JSON hợp lệ để lưu DB
 * Định dạng đầu vào mong muốn từ text: 
 * thu 2 - ca 1
 * thu 3 - ca 2
 */
function parseLichHocStringToInput(lichHocRaw: any): ILichHoc[] | null {
  if (!lichHocRaw) return null;
  
  // Nếu dữ liệu truyền xuống đã là mảng hoặc object (được bóc tách từ trước), trả về luôn
  if (Array.isArray(lichHocRaw)) return lichHocRaw as ILichHoc[];
  if (typeof lichHocRaw !== 'string') return null;

  const lines = lichHocRaw.split('\n');
  const result: ILichHoc[] = [];

  for (let line of lines) {
    if (!line.trim()) continue;
    const parts = line.split('-');
    if (parts.length === 2) {
      // Tìm số thứ và số ca bằng regex hoặc bóc tách chuỗi gọn gàng
      const thuMatch = parts[0].toLowerCase().replace('thu', '').trim();
      const caMatch = parts[1].toLowerCase().replace('ca', '').trim();
      
      const thu = parseInt(thuMatch, 10);
      const ca = parseInt(caMatch, 10);

      if (!isNaN(thu) && !isNaN(ca)) {
        result.push({ thu, ca });
      }
    }
  }
  return result.length > 0 ? result : null;
}

/**
 * Hàm Helper kiểm tra trùng lịch Phòng học
 * Tránh trường hợp 2 lớp học dùng chung 1 phòng tại cùng 1 thời điểm (ca, thứ)
 */
async function checkTrungLichPhongHoc(
  ma_phong_hoc: number, 
  lich_hoc_target: ILichHoc[] | null, 
  ngay_khai_giang: Date | null, 
  ngay_ket_thuc: Date | null,
  ma_lop_hoc_ignore?: number
): Promise<void> {
  if (!lich_hoc_target || !ma_phong_hoc) return;

  // Tìm tất cả các lớp học dùng chung phòng này
  const lopCungPhong = await prisma.lopHoc.findMany({
    where: {
      ma_phong_hoc,
      ...(ma_lop_hoc_ignore ? { NOT: { ma_lop_hoc: ma_lop_hoc_ignore } } : {})
    }
  });

  for (const lop of lopCungPhong) {
    if (!lop.lich_hoc) continue;

    // Kiểm tra giao thoa khoảng thời gian diễn ra khóa học (Date Overlap)
    const coGiaoThoaNgay = 
      (!ngay_khai_giang || !lop.ngay_ket_thuc || ngay_khai_giang <= lop.ngay_ket_thuc) &&
      (!ngay_ket_thuc || !lop.ngay_khai_giang || ngay_ket_thuc >= lop.ngay_khai_giang);

    if (coGiaoThoaNgay) {
      const lichHocHienTai = lop.lich_hoc as unknown as ILichHoc[];

      // So sánh từng cặp thứ và ca xem có bị trùng không
      const biTrungLich = lich_hoc_target.some(target =>
        lichHocHienTai.some(hienTai => hienTai.thu === target.thu && hienTai.ca === target.ca)
      );

      if (biTrungLich) {
        throw new Error(`Phòng học này đã được sử dụng bởi lớp "${lop.ten_lop}" vào khung giờ bạn đã chọn.`);
      }
    }
  }
}

/**
 * Hàm Helper kiểm tra trùng lịch dạy của Giáo viên
 */
async function checkTrungLichGiaoVien(ma_giao_vien: number, ma_lop_hoc_target: number): Promise<void> {
  const lopTarget = await prisma.lopHoc.findUnique({
    where: { ma_lop_hoc: ma_lop_hoc_target },
  });

  if (!lopTarget) {
    throw new Error("Lớp học không tồn tại.");
  }

  if (!lopTarget.lich_hoc) return;
  const lichTarget = lopTarget.lich_hoc as unknown as ILichHoc[];

  // Lấy danh sách các phân công hiện tại của giáo viên
  const danhSachPhanCong = await prisma.phanCongGiangDay.findMany({
    where: { ma_giao_vien },
    include: { lop_hoc: true },
  });

  for (const pc of danhSachPhanCong) {
    const lopHienTai = pc.lop_hoc;

    if (lopHienTai.ma_lop_hoc === ma_lop_hoc_target) continue;
    if (!lopHienTai.lich_hoc) continue;

    // Kiểm tra giao thoa thời gian chạy của 2 lớp học
    const coGiaoThoaNgay = 
      (!lopTarget.ngay_khai_giang || !lopHienTai.ngay_ket_thuc || lopTarget.ngay_khai_giang <= lopHienTai.ngay_ket_thuc) &&
      (!lopTarget.ngay_ket_thuc || !lopHienTai.ngay_khai_giang || lopTarget.ngay_ket_thuc >= lopHienTai.ngay_khai_giang);

    if (coGiaoThoaNgay) {
      const lichHienTai = lopHienTai.lich_hoc as unknown as ILichHoc[];

      const biTrungCa = lichTarget.some(t => 
        lichHienTai.some(h => h.thu === t.thu && h.ca === t.ca)
      );

      if (biTrungCa) {
        throw new Error(`Giáo viên này đã có lịch giảng dạy tại lớp "${lopHienTai.ten_lop}" vào khung giờ trùng lặp.`);
      }
    }
  }
}

export async function updateKhoaHocLienKet(ma_lop_hoc: number, ma_khoa_hoc: number) {
  const lopHoc = await prisma.lopHoc.findUnique({ where: { ma_lop_hoc } });
  if (lopHoc && lopHoc.ma_khoa_hoc) {
    throw new Error("Lớp học này đã được liên kết với một khóa học từ trước và không thể thay đổi.");
  }
  return await prisma.lopHoc.update({ where: { ma_lop_hoc }, data: { ma_khoa_hoc } });
}

export async function getDanhSachNhanXet(ma_buoi_hoc: number) {
  return await prisma.nhanXet.findMany({ where: { ma_buoi_hoc } });
}

export const lopHocService = {
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
    // Thực hiện parse lịch học dạng chữ sang mảng JSON đúng chuẩn cấu trúc hệ thống
    const parsedLichHoc = parseLichHocStringToInput(data.lich_hoc);
    const ngayKhaiGiang = data.ngay_khai_giang ? new Date(data.ngay_khai_giang) : null;
    const ngayKetThuc = data.ngay_ket_thuc ? new Date(data.ngay_ket_thuc) : null;
    const maPhongHoc = Number(data.ma_phong_hoc);

    // Kiểm tra trùng lịch phòng học trước khi cho tạo mới
    await checkTrungLichPhongHoc(maPhongHoc, parsedLichHoc, ngayKhaiGiang, ngayKetThuc);

    return prisma.lopHoc.create({
      data: {
        ten_lop: data.ten_lop,
        si_so_toi_da: data.si_so_toi_da ? Number(data.si_so_toi_da) : null,
        ngay_khai_giang: ngayKhaiGiang,
        ngay_ket_thuc: ngayKetThuc,
        ma_phong_hoc: maPhongHoc,
        ma_khoa_hoc: Number(data.ma_khoa_hoc),
        lich_hoc: parsedLichHoc as any
      }
    });
  },

  async updateLopHoc(ma_lop_hoc: number, data: any) {
    // Thực hiện parse lịch học dạng chữ sang mảng JSON đúng chuẩn cấu trúc hệ thống
    const parsedLichHoc = data.lich_hoc !== undefined ? parseLichHocStringToInput(data.lich_hoc) : undefined;
    const ngayKhaiGiang = data.ngay_khai_giang ? new Date(data.ngay_khai_giang) : null;
    const ngayKetThuc = data.ngay_ket_thuc ? new Date(data.ngay_ket_thuc) : null;
    const maPhongHoc = Number(data.ma_phong_hoc);

    // Nếu có cập nhật hoặc tính toán lại lịch học / phòng học, chạy kiểm tra trùng phòng học
    if (parsedLichHoc !== undefined || data.ma_phong_hoc) {
      // Trường hợp cập nhật nhưng không truyền lịch học mới, cần lấy lịch học cũ để đối chiếu phòng mới
      let TargetLich = parsedLichHoc;
      if (TargetLich === undefined) {
        const targetLop = await prisma.lopHoc.findUnique({ where: { ma_lop_hoc } });
        TargetLich = targetLop?.lich_hoc ? (targetLop.lich_hoc as unknown as ILichHoc[]) : null;
      }
      await checkTrungLichPhongHoc(maPhongHoc, TargetLich, ngayKhaiGiang, ngayKetThuc, ma_lop_hoc);
    }

    return prisma.lopHoc.update({
      where: { ma_lop_hoc },
      data: {
        ten_lop: data.ten_lop,
        si_so_toi_da: data.si_so_toi_da ? Number(data.si_so_toi_da) : null,
        ngay_khai_giang: ngayKhaiGiang,
        ngay_ket_thuc: ngayKetThuc,
        ma_phong_hoc: maPhongHoc,
        ma_khoa_hoc: Number(data.ma_khoa_hoc),
        lich_hoc: parsedLichHoc !== undefined ? (parsedLichHoc as any) : undefined
      }
    });
  },

  async deleteLopHoc(ma_lop_hoc: number) {
    return prisma.lopHoc.delete({ where: { ma_lop_hoc } });
  },

  async assignGiaoVien(ma_lop_hoc: number, ma_giao_vien: number) {
    // Đảm bảo kiểm tra trùng lịch dạy của giáo viên trước khi tạo phân công mới
    await checkTrungLichGiaoVien(ma_giao_vien, ma_lop_hoc);
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