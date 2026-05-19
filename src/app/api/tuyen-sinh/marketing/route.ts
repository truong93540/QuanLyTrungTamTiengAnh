import { NextResponse } from 'next/server'
import { 
    layDanhSachChuongTrinh, 
    layDanhSachNhanSuMarketingVaSale, // Đã sửa tên hàm cho đúng với file Service
    taoChuongTrinhMoi, 
    capNhatChuongTrinh, 
    xoaChuongTrinh 
} from '@/services/TuyenSinh/marketingService'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const action = searchParams.get('action')

        // Đã sửa tên action thành get_all_staff để khớp với fetch ở Frontend
        if (action === 'get_all_staff') {
            const nhanSu = await layDanhSachNhanSuMarketingVaSale();
            return NextResponse.json(nhanSu)
        }

        const danhSach = await layDanhSachChuongTrinh()
        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET API Marketing:', error)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { ten_chuong_trinh_marketing, noi_dung, ngay_bat_dau, ngay_ket_thuc, ngan_sach, ma_khoa_hoc, danh_sach_nhan_su } = body

        if (!ten_chuong_trinh_marketing || !ngay_bat_dau || !ngay_ket_thuc) {
            return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
        }

        const duLieu = {
            ten_chuong_trinh_marketing: String(ten_chuong_trinh_marketing),
            noi_dung: noi_dung ? String(noi_dung) : null,
            ngay_bat_dau: new Date(ngay_bat_dau),
            ngay_ket_thuc: new Date(ngay_ket_thuc),
            ngan_sach: ngan_sach ? Number(ngan_sach) : null,
            ma_khoa_hoc: ma_khoa_hoc ? Number(ma_khoa_hoc) : null,
            danh_sach_nhan_su: Array.isArray(danh_sach_nhan_su) ? danh_sach_nhan_su : []
        }

        const ketQua = await taoChuongTrinhMoi(duLieu)
        return NextResponse.json(ketQua, { status: 201 })
    } catch (error) {
        console.error('Lỗi POST API Marketing:', error)
        return NextResponse.json({ error: 'Lỗi khi tạo mới' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { ma_chuong_trinh_marketing, ten_chuong_trinh_marketing, noi_dung, ngay_bat_dau, ngay_ket_thuc, ngan_sach, ma_khoa_hoc, danh_sach_nhan_su } = body

        if (!ma_chuong_trinh_marketing) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })

        const duLieu = {
            ten_chuong_trinh_marketing: String(ten_chuong_trinh_marketing),
            noi_dung: noi_dung ? String(noi_dung) : null,
            ngay_bat_dau: new Date(ngay_bat_dau),
            ngay_ket_thuc: new Date(ngay_ket_thuc),
            ngan_sach: ngan_sach ? Number(ngan_sach) : null,
            ma_khoa_hoc: ma_khoa_hoc ? Number(ma_khoa_hoc) : null,
            danh_sach_nhan_su: Array.isArray(danh_sach_nhan_su) ? danh_sach_nhan_su : []
        }

        const ketQua = await capNhatChuongTrinh(Number(ma_chuong_trinh_marketing), duLieu)
        return NextResponse.json(ketQua, { status: 200 })
    } catch (error) {
        console.error('Lỗi PUT API Marketing:', error)
        return NextResponse.json({ error: 'Lỗi khi cập nhật' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })
        
        await xoaChuongTrinh(Number(id))
        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 })
    } catch (error) { 
        console.error('Lỗi DELETE API Marketing:', error)
        return NextResponse.json({ error: 'Lỗi khi xóa' }, { status: 500 }) 
    }
}