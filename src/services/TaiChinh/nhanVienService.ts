import { prisma } from '@/lib/prisma'

export const layDanhSachNhanVienTaiChinh = async () => {
    // Sử dụng model NhanSu thay vì NhanVien theo schema mới
    const danhSach = await prisma.nhanSu.findMany({
        orderBy: { ma_nhan_su: 'asc' },
    })

    return danhSach
}
