import { NextResponse } from 'next/server'
import { layDanhSachLopHoc } from '@/services/TaiChinh/lopHocService'

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const danhSachLop = await layDanhSachLopHoc()
        return NextResponse.json(danhSachLop)
    } catch (error) {
        console.error('Lỗi khi lấy danh sách lớp học:', error)
        return NextResponse.json({ error: 'Lỗi lấy danh sách lớp học' }, { status: 500 })
    }
}
