import { prisma } from '@/lib/prisma'
export interface KhuyenMaiInput {
    ten_chuong_trinh: string
    mo_ta?: string
    phan_tram_giam: number
    ngay_bat_dau: string | Date
    ngay_ket_thuc?: string | Date | null
}

export const layDanhSachKhuyenMai = async () => {
    return await prisma.chuongTrinhKhuyenMai.findMany({
        orderBy: { ma_khuyen_mai: 'asc' }, 
    })
}

export const taoKhuyenMaiMoi = async (data: KhuyenMaiInput) => {
    return await prisma.chuongTrinhKhuyenMai.create({
        data: {
            ten_chuong_trinh: data.ten_chuong_trinh,
            mo_ta: data.mo_ta,
            phan_tram_giam: data.phan_tram_giam,
            ngay_bat_dau: new Date(data.ngay_bat_dau),
            ngay_ket_thuc: data.ngay_ket_thuc ? new Date(data.ngay_ket_thuc) : null,
        },
    })
}


export const capNhatKhuyenMai = async (ma_khuyen_mai: number, data: Partial<KhuyenMaiInput>) => {
    return await prisma.chuongTrinhKhuyenMai.update({
        where: { ma_khuyen_mai: ma_khuyen_mai },
        data: {
            ...(data.ten_chuong_trinh && { ten_chuong_trinh: data.ten_chuong_trinh }),
            ...(data.mo_ta !== undefined && { mo_ta: data.mo_ta }),
            ...(data.phan_tram_giam !== undefined && { phan_tram_giam: data.phan_tram_giam }),
            ...(data.ngay_bat_dau && { ngay_bat_dau: new Date(data.ngay_bat_dau) }),
            ...(data.ngay_ket_thuc !== undefined && { 
                ngay_ket_thuc: data.ngay_ket_thuc ? new Date(data.ngay_ket_thuc) : null 
            }),
        },
    })
}
export const xoaKhuyenMai = async (ma_khuyen_mai: number) => {
    return await prisma.chuongTrinhKhuyenMai.delete({
        where: { ma_khuyen_mai: ma_khuyen_mai },
    })
}