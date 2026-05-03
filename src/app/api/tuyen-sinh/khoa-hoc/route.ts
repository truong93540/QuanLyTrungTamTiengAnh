import { NextResponse } from 'next/server'
// Import các hàm từ Service (Đổi đường dẫn @/services/... cho khớp với dự án của bạn)
import { layDanhSachKhoaHoc, taoKhoaHocMoi, capNhatKhoaHoc, xoaKhoaHoc } from '@/services/TuyenSinh/khoaHocService'

export async function GET(request: Request) {
    try {
        const danhSach = await layDanhSachKhoaHoc()
        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET:', error)
        return NextResponse.json({ error: 'Lỗi kết nối CSDL' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const newKhoaHoc = await taoKhoaHocMoi(data)
        return NextResponse.json(newKhoaHoc)
    } catch (error) {
        console.error('Lỗi POST:', error)
        return NextResponse.json({ error: 'Không thể thêm khóa học' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json()
        // Tách ID ra, phần còn lại ném vào hàm cập nhật
        const updatedKhoaHoc = await capNhatKhoaHoc(data.ma_khoa_hoc, data)
        return NextResponse.json(updatedKhoaHoc)
    } catch (error) {
        console.error('Lỗi PUT:', error)
        return NextResponse.json({ error: 'Không thể cập nhật khóa học' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        
        if (!id) return NextResponse.json({ error: 'Thiếu ID khóa học' }, { status: 400 })

        await xoaKhoaHoc(Number(id))
        return NextResponse.json({ success: true, message: 'Đã xóa thành công' })
    } catch (error) {
        console.error('Lỗi DELETE:', error)
        return NextResponse.json({ error: 'Không thể xóa khóa học' }, { status: 500 })
    }
}