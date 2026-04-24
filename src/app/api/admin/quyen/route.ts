import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const quyenList = await prisma.quyen.findMany({
            orderBy: {
                ma_quyen: 'asc',
            },
        })

        return NextResponse.json(quyenList)
    } catch (error) {
        console.error('Lỗi khi lấy danh sách quyền:', error)
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 })
    }
}
