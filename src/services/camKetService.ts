// File: src/services/camKetService.ts
import { prisma } from '@/lib/prisma'

// Interface cho bộ lọc tìm kiếm
interface CamKetFilter {
    ma_cam_ket?: string | null
    ngay_ky?: string | null
    trang_thai?: string | null
    ma_hoc_vien?: string | null
}

// Interface định dạng dữ liệu truyền vào khi Tạo mới/Cập nhật
interface CamKetData {
    ngay_ky: Date
    ngay_het_han?: Date | null
    noi_dung_cam_ket: string
    trang_thai: string
    ma_hoc_vien: number
}

// 1. LẤY DANH SÁCH (CÓ BỘ LỌC)
export const layDanhSachCamKet = async (filters: CamKetFilter) => {
    const { ma_cam_ket, ngay_ky, trang_thai, ma_hoc_vien } = filters

    // Khai báo điều kiện lọc linh hoạt theo Prisma
    const whereClause: any = {}

    if (ma_cam_ket) whereClause.ma_cam_ket = Number(ma_cam_ket)
    if (ma_hoc_vien) whereClause.ma_hoc_vien = Number(ma_hoc_vien)
    
    // Tìm kiếm trạng thái dạng chứa từ khóa (không phân biệt chữ hoa thường)
    if (trang_thai) whereClause.trang_thai = { contains: trang_thai, mode: 'insensitive' }

    // Xử lý tìm kiếm theo một ngày cụ thể (tìm từ 0h00 đến 23h59 của ngày đó)
    if (ngay_ky) {
        const date = new Date(ngay_ky)
        const nextDay = new Date(date)
        nextDay.setDate(date.getDate() + 1)
        whereClause.ngay_ky = { gte: date, lt: nextDay }
    }

    return await prisma.camKet.findMany({
        where: whereClause,
        include: {
            hoc_vien: { select: { ho_ten: true } }, // Lấy thêm tên học viên để hiển thị lên bảng
        },
        orderBy: { ngay_ky: 'desc' }, // Mặc định sắp xếp bản cam kết mới nhất lên đầu
    })
}

// 2. TẠO MỚI BẢN CAM KẾT
export const taoCamKetMoi = async (data: CamKetData) => {
    return await prisma.camKet.create({
        data: {
            ngay_ky: data.ngay_ky,
            ngay_het_han: data.ngay_het_han, // Có thể truyền null nếu chưa có ngày hết hạn
            noi_dung_cam_ket: data.noi_dung_cam_ket,
            trang_thai: data.trang_thai,
            ma_hoc_vien: data.ma_hoc_vien,
        },
        include: {
            hoc_vien: { select: { ho_ten: true } },
        },
    })
}

// 3. CẬP NHẬT BẢN CAM KẾT
export const capNhatCamKet = async (ma_cam_ket: number, data: Partial<CamKetData>) => {
    return await prisma.camKet.update({
        where: { ma_cam_ket: ma_cam_ket },
        data: {
            // Dùng Partial để chỉ cập nhật những trường được gửi lên, không gửi thì giữ nguyên
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

// 4. XÓA BẢN CAM KẾT
export const xoaCamKet = async (ma_cam_ket: number) => {
    return await prisma.camKet.delete({
        where: { ma_cam_ket: ma_cam_ket },
    })
}