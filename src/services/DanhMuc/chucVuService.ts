import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface ChucVuFilter {
    ma_chuc_vu?: string | null
    ten_chuc_vu?: string | null
    mo_ta?: string | null
}

interface ChucVuData {
    ten_chuc_vu: string
    mo_ta?: string
}

export const layDanhSachChucVu = async (filters: ChucVuFilter) => {
    const { ten_chuc_vu } = filters

    const whereClause: Prisma.ChucVuWhereInput = {}

    if (ten_chuc_vu)
        whereClause.ten_chuc_vu = {
            contains: ten_chuc_vu,
            mode: 'insensitive',
        }

    return await prisma.chucVu.findMany({
        where: whereClause,
        orderBy: { ma_chuc_vu: 'asc' },
    })
}

export const taoChucVuMoi = async (data: ChucVuData) => {
    return await prisma.chucVu.create({
        data: {
            ten_chuc_vu: data.ten_chuc_vu,
            mo_ta: data.mo_ta,
        },
    })
}

export const capNhatChucVu = async (ma_chuc_vu: number, data: ChucVuData) => {
    return await prisma.chucVu.update({
        where: { ma_chuc_vu: ma_chuc_vu },
        data: {
            ten_chuc_vu: data.ten_chuc_vu,
            mo_ta: data.mo_ta,
        },
    })
}

export const xoaChucVu = async (ma_chuc_vu: number) => {
    const [countNhanVien, countGiaoVien] = await Promise.all([
        prisma.nhanVien.count({ where: { ma_chuc_vu } }),
        prisma.giaoVien.count({ where: { ma_chuc_vu } }),
    ])

    if (countNhanVien > 0 || countGiaoVien > 0) {
        throw new Error(`CONFLICT_RELATION`)
    }

    return await prisma.chucVu.delete({
        where: { ma_chuc_vu: ma_chuc_vu },
    })
}
