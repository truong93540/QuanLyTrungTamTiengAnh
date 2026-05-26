import { NextResponse } from 'next/server'
import { layDuLieuBaoCaoMarketing } from '@/services/TuyenSinh/baocaoMarketingService'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const nam = searchParams.get('nam') || new Date().getFullYear().toString()

        const duLieu = await layDuLieuBaoCaoMarketing(Number(nam))
        return NextResponse.json(duLieu, { status: 200 })
    } catch (error) {
        console.error('Lỗi API Báo cáo Marketing:', error)
        return NextResponse.json({ error: 'Lỗi khi lấy dữ liệu báo cáo' }, { status: 500 })
    }
}