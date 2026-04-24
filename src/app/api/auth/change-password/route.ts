import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 })
        }

        const body = await req.json()
        const { currentPassword, newPassword } = body

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: 'Thiếu thông tin' }, { status: 400 })
        }

        // Tìm user trong DB
        const user = await prisma.taiKhoan.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ message: 'Không tìm thấy tài khoản' }, { status: 404 })
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(currentPassword, user.mat_khau)
        if (!isMatch && currentPassword !== user.mat_khau) { // Fallback cho mật khẩu chưa hash nếu có
            return NextResponse.json({ message: 'Mật khẩu hiện tại không chính xác' }, { status: 400 })
        }

        // Hash mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10)

        // Cập nhật vào DB
        await prisma.taiKhoan.update({
            where: { ma_tai_khoan: user.ma_tai_khoan },
            data: { mat_khau: hashedNewPassword }
        })

        return NextResponse.json({ message: 'Đổi mật khẩu thành công' })
    } catch (error) {
        console.error('Lỗi đổi mật khẩu:', error)
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 })
    }
}
