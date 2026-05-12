import { NextResponse } from 'next/server'
// Chú ý sửa lại đường dẫn import này cho khớp với nơi bạn đặt file marketingService.ts nhé!
import { 
    layDanhSachMarketing, 
    taoMarketingMoi, 
    capNhatMarketing, 
    xoaMarketing 
} from '@/services/TuyenSinh/marketingService'

export async function GET(request: Request) {
    try {
        const danhSach = await layDanhSachMarketing()
        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET Marketing:', error)
        return NextResponse.json({ error: 'Lỗi kết nối CSDL' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const newMarketing = await taoMarketingMoi(data)
        return NextResponse.json(newMarketing)
    } catch (error) {
        console.error('Lỗi POST Marketing:', error)
        return NextResponse.json({ error: 'Không thể thêm chương trình marketing' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json()
        const updatedMarketing = await capNhatMarketing(data.ma_chuong_trinh_marketing, data)
        return NextResponse.json(updatedMarketing)
    } catch (error) {
        console.error('Lỗi PUT Marketing:', error)
        return NextResponse.json({ error: 'Không thể cập nhật chương trình marketing' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        
        if (!id) return NextResponse.json({ error: 'Thiếu mã chương trình marketing' }, { status: 400 })

        await xoaMarketing(Number(id))
        return NextResponse.json({ success: true, message: 'Đã xóa thành công' })
    } catch (error) {
        console.error('Lỗi DELETE Marketing:', error)
        return NextResponse.json({ error: 'Không thể xóa chương trình marketing' }, { status: 500 })
    }
}