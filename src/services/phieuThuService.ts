import { prisma } from '@/lib/prisma'

interface PhieuThuFilter {
    ma_phieu_thu?: string | null
    so_tien?: string | null
    ngay_thu?: string | null
    ma_hoc_vien?: string | null
    ma_nhan_su?: string | null
}

interface PhieuThuData {
    so_tien: string | number
    ngay_thu: string | Date
    noi_dung: string
    ma_hoc_vien: string | number
    ma_nhan_su: string | number
}

export const layDanhSachPhieuThu = async (filters: PhieuThuFilter) => {
    const { ma_phieu_thu, so_tien, ngay_thu, ma_hoc_vien, ma_nhan_su } = filters

    const whereClause: {
        ma_phieu_thu?: number
        so_tien?: number
        ma_hoc_vien?: number
        ma_nhan_su?: number
        ngay_thu?: { gte: Date; lt: Date }
    } = {}

    if (ma_phieu_thu) whereClause.ma_phieu_thu = Number(ma_phieu_thu)
    if (so_tien) whereClause.so_tien = Number(so_tien)
    if (ma_hoc_vien) whereClause.ma_hoc_vien = Number(ma_hoc_vien)
    if (ma_nhan_su) whereClause.ma_nhan_su = Number(ma_nhan_su)

    if (ngay_thu) {
        const date = new Date(ngay_thu)
        const nextDay = new Date(date)
        nextDay.setDate(date.getDate() + 1)
        whereClause.ngay_thu = { gte: date, lt: nextDay }
    }

    return await prisma.phieuThu.findMany({
        where: whereClause,
        include: {
            hoc_vien: { select: { ho_ten: true } },
            nhan_su: { select: { ho_ten: true } },
        },
        orderBy: { ngay_thu: 'desc' },
    })
}

export const taoPhieuThuMoi = async (data: PhieuThuData) => {
    return await prisma.phieuThu.create({
        data: {
            so_tien: Number(data.so_tien),
            ngay_thu: new Date(data.ngay_thu),
            noi_dung: data.noi_dung,
            ma_hoc_vien: Number(data.ma_hoc_vien),
            ma_nhan_su: Number(data.ma_nhan_su),
        },
        include: {
            hoc_vien: { select: { ho_ten: true } },
            nhan_su: { select: { ho_ten: true } },
        },
    })
}

export const capNhatPhieuThu = async (ma_phieu_thu: number, data: PhieuThuData) => {
    return await prisma.phieuThu.update({
        where: { ma_phieu_thu: ma_phieu_thu },
        data: {
            so_tien: Number(data.so_tien),
            ngay_thu: new Date(data.ngay_thu),
            noi_dung: data.noi_dung,
            ma_hoc_vien: Number(data.ma_hoc_vien),
            ma_nhan_su: Number(data.ma_nhan_su),
        },
        include: {
            hoc_vien: { select: { ho_ten: true } },
            nhan_su: { select: { ho_ten: true } },
        },
    })
}

export const xoaPhieuThu = async (ma_phieu_thu: number) => {
    return await prisma.phieuThu.delete({
        where: { ma_phieu_thu: ma_phieu_thu },
    })
}
