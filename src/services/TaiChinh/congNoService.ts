import { prisma } from '@/lib/prisma'

export interface CongNoRecord {
    ma_hoc_vien: number
    ho_ten: string
    so_dien_thoai: string | null
    email: string | null
    ma_khoa_hoc: number
    ten_khoa_hoc: string
    ten_lop: string | null
    hoc_phi_goc: number
    khuyen_mai: {
        ten_chuong_trinh: string
        phan_tram_giam: number
    } | null
    hoc_phi_phai_nop: number
    da_dong: number
    con_thieu: number
    trang_thai_hoc: string
}

export const layDanhSachCongNo = async (): Promise<CongNoRecord[]> => {
    // Lấy tất cả học viên cùng thông tin lớp học (qua tham_gia_lop) và các phiếu thu của họ
    const hocViens = await prisma.hocVien.findMany({
        include: {
            tham_gia_lop: {
                include: {
                    lop_hoc: {
                        include: {
                            khoa_hoc: true
                        }
                    }
                }
            },
            phieu_thu: {
                include: {
                    khoa_hoc: true,
                    khuyen_mai: true
                }
            }
        }
    })

    const danhSachCongNo: CongNoRecord[] = []

    for (const hv of hocViens) {
        // Gom nhóm theo từng khóa học để tính công nợ chính xác
        const coursesMap = new Map<number, {
            khoa_hoc: any
            payments: any[]
            enrolled: boolean
            ten_lop: string | null
        }>()

        // 1. Quét các lớp học viên đang tham gia học
        for (const tgl of hv.tham_gia_lop) {
            const kh = tgl.lop_hoc?.khoa_hoc
            if (kh) {
                coursesMap.set(kh.ma_khoa_hoc, {
                    khoa_hoc: kh,
                    payments: [],
                    enrolled: true,
                    ten_lop: tgl.lop_hoc?.ten_lop || null
                })
            }
        }

        // 2. Quét các phiếu thu của học viên
        for (const pt of hv.phieu_thu) {
            const kh = pt.khoa_hoc
            if (kh) {
                if (!coursesMap.has(kh.ma_khoa_hoc)) {
                    coursesMap.set(kh.ma_khoa_hoc, {
                        khoa_hoc: kh,
                        payments: [],
                        enrolled: false,
                        ten_lop: null
                    })
                }
                coursesMap.get(kh.ma_khoa_hoc)!.payments.push(pt)
            }
        }

        // 3. Tính toán chi tiết số tiền còn thiếu cho từng khóa học
        for (const [ma_khoa_hoc, info] of coursesMap.entries()) {
            const khoaHoc = info.khoa_hoc
            const payments = info.payments
            const isEnrolled = info.enrolled

            // Tổng số tiền đã đóng cho khóa học này
            const totalPaid = payments.reduce((sum, pt) => sum + Number(pt.so_tien), 0)

            // Tìm chương trình khuyến mãi được áp dụng ở bất cứ phiếu thu nào của khóa này
            const paymentWithPromo = payments.find(pt => pt.ma_khuyen_mai)
            const khuyenMai = paymentWithPromo?.khuyen_mai || null

            // Tính học phí thực tế phải nộp sau giảm giá
            let totalTuition = Number(khoaHoc.hoc_phi)
            if (khuyenMai && khuyenMai.phan_tram_giam) {
                totalTuition = totalTuition * (1 - khuyenMai.phan_tram_giam / 100)
            }

            const remainingDue = Math.max(0, totalTuition - totalPaid)

            // Nếu số tiền còn thiếu > 0, đưa học viên vào danh sách công nợ
            if (remainingDue > 0) {
                danhSachCongNo.push({
                    ma_hoc_vien: hv.ma_hoc_vien,
                    ho_ten: hv.ho_ten,
                    so_dien_thoai: hv.so_dien_thoai,
                    email: hv.email,
                    ma_khoa_hoc: khoaHoc.ma_khoa_hoc,
                    ten_khoa_hoc: khoaHoc.ten_khoa_hoc,
                    ten_lop: info.ten_lop,
                    hoc_phi_goc: Number(khoaHoc.hoc_phi),
                    khuyen_mai: khuyenMai ? {
                        ten_chuong_trinh: khuyenMai.ten_chuong_trinh,
                        phan_tram_giam: khuyenMai.phan_tram_giam
                    } : null,
                    hoc_phi_phai_nop: totalTuition,
                    da_dong: totalPaid,
                    con_thieu: remainingDue,
                    trang_thai_hoc: isEnrolled ? "Đang học" : "Đã đăng ký"
                })
            }
        }
    }

    return danhSachCongNo
}
