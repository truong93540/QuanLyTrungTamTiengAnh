import { NextResponse } from 'next/server'
import { layDanhSachCongNo } from '@/services/TaiChinh/congNoService'

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await layDanhSachCongNo()

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
            },
        })
    } catch (error) {
        console.error('Lỗi GET Cong No:', error)
        return NextResponse.json({ error: 'Lỗi khi tải dữ liệu công nợ từ máy chủ' }, { status: 500 })
    }
}
