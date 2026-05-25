import { prisma } from '@/lib/prisma'

export const layDuLieuBaoCaoMarketing = async (nam: number) => {
    // Xác định khoảng thời gian đầu năm và cuối năm
    const ngayBatDauNam = new Date(`${nam}-01-01T00:00:00.000Z`)
    const ngayKetThucNam = new Date(`${nam}-12-31T23:59:59.999Z`)

    // Lấy tất cả chương trình trong năm kèm theo nhân sự phân công
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