import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const danhSach = await prisma.chuongTrinhHoc.findMany({
            // Tối ưu hóa: Chỉ select đúng 2 cột cần thiết để làm dropdown
            select: {
                ma_chuong_trinh: true,
                ten_chuong_trinh: true
            },
            orderBy: {
                ma_chuong_trinh: 'asc'
            }
        })
        
        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET Chương Trình Học:', error)
        return NextResponse.json({ error: 'Lỗi kết nối cơ sở dữ liệu' }, { status: 500 })
    }
}