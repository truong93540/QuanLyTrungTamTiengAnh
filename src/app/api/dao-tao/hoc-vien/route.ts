// File: src/app/api/hoc-vien/route.ts
import { NextResponse } from 'next/server'
import {
    layDanhSachHocVien,
    taoHocVienMoi,
    capNhatHocVien,
    xoaHocVien,
} from '@/services/DaoTao/hocVienService'

export async function GET() {
    try {
        const danhSach = await layDanhSachHocVien()
        return NextResponse.json(danhSach)
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi lấy danh sách học viên' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const hocVienMoi = await taoHocVienMoi(body)
        return NextResponse.json(hocVienMoi, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi thêm học viên' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const updated = await capNhatHocVien(Number(body.ma_hoc_vien), body)
        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi cập nhật học viên' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        
        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID học viên' }, { status: 400 })
        }

        await xoaHocVien(Number(id))
        return NextResponse.json({ message: 'Xóa thành công' })
        
    } catch (error: any) {
        console.error('Lỗi khi xóa học viên:', error)
        
        // Kiểm tra nếu lỗi do Prisma Foreign Key Constraint (Mã lỗi P2003 của Prisma)
        if (error.code === 'P2003') {
            return NextResponse.json(
                { error: 'Không thể xóa! Học viên này đã phát sinh dữ liệu (đóng học phí, xếp lớp, v.v.). Bạn nên chuyển trạng thái sang "Bảo lưu" hoặc "Nghỉ học".' }, 
                { status: 409 } // 409 Conflict
            )
        }

        return NextResponse.json(
            { error: 'Lỗi hệ thống khi thực hiện xóa dữ liệu.' }, 
            { status: 500 }
        )
    }
}