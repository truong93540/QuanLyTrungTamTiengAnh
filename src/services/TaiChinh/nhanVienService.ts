import { prisma } from '@/lib/prisma'

export const layDanhSachNhanVienTaiChinh = async () => {
    const danhSach = await prisma.nhanVien.findMany({
        orderBy: { ma_nhan_vien: 'asc' },
    })

    return danhSach.map(nv => ({
        ...nv,
        ma_nhan_su: nv.ma_nhan_vien
    }))
}
