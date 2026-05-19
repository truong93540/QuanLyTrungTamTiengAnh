import { NextResponse } from 'next/server'
import { 
    layDanhSachHoatDong, 
    taoHoatDong, 
    capNhatHoatDong, 
    xoaHoatDong, 
    layDanhSachGiaoVien 
} from '@/services/TuyenSinh/hoatDongService'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const action = searchParams.get('action')
        if (action === 'get_teachers') {
            const giaoVien = await layDanhSachGiaoVien()
            return NextResponse.json(giaoVien)
        }

        const filters = { search: searchParams.get('search') }
        const danhSach = await layDanhSachHoatDong(filters)
        return NextResponse.json(danhSach)

    } catch (error) {
        console.error('Lỗi GET API Hoạt động ngoại khóa:', error)
        return NextResponse.json({ error: 'Lỗi kết nối cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { ten_hoat_dong, mo_ta, ngay_to_chuc, dia_diem, chi_phi, danh_sach_giao_vien } = body

        if (!ten_hoat_dong || !ngay_to_chuc) {
            return NextResponse.json({ error: 'Tên hoạt động và Ngày tổ chức là bắt buộc' }, { status: 400 })
        }

        const duLieuMoi = {
            ten_hoat_dong: String(ten_hoat_dong),
            mo_ta: mo_ta ? String(mo_ta) : null,
            ngay_to_chuc: new Date(ngay_to_chuc),
            dia_diem: dia_diem ? String(dia_diem) : null,
            chi_phi: chi_phi !== undefined && chi_phi !== '' ? Number(chi_phi) : null,
            danh_sach_giao_vien: Array.isArray(danh_sach_giao_vien) ? danh_sach_giao_vien.map(Number) : []
        }

        const hoatDongMoi = await taoHoatDong(duLieuMoi)
        return NextResponse.json(hoatDongMoi, { status: 201 })
    } catch (error) {
        console.error('Lỗi POST API Hoạt động ngoại khóa:', error)
        return NextResponse.json({ error: 'Lỗi khi thêm vào cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { ma_hoat_dong_ngoai_khoa, ten_hoat_dong, mo_ta, ngay_to_chuc, dia_diem, chi_phi, danh_sach_giao_vien } = body

        if (!ma_hoat_dong_ngoai_khoa) {
            return NextResponse.json({ error: 'Thiếu mã hoạt động' }, { status: 400 })
        }

        const duLieuCapNhat = {
            ...(ten_hoat_dong && { ten_hoat_dong: String(ten_hoat_dong) }),
            ...(mo_ta !== undefined && { mo_ta: mo_ta ? String(mo_ta) : null }),
            ...(ngay_to_chuc && { ngay_to_chuc: new Date(ngay_to_chuc) }),
            ...(dia_diem !== undefined && { dia_diem: dia_diem ? String(dia_diem) : null }),
            ...(chi_phi !== undefined && { chi_phi: chi_phi !== '' && chi_phi !== null ? Number(chi_phi) : null }),
            ...(danh_sach_giao_vien !== undefined && { danh_sach_giao_vien: Array.isArray(danh_sach_giao_vien) ? danh_sach_giao_vien.map(Number) : [] })
        }

        const hoatDongCapNhat = await capNhatHoatDong(Number(ma_hoat_dong_ngoai_khoa), duLieuCapNhat)
        return NextResponse.json(hoatDongCapNhat, { status: 200 })
    } catch (error) {
        console.error('Lỗi PUT API Hoạt động ngoại khóa:', error)
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Thiếu mã hoạt động' }, { status: 400 })
        
        await xoaHoatDong(Number(id))
        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 })
    } catch (error) {
        console.error('Lỗi DELETE API Hoạt động ngoại khóa:', error)
        return NextResponse.json({ error: 'Lỗi khi xóa' }, { status: 500 })
    }
}