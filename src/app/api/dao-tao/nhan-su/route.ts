import { layDanhSachNhanSu } from '@/services/DaoTao/nhanSuService'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const danhSach = await layDanhSachNhanSu()
        return NextResponse.json(danhSach)
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi lấy danh sách nhân sự' }, { status: 500 })
    }
}
