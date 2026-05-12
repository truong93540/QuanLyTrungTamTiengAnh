import { NextResponse } from 'next/server'
import { layDanhSachCamKet, taoCamKetMoi, capNhatCamKet, xoaCamKet, kiemTraVaCapNhatViPham } from '@/services/TuyenSinh/camKetService'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const filters = {
            ma_cam_ket: searchParams.get('ma_cam_ket'), ngay_ky: searchParams.get('ngay_ky'),
            trang_thai: searchParams.get('trang_thai'), ma_hoc_vien: searchParams.get('ma_hoc_vien'),
            ten_hoc_vien: searchParams.get('ten_hoc_vien'), ma_khoa_hoc: searchParams.get('ma_khoa_hoc'), 
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
        const { ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien, ma_khoa_hoc, so_buoi_vang_cho_phep, tham_gia_thi_day_du, so_buoi_di_muon, so_lan_thieu_bai_tap, bi_vi_pham, ly_do_vi_pham, so_buoi_vang_thuc_te, so_buoi_di_muon_thuc_te, so_lan_thieu_bai_tap_thuc_te, da_bo_thi } = body

        if (!ngay_ky || !noi_dung_cam_ket || !trang_thai || !ma_hoc_vien || !ma_khoa_hoc) {
            return NextResponse.json({ error: 'Thiếu dữ liệu bắt buộc' }, { status: 400 })
        }

        const duLieuMoi = {
            ngay_ky: new Date(ngay_ky), ngay_het_han: ngay_het_han ? new Date(ngay_het_han) : null,
            noi_dung_cam_ket: String(noi_dung_cam_ket), trang_thai: String(trang_thai),
            ma_hoc_vien: Number(ma_hoc_vien), ma_khoa_hoc: Number(ma_khoa_hoc),
            so_buoi_vang_cho_phep: so_buoi_vang_cho_phep !== undefined ? Number(so_buoi_vang_cho_phep) : null,
            tham_gia_thi_day_du: tham_gia_thi_day_du !== undefined ? Boolean(tham_gia_thi_day_du) : null,
            so_buoi_di_muon: so_buoi_di_muon !== undefined ? Number(so_buoi_di_muon) : null,
            so_lan_thieu_bai_tap: so_lan_thieu_bai_tap !== undefined ? Number(so_lan_thieu_bai_tap) : null,
            bi_vi_pham: bi_vi_pham !== undefined ? Boolean(bi_vi_pham) : false,
            ly_do_vi_pham: ly_do_vi_pham ? String(ly_do_vi_pham) : null,
            so_buoi_vang_thuc_te: so_buoi_vang_thuc_te !== undefined ? Number(so_buoi_vang_thuc_te) : 0,
            so_buoi_di_muon_thuc_te: so_buoi_di_muon_thuc_te !== undefined ? Number(so_buoi_di_muon_thuc_te) : 0,
            so_lan_thieu_bai_tap_thuc_te: so_lan_thieu_bai_tap_thuc_te !== undefined ? Number(so_lan_thieu_bai_tap_thuc_te) : 0,
            da_bo_thi: da_bo_thi !== undefined ? Boolean(da_bo_thi) : false
        }

        const camKetMoi = await taoCamKetMoi(duLieuMoi)
        return NextResponse.json(camKetMoi, { status: 201 })
    } catch (error) { return NextResponse.json({ error: 'Lỗi khi thêm vào CSDL' }, { status: 500 }) }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { action, ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien, ma_khoa_hoc, so_buoi_vang_cho_phep, tham_gia_thi_day_du, so_buoi_di_muon, so_lan_thieu_bai_tap, bi_vi_pham, ly_do_vi_pham, so_buoi_vang_thuc_te, so_buoi_di_muon_thuc_te, so_lan_thieu_bai_tap_thuc_te, da_bo_thi } = body

        if (!ma_cam_ket) return NextResponse.json({ error: 'Thiếu mã cam kết' }, { status: 400 })

        if (action === 'check_violation') {
            const result = await kiemTraVaCapNhatViPham(Number(ma_cam_ket));
            return NextResponse.json(result, { status: 200 });
        }

        const duLieuCapNhat = {
            ...(ngay_ky && { ngay_ky: new Date(ngay_ky) }),
            ...(ngay_het_han !== undefined && { ngay_het_han: ngay_het_han ? new Date(ngay_het_han) : null }),
            ...(noi_dung_cam_ket && { noi_dung_cam_ket: String(noi_dung_cam_ket) }),
            ...(trang_thai && { trang_thai: String(trang_thai) }),
            ...(ma_hoc_vien && { ma_hoc_vien: Number(ma_hoc_vien) }),
            ...(ma_khoa_hoc && { ma_khoa_hoc: Number(ma_khoa_hoc) }),
            ...(so_buoi_vang_cho_phep !== undefined && { so_buoi_vang_cho_phep: Number(so_buoi_vang_cho_phep) }),
            ...(tham_gia_thi_day_du !== undefined && { tham_gia_thi_day_du: Boolean(tham_gia_thi_day_du) }),
            ...(so_buoi_di_muon !== undefined && { so_buoi_di_muon: Number(so_buoi_di_muon) }),
            ...(so_lan_thieu_bai_tap !== undefined && { so_lan_thieu_bai_tap: Number(so_lan_thieu_bai_tap) }),
            ...(bi_vi_pham !== undefined && { bi_vi_pham: Boolean(bi_vi_pham) }),
            ...(ly_do_vi_pham !== undefined && { ly_do_vi_pham: ly_do_vi_pham ? String(ly_do_vi_pham) : null }),
            ...(so_buoi_vang_thuc_te !== undefined && { so_buoi_vang_thuc_te: Number(so_buoi_vang_thuc_te) }),
            ...(so_buoi_di_muon_thuc_te !== undefined && { so_buoi_di_muon_thuc_te: Number(so_buoi_di_muon_thuc_te) }),
            ...(so_lan_thieu_bai_tap_thuc_te !== undefined && { so_lan_thieu_bai_tap_thuc_te: Number(so_lan_thieu_bai_tap_thuc_te) }),
            ...(da_bo_thi !== undefined && { da_bo_thi: Boolean(da_bo_thi) })
        }

        const camKetCapNhat = await capNhatCamKet(Number(ma_cam_ket), duLieuCapNhat)
        return NextResponse.json(camKetCapNhat, { status: 200 })

    } catch (error) { return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 }) }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Thiếu mã cam kết' }, { status: 400 })
        
        await xoaCamKet(Number(id))
        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 })
    } catch (error) { return NextResponse.json({ error: 'Lỗi khi xóa' }, { status: 500 }) }
}