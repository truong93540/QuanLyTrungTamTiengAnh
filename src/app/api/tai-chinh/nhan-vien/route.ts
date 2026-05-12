import { layDanhSachNhanVienTaiChinh } from '@/services/TaiChinh/nhanVienService'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const danhSach = await layDanhSachNhanVienTaiChinh()
        return NextResponse.json(danhSach)
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi lấy danh sách nhân viên' }, { status: 500 })
    }
}
