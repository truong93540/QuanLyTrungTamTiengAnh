import { prisma } from '@/lib/prisma'

export interface PayrollCalculationResult {
    ma_id: number;
    ma_chuc_vu?: number;
    loai: 'NS' | 'GV';
    ho_ten: string;
    chuc_vu: string;
    ten_phong_ban: string;
    chi_tiet_cham_cong?: any[];
    phan_cong_giang_day?: any[];
    luong_co_ban: number;
    so_ngay_cong: number;
    luong_theo_cong: number;
    phu_cap: number;
    hoa_hong: number;
    thuong_chuyen_can: number;
    thuong_nong: number;
    noi_dung_thuong: string;
    chi_tiet_thuong_nong?: { noi_dung: string; so_tien: number }[];
    tong_thuong: number;
    bao_hiem: number;
    thuc_linh: number;
    ghi_chu: string;
    chi_tiet_phu_cap: any[];

    // Chi tiết chấm công
    so_lan_di_muon: number;
    so_lan_ve_som: number;
    so_gio_lam_viec_thuong: number;
    so_gio_tang_ca_ngay_thuong: number;
    so_gio_lam_viec_thuong_ngay_nghi: number;
    so_gio_tang_ca_ngay_nghi: number;
    tong_so_gio_lam_viec: number;

    // Chi tiết cấu phần lương
    luong_lam_viec_ngay_thuong: number;
    luong_tang_ca_ngay_thuong: number;
    luong_lam_viec_ngay_nghi: number;
    luong_tang_ca_ngay_nghi: number;

    // Dữ liệu 31 ngày
    ngay_1: number; ngay_2: number; ngay_3: number; ngay_4: number; ngay_5: number;
    ngay_6: number; ngay_7: number; ngay_8: number; ngay_9: number; ngay_10: number;
    ngay_11: number; ngay_12: number; ngay_13: number; ngay_14: number; ngay_15: number;
    ngay_16: number; ngay_17: number; ngay_18: number; ngay_19: number; ngay_20: number;
    ngay_21: number; ngay_22: number; ngay_23: number; ngay_24: number; ngay_25: number;
    ngay_26: number; ngay_27: number; ngay_28: number; ngay_29: number; ngay_30: number;
    ngay_31: number;
}

export const calculatePayrollForMonth = async (
    month: number, 
    year: number,
    coefNormal: number = 1.0,
    coefOtNormal: number = 1.5,
    coefWeekend: number = 2.0,
    coefOtWeekend: number = 2.5
) => {
    const kyChamCong = `T${String(month).padStart(2, '0')}-${year}`;
    const kiThuong = `${month}/${year}`;

    // 1. Lấy dữ liệu bảng chấm công và bảng thưởng của tháng
    const bangChamCong = await prisma.bangChamCong.findFirst({
        where: { ky_cham_cong: kyChamCong },
        include: {
            danh_sach_phieu: {
                include: {
                    chi_tiet_cham_cong: true
                }
            }
        }
    });

    const bangThuong = await prisma.bangThuong.findFirst({
        where: { ki_thuong: kiThuong },
        include: {
            phieu_thuong: true
        }
    });

    // 2. Lấy danh sách nhân sự và giáo viên kèm hợp đồng hiệu lực
    const nhanSuList = await prisma.nhanSu.findMany({
        include: {
            chuc_vu: true,
            phong_ban: true,
            hop_dong: {
                where: { tg_het_hop_dong: { gte: new Date(year, month - 1, 1) } },
                orderBy: { ma_hop_dong: 'desc' },
                take: 1
            }
        }
    });

    const giaoVienList = await prisma.giaoVien.findMany({
        include: {
            chuc_vu: true,
            phong_ban: true,
            phan_cong_giang_day: {
                include: {
                    lop_hoc: true
                }
            },
            hop_dong: {
                where: { tg_het_hop_dong: { gte: new Date(year, month - 1, 1) } },
                orderBy: { ma_hop_dong: 'desc' },
                take: 1
            }
        }
    });

    const results: PayrollCalculationResult[] = [];

    // Hàm phụ trợ map dữ liệu ngày công
    const getDaysData = (phieuCC: any) => ({
        ngay_1: phieuCC?.ngay_1 || 0, ngay_2: phieuCC?.ngay_2 || 0, ngay_3: phieuCC?.ngay_3 || 0, ngay_4: phieuCC?.ngay_4 || 0, ngay_5: phieuCC?.ngay_5 || 0,
        ngay_6: phieuCC?.ngay_6 || 0, ngay_7: phieuCC?.ngay_7 || 0, ngay_8: phieuCC?.ngay_8 || 0, ngay_9: phieuCC?.ngay_9 || 0, ngay_10: phieuCC?.ngay_10 || 0,
        ngay_11: phieuCC?.ngay_11 || 0, ngay_12: phieuCC?.ngay_12 || 0, ngay_13: phieuCC?.ngay_13 || 0, ngay_14: phieuCC?.ngay_14 || 0, ngay_15: phieuCC?.ngay_15 || 0,
        ngay_16: phieuCC?.ngay_16 || 0, ngay_17: phieuCC?.ngay_17 || 0, ngay_18: phieuCC?.ngay_18 || 0, ngay_19: phieuCC?.ngay_19 || 0, ngay_20: phieuCC?.ngay_20 || 0,
        ngay_21: phieuCC?.ngay_21 || 0, ngay_22: phieuCC?.ngay_22 || 0, ngay_23: phieuCC?.ngay_23 || 0, ngay_24: phieuCC?.ngay_24 || 0, ngay_25: phieuCC?.ngay_25 || 0,
        ngay_26: phieuCC?.ngay_26 || 0, ngay_27: phieuCC?.ngay_27 || 0, ngay_28: phieuCC?.ngay_28 || 0, ngay_29: phieuCC?.ngay_29 || 0, ngay_30: phieuCC?.ngay_30 || 0,
        ngay_31: phieuCC?.ngay_31 || 0,
    });

    // 3. Tính lương cho Nhân sự
    for (const ns of nhanSuList) {
        const hopDong = ns.hop_dong[0];
        const phieuCC = bangChamCong?.danh_sach_phieu.find(p => p.ma_nhan_su === ns.ma_nhan_su);
        const dsPhieuThuong = bangThuong?.phieu_thuong.filter(p => p.ma_nhan_su === ns.ma_nhan_su) || [];

        const luongCoBan = Number(hopDong?.luong_co_ban || 0);

        // Chi tiết chấm công
        const so_lan_di_muon = phieuCC?.so_lan_di_muon || 0;
        const so_lan_ve_som = phieuCC?.so_lan_ve_som || 0;
        const so_gio_lam_viec_thuong = phieuCC?.so_gio_lam_viec_thuong || 0;
        const so_gio_tang_ca_ngay_thuong = phieuCC?.so_gio_tang_ca_ngay_thuong || 0;
        const so_gio_lam_viec_thuong_ngay_nghi = phieuCC?.so_gio_lam_viec_thuong_ngay_nghi || 0;
        const so_gio_tang_ca_ngay_nghi = phieuCC?.so_gio_tang_ca_ngay_nghi || 0;
        const tong_so_gio_lam_viec = phieuCC?.tong_so_gio_lam_viec || 0;

        // Ngày công của nhân viên = giờ thường / 8
        const soNgayCong = so_gio_lam_viec_thuong / 8;
        
        // Đơn giá giờ làm việc chuẩn = lương cơ bản / 26 / 8
        const hourlyRate = luongCoBan / 26 / 8;

        const luong_lam_viec_ngay_thuong = Math.round(so_gio_lam_viec_thuong * hourlyRate * coefNormal);
        const luong_tang_ca_ngay_thuong = Math.round(so_gio_tang_ca_ngay_thuong * hourlyRate * coefOtNormal);
        const luong_lam_viec_ngay_nghi = Math.round(so_gio_lam_viec_thuong_ngay_nghi * hourlyRate * coefWeekend);
        const luong_tang_ca_ngay_nghi = Math.round(so_gio_tang_ca_ngay_nghi * hourlyRate * coefOtWeekend);

        const luongTheoCong = luong_lam_viec_ngay_thuong + luong_tang_ca_ngay_thuong + luong_lam_viec_ngay_nghi + luong_tang_ca_ngay_nghi;

        let tongPhuCap = 0;
        const chiTietPhuCap = (hopDong?.chi_tiet_phu_cap as any[]) || [];
        chiTietPhuCap.forEach(pc => {
            if (pc.ten !== "Chuyên cần") {
                tongPhuCap += Number(pc.soTien || 0);
            }
        });

        const hoaHong = dsPhieuThuong.filter(p => p.loai_thuong === "Tiền hoa hồng").reduce((acc, p) => acc + Number(p.so_tien), 0);
        const thuongChuyenCan = dsPhieuThuong.filter(p => p.loai_thuong === "Chuyên cần").reduce((acc, p) => acc + Number(p.so_tien), 0);
        const dsThuongNong = dsPhieuThuong.filter(p => p.loai_thuong === "Thưởng nóng");
        const thuongNong = dsThuongNong.reduce((acc, p) => acc + Number(p.so_tien), 0);
        const noiDungThuong = dsThuongNong.map(p => p.noi_dung).filter(Boolean).join(", ");
        const chiTietThuongNong = dsThuongNong.map(p => ({ noi_dung: p.noi_dung || 'Thưởng nóng', so_tien: Number(p.so_tien) }));
        const tong_thuong = hoaHong + thuongChuyenCan + thuongNong;

        // Bảo hiểm: Nghỉ không lương >= 14 ngày (tương đương ngày công < 12) trong tháng thì KHÔNG đóng bảo hiểm.
        // Nghỉ không lương < 14 ngày (ngày công >= 12) thì đóng bảo hiểm bình thường dựa trên lương Hợp đồng.
        const ngayNghiKhongLuong = 26 - soNgayCong;
        const baoHiem = (hopDong?.dong_bao_hiem && ngayNghiKhongLuong < 14) ? (luongCoBan * 0.105) : 0;

        const thucLinh = Math.max(0, luongTheoCong + tongPhuCap + tong_thuong - baoHiem);

        results.push({
            ma_id: ns.ma_nhan_su,
            ma_chuc_vu: ns.ma_chuc_vu,
            loai: 'NS',
            ho_ten: ns.ho_ten,
            chuc_vu: ns.chuc_vu.ten_chuc_vu,
            ten_phong_ban: ns.phong_ban.ten_phong_ban,
            chi_tiet_cham_cong: phieuCC?.chi_tiet_cham_cong || [],
            luong_co_ban: luongCoBan,
            so_ngay_cong: Math.round(soNgayCong * 10) / 10,
            luong_theo_cong: Math.round(luongTheoCong),
            phu_cap: tongPhuCap,
            hoa_hong: hoaHong,
            thuong_chuyen_can: thuongChuyenCan,
            thuong_nong: thuongNong,
            noi_dung_thuong: noiDungThuong,
            chi_tiet_thuong_nong: chiTietThuongNong,
            tong_thuong: tong_thuong,
            bao_hiem: Math.round(baoHiem),
            thuc_linh: Math.round(thucLinh),
            ghi_chu: "",
            chi_tiet_phu_cap: chiTietPhuCap,

            // Chấp công chi tiết
            so_lan_di_muon,
            so_lan_ve_som,
            so_gio_lam_viec_thuong,
            so_gio_tang_ca_ngay_thuong,
            so_gio_lam_viec_thuong_ngay_nghi,
            so_gio_tang_ca_ngay_nghi,
            tong_so_gio_lam_viec,

            // Cấu phần lương chi tiết
            luong_lam_viec_ngay_thuong,
            luong_tang_ca_ngay_thuong,
            luong_lam_viec_ngay_nghi,
            luong_tang_ca_ngay_nghi,

            // 31 ngày
            ...getDaysData(phieuCC)
        });
    }

    // 4. Tính lương cho Giáo viên
    for (const gv of giaoVienList) {
        const hopDong = gv.hop_dong[0];
        const phieuCC = bangChamCong?.danh_sach_phieu.find(p => p.ma_giao_vien === gv.ma_giao_vien);
        const dsPhieuThuong = bangThuong?.phieu_thuong.filter(p => p.ma_giao_vien === gv.ma_giao_vien) || [];

        const luongCoBan = Number(hopDong?.luong_co_ban || 0);

        // Chi tiết chấm công
        const so_lan_di_muon = phieuCC?.so_lan_di_muon || 0;
        const so_lan_ve_som = phieuCC?.so_lan_ve_som || 0;
        const so_gio_lam_viec_thuong = phieuCC?.so_gio_lam_viec_thuong || 0;
        const so_gio_tang_ca_ngay_thuong = phieuCC?.so_gio_tang_ca_ngay_thuong || 0;
        const so_gio_lam_viec_thuong_ngay_nghi = phieuCC?.so_gio_lam_viec_thuong_ngay_nghi || 0;
        const so_gio_tang_ca_ngay_nghi = phieuCC?.so_gio_tang_ca_ngay_nghi || 0;
        const tong_so_gio_lam_viec = phieuCC?.tong_so_gio_lam_viec || 0;

        // Đơn giá giờ làm việc chuẩn = lương cơ bản / 26 / 8 (nếu tính theo giờ)
        const hourlyRate = luongCoBan / 26 / 8;

        const luong_lam_viec_ngay_thuong = Math.round(so_gio_lam_viec_thuong * hourlyRate * coefNormal);
        const luong_tang_ca_ngay_thuong = Math.round(so_gio_tang_ca_ngay_thuong * hourlyRate * coefOtNormal);
        const luong_lam_viec_ngay_nghi = Math.round(so_gio_lam_viec_thuong_ngay_nghi * hourlyRate * coefWeekend);
        const luong_tang_ca_ngay_nghi = Math.round(so_gio_tang_ca_ngay_nghi * hourlyRate * coefOtWeekend);

        const luongTheoCong = luong_lam_viec_ngay_thuong + luong_tang_ca_ngay_thuong + luong_lam_viec_ngay_nghi + luong_tang_ca_ngay_nghi;

        let tongPhuCap = 0;
        const chiTietPhuCap = (hopDong?.chi_tiet_phu_cap as any[]) || [];
        chiTietPhuCap.forEach(pc => {
            if (pc.ten !== "Chuyên cần") {
                tongPhuCap += Number(pc.soTien || 0);
            }
        });

        const hoaHong = dsPhieuThuong.filter(p => p.loai_thuong === "Tiền hoa hồng").reduce((acc, p) => acc + Number(p.so_tien), 0);
        const thuongChuyenCan = dsPhieuThuong.filter(p => p.loai_thuong === "Chuyên cần").reduce((acc, p) => acc + Number(p.so_tien), 0);
        const dsThuongNong = dsPhieuThuong.filter(p => p.loai_thuong === "Thưởng nóng");
        const thuongNong = dsThuongNong.reduce((acc, p) => acc + Number(p.so_tien), 0);
        const noiDungThuong = dsThuongNong.map(p => p.noi_dung).filter(Boolean).join(", ");
        const chiTietThuongNong = dsThuongNong.map(p => ({ noi_dung: p.noi_dung || 'Thưởng nóng', so_tien: Number(p.so_tien) }));
        const tong_thuong = hoaHong + thuongChuyenCan + thuongNong;

        const thucLinh = luongTheoCong + tongPhuCap + tong_thuong;

        results.push({
            ma_id: gv.ma_giao_vien,
            ma_chuc_vu: gv.ma_chuc_vu,
            loai: 'GV',
            ho_ten: gv.ho_ten,
            chuc_vu: gv.chuc_vu.ten_chuc_vu,
            ten_phong_ban: gv.phong_ban.ten_phong_ban,
            chi_tiet_cham_cong: phieuCC?.chi_tiet_cham_cong || [],
            phan_cong_giang_day: gv.phan_cong_giang_day || [],
            luong_co_ban: luongCoBan,
            so_ngay_cong: Math.round((tong_so_gio_lam_viec / 8) * 10) / 10,
            luong_theo_cong: Math.round(luongTheoCong),
            phu_cap: tongPhuCap,
            hoa_hong: hoaHong,
            thuong_chuyen_can: thuongChuyenCan,
            thuong_nong: thuongNong,
            noi_dung_thuong: noiDungThuong,
            chi_tiet_thuong_nong: chiTietThuongNong,
            tong_thuong: tong_thuong,
            bao_hiem: 0,
            thuc_linh: Math.round(thucLinh),
            ghi_chu: "",
            chi_tiet_phu_cap: chiTietPhuCap,

            // Chấp công chi tiết
            so_lan_di_muon,
            so_lan_ve_som,
            so_gio_lam_viec_thuong,
            so_gio_tang_ca_ngay_thuong,
            so_gio_lam_viec_thuong_ngay_nghi,
            so_gio_tang_ca_ngay_nghi,
            tong_so_gio_lam_viec,

            // Cấu phần lương chi tiết
            luong_lam_viec_ngay_thuong,
            luong_tang_ca_ngay_thuong,
            luong_lam_viec_ngay_nghi,
            luong_tang_ca_ngay_nghi,

            // 31 ngày
            ...getDaysData(phieuCC)
        });
    }

    return results;
}
