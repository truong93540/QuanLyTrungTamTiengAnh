import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const ma_id = searchParams.get('ma_id')
        const loai = searchParams.get('loai') // 'nhan-su' hoặc 'giao-vien'

        if (!ma_id || !loai) {
            return NextResponse.json({ message: 'Thiếu mã ID hoặc loại nhân sự' }, { status: 400 })
        }

        const id = parseInt(ma_id)
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Mã ID không hợp lệ' }, { status: 400 })
        }

        if (loai === 'nhan-su') {
            const nhanSu = await prisma.nhanSu.findUnique({
                where: { ma_nhan_su: id },
                select: {
                    ma_nhan_su: true,
                    ho_ten: true,
                    tai_khoan: { select: { ten_dang_nhap: true } },
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

            return NextResponse.json({
                data: { ho_ten: nhanSu.ho_ten },
                hasAccount: false,
            })
        }

        if (loai === 'giao-vien') {
            const giaoVien = await prisma.giaoVien.findUnique({
                where: { ma_giao_vien: id },
                select: {
                    ma_giao_vien: true,
                    ho_ten: true,
                    tai_khoan: { select: { ten_dang_nhap: true } },
                },
            })

            if (!giaoVien) {
                return NextResponse.json({ message: 'Không tìm thấy giáo viên' }, { status: 404 })
            }

            if (giaoVien.tai_khoan) {
                return NextResponse.json(
                    {
                        message: 'Giáo viên này đã có tài khoản',
                        data: { ho_ten: giaoVien.ho_ten },
                        hasAccount: true,
                    },
                    { status: 200 }
                )
            }

            return NextResponse.json({
                data: { ho_ten: giaoVien.ho_ten },
                hasAccount: false,
            })
        }

        return NextResponse.json(
            { message: 'Loại nhân sự không hợp lệ (dùng nhan-su hoặc giao-vien)' },
            { status: 400 },
        )
    } catch (error) {
        console.error('Lỗi khi tìm nhân sự:', error)
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 })
    }
}
