// File: src/app/api/tuyen-sinh/hoc-vien/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const id = searchParams.get('id')

        // 1. Tìm đích danh theo Mã ID (Dùng khi người dùng gõ/chọn Mã học viên)
        if (id) {
            const hocVien = await prisma.hocVien.findUnique({
                where: { ma_hoc_vien: Number(id) },
                select: { ma_hoc_vien: true, ho_ten: true }
            })
            return NextResponse.json(hocVien || null)
        }

        // 2. Tìm kiếm gợi ý theo Tên (Dùng khi gõ vào ô Tên học viên)
        if (search) {
            const danhSachHocVien = await prisma.hocVien.findMany({
                where: {
                    ho_ten: {
                        contains: search,
                        mode: 'insensitive' // Tìm kiếm không phân biệt chữ hoa, chữ thường
                    }
                },
                select: { ma_hoc_vien: true, ho_ten: true },
                take: 6 // Cắt bớt, chỉ lấy tối đa 6 người để giao diện dropdown không bị quá dài
            })
            return NextResponse.json(danhSachHocVien)
        }

        return NextResponse.json([])
    } catch (error) {
        console.error('Lỗi GET Học Viên:', error)
        return NextResponse.json({ error: 'Lỗi truy xuất dữ liệu học viên' }, { status: 500 })
    }
}