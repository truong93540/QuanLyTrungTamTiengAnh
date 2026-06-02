import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { calculatePayrollForMonth } from "@/services/TaiChinh/luongService";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
    const coefNormal = parseFloat(searchParams.get("coefNormal") || "1.0");
    const coefOtNormal = parseFloat(searchParams.get("coefOtNormal") || "1.5");
    const coefWeekend = parseFloat(searchParams.get("coefWeekend") || "2.0");
    const coefOtWeekend = parseFloat(searchParams.get("coefOtWeekend") || "2.5");
    const phatMoiLan = parseInt(searchParams.get("phatMoiLan") || "50000");
    const bhxhPhanTram = parseFloat(searchParams.get("bhxhPhanTram") || "10.5");
    const bhxhNgayToiThieu = parseInt(searchParams.get("bhxhNgayToiThieu") || "14");

    try {
        const kyLuong = `${month}/${year}`;
        
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
        
        // 1. Kiểm tra xem đã có bảng lương chốt chưa
        const existingBangLuong = await prisma.bangLuong.findFirst({
            where: { ky_luong: kyLuong },
            include: {
                phieu_chi: true,
                phieu_luong: {
                    include: {
                        nhan_su: {
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
                        },
                        giao_vien: {
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
                        },
                        phieu_cham_cong: {
                            include: {
                                chi_tiet_cham_cong: true
                            }
                        }
                    }
                }
            }
        });

        const existingBangThuong = await prisma.bangThuong.findFirst({
            where: { ki_thuong: kyLuong },
            include: { phieu_thuong: true }
        });

        if (existingBangLuong) {
            if (existingBangLuong.phieu_luong.length === 0) {
                // Tự động xóa bản ghi bảng lương rỗng để dọn dẹp
                await prisma.bangLuong.delete({
                    where: { ma_bang_luong: existingBangLuong.ma_bang_luong }
                });
            } else {
                // Map dữ liệu từ DB sang định dạng của frontend
                const results = existingBangLuong.phieu_luong.map(pl => {
                    const phieuCC = pl.phieu_cham_cong;
                    const luongCoBan = Number(pl.luong_co_ban);
                    
                    // Chi tiết chấm công
                    const so_lan_di_muon = phieuCC?.so_lan_di_muon || 0;
                    const so_lan_ve_som = phieuCC?.so_lan_ve_som || 0;
                    const so_gio_lam_viec_thuong = phieuCC?.so_gio_lam_viec_thuong || 0;
                    const so_gio_tang_ca_ngay_thuong = phieuCC?.so_gio_tang_ca_ngay_thuong || 0;
                    const so_gio_lam_viec_thuong_ngay_nghi = phieuCC?.so_gio_lam_viec_thuong_ngay_nghi || 0;
                    const so_gio_tang_ca_ngay_nghi = phieuCC?.so_gio_tang_ca_ngay_nghi || 0;
                    const tong_so_gio_lam_viec = phieuCC?.tong_so_gio_lam_viec || 0;

                    const isNS = !!pl.ma_nhan_su;
                    const soNgayCong = isNS ? ((so_gio_lam_viec_thuong + so_gio_lam_viec_thuong_ngay_nghi) / 8) : (tong_so_gio_lam_viec / 8);

                    // Nhân sự: đơn giá giờ = lương cơ bản / standardDays / 8
                    // Giáo viên: đơn giá giờ = lương cơ bản (VD: 100.000đ/giờ)
                    const hourlyRate = isNS ? (luongCoBan / standardDays / 8) : luongCoBan;

                    const luong_lam_viec_ngay_thuong = Math.round(so_gio_lam_viec_thuong * hourlyRate);
                    const luong_tang_ca_ngay_thuong = Math.round(so_gio_tang_ca_ngay_thuong * hourlyRate * 1.5);
                    const luong_lam_viec_ngay_nghi = Math.round(so_gio_lam_viec_thuong_ngay_nghi * hourlyRate * 2.0);
                    const luong_tang_ca_ngay_nghi = Math.round(so_gio_tang_ca_ngay_nghi * hourlyRate * 2.0);

                    const luongTheoCong = luong_lam_viec_ngay_thuong + luong_tang_ca_ngay_thuong + luong_lam_viec_ngay_nghi + luong_tang_ca_ngay_nghi;

                    const hoaHong = Number(pl.tien_hoa_hong || 0);
                    const tongThuong = Number(pl.tong_thuong || 0);
                    const phuCap = Number(pl.chi_tiet_phu_cap ? (pl.chi_tiet_phu_cap as any[])
                        .filter((pc: any) => pc.ten !== 'Chuyên cần')
                        .reduce((sum, pc) => sum + Number(pc.soTien || 0), 0) : 0);

                    const dsPhieuThuong = existingBangThuong?.phieu_thuong.filter(p => 
                        (isNS && p.ma_nhan_su === pl.ma_nhan_su) || 
                        (!isNS && p.ma_giao_vien === pl.ma_giao_vien)
                    ) || [];
                    
                    const thuong_chuyen_can_from_ds = dsPhieuThuong.filter(p => p.loai_thuong === "Chuyên cần").reduce((acc, p) => acc + Number(p.so_tien), 0);
                    const hoaHong_from_ds = dsPhieuThuong.filter(p => p.loai_thuong === "Tiền hoa hồng").reduce((acc, p) => acc + Number(p.so_tien), 0);
                    const dsThuongNong = dsPhieuThuong.filter(p => p.loai_thuong === "Thưởng nóng");
                    const thuong_nong_from_ds = dsThuongNong.reduce((acc, p) => acc + Number(p.so_tien), 0);

                    // Fallback: nếu không có phiếu thưởng chi tiết, reconstruct từ các field đã lưu
                    const thuong_chuyen_can = dsPhieuThuong.length > 0
                        ? thuong_chuyen_can_from_ds
                        : Math.max(0, tongThuong - hoaHong); // chuyên cần = tổng thưởng - hoa hồng (khi không có phiếu chi tiết)
                    const thuong_nong = dsPhieuThuong.length > 0
                        ? thuong_nong_from_ds
                        : 0;
                    const noi_dung_thuong = dsThuongNong.map(p => p.noi_dung).filter(Boolean).join(", ");
                    const chi_tiet_thuong_nong = dsThuongNong.map(p => ({ noi_dung: p.noi_dung || 'Thưởng nóng', so_tien: Number(p.so_tien) }));

                    // Build chi_tiet_thuong với fallback khi dsPhieuThuong rỗng
                    const chi_tiet_thuong_base = dsPhieuThuong.length > 0
                        ? dsPhieuThuong.map(p => ({ loai_thuong: p.loai_thuong, noi_dung: p.noi_dung || '', so_tien: Number(p.so_tien) }))
                        : [
                            ...(hoaHong > 0 ? [{ loai_thuong: 'Tiền hoa hồng', noi_dung: '', so_tien: hoaHong }] : []),
                            ...(thuong_chuyen_can > 0 ? [{ loai_thuong: 'Chuyên cần', noi_dung: '', so_tien: thuong_chuyen_can }] : []),
                          ];

                    return {
                        ma_id: pl.ma_nhan_su || pl.ma_giao_vien,
                        ma_chuc_vu: pl.nhan_su?.ma_chuc_vu || pl.giao_vien?.ma_chuc_vu || 0,
                        loai: isNS ? 'NS' : 'GV',
                        ho_ten: pl.nhan_su?.ho_ten || pl.giao_vien?.ho_ten || 'N/A',
                        chuc_vu: pl.nhan_su?.chuc_vu.ten_chuc_vu || pl.giao_vien?.chuc_vu.ten_chuc_vu || 'N/A',
                        ten_phong_ban: pl.nhan_su?.phong_ban.ten_phong_ban || pl.giao_vien?.phong_ban.ten_phong_ban || 'N/A',
                        chi_tiet_cham_cong: phieuCC?.chi_tiet_cham_cong || [],
                        phan_cong_giang_day: pl.giao_vien?.phan_cong_giang_day || [],
                        luong_co_ban: luongCoBan,
                        so_ngay_cong: Math.round(soNgayCong * 10) / 10,
                        luong_theo_cong: luongTheoCong,
                        phu_cap: phuCap,
                        hoa_hong: hoaHong,
                        thuong_chuyen_can: thuong_chuyen_can,
                        thuong_nong: thuong_nong,
                        noi_dung_thuong: noi_dung_thuong,
                        chi_tiet_thuong_nong: chi_tiet_thuong_nong,
                        chi_tiet_thuong: chi_tiet_thuong_base,
                        tong_thuong: tongThuong,
                        bao_hiem: Number(pl.bao_hiem_xa_hoi),
                        tien_phat: Number((pl as any).tien_phat || 0),
                        thuc_linh: Number(pl.thuc_linh),
                        ghi_chu: pl.ghi_chu || "",
                        chi_tiet_phu_cap: pl.chi_tiet_phu_cap || [],
                        hop_dong: pl.nhan_su?.hop_dong?.[0] || pl.giao_vien?.hop_dong?.[0],
                        isLocked: true,

                        // Chi tiết chấm công
                        so_lan_di_muon,
                        so_lan_ve_som,
                        so_gio_lam_viec_thuong,
                        so_gio_tang_ca_ngay_thuong,
                        so_gio_lam_viec_thuong_ngay_nghi,
                        so_gio_tang_ca_ngay_nghi,
                        tong_so_gio_lam_viec,

                        // Chi tiết cấu phần lương
                        luong_lam_viec_ngay_thuong,
                        luong_tang_ca_ngay_thuong,
                        luong_lam_viec_ngay_nghi,
                        luong_tang_ca_ngay_nghi,

                        // Dữ liệu 31 ngày
                        ngay_1: phieuCC?.ngay_1 || 0, ngay_2: phieuCC?.ngay_2 || 0, ngay_3: phieuCC?.ngay_3 || 0, ngay_4: phieuCC?.ngay_4 || 0, ngay_5: phieuCC?.ngay_5 || 0,
                        ngay_6: phieuCC?.ngay_6 || 0, ngay_7: phieuCC?.ngay_7 || 0, ngay_8: phieuCC?.ngay_8 || 0, ngay_9: phieuCC?.ngay_9 || 0, ngay_10: phieuCC?.ngay_10 || 0,
                        ngay_11: phieuCC?.ngay_11 || 0, ngay_12: phieuCC?.ngay_12 || 0, ngay_13: phieuCC?.ngay_13 || 0, ngay_14: phieuCC?.ngay_14 || 0, ngay_15: phieuCC?.ngay_15 || 0,
                        ngay_16: phieuCC?.ngay_16 || 0, ngay_17: phieuCC?.ngay_17 || 0, ngay_18: phieuCC?.ngay_18 || 0, ngay_19: phieuCC?.ngay_19 || 0, ngay_20: phieuCC?.ngay_20 || 0,
                        ngay_21: phieuCC?.ngay_21 || 0, ngay_22: phieuCC?.ngay_22 || 0, ngay_23: phieuCC?.ngay_23 || 0, ngay_24: phieuCC?.ngay_24 || 0, ngay_25: phieuCC?.ngay_25 || 0,
                        ngay_26: phieuCC?.ngay_26 || 0, ngay_27: phieuCC?.ngay_27 || 0, ngay_28: phieuCC?.ngay_28 || 0, ngay_29: phieuCC?.ngay_29 || 0, ngay_30: phieuCC?.ngay_30 || 0,
                        ngay_31: phieuCC?.ngay_31 || 0
                    };
                });
                return NextResponse.json({ 
                    results, 
                    isLocked: true, 
                    hasPhieuChi: !!existingBangLuong.phieu_chi && existingBangLuong.phieu_chi.trang_thai !== 'Đã hủy', 
                    maPhieuChi: existingBangLuong.phieu_chi?.ma_phieu_chi 
                }, {
                    headers: {
                        'Cache-Control': 'no-store, max-age=0, must-revalidate'
                    }
                });
            }
        }

        // 2. Nếu chưa có, tính toán bản xem trước
        const previewResults = await calculatePayrollForMonth(month, year, coefNormal, coefOtNormal, coefWeekend, coefOtWeekend, phatMoiLan, bhxhPhanTram, bhxhNgayToiThieu);
        return NextResponse.json({ results: previewResults, isLocked: false }, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate'
            }
        });

    } catch (error: any) {
        console.error("Lỗi lấy bảng lương:", error);
        return NextResponse.json(
            { error: error.message },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, max-age=0, must-revalidate'
                }
            }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { month, year, data } = body;

        if (!month || !year || !data || !Array.isArray(data)) {
            return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
        }

        const kyLuong = `${month}/${year}`;

        const result = await prisma.$transaction(async (tx) => {
            // 1. Tạo hoặc cập nhật BangLuong
            let bangLuong = await tx.bangLuong.findFirst({ where: { ky_luong: kyLuong } });
            
            if (bangLuong) {
                // Xóa các phiếu lương cũ để chốt lại
                await tx.phieuLuong.deleteMany({ where: { ma_bang_luong: bangLuong.ma_bang_luong } });
            } else {
                bangLuong = await tx.bangLuong.create({
                    data: {
                        ky_luong: kyLuong,
                        tong_so_tien: 0
                    }
                });
            }

            // 2. Tạo các PhieuLuong
            const phieuLuongData = [];
            let tongBangLuong = 0;

            for (const item of data) {
                // Tìm phiếu chấm công tương ứng để liên kết
                const kyChamCong = `T${String(month).padStart(2, '0')}-${year}`;
                const phieuCC = await tx.phieuChamCong.findFirst({
                    where: {
                        ma_nhan_su: item.loai === 'NS' ? item.ma_id : null,
                        ma_giao_vien: item.loai === 'GV' ? item.ma_id : null,
                        bang_cham_cong: { ky_cham_cong: kyChamCong }
                    }
                });

                if (!phieuCC) continue;

                phieuLuongData.push({
                    ma_bang_luong: bangLuong!.ma_bang_luong,
                    ma_nhan_su: item.loai === 'NS' ? item.ma_id : null,
                    ma_giao_vien: item.loai === 'GV' ? item.ma_id : null,
                    ma_phieu_cham_cong: phieuCC.ma_phieu_cham_cong,
                    luong_co_ban: item.luong_co_ban,
                    tien_hoa_hong: item.hoa_hong,
                    chi_tiet_phu_cap: item.chi_tiet_phu_cap,
                    tong_thuong: item.tong_thuong,
                    bao_hiem_xa_hoi: item.bao_hiem,
                    tien_phat: item.tien_phat || 0,
                    thuc_linh: item.thuc_linh,
                    trang_thai: "Đã chốt"
                });
                tongBangLuong += item.thuc_linh;
            }

            if (phieuLuongData.length === 0) {
                throw new Error("Không có nhân sự nào có phiếu chấm công hợp lệ trong tháng này. Vui lòng tạo bảng chấm công trước khi chốt bảng lương.");
            }

            await tx.phieuLuong.createMany({ data: phieuLuongData });

            const createdPhieuLuongs = await tx.phieuLuong.findMany({
                where: { ma_bang_luong: bangLuong!.ma_bang_luong },
                select: { ma_phieu_luong: true, ma_nhan_su: true, ma_giao_vien: true }
            });

            const existingBangThuong = await tx.bangThuong.findFirst({
                where: { ki_thuong: kyLuong },
                select: { ma_bang_thuong: true }
            });

            if (existingBangThuong) {
                for (const pl of createdPhieuLuongs) {
                    if (pl.ma_nhan_su) {
                        await tx.phieuThuong.updateMany({
                            where: {
                                ma_bang_thuong: existingBangThuong.ma_bang_thuong,
                                ma_nhan_su: pl.ma_nhan_su,
                                ma_phieu_luong: null
                            },
                            data: {
                                ma_phieu_luong: pl.ma_phieu_luong
                            }
                        });
                    }

                    if (pl.ma_giao_vien) {
                        await tx.phieuThuong.updateMany({
                            where: {
                                ma_bang_thuong: existingBangThuong.ma_bang_thuong,
                                ma_giao_vien: pl.ma_giao_vien,
                                ma_phieu_luong: null
                            },
                            data: {
                                ma_phieu_luong: pl.ma_phieu_luong
                            }
                        });
                    }
                }
            }

            // 3. Cập nhật tổng tiền bảng lương
            await tx.bangLuong.update({
                where: { ma_bang_luong: bangLuong!.ma_bang_luong },
                data: { tong_so_tien: tongBangLuong }
            });

            // Tự động tìm và tái liên kết phiếu chi cũ bị mồ côi (nếu có)
            const orphanedPhieuChi = await tx.phieuChi.findFirst({
                where: {
                    loai_phieu_chi: 'LUONG',
                    ma_bang_luong: null,
                    noi_dung: {
                        contains: `tháng ${kyLuong}`
                    }
                }
            });

            if (orphanedPhieuChi) {
                await tx.phieuChi.update({
                    where: { ma_phieu_chi: orphanedPhieuChi.ma_phieu_chi },
                    data: {
                        ma_bang_luong: bangLuong!.ma_bang_luong,
                        tong_tien: tongBangLuong
                    }
                });
            }

            return bangLuong;
        });

        return NextResponse.json({ success: true, bangLuong: result });

    } catch (error: any) {
        console.error("Lỗi chốt lương:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const month = parseInt(searchParams.get("month") || "");
        const year = parseInt(searchParams.get("year") || "");

        if (!month || !year) {
            return NextResponse.json({ error: "Thiếu thông tin tháng/năm" }, { status: 400 });
        }

        const kyLuong = `${month}/${year}`;

        // Tìm BangLuong để xóa
        const bangLuong = await prisma.bangLuong.findFirst({
            where: { ky_luong: kyLuong }
        });

        if (!bangLuong) {
            return NextResponse.json({ error: "Không tìm thấy bảng lương đã chốt" }, { status: 404 });
        }

        await prisma.$transaction(async (tx) => {
            // 1. Phá hủy liên kết PhieuThuong với PhieuLuong nếu có
            await tx.phieuThuong.updateMany({
                where: {
                    phieu_luong: {
                        ma_bang_luong: bangLuong.ma_bang_luong
                    }
                },
                data: {
                    ma_phieu_luong: null
                }
            });

            // 2. Xóa các PhieuLuong thuộc BangLuong này
            await tx.phieuLuong.deleteMany({
                where: { ma_bang_luong: bangLuong.ma_bang_luong }
            });

            // 3. Xóa BangLuong
            await tx.bangLuong.delete({
                where: { ma_bang_luong: bangLuong.ma_bang_luong }
            });
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Lỗi mở chốt lương:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
