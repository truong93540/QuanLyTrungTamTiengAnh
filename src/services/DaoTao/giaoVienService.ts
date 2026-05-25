import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export interface GiaoVienFilter {
    ma_giao_vien?: string | null
    ho_ten?: string | null
    so_dien_thoai?: string | null
    ma_phong_ban?: string | null
}

export interface GiaoVienPayload {
    ho_ten: string
    ngay_sinh?: Date | null
    gioi_tinh?: string | null
    so_dien_thoai?: string | null
    email?: string | null
    dia_chi?: string | null
    ma_chuc_vu: number
    ma_phong_ban: number
}

const normalizeOptionalString = (v: unknown): string | null | undefined => {
    if (v === undefined) return undefined
    if (v === null || v === '') return null
    return String(v)
}

export const layDanhSachGiaoVien = async (filters: GiaoVienFilter = {}) => {
    const { ma_giao_vien, ho_ten, so_dien_thoai, ma_phong_ban } = filters
    const whereClause: Prisma.GiaoVienWhereInput = {}

    if (ma_giao_vien) whereClause.ma_giao_vien = Number(ma_giao_vien)
    if (ho_ten) whereClause.ho_ten = { contains: ho_ten, mode: 'insensitive' as const }
    if (so_dien_thoai) whereClause.so_dien_thoai = { contains: so_dien_thoai, mode: 'insensitive' as const }
    if (ma_phong_ban) whereClause.ma_phong_ban = Number(ma_phong_ban)

    return await prisma.giaoVien.findMany({
        where: whereClause,
        include: {
            chuc_vu: true,    
            phong_ban: true,  
        },
        });
}

export const taoGiaoVienMoi = async (data: GiaoVienPayload) => {
    return prisma.giaoVien.create({
        data: {
            ho_ten: data.ho_ten,
            ngay_sinh: data.ngay_sinh ?? null,
            gioi_tinh: data.gioi_tinh ?? null,
            so_dien_thoai: data.so_dien_thoai ?? null,
            email: data.email ?? null,
            dia_chi: data.dia_chi ?? null,
            ma_chuc_vu: data.ma_chuc_vu,
            ma_phong_ban: data.ma_phong_ban,
        },
    })
}

export const capNhatGiaoVien = async (ma_giao_vien: number, data: Partial<GiaoVienPayload>) => {
    const capNhat: any = {}

    if (data.ho_ten !== undefined) capNhat.ho_ten = data.ho_ten
    if (data.ngay_sinh !== undefined) capNhat.ngay_sinh = data.ngay_sinh === null ? null : data.ngay_sinh
    if (data.gioi_tinh !== undefined) capNhat.gioi_tinh = normalizeOptionalString(data.gioi_tinh) ?? null
    if (data.so_dien_thoai !== undefined) capNhat.so_dien_thoai = normalizeOptionalString(data.so_dien_thoai) ?? null
    if (data.email !== undefined) capNhat.email = normalizeOptionalString(data.email) ?? null
    if (data.dia_chi !== undefined) capNhat.dia_chi = normalizeOptionalString(data.dia_chi) ?? null
    if (data.ma_chuc_vu !== undefined) capNhat.ma_chuc_vu = data.ma_chuc_vu
    if (data.ma_phong_ban !== undefined) capNhat.ma_phong_ban = data.ma_phong_ban

    return prisma.giaoVien.update({
        where: { ma_giao_vien },
        data: capNhat,
    })
}

export const xoaGiaoVien = async (ma_giao_vien: number) => {
    return prisma.giaoVien.delete({
        where: { ma_giao_vien },
    })
}