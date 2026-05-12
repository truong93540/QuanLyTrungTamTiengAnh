import { prisma } from '@/lib/prisma'

export const layDanhSachNhanVienTaiChinh = async () => {
    const danhSach = await prisma.nhanSu.findMany({
        orderBy: { ma_nhan_su: 'asc' },
    })

    return danhSach
}
