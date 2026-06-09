import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const id = searchParams.get('id')

        if (id) {
            const hocVien = await prisma.hocVien.findUnique({
                where: { ma_hoc_vien: Number(id) },
            })
            return NextResponse.json(hocVien || null)
        }

        if (search) {
            const danhSachHocVien = await prisma.hocVien.findMany({
                where: {
                    ho_ten: {
                        contains: search,
                        mode: 'insensitive' 
                    }
                },
                select: { ma_hoc_vien: true, ho_ten: true },
                take: 6
            })
            return NextResponse.json(danhSachHocVien)
        }

        return NextResponse.json([])
    } catch (error) {
        console.error('Lỗi GET Học Viên:', error)
        return NextResponse.json({ error: 'Lỗi truy xuất dữ liệu học viên' }, { status: 500 })
    }
}
export async function POST(request: Request) {
    try {
        const data = await request.json()

        const newHocVien = await prisma.hocVien.create({
            data: {
                ho_ten: data.ho_ten,
                ngay_sinh: new Date(data.ngay_sinh),
                gioi_tinh: data.gioi_tinh,
                so_dien_thoai: data.so_dien_thoai || null,
                email: data.email || null,
                dia_chi: data.dia_chi || null,
                trang_thai: data.trang_thai || 'Đang học',
            }
        })
        return NextResponse.json(newHocVien)
    } catch (error: any) { 
        console.error('Lỗi POST Học Viên:', error)
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Địa chỉ email này đã được đăng ký cho một học viên khác!' }, 
                { status: 400 }
            )
        }
        return NextResponse.json({ error: 'Không thể thêm học viên mới do lỗi máy chủ' }, { status: 500 })
    }
}