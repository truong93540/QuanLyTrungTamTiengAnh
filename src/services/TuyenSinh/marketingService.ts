import { prisma } from '@/lib/prisma'

// Định nghĩa khuôn mẫu dữ liệu đầu vào từ giao diện
export interface MarketingInput {
    ten_chuong_trinh_marketing: string
    ma_khoa_hoc: number
    noi_dung?: string
    ngay_bat_dau: string | Date
    ngay_ket_thuc: string | Date
    ngan_sach: number
}

// 1. LẤY DANH SÁCH CHIẾN DỊCH (READ)
export const layDanhSachMarketing = async () => {
    return await prisma.chuongTrinhMarketing.findMany({
        // Đã thiết lập tăng dần theo yêu cầu của bạn ở form trước
        orderBy: { ma_chuong_trinh_marketing: 'asc' }, 
    })
}

// 2. THÊM MỚI CHIẾN DỊCH (CREATE)
export const taoMarketingMoi = async (data: MarketingInput) => {
    return await prisma.chuongTrinhMarketing.create({
        data: {
            ten_chuong_trinh_marketing: data.ten_chuong_trinh_marketing,
            ma_khoa_hoc: data.ma_khoa_hoc,
            noi_dung: data.noi_dung,
            ngan_sach: data.ngan_sach,
            // Ép kiểu về Date chuẩn để lưu vào PostgreSQL
            ngay_bat_dau: new Date(data.ngay_bat_dau),
            ngay_ket_thuc: new Date(data.ngay_ket_thuc),
        },
    })
}

// 3. CẬP NHẬT CHIẾN DỊCH (UPDATE)
export const capNhatMarketing = async (ma_chuong_trinh: number, data: Partial<MarketingInput>) => {
    return await prisma.chuongTrinhMarketing.update({
        where: { ma_chuong_trinh_marketing: ma_chuong_trinh },
        data: {
            ...(data.ten_chuong_trinh_marketing && { ten_chuong_trinh_marketing: data.ten_chuong_trinh_marketing }),
            ...(data.ma_khoa_hoc && { ma_khoa_hoc: data.ma_khoa_hoc }),
            ...(data.noi_dung !== undefined && { noi_dung: data.noi_dung }),
            ...(data.ngan_sach !== undefined && { ngan_sach: data.ngan_sach }),
            ...(data.ngay_bat_dau && { ngay_bat_dau: new Date(data.ngay_bat_dau) }),
            ...(data.ngay_ket_thuc && { ngay_ket_thuc: new Date(data.ngay_ket_thuc) }),
        },
    })
}

// 4. XÓA CHIẾN DỊCH (DELETE)
export const xoaMarketing = async (ma_chuong_trinh: number) => {
    return await prisma.chuongTrinhMarketing.delete({
        where: { ma_chuong_trinh_marketing: ma_chuong_trinh },
    })
}