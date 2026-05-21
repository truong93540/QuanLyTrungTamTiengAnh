import { NextResponse } from 'next/server'
import { layDanhSachChuongTrinhMarketing } from '@/services/TaiChinh/phieuChiService'

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const danhSach = await layDanhSachChuongTrinhMarketing()
        return NextResponse.json(danhSach, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate'
            }
        })
    } catch (error) {
        console.error('Lỗi GET API Marketing (Tài Chính):', error)
        return NextResponse.json(
            { error: 'Lỗi máy chủ khi lấy danh sách chương trình marketing' },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, max-age=0, must-revalidate'
                }
            }
        )
    }
}
