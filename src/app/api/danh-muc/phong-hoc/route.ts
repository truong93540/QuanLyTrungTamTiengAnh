// File: src/app/api/phong-hoc/route.ts
import { NextResponse } from 'next/server'
import {
    layDanhSachPhongHoc,
    taoPhongHocMoi,
    capNhatPhongHoc,
    xoaPhongHoc,
} from '@/services/DanhMuc/phongHocService'

export async function GET() {
    try {
        const danhSach = await layDanhSachPhongHoc()
        return NextResponse.json(danhSach)
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi lấy danh sách phòng học' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        if (!body.ten_phong_hoc || !body.suc_chua) {
            return NextResponse.json({ error: 'Vui lòng nhập đầy đủ thông tin' }, { status: 400 })
        }
        const phongHocMoi = await taoPhongHocMoi(body)
        return NextResponse.json(phongHocMoi, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi thêm phòng học' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const updated = await capNhatPhongHoc(Number(body.ma_phong_hoc), body)
        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi cập nhật phòng học' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })
        
        await xoaPhongHoc(Number(id))
        return NextResponse.json({ message: 'Xóa thành công' })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi xóa (Phòng học có thể đang được sử dụng)' }, { status: 500 })
    }
}