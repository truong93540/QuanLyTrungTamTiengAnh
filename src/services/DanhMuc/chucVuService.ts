import { prisma } from '@/lib/prisma'

interface ChucVuFilter {
    ma_chuc_vu?: string | null
    ten_chuc_vu?: string | null
    ghi_chu?: string | null
}

interface ChucVuData {
    ten_chuc_vu: string
    ghi_chu?: string
}

export const layDanhSachChucVu = async (filters: ChucVuFilter) => {
    const { ma_chuc_vu, ten_chuc_vu, ghi_chu } = filters

    const whereClause: {
        ma_chuc_vu?: number
        ten_chuc_vu?: string
        ghi_chu?: string
    } = {}

    if (ma_chuc_vu) whereClause.ma_chuc_vu = Number(ma_chuc_vu)
    if (ten_chuc_vu) whereClause.ten_chuc_vu = ten_chuc_vu
    if (ghi_chu) whereClause.ghi_chu = ghi_chu

    return await prisma.chucVu.findMany({
        where: whereClause,
    })
}

export const taoChucVuMoi = async (data: ChucVuData) => {
    return await prisma.chucVu.create({
        data: {
            ten_chuc_vu: data.ten_chuc_vu,
            ghi_chu: data.ghi_chu,
        },
    })
}

export const capNhatChucVu = async (ma_chuc_vu: number, data: ChucVuData) => {
    return await prisma.chucVu.update({
        where: { ma_chuc_vu: ma_chuc_vu },
        data: {
            ten_chuc_vu: data.ten_chuc_vu,
            ghi_chu: data.ghi_chu,
        },
    })
}

export const xoaChucVu = async (ma_chuc_vu: number) => {
    return await prisma.chucVu.delete({
        where: { ma_chuc_vu: ma_chuc_vu },
    })
}
