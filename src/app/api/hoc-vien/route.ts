// File: src/app/api/hoc-vien/route.ts
import { NextResponse } from 'next/server'
import {
    layDanhSachHocVien,
    taoHocVienMoi,
    capNhatHocVien,
    xoaHocVien,
} from '@/services/hocVienService'

export async function GET() {
    try {
        const danhSach = await layDanhSachHocVien()
        return NextResponse.json(danhSach)
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi lấy danh sách học viên' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const hocVienMoi = await taoHocVienMoi(body)
        return NextResponse.json(hocVienMoi, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi thêm học viên' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const updated = await capNhatHocVien(Number(body.ma_hoc_vien), body)
        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi cập nhật học viên' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        await xoaHocVien(Number(id))
        return NextResponse.json({ message: 'Xóa thành công' })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi xóa học viên' }, { status: 500 })
    }
}