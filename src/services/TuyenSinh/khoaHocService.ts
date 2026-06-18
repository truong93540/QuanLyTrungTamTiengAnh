import { prisma } from '@/lib/prisma'

export interface KhoaHocInput {
    ten_khoa_hoc: string
    mo_ta: string
    thoi_luong: string
    hoc_phi: number
    trinh_do: string
    trang_thai?: string
    ma_chuong_trinh: number
    danh_sach_marketing?: number[] 
}

export const layDanhSachKhoaHoc = async () => {
    const danhSachKhoaHoc = await prisma.khoaHoc.findMany({
        include: {
            chuong_trinh: {
                select: { 
                    ten_chuong_trinh: true, 
                    muc_tieu: true,
                    mo_ta: true 
                },
            },
            chi_tiet_marketing: {
                include: {
                    chuong_trinh_marketing: true
                }
            },
            lop_hoc: {
                include: {
                    phan_cong_giang_day: {
                        include: {
                            giao_vien: { select: { ho_ten: true } }
                        }
                    },
                    phong_hoc: { select: { ten_phong_hoc: true } }
                },
                orderBy: { ngay_khai_giang: 'desc' }
            }
        },
        orderBy: { ma_khoa_hoc: 'asc' }, 
    });

    danhSachKhoaHoc.forEach(khoaHoc => {
        if (khoaHoc.chi_tiet_marketing && khoaHoc.chi_tiet_marketing.length > 0) {
            khoaHoc.chi_tiet_marketing.sort((a, b) => {
                const mktB = b.chuong_trinh_marketing;
                const mktA = a.chuong_trinh_marketing;
                const timeB = mktB?.ngay_bat_dau ? new Date(mktB.ngay_bat_dau).getTime() : 0;
                const timeA = mktA?.ngay_bat_dau ? new Date(mktA.ngay_bat_dau).getTime() : 0;
                
                return timeB - timeA;
            });
        }
    });

    return danhSachKhoaHoc;
}

export const taoKhoaHocMoi = async (data: KhoaHocInput) => {
    const khoaHocMoi = await prisma.khoaHoc.create({
        data: {
            ten_khoa_hoc: data.ten_khoa_hoc,
            mo_ta: data.mo_ta,
            thoi_luong: data.thoi_luong,
            hoc_phi: data.hoc_phi,
            trinh_do: data.trinh_do,
            trang_thai: data.trang_thai || 'Đang mở',
            ma_chuong_trinh: data.ma_chuong_trinh,
            chi_tiet_marketing: {
                create: data.danh_sach_marketing?.map(id => ({
                    ma_chuong_trinh_marketing: id
                })) || []
            }
        },
        include: {
            chuong_trinh: { select: { ten_chuong_trinh: true } },
            chi_tiet_marketing: { include: { chuong_trinh_marketing: true } }
        },
    });

    if (khoaHocMoi.chi_tiet_marketing && khoaHocMoi.chi_tiet_marketing.length > 0) {
        khoaHocMoi.chi_tiet_marketing.sort((a, b) => {
            const timeB = b.chuong_trinh_marketing?.ngay_bat_dau ? new Date(b.chuong_trinh_marketing.ngay_bat_dau).getTime() : 0;
            const timeA = a.chuong_trinh_marketing?.ngay_bat_dau ? new Date(a.chuong_trinh_marketing.ngay_bat_dau).getTime() : 0;
            return timeB - timeA;
        });
    }

    return khoaHocMoi;
}


export const capNhatKhoaHoc = async (ma_khoa_hoc: number, data: Partial<KhoaHocInput>) => {
    if (data.danh_sach_marketing !== undefined) {
        await prisma.chiTietMarketing.deleteMany({
            where: { ma_khoa_hoc: ma_khoa_hoc }
        })
    }

    const khoaHocCapNhat = await prisma.khoaHoc.update({
        where: { ma_khoa_hoc: ma_khoa_hoc },
        data: {
            ...(data.ten_khoa_hoc && { ten_khoa_hoc: data.ten_khoa_hoc }),
            ...(data.mo_ta !== undefined && { mo_ta: data.mo_ta }),
            ...(data.thoi_luong !== undefined && { thoi_luong: data.thoi_luong }),
            ...(data.hoc_phi !== undefined && { hoc_phi: data.hoc_phi }),
            ...(data.trinh_do !== undefined && { trinh_do: data.trinh_do }),
            ...(data.trang_thai !== undefined && { trang_thai: data.trang_thai }),
            ...(data.ma_chuong_trinh && { ma_chuong_trinh: data.ma_chuong_trinh }),
            ...(data.danh_sach_marketing !== undefined && {
                chi_tiet_marketing: {
                    create: data.danh_sach_marketing.map(id => ({
                        ma_chuong_trinh_marketing: id
                    }))
                }
            })
        },
        include: {
            chuong_trinh: { select: { ten_chuong_trinh: true } },
            chi_tiet_marketing: { include: { chuong_trinh_marketing: true } }
        },
    });
    if (khoaHocCapNhat.chi_tiet_marketing && khoaHocCapNhat.chi_tiet_marketing.length > 0) {
        khoaHocCapNhat.chi_tiet_marketing.sort((a, b) => {
            const timeB = b.chuong_trinh_marketing?.ngay_bat_dau ? new Date(b.chuong_trinh_marketing.ngay_bat_dau).getTime() : 0;
            const timeA = a.chuong_trinh_marketing?.ngay_bat_dau ? new Date(a.chuong_trinh_marketing.ngay_bat_dau).getTime() : 0;
            return timeB - timeA;
        });
    }

    return khoaHocCapNhat;
}

export const xoaKhoaHoc = async (ma_khoa_hoc: number) => {
    await prisma.chiTietMarketing.deleteMany({
        where: { ma_khoa_hoc: ma_khoa_hoc }
    })

    return await prisma.khoaHoc.delete({
        where: { ma_khoa_hoc: ma_khoa_hoc },
    })
}