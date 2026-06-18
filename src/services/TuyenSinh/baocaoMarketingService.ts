import { prisma } from '@/lib/prisma'

export const layDuLieuBaoCaoMarketing = async (nam: number) => {
    const ngayBatDauNam = new Date(`${nam}-01-01T00:00:00.000Z`)
    const ngayKetThucNam = new Date(`${nam}-12-31T23:59:59.999Z`)

    const danhSachChuongTrinh = await prisma.chuongTrinhMarketing.findMany({
        where: {
            ngay_bat_dau: {
                gte: ngayBatDauNam,
                lte: ngayKetThucNam
            }
        },
        include: {
            phan_cong: {
                include: {
                    nhan_su: {
                        select: {
                            ma_nhan_su: true,
                            ho_ten: true
                        }
                    }
                }
            }
        },
        orderBy: { ngay_bat_dau: 'asc' }
    });

    return danhSachChuongTrinh;
}