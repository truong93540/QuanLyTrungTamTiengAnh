import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import {
    layDanhSachPhieuChi,
    taoPhieuChiMoi,
    capNhatPhieuChi,
    xoaPhieuChi,
    PhieuChiValidationError,
} from '@/services/TaiChinh/phieuChiService'

export const dynamic = 'force-dynamic';

const getPrismaErrorResponse = (error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return { error: 'Bảng lương này đã được lập phiếu chi trước đó.', status: 400 }
        }
        if (error.code === 'P2003') {
            const field = (error.meta as { field_name?: string })?.field_name || ''
            if (field.includes('ma_bang_luong')) {
                return { error: 'Mã bảng lương không tồn tại.', status: 400 }
            }
            if (field.includes('ma_chuong_trinh_marketing')) {
                return { error: 'Mã chương trình marketing không tồn tại.', status: 400 }
            }
            if (field.includes('ma_nhan_su')) {
                return { error: 'Mã nhân sự lập phiếu không tồn tại.', status: 400 }
            }
            return { error: 'Dữ liệu tham chiếu không hợp lệ.', status: 400 }
        }
        if (error.code === 'P2025') {
            return { error: 'Phiếu chi không tồn tại.', status: 404 }
        }
    }

    return null
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const filters = {
            loai_phieu_chi: searchParams.get('loai_phieu_chi'),
            trang_thai: searchParams.get('trang_thai'),
            search: searchParams.get('search'),
        }

        const danhSach = await layDanhSachPhieuChi(filters)

        return NextResponse.json(danhSach, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate'
            }
        })
    } catch (error) {
        console.error('Lỗi GET:', error)
        return NextResponse.json(
            { error: 'Lỗi kết nối cơ sở dữ liệu' },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, max-age=0, must-revalidate'
                }
            }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const phieuChiMoi = await taoPhieuChiMoi(body)

        revalidatePath('/api/tai-chinh/luong')
        revalidatePath('/dashboard/tai-chinh/bang-luong')
        revalidatePath('/api/tai-chinh/bao-cao')
        revalidatePath('/dashboard/bao-cao/tai-chinh')

        return NextResponse.json(phieuChiMoi, { status: 201 })
    } catch (error) {
        console.error('Lỗi POST:', error)
        if (error instanceof PhieuChiValidationError) {
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

        if (!body.ma_phieu_chi) {
            return NextResponse.json({ error: 'Thiếu mã phiếu chi' }, { status: 400 })
        }

        const phieuChiCapNhat = await capNhatPhieuChi(Number(body.ma_phieu_chi), body)

        revalidatePath('/api/tai-chinh/luong')
        revalidatePath('/dashboard/tai-chinh/bang-luong')
        revalidatePath('/api/tai-chinh/bao-cao')
        revalidatePath('/dashboard/bao-cao/tai-chinh')

        return NextResponse.json(phieuChiCapNhat, { status: 200 })
    } catch (error) {
        console.error('Lỗi PUT:', error)
        if (error instanceof PhieuChiValidationError) {
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
            return NextResponse.json({ error: 'Thiếu mã phiếu chi cần xóa' }, { status: 400 })
        }

        await xoaPhieuChi(Number(id))

        revalidatePath('/api/tai-chinh/luong')
        revalidatePath('/dashboard/tai-chinh/bang-luong')
        revalidatePath('/api/tai-chinh/bao-cao')
        revalidatePath('/dashboard/bao-cao/tai-chinh')

        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 })
    } catch (error) {
        console.error('Lỗi DELETE:', error)
        if (error instanceof PhieuChiValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Lỗi khi xóa khỏi cơ sở dữ liệu' }, { status: 500 })
    }
}
