import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface PhieuChiFilter {
    loai_phieu_chi?: string | null
    trang_thai?: string | null
    search?: string | null
}

interface PhieuChiData {
    loai_phieu_chi: string
    tong_tien: string | number
    hinh_thuc_chi?: string | null
    nguoi_nhan?: string | null
    noi_dung?: string | null
    trang_thai?: string | null
    ngay_chi?: string | Date | null
    ma_bang_luong?: string | number | null
    ma_chuong_trinh_marketing?: string | number | null
    ma_nhan_su: string | number
}

export class PhieuChiValidationError extends Error {}

const validatePhieuChiReferences = async (maNhanSu: number, maBangLuong?: number | null, maMarketing?: number | null, currentPhieuChiId?: number) => {
    // 1. Kiểm tra người lập
    const nhanSu = await prisma.nhanSu.findUnique({ where: { ma_nhan_su: maNhanSu } })
    if (!nhanSu) {
        throw new PhieuChiValidationError('Mã nhân viên lập phiếu không tồn tại.')
    }

    // 2. Kiểm tra bảng lương
    if (maBangLuong) {
        const bangLuong = await prisma.bangLuong.findUnique({ where: { ma_bang_luong: maBangLuong } })
        if (!bangLuong) {
            throw new PhieuChiValidationError('Mã bảng lương không tồn tại.')
        }

        // Kiểm tra xem bảng lương đã được lập phiếu chi bởi một phiếu chi KHÁC chưa (bỏ qua các phiếu chi đã hủy)
        const duplicateBangLuong = await prisma.phieuChi.findFirst({
            where: {
                ma_bang_luong: maBangLuong,
                NOT: currentPhieuChiId ? { ma_phieu_chi: currentPhieuChiId } : undefined,
                trang_thai: { not: 'Đã hủy' }
            }
        })
        if (duplicateBangLuong) {
            throw new PhieuChiValidationError('Bảng lương này đã được lập phiếu chi trước đó.')
        }
    }

    // 3. Kiểm tra chương trình marketing
    if (maMarketing) {
        const marketing = await prisma.chuongTrinhMarketing.findUnique({ where: { ma_chuong_trinh_marketing: maMarketing } })
        if (!marketing) {
            throw new PhieuChiValidationError('Mã chương trình marketing không tồn tại.')
        }
    }
}

export const layDanhSachPhieuChi = async (filters: PhieuChiFilter) => {
    const { loai_phieu_chi, trang_thai, search } = filters

    const whereClause: Prisma.PhieuChiWhereInput = {}

    if (loai_phieu_chi && loai_phieu_chi !== 'ALL') {
        whereClause.loai_phieu_chi = loai_phieu_chi
    }

    if (trang_thai && trang_thai !== 'ALL') {
        whereClause.trang_thai = trang_thai
    }

    if (search) {
        const searchAsNumber = Number(search)
        whereClause.OR = [
            { nguoi_nhan: { contains: search, mode: 'insensitive' } },
            { noi_dung: { contains: search, mode: 'insensitive' } },
            ...(!isNaN(searchAsNumber) ? [{ ma_phieu_chi: searchAsNumber }] : [])
        ]
    }

    const result = await prisma.phieuChi.findMany({
        where: whereClause,
        include: {
            nhan_su: { select: { ho_ten: true } },
            bang_luong: true,
            chuong_trinh_mkt: true
        },
        orderBy: { ma_phieu_chi: 'desc' }
    })

    return result
}

export const taoPhieuChiMoi = async (data: PhieuChiData) => {
    const maNhanSu = Number(data.ma_nhan_su)
    const maBangLuong = data.ma_bang_luong ? Number(data.ma_bang_luong) : null
    const maMarketing = data.ma_chuong_trinh_marketing ? Number(data.ma_chuong_trinh_marketing) : null

    // Nếu đã có phiếu chi liên kết với bảng lương này nhưng ở trạng thái "Đã hủy",
    // tự động tái sử dụng (cập nhật) phiếu chi đó thay vì tạo mới để tránh lỗi Unique constraint
    if (maBangLuong) {
        const existingCancelled = await prisma.phieuChi.findFirst({
            where: {
                ma_bang_luong: maBangLuong,
                trang_thai: 'Đã hủy'
            }
        })
        if (existingCancelled) {
            return await capNhatPhieuChi(existingCancelled.ma_phieu_chi, data)
        }
    }

    await validatePhieuChiReferences(maNhanSu, maBangLuong, maMarketing)

    let ngayChi = data.ngay_chi ? new Date(data.ngay_chi) : null
    if (data.trang_thai === 'Đã chi' && !ngayChi) {
        ngayChi = new Date()
    }

    const newPhieuChi = await prisma.phieuChi.create({
        data: {
            loai_phieu_chi: data.loai_phieu_chi,
            tong_tien: Number(data.tong_tien),
            hinh_thuc_chi: data.hinh_thuc_chi || null,
            nguoi_nhan: data.nguoi_nhan || null,
            noi_dung: data.noi_dung || null,
            trang_thai: data.trang_thai || 'Chờ duyệt',
            ngay_chi: ngayChi,
            ma_bang_luong: maBangLuong,
            ma_chuong_trinh_marketing: maMarketing,
            ma_nhan_su: maNhanSu
        } as any,
        include: {
            nhan_su: { select: { ho_ten: true } },
            bang_luong: true,
            chuong_trinh_mkt: true
        }
    })

    return newPhieuChi
}

export const capNhatPhieuChi = async (ma_phieu_chi: number, data: PhieuChiData) => {
    const maNhanSu = Number(data.ma_nhan_su)
    const maBangLuong = data.ma_bang_luong ? Number(data.ma_bang_luong) : null
    const maMarketing = data.ma_chuong_trinh_marketing ? Number(data.ma_chuong_trinh_marketing) : null

    await validatePhieuChiReferences(maNhanSu, maBangLuong, maMarketing, ma_phieu_chi)

    let ngayChi = data.ngay_chi ? new Date(data.ngay_chi) : null
    if (data.trang_thai === 'Đã chi' && !ngayChi) {
        ngayChi = new Date()
    }

    const updatedPhieuChi = await prisma.phieuChi.update({
        where: { ma_phieu_chi },
        data: {
            loai_phieu_chi: data.loai_phieu_chi,
            tong_tien: Number(data.tong_tien),
            hinh_thuc_chi: data.hinh_thuc_chi || null,
            nguoi_nhan: data.nguoi_nhan || null,
            noi_dung: data.noi_dung || null,
            trang_thai: data.trang_thai || 'Đã chi',
            ngay_chi: ngayChi,
            ma_bang_luong: maBangLuong,
            ma_chuong_trinh_marketing: maMarketing,
            ma_nhan_su: maNhanSu
        } as any,
        include: {
            nhan_su: { select: { ho_ten: true } },
            bang_luong: true,
            chuong_trinh_mkt: true
        }
    })

    return updatedPhieuChi
}

export const xoaPhieuChi = async (ma_phieu_chi: number) => {
    return await prisma.phieuChi.delete({
        where: { ma_phieu_chi }
    })
}
