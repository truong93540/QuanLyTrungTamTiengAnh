import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import {
    layDanhSachPhieuThu,
    taoPhieuThuMoi,
    capNhatPhieuThu,
    xoaPhieuThu,
    PhieuThuValidationError,
} from '@/services/TaiChinh/phieuThuService'

const getPrismaErrorResponse = (error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
            const field = (error.meta as any)?.field_name || ''
            if (field.includes('ma_hoc_vien')) {
                return { error: 'Mã học viên không tồn tại.', status: 400 }
            }
            if (field.includes('ma_nhan_su')) {
                return { error: 'Mã nhân sự lập phiếu không tồn tại.', status: 400 }
            }
            return { error: 'Dữ liệu tham chiếu không hợp lệ.', status: 400 }
        }
        if (error.code === 'P2025') {
            return { error: 'Phiếu thu không tồn tại.', status: 404 }
        }
    }

    return null
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const filters = {
            ma_phieu_thu: searchParams.get('ma_phieu_thu'),
            so_tien: searchParams.get('so_tien'),
            ngay_thu: searchParams.get('ngay_thu'),
            ma_hoc_vien: searchParams.get('ma_hoc_vien'),
            ma_nhan_su: searchParams.get('ma_nhan_su'),
        }

        
        const danhSach = await layDanhSachPhieuThu(filters)

        
        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET:', error)
        return NextResponse.json({ error: 'Lỗi kết nối cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const phieuThuMoi = await taoPhieuThuMoi(body)

        return NextResponse.json(phieuThuMoi, { status: 201 })
    } catch (error) {
        console.error('Lỗi POST:', error)
        if (error instanceof PhieuThuValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        const prismaResponse = getPrismaErrorResponse(error)
        if (prismaResponse) {
            return NextResponse.json(prismaResponse, { status: prismaResponse.status })
        }

        return NextResponse.json({ error: 'Lỗi khi thêm vào cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()

        if (!body.ma_phieu_thu) {
            return NextResponse.json({ error: 'Thiếu mã phiếu thu' }, { status: 400 })
        }

        const phieuThuCapNhat = await capNhatPhieuThu(Number(body.ma_phieu_thu), body)

        return NextResponse.json(phieuThuCapNhat, { status: 200 })
    } catch (error) {
        console.error('Lỗi PUT:', error)
        if (error instanceof PhieuThuValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        const prismaResponse = getPrismaErrorResponse(error)
        if (prismaResponse) {
            return NextResponse.json(prismaResponse, { status: prismaResponse.status })
        }

        return NextResponse.json({ error: 'Lỗi khi cập nhật cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Thiếu mã phiếu thu cần xóa' }, { status: 400 })
        }

        await xoaPhieuThu(Number(id))

        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 })
    } catch (error) {
        console.error('Lỗi DELETE:', error)
        return NextResponse.json({ error: 'Lỗi khi xóa khỏi cơ sở dữ liệu' }, { status: 500 })
    }
}
