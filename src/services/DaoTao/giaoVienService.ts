import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface GiaoVienFilterParams {
  search?: string;
  ma_chuc_vu?: number;
  ma_phong_ban?: number;
  page?: number;
  limit?: number;
}

interface PhuCapJson {
  ten: string;
  soTien: number;
}

export interface GiaoVienInput {
  ho_ten: string;
  ngay_sinh?: string | Date | null;
  gioi_tinh?: string | null;
  so_dien_thoai?: string | null;
  email?: string | null;
  dia_chi?: string | null;
  ma_chuc_vu: number;
  ma_phong_ban: number;
  
  tai_khoan?: {
    ten_dang_nhap: string;
    mat_khau: string;
    trang_thai?: string | null;
  } | null;

  ho_so_bang?: Array<{
    ma_bang_cap: number | string;
    ten_bang_cap_moi?: string;
    ngay_cap?: string | Date | null;
    noi_cap?: string | null;
  }>;

  hop_dong?: Array<{
    so_hop_dong: string;
    ngay_ky?: string | Date | null;
    ten_cong_viec?: string | null;
    tg_thu_viec?: string | null;
    dong_bao_hiem?: boolean;
    luong_co_ban: number;                 // Đổi từ muc_luong_chinh -> luong_co_ban
    chi_tiet_phu_cap_text?: string;       // Đổi từ phu_cap_text -> chi_tiet_phu_cap_text
    tg_het_hop_dong?: string | Date | null;
  }>;
}

export const giaoVienService = {
  async getAll(params: GiaoVienFilterParams) {
    const { search, ma_chuc_vu, ma_phong_ban, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { ho_ten: { contains: search, mode: 'insensitive' } },
        { so_dien_thoai: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (ma_chuc_vu) where.ma_chuc_vu = ma_chuc_vu;
    if (ma_phong_ban) where.ma_phong_ban = ma_phong_ban;

    const [total, items] = await prisma.$transaction([
      prisma.giaoVien.count({ where }),
      prisma.giaoVien.findMany({
        where,
        include: {
          chuc_vu: true,
          phong_ban: true,
          tai_khoan: { select: { ten_dang_nhap: true, trang_thai: true } },
          hop_dong: true,
          ho_so_bang: { include: { bang_cap: true } },
          phan_cong_giang_day: { include: { lop_hoc: true } },
        },
        orderBy: { ma_giao_vien: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: number) {
    return await prisma.giaoVien.findUnique({
      where: { ma_giao_vien: id },
      include: {
        chuc_vu: true,
        phong_ban: true,
        tai_khoan: { select: { ten_dang_nhap: true, trang_thai: true } },
        hop_dong: true,
        ho_so_bang: { include: { bang_cap: true } },
        phan_cong_giang_day: { include: { lop_hoc: true } },
      },
    });
  },

  async getMetadata() {
    const [chucVus, phongBans, lopHocs, bangCaps] = await prisma.$transaction([
      prisma.chucVu.findMany(),
      prisma.phongBan.findMany(),
      prisma.lopHoc.findMany(),
      prisma.bangCap.findMany(),
    ]);
    return { chucVus, phongBans, lopHocs, bangCaps };
  },

  async create(data: GiaoVienInput) {
    return await prisma.$transaction(async (tx) => {
      const newTeacher = await tx.giaoVien.create({
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

      const teacherId = newTeacher.ma_giao_vien;

      if (data.tai_khoan && data.tai_khoan.ten_dang_nhap) {
        await tx.taiKhoan.create({
          data: {
            ten_dang_nhap: data.tai_khoan.ten_dang_nhap,
            mat_khau: data.tai_khoan.mat_khau,
            trang_thai: data.tai_khoan.trang_thai || 'KICH_HOAT',
            ma_giao_vien: teacherId,
          },
        });
      }

      if (data.ho_so_bang && data.ho_so_bang.length > 0) {
        for (const b of data.ho_so_bang) {
          let finalBangCapId: number;

          if (b.ma_bang_cap === 'NEW' && b.ten_bang_cap_moi) {
            const newBc = await tx.bangCap.upsert({
              where: { ten_bang_cap: b.ten_bang_cap_moi.trim() },
              update: {},
              create: { ten_bang_cap: b.ten_bang_cap_moi.trim() }
            });
            finalBangCapId = newBc.ma_bang_cap;
          } else {
            finalBangCapId = Number(b.ma_bang_cap);
          }

          await tx.hoSoBangCap.create({
            data: {
              ma_giao_vien: teacherId,
              ma_bang_cap: finalBangCapId,
              ngay_cap: b.ngay_cap ? new Date(b.ngay_cap) : null,
              noi_cap: b.noi_cap || null,
            },
          });
        }
      }

      if (data.hop_dong && data.hop_dong.length > 0) {
        for (const hd of data.hop_dong) {
          let mappedPhuCap: PhuCapJson[] = [];
          if (hd.chi_tiet_phu_cap_text) {
            try {
              mappedPhuCap = hd.chi_tiet_phu_cap_text.split(',').map((item) => {
                const [ten, soTienStr] = item.split(':');
                return {
                  ten: ten ? ten.trim() : 'Phụ cấp',
                  soTien: soTienStr ? Number(soTienStr.trim()) : 0,
                };
              });
            } catch (e) {
              mappedPhuCap = [];
            }
          }

          // Khớp cấu trúc chính xác tuyệt đối với Schema thực tế
          await tx.hopDongLaoDong.create({
            data: {
              ma_giao_vien: teacherId,
              so_hop_dong: hd.so_hop_dong,
              ngay_ky: hd.ngay_ky ? new Date(hd.ngay_ky) : null,
              ten_cong_viec: hd.ten_cong_viec || null,
              tg_thu_viec: hd.tg_thu_viec || null,
              dong_bao_hiem: hd.dong_bao_hiem || false,
              luong_co_ban: hd.luong_co_ban ? Number(hd.luong_co_ban) : 0, // Ánh xạ chính xác trường DECIMAL
              chi_tiet_phu_cap: mappedPhuCap as any,                      // Ánh xạ chính xác trường JSON
              tg_het_hop_dong: hd.tg_het_hop_dong ? new Date(hd.tg_het_hop_dong) : null,
            },
          });
        }
      }

      return newTeacher;
    });
  },

  async update(id: number, data: GiaoVienInput) {
    return await prisma.$transaction(async (tx) => {
      const updatedTeacher = await tx.giaoVien.update({
        where: { ma_giao_vien: id },
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

      if (data.ho_so_bang) {
        await tx.hoSoBangCap.deleteMany({ where: { ma_giao_vien: id } });
        if (data.ho_so_bang.length > 0) {
          for (const b of data.ho_so_bang) {
            let finalBangCapId: number;

            if (b.ma_bang_cap === 'NEW' && b.ten_bang_cap_moi) {
              const newBc = await tx.bangCap.upsert({
                where: { ten_bang_cap: b.ten_bang_cap_moi.trim() },
                update: {},
                create: { ten_bang_cap: b.ten_bang_cap_moi.trim() }
              });
              finalBangCapId = newBc.ma_bang_cap;
            } else {
              finalBangCapId = Number(b.ma_bang_cap);
            }

            await tx.hoSoBangCap.create({
              data: {
                ma_giao_vien: id,
                ma_bang_cap: finalBangCapId,
                ngay_cap: b.ngay_cap ? new Date(b.ngay_cap) : null,
                noi_cap: b.noi_cap || null,
              },
            });
          }
        }
      }

      if (data.hop_dong) {
        await tx.hopDongLaoDong.deleteMany({ where: { ma_giao_vien: id } });
        if (data.hop_dong.length > 0) {
          for (const hd of data.hop_dong) {
            let mappedPhuCap: PhuCapJson[] = [];
            if (hd.chi_tiet_phu_cap_text) {
              try {
                mappedPhuCap = hd.chi_tiet_phu_cap_text.split(',').map((item) => {
                  const [ten, soTienStr] = item.split(':');
                  return {
                    ten: ten ? ten.trim() : 'Phụ cấp',
                    soTien: soTienStr ? Number(soTienStr.trim()) : 0,
                  };
                });
              } catch (e) {
                mappedPhuCap = [];
              }
            }

            // Ánh xạ chính xác tuyệt đối với Schema thực tế khi UPDATE
            await tx.hopDongLaoDong.create({
              data: {
                ma_giao_vien: id,
                so_hop_dong: hd.so_hop_dong,
                ngay_ky: hd.ngay_ky ? new Date(hd.ngay_ky) : null,
                ten_cong_viec: hd.ten_cong_viec || null,
                tg_thu_viec: hd.tg_thu_viec || null,
                dong_bao_hiem: hd.dong_bao_hiem || false,
                luong_co_ban: hd.luong_co_ban ? Number(hd.luong_co_ban) : 0,
                chi_tiet_phu_cap: mappedPhuCap as any,
                tg_het_hop_dong: hd.tg_het_hop_dong ? new Date(hd.tg_het_hop_dong) : null,
              },
            });
          }
        }
      }

      if (data.tai_khoan) {
        const existingAccount = await tx.taiKhoan.findUnique({ where: { ma_giao_vien: id } });
        if (existingAccount) {
          await tx.taiKhoan.update({
            where: { ma_giao_vien: id },
            data: {
              ten_dang_nhap: data.tai_khoan.ten_dang_nhap,
              mat_khau: data.tai_khoan.mat_khau, 
              trang_thai: data.tai_khoan.trang_thai,
            },
          });
        } else if (data.tai_khoan.ten_dang_nhap) {
          await tx.taiKhoan.create({
            data: {
              ten_dang_nhap: data.tai_khoan.ten_dang_nhap,
              mat_khau: data.tai_khoan.mat_khau,
              trang_thai: data.tai_khoan.trang_thai || 'KICH_HOAT',
              ma_giao_vien: id,
            },
          });
        }
      }

      return updatedTeacher;
    });
  },

  async delete(id: number) {
    return await prisma.$transaction(async (tx) => {
      await tx.taiKhoan.deleteMany({ where: { ma_giao_vien: id } });
      await tx.hoSoBangCap.deleteMany({ where: { ma_giao_vien: id } });
      await tx.hopDongLaoDong.deleteMany({ where: { ma_giao_vien: id } });
      await tx.phanCongGiangDay.deleteMany({ where: { ma_giao_vien: id } });
      await tx.keHoachGiangDay.deleteMany({ where: { ma_giao_vien: id } });
      await tx.phanCongHoatDong.deleteMany({ where: { ma_giao_vien: id } });
      
      return await tx.giaoVien.delete({ where: { ma_giao_vien: id } });
    });
  },
};