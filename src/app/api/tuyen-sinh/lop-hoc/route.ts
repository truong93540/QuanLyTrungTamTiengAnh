import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const danhSachLop = await prisma.lopHoc.findMany({
            select: {
                ma_lop_hoc: true,
                ten_lop: true,
                ma_khoa_hoc: true 
            },
            orderBy: {
                ten_lop: 'asc'
            }
        });

        return NextResponse.json(danhSachLop, { status: 200 });
    } catch (error) {
        console.error('Lỗi API Tuyển sinh - Lớp học:', error);
        return NextResponse.json({ error: 'Không thể tải danh sách lớp' }, { status: 500 });
    }
}