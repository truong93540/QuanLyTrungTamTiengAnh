import { prisma } from '@/lib/prisma';

export interface LopHocFilter {
  page?: number;
  limit?: number;
  search?: string;
}

export interface TaoLopHocInput {
  ten_lop: string;
  si_so_toi_da?: number;
  ngay_khai_giang?: Date | string;
  ngay_ket_thuc?: Date | string;
  lich_hoc?: any;
  ma_phong_hoc: number;
  ma_khoa_hoc: number;
}

export interface CapNhatLopHocInput {
  ten_lop?: string;
  si_so_toi_da?: number;
  ngay_khai_giang?: Date | string;
  ngay_ket_thuc?: Date | string;
  lich_hoc?: any;
  ma_phong_hoc?: number;
  ma_khoa_hoc?: number;
}

export const layDanhSachLopHoc = async (filters: LopHocFilter) => {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;
  const search = filters.search || '';

  const where: any = {};
  if (search) {
    where.ten_lop = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const [items, total] = await Promise.all([
    prisma.lopHoc.findMany({
      where,
      skip,
      take: limit,
      include: {
        khoa_hoc: true,
        phong_hoc: true,
        phan_cong_giang_day: {
          include: {
            giao_vien: true,
          },
        },
        tham_gia: {
          include: {
            hoc_vien: true,
          },
        },
      },
      orderBy: {
        ma_lop_hoc: 'desc',
      },
    }),
    prisma.lopHoc.count({ where }),
  ]);

  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const layChiTietLopHoc = async (id: number) => {
  return await prisma.lopHoc.findUnique({
    where: { ma_lop_hoc: id },
    include: {
      khoa_hoc: true,
      phong_hoc: true,
      phan_cong_giang_day: {
        include: {
          giao_vien: true,
        },
      },
      tham_gia: {
        include: {
          hoc_vien: true,
        },
      },
      buoi_hoc: {
        orderBy: {
          ngay_hoc: 'asc',
        },
      },
    },
  });
};

export const taoLopHoc = async (data: TaoLopHocInput) => {
  return await prisma.lopHoc.create({
    data: {
      ten_lop: data.ten_lop,
      si_so_toi_da: data.si_so_toi_da ? Number(data.si_so_toi_da) : null,
      ngay_khai_giang: data.ngay_khai_giang ? new Date(data.ngay_khai_giang) : null,
      ngay_ket_thuc: data.ngay_ket_thuc ? new Date(data.ngay_ket_thuc) : null,
      lich_hoc: data.lich_hoc || null,
      ma_phong_hoc: Number(data.ma_phong_hoc),
      ma_khoa_hoc: Number(data.ma_khoa_hoc),
    },
    include: {
      khoa_hoc: true,
      phong_hoc: true,
    },
  });
};

export const capNhatLopHoc = async (id: number, data: CapNhatLopHocInput) => {
  return await prisma.lopHoc.update({
    where: { ma_lop_hoc: id },
    data: {
      ...(data.ten_lop && { ten_lop: data.ten_lop }),
      si_so_toi_da: data.si_so_toi_da !== undefined ? (data.si_so_toi_da ? Number(data.si_so_toi_da) : null) : undefined,
      ngay_khai_giang: data.ngay_khai_giang !== undefined ? (data.ngay_khai_giang ? new Date(data.ngay_khai_giang) : null) : undefined,
      ngay_ket_thuc: data.ngay_ket_thuc !== undefined ? (data.ngay_ket_thuc ? new Date(data.ngay_ket_thuc) : null) : undefined,
      lich_hoc: data.lich_hoc !== undefined ? data.lich_hoc : undefined,
      ...(data.ma_phong_hoc && { ma_phong_hoc: Number(data.ma_phong_hoc) }),
      ...(data.ma_khoa_hoc && { ma_khoa_hoc: Number(data.ma_khoa_hoc) }),
    },
    include: {
      khoa_hoc: true,
      phong_hoc: true,
    },
  });
};

export const xoaLopHoc = async (id: number) => {
  return await prisma.lopHoc.delete({
    where: { ma_lop_hoc: id },
  });
};

export const layMetadataLopHoc = async () => {
  const [khoaHoc, phongHoc] = await Promise.all([
    prisma.khoaHoc.findMany({ select: { ma_khoa_hoc: true, ten_khoa_hoc: true } }),
    prisma.phongHoc.findMany({ select: { ma_phong_hoc: true, ten_phong_hoc: true } }),
  ]);
  return { khoaHoc, phongHoc };
};