import { prisma } from '@/lib/prisma'

export const layDuLieuBaoCaoHoatDong = async (nam: number) => {
    const ngayBatDauNam = new Date(`${nam}-01-01T00:00:00.000Z`)
    const ngayKetThucNam = new Date(`${nam}-12-31T23:59:59.999Z`)

    const danhSachHoatDong = await prisma.hoatDongNgoaiKhoa.findMany({
        where: {
            ngay_to_chuc: {
                gte: ngayBatDauNam,
                lte: ngayKetThucNam
            }
        },
        include: {
            phan_cong: { 
                include: {
                    giao_vien: {
                        select: { ma_giao_vien: true, ho_ten: true }
                    }
                }
            },
            tham_gia_hoc_vien: { 
                include: {
                    hoc_vien: {
                        include: {
                            tham_gia_lop: { 
                                include: {
                                    lop_hoc: { 
                                        select: { ma_lop_hoc: true, ten_lop: true }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: { ngay_to_chuc: 'asc' }
    });

    return danhSachHoatDong;
}