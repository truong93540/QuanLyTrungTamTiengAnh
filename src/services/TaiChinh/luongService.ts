import { prisma } from '@/lib/prisma'
import { calculateDayMetrics } from '@/services/TaiChinh/chamCongService'

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
    chi_tiet_thuong?: { loai_thuong?: string; noi_dung?: string; so_tien: number }[];
    chi_tiet_thuong_nong?: { noi_dung: string; so_tien: number }[];
    tong_thuong: number;
    bao_hiem: number;
    tien_phat: number;
    thuc_linh: number;
    ghi_chu: string;
    chi_tiet_phu_cap: any[];
    hop_dong?: any;

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
    coefOtWeekend: number = 2.5,
    phatMoiLan: number = 50000,
    bhxhPhanTram: number = 10.5,
    bhxhNgayToiThieu: number = 14
) => {
    const kyChamCong = `T${String(month).padStart(2, '0')}-${year}`;
    const kiThuong = `${month}/${year}`;

    const getWorkingDaysInMonth = (m: number, y: number) => {
        const daysInMonth = new Date(y, m, 0).getDate();
        let workingDays = 0;
        for (let i = 1; i <= daysInMonth; i++) {
            const dayOfWeek = new Date(y, m - 1, i).getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) workingDays++; // Bỏ Thứ 7 và Chủ Nhật
        }
        return workingDays;
    };
    const standardDays = getWorkingDaysInMonth(month, year);

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
                where: {
                    OR: [
                        { tg_het_hop_dong: null },
                        { tg_het_hop_dong: { gte: new Date(year, month - 1, 1) } }
                    ]
                },
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
                where: {
                    OR: [
                        { tg_het_hop_dong: null },
                        { tg_het_hop_dong: { gte: new Date(year, month - 1, 1) } }
                    ]
                },
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
        // Dynamic recalculation of hours on the fly to support Saturday/Sunday and precise office hours instantly
        let so_gio_lam_viec_thuong = 0;
        let so_gio_tang_ca_ngay_thuong = 0;
        let so_gio_lam_viec_thuong_ngay_nghi = 0;
        let so_gio_tang_ca_ngay_nghi = 0;
        let tong_so_gio_lam_viec = 0;

        if (phieuCC && phieuCC.chi_tiet_cham_cong && phieuCC.chi_tiet_cham_cong.length > 0) {
            phieuCC.chi_tiet_cham_cong.forEach((ct: any) => {
                const dayData = {
                    ma_id: String(ns.ma_nhan_su),
                    loai: 'NS' as const,
                    ngay: ct.ngay,
                    intervals: [],
                    gio_vao_1: ct.gio_vao_1, gio_ra_1: ct.gio_ra_1,
                    gio_vao_2: ct.gio_vao_2, gio_ra_2: ct.gio_ra_2,
                    gio_vao_3: ct.gio_vao_3, gio_ra_3: ct.gio_ra_3,
                    gio_vao_4: ct.gio_vao_4, gio_ra_4: ct.gio_ra_4,
                    gio_vao_5: ct.gio_vao_5, gio_ra_5: ct.gio_ra_5,
                    gio_vao_6: ct.gio_vao_6, gio_ra_6: ct.gio_ra_6,
                };
                const metrics = calculateDayMetrics(dayData, []);
                const dateObj = new Date(ct.ngay);
                const isW = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                if (isW) {
                    so_gio_lam_viec_thuong_ngay_nghi += metrics.gio_lam_thuong;
                    so_gio_tang_ca_ngay_nghi += metrics.gio_tang_ca;
                } else {
                    so_gio_lam_viec_thuong += metrics.gio_lam_thuong;
                    so_gio_tang_ca_ngay_thuong += metrics.gio_tang_ca;
                }
                tong_so_gio_lam_viec += (metrics.gio_lam_thuong + metrics.gio_tang_ca);
            });
        } else {
            so_gio_lam_viec_thuong = phieuCC?.so_gio_lam_viec_thuong || 0;
            so_gio_tang_ca_ngay_thuong = phieuCC?.so_gio_tang_ca_ngay_thuong || 0;
            so_gio_lam_viec_thuong_ngay_nghi = phieuCC?.so_gio_lam_viec_thuong_ngay_nghi || 0;
            so_gio_tang_ca_ngay_nghi = phieuCC?.so_gio_tang_ca_ngay_nghi || 0;
            tong_so_gio_lam_viec = phieuCC?.tong_so_gio_lam_viec || 0;
        }

        // Ngày công của nhân viên = (giờ thường + giờ thường ngày nghỉ) / 8
        const soNgayCong = (so_gio_lam_viec_thuong + so_gio_lam_viec_thuong_ngay_nghi) / 8;
        
        // Đơn giá giờ làm việc chuẩn = lương cơ bản / standardDays / 8
        const hourlyRate = luongCoBan / standardDays / 8;

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

        // Bảo hiểm: Số ngày công đi làm thực tế phải >= bhxhNgayToiThieu (Mặc định 14 ngày công) thì mới đóng bảo hiểm.
        const baoHiem = (hopDong?.dong_bao_hiem && soNgayCong >= bhxhNgayToiThieu) ? (luongCoBan * (bhxhPhanTram / 100)) : 0;
        const so_tien_phat = (so_lan_di_muon + so_lan_ve_som) * phatMoiLan;

        const thucLinh = Math.max(0, luongTheoCong + tongPhuCap + tong_thuong - baoHiem - so_tien_phat);

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
            chi_tiet_thuong: dsPhieuThuong.map(p => ({ loai_thuong: p.loai_thuong, noi_dung: p.noi_dung || '', so_tien: Number(p.so_tien) })),
            tong_thuong: tong_thuong,
            bao_hiem: Math.round(baoHiem),
            tien_phat: Math.round(so_tien_phat),
            thuc_linh: Math.round(thucLinh),
            ghi_chu: "",
            chi_tiet_phu_cap: chiTietPhuCap,
            hop_dong: hopDong,

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

        // Giáo viên: lương cơ bản là đơn giá theo giờ dạy (VD: 100.000đ/giờ)
        // Không tính theo ngày công chuẩn như nhân sự
        const hourlyRate = luongCoBan; // đơn giá 1 giờ dạy

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

        const so_tien_phat = (so_lan_di_muon + so_lan_ve_som) * phatMoiLan;
        const baoHiem = hopDong?.dong_bao_hiem ? (luongTheoCong * (bhxhPhanTram / 100)) : 0;
        const thucLinh = Math.max(0, luongTheoCong + tongPhuCap + tong_thuong - baoHiem - so_tien_phat);

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
            chi_tiet_thuong: dsPhieuThuong.map(p => ({ loai_thuong: p.loai_thuong, noi_dung: p.noi_dung || '', so_tien: Number(p.so_tien) })),
            tong_thuong: tong_thuong,
            bao_hiem: Math.round(baoHiem),
            tien_phat: Math.round(so_tien_phat),
            thuc_linh: Math.round(thucLinh),
            ghi_chu: "",
            chi_tiet_phu_cap: chiTietPhuCap,
            hop_dong: hopDong,

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
