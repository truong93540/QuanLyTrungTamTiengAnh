import { NextResponse } from 'next/server'
import { layDanhSachKhoaHoc, taoKhoaHocMoi, capNhatKhoaHoc, xoaKhoaHoc } from '@/services/TuyenSinh/khoaHocService'

export async function GET() {
    try {
        const danhSach = await layDanhSachKhoaHoc()
        return NextResponse.json(danhSach)
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        if (!body.ten_khoa_hoc || !body.hoc_phi || !body.ma_chuong_trinh) {
            return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
        }
        const ketQua = await taoKhoaHocMoi({
            ...body,
            hoc_phi: Number(body.hoc_phi),
            ma_chuong_trinh: Number(body.ma_chuong_trinh)
        })
        return NextResponse.json(ketQua, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi tạo mới' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        if (!body.ma_khoa_hoc) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })

        const ketQua = await capNhatKhoaHoc(Number(body.ma_khoa_hoc), {
            ...body,
            hoc_phi: Number(body.hoc_phi),
            ma_chuong_trinh: Number(body.ma_chuong_trinh)
        })
        return NextResponse.json(ketQua, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi cập nhật' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })
        
        await xoaKhoaHoc(Number(id))
        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 })
    } catch (error) { 
        return NextResponse.json({ error: 'Lỗi khi xóa (Có thể do khóa ngoại)' }, { status: 500 }) 
    }
}