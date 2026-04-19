import { NextResponse } from 'next/server'
import {
    layDanhSachPhongBan,
    taoPhongBanMoi,
    capNhatPhongBan,
    xoaPhongBan,
} from '@/services/DanhMuc/phongBanService' 

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        
       
        const filters = {
            ma_phong_ban: searchParams.get('ma_phong_ban'),
            ten_phong_ban: searchParams.get('ten_phong_ban'),
            mo_ta: searchParams.get('mo_ta'),
            ngay_thanh_lap: searchParams.get('ngay_thanh_lap'),
        }

        const danhSach = await layDanhSachPhongBan(filters)
        return NextResponse.json(danhSach)
        
    } catch (error) {
        console.error('Lỗi GET:', error)
        return NextResponse.json({ error: 'Lỗi kết nối cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        if (!body.ten_phong_ban) {
            return NextResponse.json({ error: 'Thiếu Tên phòng ban' }, { status: 400 })
        }

        const duLieuMoi = {
            ten_phong_ban: String(body.ten_phong_ban),
            mo_ta: body.mo_ta ? String(body.mo_ta) : null,
            ngay_thanh_lap: body.ngay_thanh_lap ? new Date(body.ngay_thanh_lap) : null,
        }

        const phongBanMoi = await taoPhongBanMoi(duLieuMoi)
        return NextResponse.json(phongBanMoi, { status: 201 })

    } catch (error) {
        console.error('Lỗi POST:', error)
        return NextResponse.json({ error: 'Lỗi khi thêm vào cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()

        if (!body.ma_phong_ban) {
            return NextResponse.json({ error: 'Thiếu mã phòng ban để cập nhật' }, { status: 400 })
        }

        const duLieuCapNhat = {
            ...(body.ten_phong_ban && { ten_phong_ban: String(body.ten_phong_ban) }),
            ...(body.mo_ta !== undefined && { mo_ta: body.mo_ta ? String(body.mo_ta) : null }),
            ...(body.ngay_thanh_lap !== undefined && { 
                ngay_thanh_lap: body.ngay_thanh_lap ? new Date(body.ngay_thanh_lap) : null 
            }),
        }

        const phongBanCapNhat = await capNhatPhongBan(Number(body.ma_phong_ban), duLieuCapNhat)
        return NextResponse.json(phongBanCapNhat, { status: 200 })

    } catch (error) {
        console.error('Lỗi PUT:', error)
        return NextResponse.json({ error: 'Lỗi khi cập nhật cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Thiếu mã phòng ban cần xóa' }, { status: 400 })
        }

        await xoaPhongBan(Number(id))
        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 })
        
    } catch (error) {
        console.error('Lỗi DELETE:', error)
        return NextResponse.json({ error: 'Lỗi khi xóa khỏi cơ sở dữ liệu' }, { status: 500 })
    }
}