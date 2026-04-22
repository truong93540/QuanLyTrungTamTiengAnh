import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface PhieuThuFilter {
    ma_phieu_thu?: string | null
    so_tien?: string | null
    ngay_thu?: string | null
    ma_hoc_vien?: string | null
    ten_hoc_vien?: string | null
    ma_nhan_su?: string | null
}

interface PhieuThuData {
    so_tien: string | number
    ngay_thu: string | Date
    noi_dung: string
    ma_hoc_vien: string | number
    ma_nhan_su: string | number
}

export class PhieuThuValidationError extends Error {}

const validatePhieuThuReferences = async (ma_hoc_vien: number, ma_nhan_su: number) => {
    const hocVien = await prisma.hocVien.findUnique({ where: { ma_hoc_vien } })
    if (!hocVien) {
        throw new PhieuThuValidationError('Mã học viên không tồn tại.')
    }

    const nhanSu = await prisma.nhanSu.findUnique({ where: { ma_nhan_su } })
    if (!nhanSu) {
        throw new PhieuThuValidationError('Mã nhân sự lập phiếu không tồn tại.')
    }
}

export const layDanhSachPhieuThu = async (filters: PhieuThuFilter) => {
    const { ten_hoc_vien } = filters

    const whereClause: Prisma.PhieuThuWhereInput = {}

    if (ten_hoc_vien) {
        whereClause.hoc_vien = {
            ho_ten: {
                contains: ten_hoc_vien,
                mode: 'insensitive',
            },
        }
    }

    return await prisma.phieuThu.findMany({
        where: whereClause,
        include: {
            hoc_vien: true,
            nhan_su: true,
        },
        orderBy: { ngay_thu: 'desc' },
    })
}

export const taoPhieuThuMoi = async (data: PhieuThuData) => {
    const maHocVien = Number(data.ma_hoc_vien)
    const maNhanSu = Number(data.ma_nhan_su)

    await validatePhieuThuReferences(maHocVien, maNhanSu)

    return await prisma.phieuThu.create({
        data: {
            so_tien: Number(data.so_tien),
            ngay_thu: new Date(data.ngay_thu),
            noi_dung: data.noi_dung,
            ma_hoc_vien: maHocVien,
            ma_nhan_su: maNhanSu,
        },
        include: {
            hoc_vien: { select: { ho_ten: true } },
            nhan_su: { select: { ho_ten: true } },
        },
    })
}

export const capNhatPhieuThu = async (ma_phieu_thu: number, data: PhieuThuData) => {
    const maHocVien = Number(data.ma_hoc_vien)
    const maNhanSu = Number(data.ma_nhan_su)

    await validatePhieuThuReferences(maHocVien, maNhanSu)

    return await prisma.phieuThu.update({
        where: { ma_phieu_thu: ma_phieu_thu },
        data: {
            so_tien: Number(data.so_tien),
            ngay_thu: new Date(data.ngay_thu),
            noi_dung: data.noi_dung,
            ma_hoc_vien: maHocVien,
            ma_nhan_su: maNhanSu,
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
