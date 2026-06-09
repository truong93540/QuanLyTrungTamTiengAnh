import { NextResponse } from 'next/server'
import { 
    layDanhSachCamKet, 
    taoCamKetMoi, 
    capNhatCamKet, 
    xoaCamKet, 
    kiemTraVaCapNhatViPham 
} from '@/services/TuyenSinh/camKetService'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const filters = {
            ma_cam_ket: searchParams.get('ma_cam_ket'), 
            ngay_ky: searchParams.get('ngay_ky'),
            trang_thai: searchParams.get('trang_thai'), 
            ma_hoc_vien: searchParams.get('ma_hoc_vien'),
            ten_hoc_vien: searchParams.get('ten_hoc_vien'), 
            ma_khoa_hoc: searchParams.get('ma_khoa_hoc'), 
        }
        const danhSach = await layDanhSachCamKet(filters)
        return NextResponse.json(danhSach)
    } catch (error) {
        console.error('Lỗi GET API Cam kết:', error)
        return NextResponse.json({ error: 'Lỗi kết nối cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { 
            ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien, ma_khoa_hoc, 
            so_buoi_vang_cho_phep, tham_gia_thi_day_du, so_buoi_di_muon, so_lan_thieu_bai_tap, 
            bi_vi_pham, ly_do_vi_pham, so_buoi_vang_thuc_te, so_buoi_di_muon_thuc_te, 
            so_lan_thieu_bai_tap_thuc_te, da_bo_thi 
        } = body

        if (!ngay_ky || !noi_dung_cam_ket || !trang_thai || !ma_hoc_vien || !ma_khoa_hoc) {
            return NextResponse.json({ error: 'Thiếu dữ liệu bắt buộc' }, { status: 400 })
        }

        const duLieuMoi = {
            ngay_ky: new Date(ngay_ky), 
            ngay_het_han: ngay_het_han ? new Date(ngay_het_han) : null,
            noi_dung_cam_ket: String(noi_dung_cam_ket), 
            trang_thai: String(trang_thai),
            ma_hoc_vien: Number(ma_hoc_vien), 
            ma_khoa_hoc: Number(ma_khoa_hoc),
            so_buoi_vang_cho_phep: so_buoi_vang_cho_phep != null ? Number(so_buoi_vang_cho_phep) : null,
            tham_gia_thi_day_du: tham_gia_thi_day_du !== undefined ? Boolean(tham_gia_thi_day_du) : null,
            so_buoi_di_muon: so_buoi_di_muon != null ? Number(so_buoi_di_muon) : null,
            so_lan_thieu_bai_tap: so_lan_thieu_bai_tap != null ? Number(so_lan_thieu_bai_tap) : null,
            bi_vi_pham: !!bi_vi_pham,
            ly_do_vi_pham: ly_do_vi_pham ? String(ly_do_vi_pham) : null,
            so_buoi_vang_thuc_te: Number(so_buoi_vang_thuc_te || 0),
            so_buoi_di_muon_thuc_te: Number(so_buoi_di_muon_thuc_te || 0),
            so_lan_thieu_bai_tap_thuc_te: Number(so_lan_thieu_bai_tap_thuc_te || 0),
            da_bo_thi: !!da_bo_thi
        }

        const camKetMoi = await taoCamKetMoi(duLieuMoi)
        return NextResponse.json(camKetMoi, { status: 201 })
    } catch (error: any) { 
        console.error('LỖI POST API Cam kết:', error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Bản cam kết cho học viên này có thể đã tồn tại hoặc có dữ liệu bị trùng lặp!' }, 
                { status: 400 }
            )
        }

        return NextResponse.json({ error: 'Lỗi khi thêm vào CSDL' }, { status: 500 }) 
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { action, ma_cam_ket, ...rest } = body

        if (!ma_cam_ket) return NextResponse.json({ error: 'Thiếu mã cam kết' }, { status: 400 })
        if (action === 'check_violation') {
            const result = await kiemTraVaCapNhatViPham(Number(ma_cam_ket));
            return NextResponse.json(result, { status: 200 });
        }
        const duLieuCapNhat: any = {};
        if (rest.ngay_ky) duLieuCapNhat.ngay_ky = new Date(rest.ngay_ky);
        if (rest.ngay_het_han !== undefined) duLieuCapNhat.ngay_het_han = rest.ngay_het_han ? new Date(rest.ngay_het_han) : null;
        if (rest.noi_dung_cam_ket) duLieuCapNhat.noi_dung_cam_ket = String(rest.noi_dung_cam_ket);
        if (rest.trang_thai) duLieuCapNhat.trang_thai = String(rest.trang_thai);
        if (rest.ma_hoc_vien) duLieuCapNhat.ma_hoc_vien = Number(rest.ma_hoc_vien);
        if (rest.ma_khoa_hoc) duLieuCapNhat.ma_khoa_hoc = Number(rest.ma_khoa_hoc);
        
        const numericFields = ['so_buoi_vang_cho_phep', 'so_buoi_di_muon', 'so_lan_thieu_bai_tap', 'so_buoi_vang_thuc_te', 'so_buoi_di_muon_thuc_te', 'so_lan_thieu_bai_tap_thuc_te'];
        numericFields.forEach(field => { if (rest[field] !== undefined) duLieuCapNhat[field] = Number(rest[field]); });
        
        const booleanFields = ['tham_gia_thi_day_du', 'bi_vi_pham', 'da_bo_thi'];
        booleanFields.forEach(field => { if (rest[field] !== undefined) duLieuCapNhat[field] = Boolean(rest[field]); });

        if (rest.ly_do_vi_pham !== undefined) duLieuCapNhat.ly_do_vi_pham = rest.ly_do_vi_pham ? String(rest.ly_do_vi_pham) : null;

        const camKetCapNhat = await capNhatCamKet(Number(ma_cam_ket), duLieuCapNhat)
        return NextResponse.json(camKetCapNhat, { status: 200 })

    } catch (error: any) { 
        console.error('LỖI PUT API Cam kết:', error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Dữ liệu cập nhật bị trùng lặp với một bản cam kết khác!' }, 
                { status: 400 }
            )
        }

        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 }) 
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Thiếu mã cam kết' }, { status: 400 })
        
        await xoaCamKet(Number(id)) 
        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 })
    } catch (error) { 
        console.error('LỖI DELETE API Cam kết:', error);
        return NextResponse.json({ error: 'Lỗi khi xóa' }, { status: 500 }) 
    }
}