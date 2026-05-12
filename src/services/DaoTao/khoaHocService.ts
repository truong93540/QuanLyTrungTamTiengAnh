import { prisma } from '@/lib/prisma'

export const layDanhSachKhoaHoc = async () => {
    return await prisma.khoaHoc.findMany({
        orderBy: { ma_khoa_hoc: 'desc' },
        select: {
            ma_khoa_hoc: true,
            ten_khoa_hoc: true,
            hoc_phi: true,
            trang_thai: true,
        }
    })
}
