import { prisma } from '@/lib/prisma'

export interface KhoaHocInput {
    ten_khoa_hoc: string
    mo_ta: string
    thoi_luong: string
    hoc_phi: number
    trinh_do: string
    trang_thai?: string
    ma_chuong_trinh: number
    danh_sach_marketing?: number[] 
}

// 1. LẤY DANH SÁCH KHÓA HỌC (READ)
export const layDanhSachKhoaHoc = async () => {
    return await prisma.khoaHoc.findMany({
        include: {
            chuong_trinh: {
                select: { ten_chuong_trinh: true, 
                          muc_tieu: true,
                          mo_ta: true 
                },
            },
            chi_tiet_marketing: {
                include: {
                    chuong_trinh_marketing: true
                }
            },
            lop_hoc: {
                include: {
                    phan_cong_giang_day: {
                        include: {
                            giao_vien: { select: { ho_ten: true } }
                        }
                    },
                    phong_hoc: { select: { ten_phong_hoc: true } }
                },
                orderBy: { ngay_khai_giang: 'desc' }
            }
        },
        orderBy: { ma_khoa_hoc: 'asc' }, 
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
            trang_thai: data.trang_thai || 'Đang mở',
            ma_chuong_trinh: data.ma_chuong_trinh,
            chi_tiet_marketing: {
                create: data.danh_sach_marketing?.map(id => ({
                    ma_chuong_trinh_marketing: id
                })) || []
            }
        },
        include: {
            chuong_trinh: { select: { ten_chuong_trinh: true } },
            chi_tiet_marketing: { include: { chuong_trinh_marketing: true } }
        },
    })
}

// 3. CẬP NHẬT KHÓA HỌC (UPDATE)
export const capNhatKhoaHoc = async (ma_khoa_hoc: number, data: Partial<KhoaHocInput>) => {
    // Nếu có cập nhật danh sách marketing, xóa liên kết cũ trong bảng trung gian
    if (data.danh_sach_marketing !== undefined) {
        await prisma.chiTietMarketing.deleteMany({
            where: { ma_khoa_hoc: ma_khoa_hoc }
        })
    }

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
            // Tạo lại các liên kết mới
            ...(data.danh_sach_marketing !== undefined && {
                chi_tiet_marketing: {
                    create: data.danh_sach_marketing.map(id => ({
                        ma_chuong_trinh_marketing: id
                    }))
                }
            })
        },
        include: {
            chuong_trinh: { select: { ten_chuong_trinh: true } },
            chi_tiet_marketing: { include: { chuong_trinh_marketing: true } }
        },
    })
}

// 4. XÓA KHÓA HỌC (DELETE)
export const xoaKhoaHoc = async (ma_khoa_hoc: number) => {
    // Xóa dữ liệu tham chiếu ở bảng trung gian trước để tránh lỗi Foreign Key
    await prisma.chiTietMarketing.deleteMany({
        where: { ma_khoa_hoc: ma_khoa_hoc }
    })

    return await prisma.khoaHoc.delete({
        where: { ma_khoa_hoc: ma_khoa_hoc },
    })
}