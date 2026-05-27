import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface GiaoVienFilterParams {
  search?: string;
  ma_chuc_vu?: number;
  ma_phong_ban?: number;
  page?: number;
  limit?: number;
}

// Định nghĩa cấu trúc Object phụ cấp lưu trong Database JSON
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
    ma_bang_cap: number;
    ngay_cap?: string | Date | null;
    noi_cap?: string | null;
  }>;

  // Cải tiến: Nhận text thô từ Form, Service sẽ parse ra JSON
  hop_dong?: Array<{
    so_hop_dong: string;
    ngay_ky?: string | Date | null;
    ten_cong_viec?: string | null;
    tg_thu_viec?: string | null;
    dong_bao_hiem?: boolean;
    luong_co_ban?: number;
    phan_tram_hoa_hong?: number;
    tg_het_hop_dong?: string | Date | null;
    phu_cap_raw_text?: string | null; // Chuỗi định dạng: "Đi lại - 500000\nTiền ăn - 300000"
  }>;

  ma_lop_hocs?: number[];
}

/**
 * Hàm Helper biên dịch chuỗi Text thô từ giao diện thành mảng JSON để lưu vào DB
 * Quy tắc bắt lỗi nâng cao:
 * 1. Đúng định dạng phân tách: Tên - Số tiền
 * 2. Cấm từ khóa "Chuyên cần"
 * 3. Luôn bắt buộc VIẾT HOA chữ cái đầu tiên của tên phụ cấp (VD: "Đi lại" -> Hợp lệ, "đi lại" -> Lỗi)
 */
function parseAndValidatePhuCap(rawText: string | null | undefined): PhuCapJson[] {
  if (!rawText || !rawText.trim()) return [];
  
  const result: PhuCapJson[] = [];
  const lines = rawText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Bỏ qua dòng trống

    // 1. Kiểm tra cấu trúc dấu gạch ngang
    if (!line.includes('-')) {
      throw new Error(`Dòng ${i + 1} phần Phụ cấp: Sai định dạng. Phải có dấu gạch ngang '-' phân tách (VD: Đi lại - 500000)`);
    }

    const parts = line.split('-');
    if (parts.length !== 2) {
      throw new Error(`Dòng ${i + 1} phần Phụ cấp: Định dạng không hợp lệ. Vui lòng chỉ dùng duy nhất một dấu '-' trên một dòng.`);
    }

    const ten = parts[0].trim();
    const soTienStr = parts[1].trim();

    if (!ten) {
      throw new Error(`Dòng ${i + 1} phần Phụ cấp: Tên khoản phụ cấp không được để trống.`);
    }

    // 2. Nghiêm cấm từ khóa "Chuyên cần"
    if (ten.toLowerCase() === 'chuyên cần') {
      throw new Error(`Dòng ${i + 1} phần Phụ cấp: Không cho phép nhập phụ cấp "Chuyên cần". Hệ thống tự động tính toán khoản này.`);
    }

    // 3. CẢI TIẾN: Bắt buộc viết hoa chữ cái đầu tiên (hỗ trợ cả bảng chữ cái tiếng Việt có dấu)
    const firstChar = ten.charAt(0);
    if (firstChar !== firstChar.toUpperCase() || firstChar === firstChar.toLowerCase()) {
      throw new Error(
        `Dòng ${i + 1} phần Phụ cấp: Tên phụ cấp phải viết hoa chữ cái đầu tiên. Bạn đang nhập "${ten}", vui lòng sửa thành "${firstChar.toUpperCase()}${ten.slice(1)}".`
      );
    }

    // 4. Kiểm tra số tiền hợp lệ
    const soTien = Number(soTienStr);
    if (isNaN(soTien) || soTien < 0) {
      throw new Error(`Dòng ${i + 1} phần Phụ cấp: Số tiền phụ cấp "${soTienStr}" phải là một số dương hợp lệ.`);
    }

    result.push({ ten, soTien });
  }

  return result;
}

export const giaoVienService = {
  async getAll(params: GiaoVienFilterParams) {
    const { search, ma_chuc_vu, ma_phong_ban, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { ho_ten: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { so_dien_thoai: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (ma_chuc_vu) whereClause.ma_chuc_vu = Number(ma_chuc_vu);
    if (ma_phong_ban) whereClause.ma_phong_ban = Number(ma_phong_ban);

    const [items, total] = await prisma.$transaction([
      prisma.giaoVien.findMany({
        where: whereClause,
        include: {
          chuc_vu: true,
          phong_ban: true,
          tai_khoan: { select: { ma_tai_khoan: true, ten_dang_nhap: true, trang_thai: true } },
          hop_dong: true,
          ho_so_bang: { include: { bang_cap: true } },
          phan_cong_giang_day: { include: { lop_hoc: true } }
        },
        orderBy: { ma_giao_vien: 'desc' },
        skip,
        take: limit,
      }),
      prisma.giaoVien.count({ where: whereClause }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: number) {
    return await prisma.giaoVien.findUnique({
      where: { ma_giao_vien: id },
      include: {
        chuc_vu: true,
        phong_ban: true,
        tai_khoan: true,
        hop_dong: true,
        ho_so_bang: { include: { bang_cap: true } },
        phan_cong_giang_day: { include: { lop_hoc: true } },
        buoi_hoc: true,
        ke_hoach_day: true
      },
    });
  },

  async create(data: GiaoVienInput) {
    return await prisma.$transaction(async (tx) => {
      // Tiền xử lý dữ liệu hợp đồng lao động & parse phụ cấp sang JSON
      const hopDongData = data.hop_dong?.map((h) => {
        const phuCapJson = parseAndValidatePhuCap(h.phu_cap_raw_text);
        return {
          so_hop_dong: h.so_hop_dong,
          ngay_ky: h.ngay_ky ? new Date(h.ngay_ky) : null,
          ten_cong_viec: h.ten_cong_viec,
          tg_thu_viec: h.tg_thu_viec,
          dong_bao_hiem: h.dong_bao_hiem ?? false,
          luong_co_ban: h.luong_co_ban ? Number(h.luong_co_ban) : null,
          phan_tram_hoa_hong: h.phan_tram_hoa_hong ? Number(h.phan_tram_hoa_hong) : 0,
          tg_het_hop_dong: h.tg_het_hop_dong ? new Date(h.tg_het_hop_dong) : null,
          chi_tiet_phu_cap: phuCapJson as any, // Ép kiểu sang Json của Prisma
        };
      }) || [];

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
          ho_so_bang: {
            create: data.ho_so_bang?.map((b) => ({
              ma_bang_cap: Number(b.ma_bang_cap),
              ngay_cap: b.ngay_cap ? new Date(b.ngay_cap) : null,
              noi_cap: b.noi_cap,
            })) || [],
          },
          hop_dong: {
            create: hopDongData,
          },
          phan_cong_giang_day: {
            create: data.ma_lop_hocs?.map((lopId) => ({
              ma_lop_hoc: Number(lopId),
            })) || [],
          },
        },
      });

      if (data.tai_khoan && data.tai_khoan.ten_dang_nhap) {
        await tx.taiKhoan.create({
          data: {
            ten_dang_nhap: data.tai_khoan.ten_dang_nhap,
            mat_khau: data.tai_khoan.mat_khau, 
            trang_thai: data.tai_khoan.trang_thai || 'KICH_HOAT',
            ma_giao_vien: newTeacher.ma_giao_vien,
          },
        });
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

      // Đồng bộ hồ sơ bằng cấp
      await tx.hoSoBangCap.deleteMany({ where: { ma_giao_vien: id } });
      if (data.ho_so_bang && data.ho_so_bang.length > 0) {
        await tx.hoSoBangCap.createMany({
          data: data.ho_so_bang.map((b) => ({
            ma_giao_vien: id,
            ma_bang_cap: Number(b.ma_bang_cap),
            ngay_cap: b.ngay_cap ? new Date(b.ngay_cap) : null,
            noi_cap: b.noi_cap,
          })),
        });
      }

      // Cải tiến: Đồng bộ quan hệ Hợp đồng lao động đầy đủ trường kèm JSON Phụ cấp
      await tx.hopDongLaoDong.deleteMany({ where: { ma_giao_vien: id } });
      if (data.hop_dong && data.hop_dong.length > 0) {
        // Thực hiện map dữ liệu và parse phụ cấp trước khi chèn vào DB
        const processedHopDongs = data.hop_dong.map((h) => {
          const phuCapJson = parseAndValidatePhuCap(h.phu_cap_raw_text);
          return {
            ma_giao_vien: id,
            so_hop_dong: h.so_hop_dong,
            ngay_ky: h.ngay_ky ? new Date(h.ngay_ky) : null,
            ten_cong_viec: h.ten_cong_viec,
            tg_thu_viec: h.tg_thu_viec,
            dong_bao_hiem: h.dong_bao_hiem ?? false,
            luong_co_ban: h.luong_co_ban ? Number(h.luong_co_ban) : null,
            phan_tram_hoa_hong: h.phan_tram_hoa_hong ? Number(h.phan_tram_hoa_hong) : 0,
            tg_het_hop_dong: h.tg_het_hop_dong ? new Date(h.tg_het_hop_dong) : null,
            chi_tiet_phu_cap: phuCapJson as any
          };
        });

        // Sử dụng vòng lặp hoặc tạo lẻ vì createMany của Prisma đôi khi kén chọn dữ liệu Json nâng cao trực tiếp tùy phiên bản, 
        // hoặc dùng createMany chuẩn chỉ:
        await tx.hopDongLaoDong.createMany({
          data: processedHopDongs
        });
      }

      // Đồng bộ phân công lớp học
      await tx.phanCongGiangDay.deleteMany({ where: { ma_giao_vien: id } });
      if (data.ma_lop_hocs && data.ma_lop_hocs.length > 0) {
        await tx.phanCongGiangDay.createMany({
          data: data.ma_lop_hocs.map((lopId) => ({
            ma_giao_vien: id,
            ma_lop_hoc: Number(lopId),
          })),
        });
      }

      // Đồng bộ tài khoản
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

  async getMetadata() {
    const [chucVus, phongBans, lopHocs, bangCaps] = await Promise.all([
      prisma.chucVu.findMany(),
      prisma.phongBan.findMany(),
      prisma.lopHoc.findMany({ select: { ma_lop_hoc: true, ten_lop: true } }),
      prisma.bangCap.findMany(),
    ]);
    return { chucVus, phongBans, lopHocs, bangCaps };
  }
};