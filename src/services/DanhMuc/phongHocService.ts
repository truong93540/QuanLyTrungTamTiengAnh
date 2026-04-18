// File: src/services/phongHocService.ts
import { prisma } from '@/lib/prisma'

interface PhongHocData {
    ten_phong_hoc: string
    suc_chua: number | string
}

export const layDanhSachPhongHoc = async () => {
    return await prisma.phongHoc.findMany({
        orderBy: { ma_phong_hoc: 'desc' },
    })
}

export const taoPhongHocMoi = async (data: PhongHocData) => {
    return await prisma.phongHoc.create({
        data: {
            ten_phong_hoc: data.ten_phong_hoc,
            suc_chua: Number(data.suc_chua),
        },
    })
}

export const capNhatPhongHoc = async (ma_phong_hoc: number, data: PhongHocData) => {
    return await prisma.phongHoc.update({
        where: { ma_phong_hoc: ma_phong_hoc },
        data: {
            ten_phong_hoc: data.ten_phong_hoc,
            suc_chua: Number(data.suc_chua),
        },
    })
}

export const xoaPhongHoc = async (ma_phong_hoc: number) => {
    return await prisma.phongHoc.delete({
        where: { ma_phong_hoc: ma_phong_hoc },
    })
}