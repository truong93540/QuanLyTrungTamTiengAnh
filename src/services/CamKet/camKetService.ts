import { prisma } from '@/lib/prisma'
interface CamKetFilter {
    ma_cam_ket?: string | null
    ngay_ky?: string | null
    trang_thai?: string | null
    ma_hoc_vien?: string | null
    ten_hoc_vien?: string | null 
}
interface CamKetData {
    ngay_ky: Date
    ngay_het_han?: Date | null
    noi_dung_cam_ket: string
    trang_thai: string
    ma_hoc_vien: number
}
export const layDanhSachCamKet = async (filters: CamKetFilter) => {
 
    const { ma_cam_ket, ngay_ky, trang_thai, ma_hoc_vien, ten_hoc_vien } = filters

    const whereClause: any = {}

    if (ma_cam_ket) whereClause.ma_cam_ket = Number(ma_cam_ket)
    if (ma_hoc_vien) whereClause.ma_hoc_vien = Number(ma_hoc_vien)
    
    if (trang_thai) whereClause.trang_thai = { contains: trang_thai, mode: 'insensitive' }

    if (ngay_ky) {
        const date = new Date(ngay_ky)
        const nextDay = new Date(date)
        nextDay.setDate(date.getDate() + 1)
        whereClause.ngay_ky = { gte: date, lt: nextDay }
    } 
    if (ten_hoc_vien) {
        whereClause.hoc_vien = {
            ho_ten: { contains: ten_hoc_vien, mode: 'insensitive' }
        }
    }
    return await prisma.camKet.findMany({
        where: whereClause,
        include: {
            hoc_vien: { select: { ho_ten: true } }, 
        },
        orderBy: { ma_cam_ket: 'asc' }, 
    })
}


export const taoCamKetMoi = async (data: CamKetData) => {
    return await prisma.camKet.create({
        data: {
            ngay_ky: data.ngay_ky,
            ngay_het_han: data.ngay_het_han, 
            noi_dung_cam_ket: data.noi_dung_cam_ket,
            trang_thai: data.trang_thai,
            ma_hoc_vien: data.ma_hoc_vien,
        },
        include: {
            hoc_vien: { select: { ho_ten: true } },
        },
    })
}


export const capNhatCamKet = async (ma_cam_ket: number, data: Partial<CamKetData>) => {
    return await prisma.camKet.update({
        where: { ma_cam_ket: ma_cam_ket },
        data: {
            ...(data.ngay_ky && { ngay_ky: data.ngay_ky }),
            ...(data.ngay_het_han !== undefined && { ngay_het_han: data.ngay_het_han }),
            ...(data.noi_dung_cam_ket && { noi_dung_cam_ket: data.noi_dung_cam_ket }),
            ...(data.trang_thai && { trang_thai: data.trang_thai }),
            ...(data.ma_hoc_vien && { ma_hoc_vien: data.ma_hoc_vien }),
        },
        include: {
            hoc_vien: { select: { ho_ten: true } },
        },
    })
}


export const xoaCamKet = async (ma_cam_ket: number) => {
    return await prisma.camKet.delete({
        where: { ma_cam_ket: ma_cam_ket },
    })
}