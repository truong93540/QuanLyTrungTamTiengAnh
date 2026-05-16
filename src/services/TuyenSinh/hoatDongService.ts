import { prisma } from '@/lib/prisma'

interface HoatDongFilter {
    search?: string | null
}

interface HoatDongData {
    ten_hoat_dong: string
    mo_ta?: string | null
    ngay_to_chuc: Date
    dia_diem?: string | null
    chi_phi?: number | null
    danh_sach_giao_vien?: number[] 
}

export const layDanhSachGiaoVien = async () => {
    return await prisma.giaoVien.findMany({
        select: { ma_giao_vien: true, ho_ten: true },
        orderBy: { ho_ten: 'asc' }
    });
}

// 1. LẤY DANH SÁCH HOẠT ĐỘNG (KÈM GIÁO VIÊN VÀ HỌC VIÊN + LỚP)
export const layDanhSachHoatDong = async (filters: HoatDongFilter) => {
    const { search } = filters
    const whereClause: any = {}

    if (search) {
        whereClause.OR = [
            { ten_hoat_dong: { contains: search, mode: 'insensitive' } },
            { dia_diem: { contains: search, mode: 'insensitive' } }
        ]
    }

    return await prisma.hoatDongNgoaiKhoa.findMany({
        where: whereClause,
        orderBy: { ngay_to_chuc: 'desc' },
        include: {
            // Kéo danh sách Giáo viên (Theo đúng tên schema là phan_cong)
            phan_cong: { 
                include: {
                    giao_vien: { select: { ho_ten: true, so_dien_thoai: true, email: true } }
                }
            },
            // Kéo danh sách Học viên tham gia & Lớp học tương ứng (Theo tên schema là tham_gia_hoc_vien)
            tham_gia_hoc_vien: {
                include: {
                    hoc_vien: {
                        select: {
                            ma_hoc_vien: true,
                            ho_ten: true,
                            so_dien_thoai: true,
                            email: true,
                            // Kéo thêm dữ liệu bảng ThamGiaLop -> LopHoc để gom nhóm trên UI
                            tham_gia_lop: {
                                include: {
                                    lop_hoc: { select: { ma_lop_hoc: true, ten_lop: true } }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

// 2. THÊM MỚI HOẠT ĐỘNG
export const taoHoatDong = async (data: HoatDongData) => {
    return await prisma.hoatDongNgoaiKhoa.create({
        data: {
            ten_hoat_dong: data.ten_hoat_dong,
            mo_ta: data.mo_ta,
            ngay_to_chuc: data.ngay_to_chuc,
            dia_diem: data.dia_diem,
            chi_phi: data.chi_phi,
            ...(data.danh_sach_giao_vien && data.danh_sach_giao_vien.length > 0 && {
                phan_cong: { 
                    create: data.danh_sach_giao_vien.map(idGV => ({
                        ma_giao_vien: idGV
                    }))
                }
            })
        },
        include: { phan_cong: { include: { giao_vien: { select: { ho_ten: true } } } } }
    })
}

// 3. CẬP NHẬT HOẠT ĐỘNG
export const capNhatHoatDong = async (ma_hoat_dong: number, data: Partial<HoatDongData>) => {
    return await prisma.hoatDongNgoaiKhoa.update({
        where: { ma_hoat_dong_ngoai_khoa: ma_hoat_dong },
        data: {
            ...(data.ten_hoat_dong && { ten_hoat_dong: data.ten_hoat_dong }),
            ...(data.mo_ta !== undefined && { mo_ta: data.mo_ta }),
            ...(data.ngay_to_chuc && { ngay_to_chuc: data.ngay_to_chuc }),
            ...(data.dia_diem !== undefined && { dia_diem: data.dia_diem }),
            ...(data.chi_phi !== undefined && { chi_phi: data.chi_phi }),
            ...(data.danh_sach_giao_vien !== undefined && {
                phan_cong: { 
                    deleteMany: {}, 
                    create: data.danh_sach_giao_vien.map(idGV => ({
                        ma_giao_vien: idGV
                    }))
                }
            })
        },
        include: { phan_cong: { include: { giao_vien: { select: { ho_ten: true } } } } }
    })
}

// 4. XÓA HOẠT ĐỘNG
export const xoaHoatDong = async (ma_hoat_dong: number) => {
    // Xóa liên kết trước khi xóa bảng chính để tránh lỗi khóa ngoại (Foreign Key Constraint)
    await prisma.phanCongHoatDong.deleteMany({
        where: { ma_hoat_dong_ngoai_khoa: ma_hoat_dong }
    });
    
    await prisma.thamGiaNgoaiKhoa.deleteMany({
        where: { ma_hoat_dong_ngoai_khoa: ma_hoat_dong }
    });

    return await prisma.hoatDongNgoaiKhoa.delete({
        where: { ma_hoat_dong_ngoai_khoa: ma_hoat_dong }
    })
}