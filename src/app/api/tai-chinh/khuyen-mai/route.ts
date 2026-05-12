import { NextResponse } from 'next/server'
import { layDanhSachKhuyenMaiActive } from '@/services/TaiChinh/khuyenMaiService'

export async function GET() {
    try {
        const danhSach = await layDanhSachKhuyenMaiActive()
        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET khuyen mai:', error)
        return NextResponse.json({ error: 'Lỗi kết nối cơ sở dữ liệu' }, { status: 500 })
    }
}
