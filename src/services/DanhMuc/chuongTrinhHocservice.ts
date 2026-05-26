import { prisma } from '@/lib/prisma'

export async function getDanhSachChuongTrinh(search?: string) {
    return await prisma.chuongTrinhHoc.findMany({
        where: search ? {
            ten_chuong_trinh: {
                contains: search,
                mode: 'insensitive'
            }
        } : undefined,
        orderBy: {
            ma_chuong_trinh: 'asc'
        }
    })
}

export async function createChuongTrinh(data: { ten_chuong_trinh: string; mo_ta?: string; muc_tieu?: string }) {
    return await prisma.chuongTrinhHoc.create({
        data: {
            ten_chuong_trinh: data.ten_chuong_trinh,
            mo_ta: data.mo_ta,
            muc_tieu: data.muc_tieu
        }
    })
}

export async function updateChuongTrinh(id: number, data: { ten_chuong_trinh: string; mo_ta?: string; muc_tieu?: string }) {
    return await prisma.chuongTrinhHoc.update({
        where: { ma_chuong_trinh: id },
        data: {
            ten_chuong_trinh: data.ten_chuong_trinh,
            mo_ta: data.mo_ta,
            muc_tieu: data.muc_tieu
        }
    })
}

export async function deleteChuongTrinh(id: number) {
    return await prisma.chuongTrinhHoc.delete({
        where: { ma_chuong_trinh: id }
    })
}