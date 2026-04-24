import { prisma } from '@/lib/prisma'

interface NhanSuData {
    ma_nhan_su: number
    ho_ten: string
    ngay_sinh: string | Date
    gioi_tinh: string
    so_dien_thoai: string
    dia_chi: string
    ma_phong_ban: number
    ma_chuc_vu: number
}

export const layDanhSachNhanSu = async () => {
    return await prisma.nhanSu.findMany({
        orderBy: { ma_nhan_su: 'asc' },
    })
}
