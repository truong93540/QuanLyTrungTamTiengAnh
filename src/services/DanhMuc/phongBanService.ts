// File: src/services/DanhMuc/phongBanService.ts
import { prisma } from '@/lib/prisma'

// Interface hứng dữ liệu từ URL để tìm kiếm
interface PhongBanFilter {
    ma_phong_ban?: string | null
    ten_phong_ban?: string | null
    mo_ta?: string | null
    ngay_thanh_lap?: string | null
}

// Interface định dạng dữ liệu truyền vào khi Thêm/Sửa
interface PhongBanData {
    ten_phong_ban: string
    mo_ta?: string | null
    ngay_thanh_lap?: Date | null
}

// 1. LẤY DANH SÁCH (CÓ TÌM KIẾM)
export const layDanhSachPhongBan = async (filters: PhongBanFilter) => {
    const { ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap } = filters

    const whereClause: any = {}

    if (ma_phong_ban) whereClause.ma_phong_ban = Number(ma_phong_ban)
    
    // Tìm kiếm tương đối (chứa từ khóa, không phân biệt hoa thường) để dễ tìm hơn
    if (ten_phong_ban) whereClause.ten_phong_ban = { contains: ten_phong_ban, mode: 'insensitive' }
    if (mo_ta) whereClause.mo_ta = { contains: mo_ta, mode: 'insensitive' }

    // Xử lý tìm kiếm trong 1 ngày cụ thể (từ 0h00 đến 23h59)
    if (ngay_thanh_lap) {
        const date = new Date(ngay_thanh_lap)
        const nextDay = new Date(date)
        nextDay.setDate(date.getDate() + 1)
        whereClause.ngay_thanh_lap = { gte: date, lt: nextDay }
    }

    return await prisma.phongBan.findMany({
        where: whereClause,
        orderBy: { ma_phong_ban: 'asc' }, // Tùy chọn: Sắp xếp các phòng ban mới tạo lên đầu bảng
    })
}

// 2. THÊM MỚI
export const taoPhongBanMoi = async (data: PhongBanData) => {
    return await prisma.phongBan.create({
        data: {
            ten_phong_ban: data.ten_phong_ban,
            mo_ta: data.mo_ta,
            ngay_thanh_lap: data.ngay_thanh_lap,
        },
    })
}

// 3. CẬP NHẬT
export const capNhatPhongBan = async (ma_phong_ban: number, data: Partial<PhongBanData>) => {
    return await prisma.phongBan.update({
        where: { ma_phong_ban: ma_phong_ban },
        data: {
            // Dùng Partial để chỉ cập nhật những trường có thay đổi
            ...(data.ten_phong_ban && { ten_phong_ban: data.ten_phong_ban }),
            ...(data.mo_ta !== undefined && { mo_ta: data.mo_ta }),
            ...(data.ngay_thanh_lap !== undefined && { ngay_thanh_lap: data.ngay_thanh_lap }),
        },
    })
}

// 4. XÓA
export const xoaPhongBan = async (ma_phong_ban: number) => {
    return await prisma.phongBan.delete({
        where: { ma_phong_ban: ma_phong_ban },
    })
}