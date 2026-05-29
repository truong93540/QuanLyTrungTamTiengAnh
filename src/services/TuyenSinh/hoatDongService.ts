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
    danh_sach_hoc_vien?: number[] 
}

export const layDanhSachGiaoVien = async () => {
    return await prisma.giaoVien.findMany({
        select: { ma_giao_vien: true, ho_ten: true, so_dien_thoai: true, email: true },
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
            phan_cong: { 
                include: {
                    giao_vien: { select: { ma_giao_vien: true, ho_ten: true, so_dien_thoai: true, email: true } }
                }
            },
            tham_gia_hoc_vien: {
                include: {
                    hoc_vien: {
                        select: {
                            ma_hoc_vien: true,
                            ho_ten: true,
                            so_dien_thoai: true,
                            email: true,
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
            // Thêm phân công giáo viên vào bảng trung gian
            ...(data.danh_sach_giao_vien && data.danh_sach_giao_vien.length > 0 && {
                phan_cong: { 
                    create: data.danh_sach_giao_vien.map(idGV => ({
                        ma_giao_vien: idGV
                    }))
                }
            }),
            // Bổ sung: Thêm học viên vào bảng trung gian ThamGiaNgoaiKhoa
            ...(data.danh_sach_hoc_vien && data.danh_sach_hoc_vien.length > 0 && {
                tham_gia_hoc_vien: {
                    create: data.danh_sach_hoc_vien.map(idHV => ({
                        ma_hoc_vien: idHV
                    }))
                }
            })
        },
        include: { 
            phan_cong: { include: { giao_vien: { select: { ho_ten: true } } } },
            tham_gia_hoc_vien: { include: { hoc_vien: { select: { ho_ten: true } } } } 
        }
    })
}

// 3. CẬP NHẬT HOẠT ĐỘNG
export const capNhatHoatDong = async (ma_hoat_dong: number, data: Partial<HoatDongData>) => {
    // 3.1 Cập nhật thông tin cơ bản
    const hoatDongDuocCapNhat = await prisma.hoatDongNgoaiKhoa.update({
        where: { ma_hoat_dong_ngoai_khoa: ma_hoat_dong },
        data: {
            ...(data.ten_hoat_dong && { ten_hoat_dong: data.ten_hoat_dong }),
            ...(data.mo_ta !== undefined && { mo_ta: data.mo_ta }),
            ...(data.ngay_to_chuc && { ngay_to_chuc: data.ngay_to_chuc }),
            ...(data.dia_diem !== undefined && { dia_diem: data.dia_diem }),
            ...(data.chi_phi !== undefined && { chi_phi: data.chi_phi }),
            
            // Cập nhật lại danh sách giáo viên (Xóa hết rồi tạo lại)
            ...(data.danh_sach_giao_vien !== undefined && {
                phan_cong: { 
                    deleteMany: {}, 
                    create: data.danh_sach_giao_vien.map(idGV => ({
                        ma_giao_vien: idGV
                    }))
                }
            }),

            // Bổ sung: Cập nhật lại danh sách học viên tham gia (Xóa hết rồi tạo lại)
            ...(data.danh_sach_hoc_vien !== undefined && {
                tham_gia_hoc_vien: {
                    deleteMany: {},
                    create: data.danh_sach_hoc_vien.map(idHV => ({
                        ma_hoc_vien: idHV
                    }))
                }
            })
        },
        include: { 
            phan_cong: { include: { giao_vien: { select: { ho_ten: true } } } },
            tham_gia_hoc_vien: { include: { hoc_vien: { select: { ho_ten: true } } } }
        }
    })

    return hoatDongDuocCapNhat;
}

// 4. XÓA HOẠT ĐỘNG
export const xoaHoatDong = async (ma_hoat_dong: number) => {
    // Để an toàn và tránh lỗi khóa ngoại, sử dụng transaction để xóa dữ liệu ở bảng trung gian trước
    await prisma.$transaction([
        prisma.phanCongHoatDong.deleteMany({
            where: { ma_hoat_dong_ngoai_khoa: ma_hoat_dong }
        }),
        prisma.thamGiaNgoaiKhoa.deleteMany({
            where: { ma_hoat_dong_ngoai_khoa: ma_hoat_dong }
        }),
        prisma.hoatDongNgoaiKhoa.delete({
            where: { ma_hoat_dong_ngoai_khoa: ma_hoat_dong }
        })
    ]);

    return { success: true };
}