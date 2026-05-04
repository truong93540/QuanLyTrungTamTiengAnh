import { NextResponse } from 'next/server'
// Đổi đường dẫn @/services/... cho khớp với dự án của bạn nhé
import { 
    layDanhSachKhuyenMai, 
    taoKhuyenMaiMoi, 
    capNhatKhuyenMai, 
    xoaKhuyenMai 
} from '@/services/TuyenSinh/khuyenMaiService'

export async function GET(request: Request) {
    try {
        const danhSach = await layDanhSachKhuyenMai()
        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET Khuyến Mãi:', error)
        return NextResponse.json({ error: 'Lỗi kết nối CSDL' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const newKhuyenMai = await taoKhuyenMaiMoi(data)
        return NextResponse.json(newKhuyenMai)
    } catch (error) {
        console.error('Lỗi POST Khuyến Mãi:', error)
        return NextResponse.json({ error: 'Không thể thêm chương trình khuyến mãi' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json()
        const updatedKhuyenMai = await capNhatKhuyenMai(data.ma_khuyen_mai, data)
        return NextResponse.json(updatedKhuyenMai)
    } catch (error) {
        console.error('Lỗi PUT Khuyến Mãi:', error)
        return NextResponse.json({ error: 'Không thể cập nhật chương trình khuyến mãi' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        
        if (!id) return NextResponse.json({ error: 'Thiếu mã khuyến mãi' }, { status: 400 })

        await xoaKhuyenMai(Number(id))
        return NextResponse.json({ success: true, message: 'Đã xóa thành công' })
    } catch (error) {
        console.error('Lỗi DELETE Khuyến Mãi:', error)
        return NextResponse.json({ error: 'Không thể xóa chương trình khuyến mãi' }, { status: 500 })
    }
}