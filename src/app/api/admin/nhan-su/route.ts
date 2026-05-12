import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const ma_id = searchParams.get('ma_id')
        const loai = searchParams.get('loai') // 'nhan-vien' hoặc 'giao-vien'

        if (!ma_id || !loai) {
            return NextResponse.json({ message: 'Thiếu mã ID hoặc loại nhân sự' }, { status: 400 })
        }

        const id = parseInt(ma_id)
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Mã ID không hợp lệ' }, { status: 400 })
        }

        if (loai === 'nhan-vien') {
            const nhanVien = await prisma.nhanVien.findUnique({
                where: { ma_nhan_vien: id },
                select: {
                    ma_nhan_vien: true,
                    ho_ten: true,
                    tai_khoan: { select: { ten_dang_nhap: true } },
                },
            })

            if (!nhanVien) {
                return NextResponse.json({ message: 'Không tìm thấy nhân viên' }, { status: 404 })
            }

            return NextResponse.json({
                data: { ho_ten: nhanVien.ho_ten },
                hasAccount: !!nhanVien.tai_khoan,
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

            return NextResponse.json({
                data: { ho_ten: giaoVien.ho_ten },
                hasAccount: !!giaoVien.tai_khoan,
            })
        }

        return NextResponse.json({ message: 'Loại nhân sự không hợp lệ (dùng nhan-vien hoặc giao-vien)' }, { status: 400 })
    } catch (error) {
        console.error('Lỗi khi tìm nhân sự:', error)
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 })
    }
}
