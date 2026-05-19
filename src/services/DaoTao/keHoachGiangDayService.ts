import { prisma } from "@/lib/prisma";

export const keHoachGiangDayService = {
  /**
   * Truy vấn toàn bộ danh sách kế hoạch kèm dữ liệu quan hệ đồng cấp hệ thống
   */
  async getAll() {
    return await prisma.keHoachGiangDay.findMany({
      include: {
        giao_vien: {
          include: {
            buoi_hoc: {
              include: {
                diem_danh: true,
                nhan_xet: true,
              },
            },
          },
        },
        khoa_hoc: {
          include: {
            chuong_trinh: true,
            lop_hoc: {
              include: {
                buoi_hoc: true,
              },
            },
            bai_kiem_tra: true,
          },
        },
      },
      orderBy: {
        ma_ke_hoach_giang_day: "desc",
      },
    });
  },

  /**
   * Truy vấn thông tin chi tiết một kế hoạch giảng dạy theo mã định danh duy nhất
   */
  async getById(id: number) {
    return await prisma.keHoachGiangDay.findUnique({
      where: { ma_ke_hoach_giang_day: id },
      include: {
        giao_vien: {
          include: {
            buoi_hoc: {
              include: {
                diem_danh: {
                  include: {
                    hoc_vien: true,
                  },
                },
                nhan_xet: {
                  include: {
                    hoc_vien: true,
                  },
                },
              },
            },
          },
        },
        khoa_hoc: {
          include: {
            chuong_trinh: true,
            lop_hoc: {
              include: {
                buoi_hoc: {
                  include: {
                    diem_danh: true,
                    nhan_xet: true,
                  },
                },
                tham_gia: {
                  include: {
                    hoc_vien: true,
                  },
                },
              },
            },
            bai_kiem_tra: {
              include: {
                ket_qua: {
                  include: {
                    hoc_vien: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  /**
   * Khởi tạo bản ghi kế hoạch giảng dạy mới
   */
  async create(data: {
    noi_dung?: string;
    lich_day?: string;
    thoi_gian?: string;
    ma_giao_vien: number;
    ma_khoa_hoc: number;
  }) {
    return await prisma.keHoachGiangDay.create({
      data: {
        noi_dung: data.noi_dung,
        lich_day: data.lich_day,
        thoi_gian: data.thoi_gian,
        ma_giao_vien: Number(data.ma_giao_vien),
        ma_khoa_hoc: Number(data.ma_khoa_hoc),
      },
    });
  },

  /**
   * Cập nhật thông tin chi tiết bản ghi kế hoạch giảng dạy
   */
  async update(
    id: number,
    data: {
      noi_dung?: string;
      lich_day?: string;
      thoi_gian?: string;
      ma_giao_vien?: number;
      ma_khoa_hoc?: number;
    }
  ) {
    return await prisma.keHoachGiangDay.update({
      where: { ma_ke_hoach_giang_day: id },
      data: {
        noi_dung: data.noi_dung,
        lich_day: data.lich_day,
        thoi_gian: data.thoi_gian,
        ma_giao_vien: data.ma_giao_vien ? Number(data.ma_giao_vien) : undefined,
        ma_khoa_hoc: data.ma_khoa_hoc ? Number(data.ma_khoa_hoc) : undefined,
      },
    });
  },

  /**
   * Xử lý xóa kế hoạch giảng dạy khỏi cơ sở dữ liệu
   */
  async delete(id: number) {
    return await prisma.keHoachGiangDay.delete({
      where: { ma_ke_hoach_giang_day: id },
    });
  },

  /**
   * Nghiệp vụ con: Tạo buổi học trực thuộc kế hoạch đào tạo
   */
  async createBuoiHoc(data: {
    ngay_hoc: Date | string;
    noi_dung_hoc?: string;
    ma_giao_vien: number;
    ma_lop_hoc: number;
  }) {
    return await prisma.buoiHoc.create({
      data: {
        ngay_hoc: new Date(data.ngay_hoc),
        noi_dung_hoc: data.noi_dung_hoc,
        ma_giao_vien: Number(data.ma_giao_vien),
        ma_lop_hoc: Number(data.ma_lop_hoc),
      },
    });
  },

  /**
   * Nghiệp vụ con: Cập nhật thông tin buổi học
   */
  async updateBuoiHoc(
    ma_buoi_hoc: number,
    data: {
      ngay_hoc?: Date | string;
      noi_dung_hoc?: string;
      ma_giao_vien?: number;
      ma_lop_hoc?: number;
    }
  ) {
    return await prisma.buoiHoc.update({
      where: { ma_buoi_hoc },
      data: {
        ngay_hoc: data.ngay_hoc ? new Date(data.ngay_hoc) : undefined,
        noi_dung_hoc: data.noi_dung_hoc,
        ma_giao_vien: data.ma_giao_vien ? Number(data.ma_giao_vien) : undefined,
        ma_lop_hoc: data.ma_lop_hoc ? Number(data.ma_lop_hoc) : undefined,
      },
    });
  },

  /**
   * Nghiệp vụ con: Xóa buổi học ra khỏi lớp phụ trách
   */
  async deleteBuoiHoc(ma_buoi_hoc: number) {
    return await prisma.buoiHoc.delete({
      where: { ma_buoi_hoc },
    });
  },

  /**
   * Truy vấn thông tin phụ trợ phục vụ nạp Form lựa chọn (Dropdown Option Setup)
   */
  async getFormDataOptions() {
    const giaoVien = await prisma.giaoVien.findMany({
      select: { ma_giao_vien: true, ho_ten: true },
    });
    const khoaHoc = await prisma.khoaHoc.findMany({
      include: { chuong_trinh: true, lop_hoc: true },
    });
    return { giaoVien, khoaHoc };
  },
};