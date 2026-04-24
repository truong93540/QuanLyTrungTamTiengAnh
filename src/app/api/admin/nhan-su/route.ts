import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const ma_nhan_su = searchParams.get('ma_nhan_su')

        if (!ma_nhan_su) {
            return NextResponse.json({ message: 'Thiếu mã nhân sự' }, { status: 400 })
        }

        const id = parseInt(ma_nhan_su)
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Mã nhân sự không hợp lệ' }, { status: 400 })
        }

        // Tìm nhân sự
        const nhanSu = await prisma.nhanSu.findUnique({
            where: { ma_nhan_su: id },
            select: {
                ma_nhan_su: true,
                ho_ten: true,
                tai_khoan: {
                    select: {
                        ten_dang_nhap: true,
                    },
                },
            },
        })

        if (!nhanSu) {
            return NextResponse.json({ message: 'Không tìm thấy nhân sự' }, { status: 404 })
        }

        if (nhanSu.tai_khoan) {
            return NextResponse.json(
                {
                    message: 'Nhân sự này đã có tài khoản',
                    data: { ho_ten: nhanSu.ho_ten },
                    hasAccount: true,
                },
                { status: 200 }
            )
        }

        return NextResponse.json({ data: { ho_ten: nhanSu.ho_ten }, hasAccount: false })
    } catch (error) {
        console.error('Lỗi khi tìm nhân sự:', error)
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 })
    }
}
