// File: src/app/api/cam-ket/route.ts
import { NextResponse } from 'next/server'
import {
    layDanhSachCamKet,
    taoCamKetMoi,
    capNhatCamKet,
    xoaCamKet,
} from '@/services/camKetService'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        
        // Nhận chi tiết từng trường dữ liệu từ URL để làm bộ lọc tìm kiếm
        const filters = {
            ma_cam_ket: searchParams.get('ma_cam_ket'),
            ngay_ky: searchParams.get('ngay_ky'),
            ngay_het_han: searchParams.get('ngay_het_han'),
            noi_dung_cam_ket: searchParams.get('noi_dung_cam_ket'),
            trang_thai: searchParams.get('trang_thai'),
            ma_hoc_vien: searchParams.get('ma_hoc_vien'),
        }

        const danhSach = await layDanhSachCamKet(filters)
        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET:', error)
        return NextResponse.json({ error: 'Lỗi kết nối cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // 1. Bóc tách chi tiết các trường dữ liệu cần thêm mới (Bỏ qua ma_cam_ket vì nó là tự tăng)
        const { 
            ngay_ky, 
            ngay_het_han, 
            noi_dung_cam_ket, 
            trang_thai, 
            ma_hoc_vien 
        } = body

        // 2. Validate dựa trên ràng buộc "Not null" trong CSDL
        if (!ngay_ky || !noi_dung_cam_ket || !trang_thai || !ma_hoc_vien) {
            return NextResponse.json(
                { error: 'Thiếu dữ liệu bắt buộc (Ngày ký, Nội dung, Trạng thái hoặc Mã học viên)' }, 
                { status: 400 }
            )
        }

        // 3. Đóng gói dữ liệu chuẩn chỉ để gửi cho Service (hoặc Prisma)
        const duLieuMoi = {
            ngay_ky: new Date(ngay_ky),
            ngay_het_han: ngay_het_han ? new Date(ngay_het_han) : null, // Xử lý trường Nullable
            noi_dung_cam_ket: String(noi_dung_cam_ket),
            trang_thai: String(trang_thai),
            ma_hoc_vien: Number(ma_hoc_vien)
        }

        const camKetMoi = await taoCamKetMoi(duLieuMoi)
        return NextResponse.json(camKetMoi, { status: 201 })
        
    } catch (error) {
        console.error('Lỗi POST:', error)
        return NextResponse.json({ error: 'Lỗi khi thêm vào cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()

        // 1. Bóc tách toàn bộ các trường bao gồm cả khóa chính
        const { 
            ma_cam_ket,
            ngay_ky, 
            ngay_het_han, 
            noi_dung_cam_ket, 
            trang_thai, 
            ma_hoc_vien 
        } = body

        // 2. Validate khóa chính
        if (!ma_cam_ket) {
            return NextResponse.json({ error: 'Thiếu mã cam kết để cập nhật' }, { status: 400 })
        }

        // 3. Đóng gói dữ liệu cập nhật
        const duLieuCapNhat = {
            // Tương tự như thêm mới, nhưng dùng cho update
            ...(ngay_ky && { ngay_ky: new Date(ngay_ky) }),
            ngay_het_han: ngay_het_han ? new Date(ngay_het_han) : null,
            ...(noi_dung_cam_ket && { noi_dung_cam_ket: String(noi_dung_cam_ket) }),
            ...(trang_thai && { trang_thai: String(trang_thai) }),
            ...(ma_hoc_vien && { ma_hoc_vien: Number(ma_hoc_vien) })
        }

        const camKetCapNhat = await capNhatCamKet(Number(ma_cam_ket), duLieuCapNhat)
        return NextResponse.json(camKetCapNhat, { status: 200 })

    } catch (error) {
        console.error('Lỗi PUT:', error)
        return NextResponse.json({ error: 'Lỗi khi cập nhật cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id') // Khớp với ma_cam_ket

        if (!id) {
            return NextResponse.json({ error: 'Thiếu mã cam kết cần xóa' }, { status: 400 })
        }

        await xoaCamKet(Number(id))
        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 })

    } catch (error) {
        console.error('Lỗi DELETE:', error)
        return NextResponse.json({ error: 'Lỗi khi xóa khỏi cơ sở dữ liệu' }, { status: 500 })
    }
}