import { NextResponse } from 'next/server'
import {
    layDanhSachGiaoVien,
    taoGiaoVienMoi,
    capNhatGiaoVien,
    xoaGiaoVien,
} from '@/services/DaoTao/giaoVienService'

function parseDate(value: unknown): Date | null | undefined {
    if (value === undefined) return undefined
    if (value === null || value === '') return null
    const d = new Date(String(value))
    return Number.isNaN(d.getTime()) ? null : d
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const filters = {
            ma_giao_vien: searchParams.get('ma_giao_vien'),
            ho_ten: searchParams.get('ho_ten'),
            so_dien_thoai: searchParams.get('so_dien_thoai'),
            ma_phong_ban: searchParams.get('ma_phong_ban'),
        }
        const danhSach = await layDanhSachGiaoVien(filters)
        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET giáo viên:', error)
        return NextResponse.json({ error: 'Lỗi lấy danh sách giáo viên' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        if (!body.ho_ten || !String(body.ho_ten).trim()) {
            return NextResponse.json({ error: 'Thiếu họ tên giáo viên' }, { status: 400 })
        }
        if (!body.ma_chuc_vu || !body.ma_phong_ban) {
            return NextResponse.json({ error: 'Thiếu thông tin Chức vụ hoặc Phòng ban' }, { status: 400 })
        }

        const giaoVienMoi = await taoGiaoVienMoi({
            ho_ten: String(body.ho_ten).trim(),
            ngay_sinh: parseDate(body.ngay_sinh) ?? null,
            gioi_tinh: body.gioi_tinh ? String(body.gioi_tinh) : null,
            so_dien_thoai: body.so_dien_thoai ? String(body.so_dien_thoai) : null,
            email: body.email ? String(body.email) : null,
            dia_chi: body.dia_chi ? String(body.dia_chi) : null,
            ma_chuc_vu: Number(body.ma_chuc_vu),
            ma_phong_ban: Number(body.ma_phong_ban),
        })
        return NextResponse.json(giaoVienMoi, { status: 201 })
    } catch (error: unknown) {
        console.error('Lỗi POST giáo viên:', error)
        return NextResponse.json({ error: 'Lỗi khi thêm giáo viên' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        if (!body.ma_giao_vien) {
            return NextResponse.json({ error: 'Thiếu mã giáo viên' }, { status: 400 })
        }
        
        const ma = Number(body.ma_giao_vien)
        const duLieu: Parameters<typeof capNhatGiaoVien>[1] = {}
        
        if (body.ho_ten !== undefined) duLieu.ho_ten = String(body.ho_ten).trim()
        if (body.ngay_sinh !== undefined) duLieu.ngay_sinh = parseDate(body.ngay_sinh)
        if (body.gioi_tinh !== undefined) duLieu.gioi_tinh = body.gioi_tinh ? String(body.gioi_tinh) : null
        if (body.so_dien_thoai !== undefined) duLieu.so_dien_thoai = body.so_dien_thoai ? String(body.so_dien_thoai) : null
        if (body.email !== undefined) duLieu.email = body.email ? String(body.email) : null
        if (body.dia_chi !== undefined) duLieu.dia_chi = body.dia_chi ? String(body.dia_chi) : null
        if (body.ma_chuc_vu !== undefined) duLieu.ma_chuc_vu = Number(body.ma_chuc_vu)
        if (body.ma_phong_ban !== undefined) duLieu.ma_phong_ban = Number(body.ma_phong_ban)

        const updated = await capNhatGiaoVien(ma, duLieu)
        return NextResponse.json(updated)
    } catch (error: unknown) {
        console.error('Lỗi PUT giáo viên:', error)
        return NextResponse.json({ error: 'Lỗi khi cập nhật giáo viên' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID giáo viên' }, { status: 400 })
        }

        await xoaGiaoVien(Number(id))
        return NextResponse.json({ message: 'Xóa thành công' })
    } catch (error: unknown) {
        console.error('Lỗi khi xóa giáo viên:', error)
        const err = error as { code?: string }
        if (err.code === 'P2003') {
            return NextResponse.json(
                { error: 'Không thể xóa. Giáo viên này đang phụ trách Lớp Học hoặc có dữ liệu liên quan.' },
                { status: 409 },
            )
        }
        return NextResponse.json({ error: 'Lỗi hệ thống khi thực hiện xóa dữ liệu.' }, { status: 500 })
    }
}