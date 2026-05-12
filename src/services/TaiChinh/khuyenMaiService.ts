import { prisma } from '@/lib/prisma'

export const layDanhSachKhuyenMaiActive = async () => {
    const today = new Date()
    return await prisma.chuongTrinhKhuyenMai.findMany({
        where: {
            ngay_bat_dau: { lte: today },
            OR: [
                { ngay_ket_thuc: { gte: today } },
                { ngay_ket_thuc: null }
            ]
        },
        orderBy: { ngay_bat_dau: 'desc' }
    })
}
