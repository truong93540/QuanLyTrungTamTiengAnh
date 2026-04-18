// File: src/app/api/phieu-thu/route.ts
import { NextResponse } from 'next/server'
import {
    layDanhSachPhieuThu,
    taoPhieuThuMoi,
    capNhatPhieuThu,
    xoaPhieuThu,
} from '@/services/TaiChinh/phieuThuService'

export async function GET(request: Request) {
    try {
        // Nhận order từ URL
        const { searchParams } = new URL(request.url)
        const filters = {
            ma_phieu_thu: searchParams.get('ma_phieu_thu'),
            so_tien: searchParams.get('so_tien'),
            ngay_thu: searchParams.get('ngay_thu'),
            ma_hoc_vien: searchParams.get('ma_hoc_vien'),
            ma_nhan_su: searchParams.get('ma_nhan_su'),
        }

        // Nhờ đầu bếp nấu
        const danhSach = await layDanhSachPhieuThu(filters)

        // Bưng món ra cho khách
        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET:', error)
        return NextResponse.json({ error: 'Lỗi kết nối cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const phieuThuMoi = await taoPhieuThuMoi(body)

        return NextResponse.json(phieuThuMoi, { status: 201 })
    } catch (error) {
        console.error('Lỗi POST:', error)
        return NextResponse.json({ error: 'Lỗi khi thêm vào cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()

        if (!body.ma_phieu_thu) {
            return NextResponse.json({ error: 'Thiếu mã phiếu thu' }, { status: 400 })
        }

        const phieuThuCapNhat = await capNhatPhieuThu(Number(body.ma_phieu_thu), body)

        return NextResponse.json(phieuThuCapNhat, { status: 200 })
    } catch (error) {
        console.error('Lỗi PUT:', error)
        return NextResponse.json({ error: 'Lỗi khi cập nhật cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Thiếu mã phiếu thu cần xóa' }, { status: 400 })
        }

        await xoaPhieuThu(Number(id))

        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 })
    } catch (error) {
        console.error('Lỗi DELETE:', error)
        return NextResponse.json({ error: 'Lỗi khi xóa khỏi cơ sở dữ liệu' }, { status: 500 })
    }
}
