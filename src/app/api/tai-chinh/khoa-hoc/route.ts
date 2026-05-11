import { NextResponse } from 'next/server'
import { layDanhSachKhoaHoc } from '@/services/DaoTao/khoaHocService'

export async function GET() {
    try {
        const danhSach = await layDanhSachKhoaHoc()
        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET khoa hoc:', error)
        return NextResponse.json({ error: 'Lỗi kết nối cơ sở dữ liệu' }, { status: 500 })
    }
}
