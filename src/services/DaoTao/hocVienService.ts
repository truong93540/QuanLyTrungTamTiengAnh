// File: src/services/hocVienService.ts
import { prisma } from '@/lib/prisma'

interface HocVienData {
    ho_ten: string
    ngay_sinh: string | Date
    gioi_tinh?: string
    dia_chi?: string
    so_dien_thoai?: string
    email?: string
    trang_thai?: string
}

export const layDanhSachHocVien = async () => {
    return await prisma.hocVien.findMany({
        orderBy: { ma_hoc_vien: 'desc' },
    })
}

export const taoHocVienMoi = async (data: HocVienData) => {
    return await prisma.hocVien.create({
        data: {
            ho_ten: data.ho_ten,
            ngay_sinh: new Date(data.ngay_sinh),
            gioi_tinh: data.gioi_tinh || null,
            dia_chi: data.dia_chi || null,
            so_dien_thoai: data.so_dien_thoai || null,
            email: data.email || null,
            trang_thai: data.trang_thai || 'Đang học',
        },
    })
}

export const capNhatHocVien = async (ma_hoc_vien: number, data: HocVienData) => {
    return await prisma.hocVien.update({
        where: { ma_hoc_vien: ma_hoc_vien },
        data: {
            ho_ten: data.ho_ten,
            ngay_sinh: new Date(data.ngay_sinh),
            gioi_tinh: data.gioi_tinh || null,
            dia_chi: data.dia_chi || null,
            so_dien_thoai: data.so_dien_thoai || null,
            email: data.email || null,
            trang_thai: data.trang_thai,
        },
    })
}

export const xoaHocVien = async (ma_hoc_vien: number) => {
    return await prisma.hocVien.delete({
        where: { ma_hoc_vien: ma_hoc_vien },
    })
}