import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface PhieuThuFilter {
    ma_phieu_thu?: string | null
    so_tien?: string | null
    ngay_thu?: string | null
    ma_hoc_vien?: string | null
    ten_hoc_vien?: string | null
    ma_nhan_vien?: string | null
}

interface PhieuThuData {
    so_tien: string | number
    ngay_thu: string | Date
    noi_dung: string
    ma_hoc_vien: string | number
    ma_nhan_su: string | number // Giữ nguyên tên biến từ client để tránh sửa quá nhiều
    ma_khoa_hoc: string | number
    ma_khuyen_mai?: string | number | null
}

export class PhieuThuValidationError extends Error {}

const validatePhieuThuReferences = async (ma_hoc_vien: number, ma_nhan_vien: number) => {
    const hocVien = await prisma.hocVien.findUnique({ where: { ma_hoc_vien } })
    if (!hocVien) {
        throw new PhieuThuValidationError('Mã học viên không tồn tại.')
    }

    const nhanVien = await prisma.nhanVien.findUnique({ where: { ma_nhan_vien } })
    if (!nhanVien) {
        throw new PhieuThuValidationError('Mã nhân viên lập phiếu không tồn tại.')
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

    const result = await prisma.phieuThu.findMany({
        where: whereClause,
        include: {
            hoc_vien: true,
            nhan_vien: true,
            khoa_hoc: true,
            khuyen_mai: true,
        },
        orderBy: { ngay_thu: 'desc' },
    })

    return result.map(item => ({
        ...item,
        nhan_su: item.nhan_vien,
        ma_nhan_su: item.ma_nhan_vien
    }))
}

export const taoPhieuThuMoi = async (data: PhieuThuData) => {
    const maHocVien = Number(data.ma_hoc_vien)
    const maNhanVien = Number(data.ma_nhan_su) // Lấy từ field ma_nhan_su của frontend

    await validatePhieuThuReferences(maHocVien, maNhanVien)

    const newPhieuThu = await prisma.phieuThu.create({
        data: {
            so_tien: Number(data.so_tien),
            ngay_thu: new Date(data.ngay_thu),
            noi_dung: data.noi_dung,
            ma_hoc_vien: maHocVien,
            ma_nhan_vien: maNhanVien,
            ma_khoa_hoc: Number(data.ma_khoa_hoc),
            ma_khuyen_mai: data.ma_khuyen_mai ? Number(data.ma_khuyen_mai) : null,
        },
        include: {
            hoc_vien: { select: { ho_ten: true } },
            nhan_vien: { select: { ho_ten: true } },
            khoa_hoc: { select: { ten_khoa_hoc: true, hoc_phi: true } },
            khuyen_mai: { select: { ten_chuong_trinh: true, phan_tram_giam: true } },
        },
    })

    return {
        ...newPhieuThu,
        nhan_su: newPhieuThu.nhan_vien,
        ma_nhan_su: newPhieuThu.ma_nhan_vien
    }
}

export const capNhatPhieuThu = async (ma_phieu_thu: number, data: PhieuThuData) => {
    const maHocVien = Number(data.ma_hoc_vien)
    const maNhanVien = Number(data.ma_nhan_su)

    await validatePhieuThuReferences(maHocVien, maNhanVien)

    const updatedPhieuThu = await prisma.phieuThu.update({
        where: { ma_phieu_thu: ma_phieu_thu },
        data: {
            so_tien: Number(data.so_tien),
            ngay_thu: new Date(data.ngay_thu),
            noi_dung: data.noi_dung,
            ma_hoc_vien: maHocVien,
            ma_nhan_vien: maNhanVien,
            ma_khoa_hoc: Number(data.ma_khoa_hoc),
            ma_khuyen_mai: data.ma_khuyen_mai ? Number(data.ma_khuyen_mai) : null,
        },
        include: {
            hoc_vien: { select: { ho_ten: true } },
            nhan_vien: { select: { ho_ten: true } },
            khoa_hoc: { select: { ten_khoa_hoc: true, hoc_phi: true } },
            khuyen_mai: { select: { ten_chuong_trinh: true, phan_tram_giam: true } },
        },
    })

    return {
        ...updatedPhieuThu,
        nhan_su: updatedPhieuThu.nhan_vien,
        ma_nhan_su: updatedPhieuThu.ma_nhan_vien
    }
}

export const xoaPhieuThu = async (ma_phieu_thu: number) => {
    return await prisma.phieuThu.delete({
        where: { ma_phieu_thu: ma_phieu_thu },
    })
}

