import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.ma_nhan_su && !session?.user?.ma_giao_vien) {
            return NextResponse.json({ message: 'Chưa đăng nhập hoặc không có quyền truy cập.' }, { status: 401 })
        }

        const body = await req.json()
        const { password, month, year } = body

        if (!password || !month || !year) {
            return NextResponse.json({ message: 'Thiếu thông tin xác thực.' }, { status: 400 })
        }

        // 1. Tìm tài khoản trong DB để lấy hash mật khẩu
        const user = await prisma.taiKhoan.findFirst({
            where: {
                OR: [
                    { ma_nhan_su: session.user.ma_nhan_su || -1 },
                    { ma_giao_vien: session.user.ma_giao_vien || -1 }
                ]
            }
        })

        if (!user) {
            return NextResponse.json({ message: 'Không tìm thấy tài khoản người dùng.' }, { status: 404 })
        }

        // 2. Xác minh mật khẩu
        const isMatch = await bcrypt.compare(password, user.mat_khau)
        if (!isMatch && password !== user.mat_khau) { // Fallback cho mật khẩu thô nếu có
            return NextResponse.json({ message: 'Mật khẩu tài khoản không chính xác.' }, { status: 401 })
        }

        // 3. Truy vấn phiếu lương
        const kyLuong = `${month}/${year}`
        const phieuLuong = await prisma.phieuLuong.findFirst({
            where: {
                ma_nhan_su: session.user.ma_nhan_su || undefined,
                ma_giao_vien: session.user.ma_giao_vien || undefined,
                bang_luong: {
                    ky_luong: kyLuong
                }
            },
            include: {
                bang_luong: true,
                phieu_cham_cong: {
                    include: {
                        chi_tiet_cham_cong: { orderBy: { ngay: 'asc' } }
                    }
                },
                nhan_su: {
                    include: {
                        chuc_vu: true,
                        phong_ban: true
                    }
                },
                giao_vien: {
                    include: {
                        chuc_vu: true,
                        phong_ban: true
                    }
                },
                danh_sach_thuong: true
            }
        })

        if (!phieuLuong) {
            return NextResponse.json({
                message: `Chưa có phiếu lương chính thức cho kì lương tháng ${month}/${year}.`
            }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: phieuLuong })
    } catch (error) {
        console.error('Lỗi lấy phiếu lương cá nhân:', error)
        return NextResponse.json({ message: 'Lỗi máy chủ trong quá trình xử lý.' }, { status: 500 })
    }
}
