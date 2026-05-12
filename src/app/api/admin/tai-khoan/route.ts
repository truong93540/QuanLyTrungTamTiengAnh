import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

// Lấy danh sách toàn bộ tài khoản kèm quyền
export async function GET() {
    try {
        const taiKhoans = await prisma.taiKhoan.findMany({
            include: {
                nhan_su: {
                    select: {
                        ho_ten: true,
                        ma_nhan_su: true,
                        ma_phong_ban: true,
                        ma_chuc_vu: true,
                    },
                },
                giao_vien: {
                    select: {
                        ho_ten: true,
                        ma_giao_vien: true,
                        ma_phong_ban: true,
                        ma_chuc_vu: true,
                    },
                },
                phan_quyen: {
                    include: {
                        quyen: true,
                    },
                },
            },
            orderBy: { ma_tai_khoan: 'desc' },
        })

        // Format lại dữ liệu cho dễ dùng ở frontend
        const formattedData = taiKhoans.map((tk) => {
            const nhanSu = tk.nhan_su || tk.giao_vien
            const loai = tk.nhan_su ? 'Nhân sự' : tk.giao_vien ? 'Giáo viên' : 'Không xác định'
            return {
                ma_tai_khoan: tk.ma_tai_khoan,
                ten_dang_nhap: tk.ten_dang_nhap,
                email: tk.email,
                trang_thai: tk.trang_thai,
                ma_nhan_su: (tk as unknown as { ma_nhan_su: number | null }).ma_nhan_su,
                ma_giao_vien: tk.ma_giao_vien,
                ho_ten: (nhanSu as { ho_ten: string } | null)?.ho_ten || 'Không xác định',
                loai,
                quyen: tk.phan_quyen.map((pq) => pq.quyen.ten_quyen),
                quyen_ids: tk.phan_quyen.map((pq) => pq.quyen.ma_quyen),
            }
        })

        return NextResponse.json(formattedData)
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tài khoản:', error)
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 })
    }
}

// Tạo tài khoản mới
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { ten_dang_nhap, mat_khau, email, ma_id, loai, trang_thai, quyen_ids } = body

        // Validate cơ bản
        if (!ten_dang_nhap || !mat_khau || !email || !ma_id || !loai) {
            return NextResponse.json({ message: 'Thiếu thông tin bắt buộc' }, { status: 400 })
        }

        if (loai !== 'nhan-su' && loai !== 'giao-vien') {
            return NextResponse.json({ message: 'Loại nhân sự không hợp lệ' }, { status: 400 })
        }

        const idNumber = Number(ma_id)

        // Kiểm tra nhân sự tồn tại và chưa có tài khoản
        if (loai === 'nhan-su') {
            const nhanSu = await (prisma as any).nhanSu.findUnique({
                where: { ma_nhan_su: idNumber },
                include: { tai_khoan: true },
            })
            if (!nhanSu) {
                return NextResponse.json({ message: 'Mã nhân sự không tồn tại' }, { status: 404 })
            }
            if (nhanSu.tai_khoan) {
                return NextResponse.json(
                    { message: 'Nhân sự này đã được cấp tài khoản' },
                    { status: 400 },
                )
            }
        } else {
            const giaoVien = await prisma.giaoVien.findUnique({
                where: { ma_giao_vien: idNumber },
                include: { tai_khoan: true },
            })
            if (!giaoVien) {
                return NextResponse.json({ message: 'Mã giáo viên không tồn tại' }, { status: 404 })
            }
            if (giaoVien.tai_khoan) {
                return NextResponse.json(
                    { message: 'Giáo viên này đã được cấp tài khoản' },
                    { status: 400 },
                )
            }
        }

        // Kiểm tra trùng username / email
        const existingUsername = await prisma.taiKhoan.findUnique({ where: { ten_dang_nhap } })
        if (existingUsername) {
            return NextResponse.json({ message: 'Tên đăng nhập đã tồn tại' }, { status: 400 })
        }

        const existingEmail = await prisma.taiKhoan.findUnique({ where: { email } })
        if (existingEmail) {
            return NextResponse.json({ message: 'Email đã tồn tại' }, { status: 400 })
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(mat_khau, 10)

        // Bắt đầu tạo tài khoản và phân quyền trong 1 transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Tạo tài khoản
            const newTaiKhoan = await tx.taiKhoan.create({
                data: {
                    ten_dang_nhap,
                    mat_khau: hashedPassword,
                    email,
                    ...(loai === 'nhan-su' ? { ma_nhan_su: idNumber } : { ma_giao_vien: idNumber }),
                    trang_thai: trang_thai || 'Hoạt động',
                },
            })

            // 2. Gán quyền nếu có chọn
            if (quyen_ids && Array.isArray(quyen_ids) && quyen_ids.length > 0) {
                const phanQuyenData = quyen_ids.map((ma_quyen: number) => ({
                    ma_tai_khoan: newTaiKhoan.ma_tai_khoan,
                    ma_quyen: Number(ma_quyen),
                }))
                await tx.phanQuyen.createMany({
                    data: phanQuyenData,
                })
            }

            return newTaiKhoan
        })

        return NextResponse.json(
            { message: 'Tạo tài khoản thành công', data: result },
            { status: 201 },
        )
    } catch (error) {
        console.error('Lỗi tạo tài khoản:', error)
        return NextResponse.json({ message: 'Lỗi server khi tạo tài khoản' }, { status: 500 })
    }
}
