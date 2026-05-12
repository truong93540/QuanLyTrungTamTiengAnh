import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

// Lấy danh sách toàn bộ tài khoản kèm quyền
export async function GET() {
    try {
        const taiKhoans = await prisma.taiKhoan.findMany({
            include: {
                nhan_su: {
                    select: { ho_ten: true, ma_nhan_su: true, ma_phong_ban: true, ma_chuc_vu: true },
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
        const formattedData = taiKhoans.map((tk) => ({
            ma_tai_khoan: tk.ma_tai_khoan,
            ten_dang_nhap: tk.ten_dang_nhap,
            email: tk.email,
            trang_thai: tk.trang_thai,
            ma_nhan_su: tk.ma_nhan_su,
            ho_ten: tk.nhan_su?.ho_ten || 'Không xác định',
            quyen: tk.phan_quyen.map((pq) => pq.quyen.ten_quyen),
            quyen_ids: tk.phan_quyen.map((pq) => pq.quyen.ma_quyen),
        }))

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
        const { ten_dang_nhap, mat_khau, email, ma_nhan_su, trang_thai, quyen_ids } = body

        // Validate cơ bản
        if (!ten_dang_nhap || !mat_khau || !email || !ma_nhan_su) {
            return NextResponse.json({ message: 'Thiếu thông tin bắt buộc' }, { status: 400 })
        }

        // Kiểm tra xem mã nhân sự có tồn tại không
        const nhanSu = await prisma.nhanSu.findUnique({
            where: { ma_nhan_su: Number(ma_nhan_su) },
        })

        if (!nhanSu) {
            return NextResponse.json({ message: 'Mã nhân sự không tồn tại' }, { status: 404 })
        }

        // Kiểm tra xem nhân sự này đã có tài khoản chưa
        const existingAccountForStaff = await prisma.taiKhoan.findUnique({
            where: { ma_nhan_su: Number(ma_nhan_su) },
        })

        if (existingAccountForStaff) {
            return NextResponse.json(
                { message: 'Nhân sự này đã được cấp tài khoản' },
                { status: 400 }
            )
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
                    ma_nhan_su: Number(ma_nhan_su),
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
            { status: 201 }
        )
    } catch (error) {
        console.error('Lỗi tạo tài khoản:', error)
        return NextResponse.json({ message: 'Lỗi server khi tạo tài khoản' }, { status: 500 })
    }
}
