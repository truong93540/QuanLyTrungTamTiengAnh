import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

// Cập nhật tài khoản và phân quyền
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const ma_tai_khoan = parseInt(id)

        if (isNaN(ma_tai_khoan)) {
            return NextResponse.json({ message: 'ID tài khoản không hợp lệ' }, { status: 400 })
        }

        const body = await req.json()
        const { ten_dang_nhap, mat_khau, email, trang_thai, quyen_ids } = body

        // Kiểm tra xem tài khoản có tồn tại không
        const existingAccount = await prisma.taiKhoan.findUnique({
            where: { ma_tai_khoan },
        })

        if (!existingAccount) {
            return NextResponse.json({ message: 'Không tìm thấy tài khoản' }, { status: 404 })
        }

        // Kiểm tra trùng username / email (bỏ qua bản thân nó)
        if (ten_dang_nhap && ten_dang_nhap !== existingAccount.ten_dang_nhap) {
            const duplicateUsername = await prisma.taiKhoan.findUnique({
                where: { ten_dang_nhap },
            })
            if (duplicateUsername) {
                return NextResponse.json({ message: 'Tên đăng nhập đã tồn tại' }, { status: 400 })
            }
        }

        if (email && email !== existingAccount.email) {
            const duplicateEmail = await prisma.taiKhoan.findUnique({
                where: { email },
            })
            if (duplicateEmail) {
                return NextResponse.json({ message: 'Email đã tồn tại' }, { status: 400 })
            }
        }

        // Dữ liệu update cơ bản
        const updateData: any = {
            ten_dang_nhap: ten_dang_nhap || existingAccount.ten_dang_nhap,
            email: email || existingAccount.email,
            trang_thai: trang_thai !== undefined ? trang_thai : existingAccount.trang_thai,
        }

        // Nếu có gửi mật khẩu mới thì mã hóa và update
        if (mat_khau && mat_khau.trim() !== '') {
            updateData.mat_khau = await bcrypt.hash(mat_khau, 10)
        }

        // Thực hiện transaction: Update bảng TaiKhoan và Bảng PhanQuyen
        const updatedAccount = await prisma.$transaction(async (tx) => {
            // 1. Cập nhật thông tin tài khoản
            const account = await tx.taiKhoan.update({
                where: { ma_tai_khoan },
                data: updateData,
            })

            // 2. Cập nhật quyền (chỉ làm khi có mảng quyen_ids gửi lên, kể cả mảng rỗng [] để xóa hết quyền)
            if (quyen_ids !== undefined && Array.isArray(quyen_ids)) {
                // Xóa các quyền cũ
                await tx.phanQuyen.deleteMany({
                    where: { ma_tai_khoan },
                })

                // Thêm quyền mới
                if (quyen_ids.length > 0) {
                    const phanQuyenData = quyen_ids.map((ma_quyen: number) => ({
                        ma_tai_khoan,
                        ma_quyen: Number(ma_quyen),
                    }))
                    await tx.phanQuyen.createMany({
                        data: phanQuyenData,
                    })
                }
            }

            return account
        })

        return NextResponse.json(
            { message: 'Cập nhật tài khoản thành công', data: updatedAccount },
            { status: 200 }
        )
    } catch (error) {
        console.error('Lỗi khi cập nhật tài khoản:', error)
        return NextResponse.json({ message: 'Lỗi server khi cập nhật tài khoản' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const ma_tai_khoan = parseInt(id)

        if (isNaN(ma_tai_khoan)) {
            return NextResponse.json({ message: 'ID tài khoản không hợp lệ' }, { status: 400 })
        }

        // Xóa trong transaction để tránh mồ côi dữ liệu
        await prisma.$transaction(async (tx) => {
            await tx.phanQuyen.deleteMany({
                where: { ma_tai_khoan },
            })
            await tx.taiKhoan.delete({
                where: { ma_tai_khoan },
            })
        })

        return NextResponse.json({ message: 'Xóa tài khoản thành công' }, { status: 200 })
    } catch (error) {
        console.error('Lỗi khi xóa tài khoản:', error)
        return NextResponse.json({ message: 'Lỗi server khi xóa tài khoản' }, { status: 500 })
    }
}
