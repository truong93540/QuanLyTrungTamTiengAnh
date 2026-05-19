import { prisma } from '@/lib/prisma'

export const layDanhSachLopHoc = async () => {
    return await prisma.lopHoc.findMany({
        include: {
            khoa_hoc: {
                select: {
                    ma_khoa_hoc: true,
                    ten_khoa_hoc: true,
                    hoc_phi: true,
                }
            },
            tham_gia: {
                include: {
                    hoc_vien: {
                        select: {
                            ma_hoc_vien: true,
                            ho_ten: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            ma_lop_hoc: 'desc',
        }
    })
}
