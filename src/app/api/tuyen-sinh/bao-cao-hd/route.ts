import { NextResponse } from 'next/server'
import { layDuLieuBaoCaoHoatDong } from '@/services/TuyenSinh/baocaoHoatdongService' 

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const nam = searchParams.get('nam') || new Date().getFullYear().toString()

        const duLieu = await layDuLieuBaoCaoHoatDong(Number(nam))
        return NextResponse.json(duLieu, { status: 200 })
    } catch (error) {
        console.error('Lỗi API Báo cáo Hoạt động ngoại khóa:', error)
        return NextResponse.json({ error: 'Lỗi khi lấy dữ liệu báo cáo' }, { status: 500 })
    }
}