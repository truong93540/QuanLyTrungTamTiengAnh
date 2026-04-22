import {
    capNhatChucVu,
    layDanhSachChucVu,
    taoChucVuMoi,
    xoaChucVu,
} from '@/services/DanhMuc/chucVuService'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const filters = {
            ten_chuc_vu: searchParams.get('ten_chuc_vu'),
        }

        const danhSach = await layDanhSachChucVu(filters)

        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET:', error)
        return NextResponse.json({ error: 'Lỗi kết nối cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const chucVuMoi = await taoChucVuMoi(body)

        return NextResponse.json(chucVuMoi, { status: 201 })
    } catch (error) {
        console.error('Lỗi POST:', error)
        return NextResponse.json({ error: 'Lỗi khi thêm vào cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()

        if (!body.ma_chuc_vu) {
            return NextResponse.json({ error: 'Thiếu mã chức vụ' }, { status: 400 })
        }

        const chucVuCapNhat = await capNhatChucVu(Number(body.ma_chuc_vu), body)

        return NextResponse.json(chucVuCapNhat, { status: 200 })
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
            return NextResponse.json({ error: 'Thiếu mã chức vụ cần xóa' }, { status: 400 })
        }

        await xoaChucVu(Number(id))

        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 })
    } catch (error) {
        console.error('Lỗi DELETE:', error)
        return NextResponse.json({ error: 'Lỗi khi xóa khỏi cơ sở dữ liệu' }, { status: 500 })
    }
}
