import { prisma } from '@/lib/prisma'

// Định nghĩa khuôn mẫu dữ liệu đầu vào
export interface KhoaHocInput {
    ten_khoa_hoc: string
    mo_ta: string
    thoi_luong: string
    hoc_phi: number
    trinh_do: string
    trang_thai?: string
    ma_chuong_trinh: number
}

// 1. LẤY DANH SÁCH KHÓA HỌC (READ)
export const layDanhSachKhoaHoc = async () => {
    return await prisma.khoaHoc.findMany({
        // JOIN bảng để lấy tên chương trình học mang lên giao diện
        include: {
            chuong_trinh: {
                select: { ten_chuong_trinh: true },
            },
        },
        orderBy: { ma_khoa_hoc: 'asc' }, // Sắp xếp theo mã tăng dần
    })
}

// 2. THÊM MỚI KHÓA HỌC (CREATE)
export const taoKhoaHocMoi = async (data: KhoaHocInput) => {
    return await prisma.khoaHoc.create({
        data: {
            ten_khoa_hoc: data.ten_khoa_hoc,
            mo_ta: data.mo_ta,
            thoi_luong: data.thoi_luong,
            hoc_phi: data.hoc_phi,
            trinh_do: data.trinh_do,
            trang_thai: data.trang_thai,
            ma_chuong_trinh: data.ma_chuong_trinh,
        },
        include: {
            chuong_trinh: { select: { ten_chuong_trinh: true } },
        },
    })
}

// 3. CẬP NHẬT KHÓA HỌC (UPDATE) - Áp dụng "Rải điều kiện" chống ghi đè rác
export const capNhatKhoaHoc = async (ma_khoa_hoc: number, data: Partial<KhoaHocInput>) => {
    return await prisma.khoaHoc.update({
        where: { ma_khoa_hoc: ma_khoa_hoc },
        data: {
            ...(data.ten_khoa_hoc && { ten_khoa_hoc: data.ten_khoa_hoc }),
            ...(data.mo_ta !== undefined && { mo_ta: data.mo_ta }),
            ...(data.thoi_luong !== undefined && { thoi_luong: data.thoi_luong }),
            ...(data.hoc_phi !== undefined && { hoc_phi: data.hoc_phi }),
            ...(data.trinh_do !== undefined && { trinh_do: data.trinh_do }),
            ...(data.trang_thai !== undefined && { trang_thai: data.trang_thai }),
            ...(data.ma_chuong_trinh && { ma_chuong_trinh: data.ma_chuong_trinh }),
        },
        include: {
            chuong_trinh: { select: { ten_chuong_trinh: true } },
        },
    })
}

// 4. XÓA KHÓA HỌC (DELETE)
export const xoaKhoaHoc = async (ma_khoa_hoc: number) => {
    return await prisma.khoaHoc.delete({
        where: { ma_khoa_hoc: ma_khoa_hoc },
    })
}