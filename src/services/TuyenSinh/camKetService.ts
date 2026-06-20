import { prisma } from '@/lib/prisma'

interface CamKetFilter {
    ma_cam_ket?: string | null; ngay_ky?: string | null; trang_thai?: string | null;
    ma_hoc_vien?: string | null; ten_hoc_vien?: string | null; ma_khoa_hoc?: string | null;
}

interface CamKetData {
    ngay_ky: Date; ngay_het_han?: Date | null; noi_dung_cam_ket: string; trang_thai: string;
    ma_hoc_vien: number; ma_khoa_hoc: number; so_buoi_vang_cho_phep?: number | null;
    tham_gia_thi_day_du?: boolean | null; so_buoi_di_muon?: number | null;
    so_lan_thieu_bai_tap?: number | null; bi_vi_pham?: boolean; ly_do_vi_pham?: string | null;
    so_buoi_vang_thuc_te?: number | null; so_buoi_di_muon_thuc_te?: number | null;
    so_lan_thieu_bai_tap_thuc_te?: number | null; da_bo_thi?: boolean | null;
}

export const layDanhSachCamKet = async (filters: CamKetFilter) => {
    const { ma_cam_ket, ngay_ky, trang_thai, ma_hoc_vien, ten_hoc_vien, ma_khoa_hoc } = filters;
    const whereClause: any = {};

    if (ma_cam_ket) whereClause.ma_cam_ket = Number(ma_cam_ket);
    if (ma_hoc_vien) whereClause.ma_hoc_vien = Number(ma_hoc_vien);
    if (ma_khoa_hoc) whereClause.ma_khoa_hoc = Number(ma_khoa_hoc);
    if (trang_thai) whereClause.trang_thai = { contains: trang_thai, mode: 'insensitive' };
    if (ngay_ky) {
        const date = new Date(ngay_ky); const nextDay = new Date(date); nextDay.setDate(date.getDate() + 1);
        whereClause.ngay_ky = { gte: date, lt: nextDay };
    } 
    if (ten_hoc_vien) whereClause.hoc_vien = { ho_ten: { contains: ten_hoc_vien, mode: 'insensitive' } };

    return await prisma.camKet.findMany({
        where: whereClause,
        include: { 
            khoa_hoc: { select: { ten_khoa_hoc: true } },
            hoc_vien: { 
                include: { 
                    tham_gia_lop: { 
                        include: { 
                            lop_hoc: { select: { ma_lop_hoc: true, ten_lop: true } } 
                        } 
                    } 
                } 
            } 
        },
        orderBy: { ma_cam_ket: 'asc' }, 
    });
}

export const taoCamKetMoi = async (data: CamKetData) => {
    return await prisma.camKet.create({
        data: {
            ngay_ky: data.ngay_ky, ngay_het_han: data.ngay_het_han, noi_dung_cam_ket: data.noi_dung_cam_ket, 
            trang_thai: data.trang_thai, ma_hoc_vien: data.ma_hoc_vien, ma_khoa_hoc: data.ma_khoa_hoc, 
            so_buoi_vang_cho_phep: data.so_buoi_vang_cho_phep, tham_gia_thi_day_du: data.tham_gia_thi_day_du,
            so_buoi_di_muon: data.so_buoi_di_muon, so_lan_thieu_bai_tap: data.so_lan_thieu_bai_tap,
            bi_vi_pham: data.bi_vi_pham, ly_do_vi_pham: data.ly_do_vi_pham,
            so_buoi_vang_thuc_te: data.so_buoi_vang_thuc_te, so_buoi_di_muon_thuc_te: data.so_buoi_di_muon_thuc_te,
            so_lan_thieu_bai_tap_thuc_te: data.so_lan_thieu_bai_tap_thuc_te, da_bo_thi: data.da_bo_thi
        },
        include: { hoc_vien: { select: { ho_ten: true } }, khoa_hoc: { select: { ten_khoa_hoc: true } } },
    });
}

export const capNhatCamKet = async (ma_cam_ket: number, data: Partial<CamKetData>) => {
    return await prisma.camKet.update({
        where: { ma_cam_ket: ma_cam_ket },
        data: {
            ...(data.ngay_ky !== undefined && { ngay_ky: data.ngay_ky }),
            ...(data.ngay_het_han !== undefined && { ngay_het_han: data.ngay_het_han }),
            ...(data.noi_dung_cam_ket !== undefined && { noi_dung_cam_ket: data.noi_dung_cam_ket }),
            ...(data.trang_thai !== undefined && { trang_thai: data.trang_thai }),
            ...(data.ma_hoc_vien !== undefined && { ma_hoc_vien: data.ma_hoc_vien }),
            ...(data.ma_khoa_hoc !== undefined && { ma_khoa_hoc: data.ma_khoa_hoc }), 
            ...(data.so_buoi_vang_cho_phep !== undefined && { so_buoi_vang_cho_phep: data.so_buoi_vang_cho_phep }),
            ...(data.tham_gia_thi_day_du !== undefined && { tham_gia_thi_day_du: data.tham_gia_thi_day_du }),
            ...(data.so_buoi_di_muon !== undefined && { so_buoi_di_muon: data.so_buoi_di_muon }),
            ...(data.so_lan_thieu_bai_tap !== undefined && { so_lan_thieu_bai_tap: data.so_lan_thieu_bai_tap }),
            ...(data.bi_vi_pham !== undefined && { bi_vi_pham: data.bi_vi_pham }),
            ...(data.ly_do_vi_pham !== undefined && { ly_do_vi_pham: data.ly_do_vi_pham }),
            ...(data.so_buoi_vang_thuc_te !== undefined && { so_buoi_vang_thuc_te: data.so_buoi_vang_thuc_te }),
            ...(data.so_buoi_di_muon_thuc_te !== undefined && { so_buoi_di_muon_thuc_te: data.so_buoi_di_muon_thuc_te }),
            ...(data.so_lan_thieu_bai_tap_thuc_te !== undefined && { so_lan_thieu_bai_tap_thuc_te: data.so_lan_thieu_bai_tap_thuc_te }),
            ...(data.da_bo_thi !== undefined && { da_bo_thi: data.da_bo_thi }),
        },
        include: { hoc_vien: { select: { ho_ten: true } }, khoa_hoc: { select: { ten_khoa_hoc: true } } },
    });
}

export const xoaCamKet = async (ma_cam_ket: number) => {
    return await prisma.camKet.delete({ where: { ma_cam_ket: ma_cam_ket } });
}

export const kiemTraVaCapNhatViPham = async (ma_cam_ket: number) => {
    const camKet = await prisma.camKet.findUnique({ where: { ma_cam_ket } });
    if (!camKet) throw new Error("Không tìm thấy cam kết");

    const { ma_hoc_vien, ma_khoa_hoc } = camKet;

    let thamGiaLop = await prisma.thamGiaLop.findFirst({
        where: {
            ma_hoc_vien: ma_hoc_vien,
            trang_thai: 'Đang học',
            lop_hoc: { ma_khoa_hoc: ma_khoa_hoc }
        },
        orderBy: { ngay_dang_ky: 'desc' }
    });

    if (!thamGiaLop) {
        thamGiaLop = await prisma.thamGiaLop.findFirst({
            where: {
                ma_hoc_vien: ma_hoc_vien,
                lop_hoc: { ma_khoa_hoc: ma_khoa_hoc }
            },
            orderBy: { ngay_dang_ky: 'desc' }
        });
    }

    const dieuKienLocBuoiHoc = thamGiaLop 
        ? { ma_lop_hoc: thamGiaLop.ma_lop_hoc } 
        : { lop_hoc: { ma_khoa_hoc: ma_khoa_hoc } };

    const thieu_bt = await prisma.nhanXet.count({
        where: { 
            ma_hoc_vien: ma_hoc_vien, 
            da_lam_bai_tap: false,
            buoi_hoc: dieuKienLocBuoiHoc
        }
    });

    const vang = await prisma.diemDanh.count({
        where: { 
            ma_hoc_vien: ma_hoc_vien, 
            trang_thai: { in: ['Vắng phép', 'Vắng không phép'] },
            buoi_hoc: dieuKienLocBuoiHoc
        }
    });

    const muon = await prisma.diemDanh.count({
        where: { 
            ma_hoc_vien: ma_hoc_vien, 
            trang_thai: 'Đi muộn',
            buoi_hoc: dieuKienLocBuoiHoc
        }
    });

    let bo_thi = false;
    if (camKet.tham_gia_thi_day_du && ma_khoa_hoc) {
        const danhSachBaiKiemTra = await prisma.baiKiemTra.findMany({
            where: thamGiaLop ? { ma_lop_hoc: thamGiaLop.ma_lop_hoc } : { lop_hoc: { ma_khoa_hoc: ma_khoa_hoc } }
        });
        
        for (const bkt of danhSachBaiKiemTra) {
            const ketQua = await prisma.ketQuaKiemTra.findFirst({
                where: { ma_bai_kiem_tra: bkt.ma_bai_kiem_tra, ma_hoc_vien: ma_hoc_vien }
            });
            
           if (ketQua && ketQua.diem_so === 1 && ketQua.nhan_xet?.trim().toLowerCase() === 'bỏ thi') {
                bo_thi = true;
                break;
            }
        }
    }

    const isViolated = (camKet.so_lan_thieu_bai_tap !== null && thieu_bt > camKet.so_lan_thieu_bai_tap) || 
                       (camKet.so_buoi_vang_cho_phep !== null && vang > camKet.so_buoi_vang_cho_phep) || 
                       (camKet.so_buoi_di_muon !== null && muon > camKet.so_buoi_di_muon) || 
                       bo_thi;

    let reason = [];
    if (camKet.so_lan_thieu_bai_tap !== null && thieu_bt > camKet.so_lan_thieu_bai_tap) reason.push(`- Thiếu bài tập quá số lần quy định (${thieu_bt}/${camKet.so_lan_thieu_bai_tap})`);
    if (camKet.so_buoi_vang_cho_phep !== null && vang > camKet.so_buoi_vang_cho_phep) reason.push(`- Nghỉ học quá số buổi (${vang}/${camKet.so_buoi_vang_cho_phep})`);
    if (camKet.so_buoi_di_muon !== null && muon > camKet.so_buoi_di_muon) reason.push(`- Đi muộn quá số buổi (${muon}/${camKet.so_buoi_di_muon})`);
    if (bo_thi) reason.push(`- Bỏ thi / Không tham gia bài test bắt buộc`);

    const finalReason = isViolated ? reason.join('\n') : null;

    const updatedCamKet = await prisma.camKet.update({
        where: { ma_cam_ket },
        data: { 
            bi_vi_pham: isViolated, 
            ly_do_vi_pham: finalReason,
            so_buoi_vang_thuc_te: vang,
            so_buoi_di_muon_thuc_te: muon,
            so_lan_thieu_bai_tap_thuc_te: thieu_bt,
            da_bo_thi: bo_thi
        },
        include: { hoc_vien: { select: { ho_ten: true } }, khoa_hoc: { select: { ten_khoa_hoc: true } } },
    });

    return { updatedCamKet, stats: { vang, muon, thieu_bt, bo_thi } };
}