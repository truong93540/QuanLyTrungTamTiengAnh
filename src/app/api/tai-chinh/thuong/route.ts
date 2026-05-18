import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
    const ngayLeText = searchParams.get("ngayLeText") || "";

    try {
        // 1. Lấy tất cả nhân sự và dữ liệu liên quan (Hợp đồng, Phiếu chấm công, Phiếu thu)
        const kyCongChuan = `T${String(month).padStart(2, '0')}-${year}`;
        const kyCongPhu = `T${month}-${year}`;

        const nhanSuList = await prisma.nhanSu.findMany({
            include: {
                chuc_vu: true,
                phong_ban: true,
                hop_dong: {
                    where: { tg_het_hop_dong: { gte: new Date(year, month - 1, 1) } },
                    orderBy: { ma_hop_dong: 'desc' },
                    take: 1
                },
                phieu_cham_cong: {
                    where: {
                        bang_cham_cong: {
                            ky_cham_cong: {
                                in: [kyCongChuan, kyCongPhu]
                            }
                        }
                    },
                    take: 1
                }
            }
        });

        const giaoVienList = await prisma.giaoVien.findMany({
            include: {
                chuc_vu: true,
                phong_ban: true
            }
        });

        // 2. Lấy tất cả phiếu thu của tháng (để tính hoa hồng)
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);

        // 2. Lấy dữ liệu BangThuong và PhieuThuong đã có (để lấy thưởng nóng)
        const kiThuong = `${month}/${year}`;
        const existingBangThuong = await prisma.bangThuong.findFirst({
            where: { ki_thuong: kiThuong },
            include: {
                phieu_thuong: {
                    where: {
                        NOT: {
                            loai_thuong: { in: ["Tiền hoa hồng", "Chuyên cần"] }
                        }
                    }
                }
            }
        });

        // 3. Lấy tất cả phiếu thu của tháng (để tính hoa hồng)
        const phieuThuList = await prisma.phieuThu.findMany({
            where: {
                ngay_thu: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });



        const getWorkingDaysInMonth = (m: number, y: number) => {
            const daysInMonth = new Date(y, m, 0).getDate();
            let workingDays = 0;
            for (let i = 1; i <= daysInMonth; i++) {
                if (new Date(y, m - 1, i).getDay() !== 0) workingDays++;
            }
            return workingDays;
        };
        const standardWorkingDays = getWorkingDaysInMonth(month, year);
        
        // Tính số ngày lễ hợp lệ (chỉ đếm các ngày thuộc tháng hiện tại và không phải Chủ Nhật)
        let countNgayLeHieuLuc = 0;
        if (ngayLeText.trim()) {
            const parsedNgayLe = ngayLeText.split(",").map(d => d.trim()).filter(d => d.length > 0);
            parsedNgayLe.forEach(dateStr => {
                let d = NaN, m = NaN;
                if (dateStr.includes("/")) {
                    const parts = dateStr.split("/").map(Number);
                    d = parts[0];
                    m = parts[1];
                } else {
                    d = Number(dateStr);
                    m = month; // Nếu chỉ nhập ngày, mặc định là tháng đang chọn
                }
                
                if (!isNaN(d) && !isNaN(m) && m === month) {
                    const daysInMonth = new Date(year, month, 0).getDate();
                    if (d >= 1 && d <= daysInMonth) {
                        const dateObj = new Date(year, m - 1, d);
                        // Chỉ trừ đi ngày công nếu ngày lễ rơi vào ngày làm việc bình thường (khác Chủ Nhật)
                        if (dateObj.getDay() !== 0) {
                            countNgayLeHieuLuc++;
                        }
                    }
                }
            });
        }
        const requiredWorkingDays = Math.max(0, standardWorkingDays - countNgayLeHieuLuc);

        // 4. Tổng hợp dữ liệu
        const results = nhanSuList.map(ns => {
            const hopDong = ns.hop_dong[0];
            const pcc = ns.phieu_cham_cong[0];
            
            // Tính hoa hồng
            const phieuThuCuaNS = phieuThuList.filter(pt => pt.ma_nhan_su === ns.ma_nhan_su);
            const tongTienThu = phieuThuCuaNS.reduce((acc, pt) => acc + Number(pt.so_tien), 0);
            const phanTramHoaHong = hopDong?.phan_tram_hoa_hong || 0;
            const tienHoaHong = (tongTienThu * phanTramHoaHong) / 100;

            // Lấy tiền chuyên cần từ hợp đồng
            let tienChuyenCanHieuLuc = 0;
            const phuCap = hopDong?.chi_tiet_phu_cap as any[];
            if (Array.isArray(phuCap)) {
                const item = phuCap.find(p => p.ten === "Chuyên cần");
                if (item) tienChuyenCanHieuLuc = Number(item.soTien);
            }

            // Xét điều kiện chuyên cần: Có dữ liệu công, làm đủ ngày công chuẩn, không đi muộn
            const diMuon = pcc?.so_lan_di_muon || 0;
            const veSom = pcc?.so_lan_ve_som || 0;
            const soNgayCongThuong = (pcc?.so_gio_lam_viec_thuong || 0) / 8;
            const isChuyenCan = pcc && (soNgayCongThuong >= requiredWorkingDays) && diMuon === 0;
            const thuongChuyenCan = isChuyenCan ? tienChuyenCanHieuLuc : 0;

            // Tính thưởng nóng (lấy từ dữ liệu đã lưu)
            const dsThuongNong = existingBangThuong?.phieu_thuong.filter(p => p.ma_nhan_su === ns.ma_nhan_su) || [];
            const tongThuongNong = dsThuongNong.reduce((acc, p) => acc + Number(p.so_tien), 0);

            return {
                ma_nhan_su: ns.ma_nhan_su,
                ho_ten: ns.ho_ten,
                ma_chuc_vu: ns.ma_chuc_vu,
                chuc_vu: ns.chuc_vu.ten_chuc_vu,
                ten_phong_ban: ns.phong_ban.ten_phong_ban,
                tong_doanh_so: tongTienThu,
                phan_tram: phanTramHoaHong,
                tien_hoa_hong: tienHoaHong,
                tien_chuyen_can: tienChuyenCanHieuLuc,
                duoc_thuong_chuyen_can: isChuyenCan,
                thuong_chuyen_can: thuongChuyenCan,
                thuong_nong: tongThuongNong,
                chi_tiet_thuong_nong: dsThuongNong.map(p => ({
                    ma_phieu_thuong: p.ma_phieu_thuong,
                    so_tien: Number(p.so_tien),
                    noi_dung: p.noi_dung
                })),
                tong_thuong: tienHoaHong + thuongChuyenCan + tongThuongNong,
                chi_tiet_cong: {
                    has_data: !!pcc,
                    di_muon: diMuon,
                    ve_som: veSom,
                    so_ngay_cong: soNgayCongThuong,
                    required_days: requiredWorkingDays
                }
            };
        });

        // 5. Tổng hợp dữ liệu Giáo viên (chỉ tính thưởng nóng)
        const gvResults = giaoVienList.map(gv => {
            const dsThuongNong = existingBangThuong?.phieu_thuong.filter(p => p.ma_giao_vien === gv.ma_giao_vien) || [];
            const tongThuongNong = dsThuongNong.reduce((acc, p) => acc + Number(p.so_tien), 0);

            return {
                ma_nhan_su: gv.ma_giao_vien, // Dùng chung field ID để frontend dễ xử lý
                isTeacher: true,
                ho_ten: gv.ho_ten,
                ma_chuc_vu: gv.ma_chuc_vu,
                chuc_vu: gv.chuc_vu.ten_chuc_vu,
                ten_phong_ban: gv.phong_ban.ten_phong_ban,
                tong_doanh_so: 0,
                phan_tram: 0,
                tien_hoa_hong: 0,
                tien_chuyen_can: 0,
                duoc_thuong_chuyen_can: false,
                thuong_chuyen_can: 0,
                thuong_nong: tongThuongNong,
                chi_tiet_thuong_nong: dsThuongNong.map(p => ({
                    ma_phieu_thuong: p.ma_phieu_thuong,
                    so_tien: Number(p.so_tien),
                    noi_dung: p.noi_dung
                })),
                tong_thuong: tongThuongNong,
                chi_tiet_cong: {
                    has_data: false,
                    di_muon: 0,
                    ve_som: 0,
                    so_ngay_cong: 0,
                    required_days: 0
                }
            };
        });

        // Kiểm tra xem bảng thưởng đã được chốt (lưu) chưa
        const checkSaved = await prisma.phieuThuong.findFirst({
            where: {
                bang_thuong: { ki_thuong: kiThuong },
                loai_thuong: { in: ["Tiền hoa hồng", "Chuyên cần"] }
            }
        });
        const isSaved = !!checkSaved;

        return NextResponse.json({
            results: [...results, ...gvResults],
            isSaved
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { month, year, data, isThuongNong, ma_nhan_su, so_tien, noi_dung } = body;

        // Trường hợp 1: Lưu phiếu thưởng nóng đơn lẻ
        if (isThuongNong) {
            const kiThuong = `${month}/${year}`;
            const result = await prisma.$transaction(async (tx) => {
                let bangThuong = await tx.bangThuong.findFirst({ where: { ki_thuong: kiThuong } });
                if (!bangThuong) {
                    bangThuong = await tx.bangThuong.create({ data: { ki_thuong: kiThuong, so_tien_thuong: 0 } });
                }

                const isTeacher = ma_nhan_su.startsWith('GV_');
                const realId = isTeacher ? parseInt(ma_nhan_su.replace('GV_', '')) : parseInt(ma_nhan_su);

                const phieu = await tx.phieuThuong.create({
                    data: {
                        ma_nhan_su: isTeacher ? null : realId,
                        ma_giao_vien: isTeacher ? realId : null,
                        ma_bang_thuong: bangThuong.ma_bang_thuong,
                        loai_thuong: "Thưởng nóng",
                        so_tien: parseFloat(so_tien),
                        noi_dung: noi_dung
                    }
                });

                // Cập nhật lại tổng tiền bảng thưởng
                const allPhieu = await tx.phieuThuong.findMany({ where: { ma_bang_thuong: bangThuong.ma_bang_thuong } });
                const total = allPhieu.reduce((acc, p) => acc + Number(p.so_tien), 0);
                await tx.bangThuong.update({
                    where: { ma_bang_thuong: bangThuong.ma_bang_thuong },
                    data: { so_tien_thuong: total }
                });

                return phieu;
            });
            return NextResponse.json({ success: true, phieu: result });
        }

        // Trường hợp 2: Lưu toàn bộ bảng thưởng (giữ nguyên logic cũ nhưng không xóa thưởng nóng)
        if (!month || !year || !data || !Array.isArray(data)) {
            return NextResponse.json({ error: "Thiếu dữ liệu để lưu" }, { status: 400 });
        }

        const kiThuong = `${month}/${year}`;

        // Sử dụng transaction để đảm bảo tính nhất quán
        const result = await prisma.$transaction(async (tx) => {
            // 1. Tìm hoặc tạo BangThuong cho kỳ này
            let bangThuong = await tx.bangThuong.findFirst({
                where: { ki_thuong: kiThuong }
            });

            if (bangThuong) {
                // CHỈ XÓA các phiếu tự động (Hoa hồng, Chuyên cần) để ghi đè, GIỮ LẠI Thưởng nóng
                await tx.phieuThuong.deleteMany({
                    where: { 
                        ma_bang_thuong: bangThuong.ma_bang_thuong,
                        loai_thuong: { in: ["Tiền hoa hồng", "Chuyên cần"] }
                    }
                });
            } else {
                bangThuong = await tx.bangThuong.create({
                    data: {
                        ki_thuong: kiThuong,
                        so_tien_thuong: data.reduce((acc, curr) => acc + curr.tong_thuong, 0)
                    }
                });
            }

            // 2. Tạo các phiếu thưởng mới
            const phieuThuongData: any[] = [];

            for (const item of data) {
                // Thưởng hoa hồng
                if (item.tien_hoa_hong > 0) {
                    phieuThuongData.push({
                        ma_nhan_su: item.ma_nhan_su,
                        ma_bang_thuong: bangThuong!.ma_bang_thuong,
                        loai_thuong: "Tiền hoa hồng",
                        so_tien: item.tien_hoa_hong,
                        noi_dung: `Hoa hồng doanh số tháng ${kiThuong}`
                    });
                }

                // Thưởng chuyên cần
                if (item.duoc_thuong_chuyen_can && item.tien_chuyen_can > 0) {
                    phieuThuongData.push({
                        ma_nhan_su: item.ma_nhan_su,
                        ma_bang_thuong: bangThuong!.ma_bang_thuong,
                        loai_thuong: "Chuyên cần",
                        so_tien: item.tien_chuyen_can,
                        noi_dung: `Thưởng chuyên cần tháng ${kiThuong}`
                    });
                }
            }

            if (phieuThuongData.length > 0) {
                await tx.phieuThuong.createMany({
                    data: phieuThuongData
                });
            }

            // Cập nhật lại tổng tiền của bảng thưởng bao gồm cả thưởng nóng
            const allPhieuCurrent = await tx.phieuThuong.findMany({ where: { ma_bang_thuong: bangThuong!.ma_bang_thuong } });
            const finalTotal = allPhieuCurrent.reduce((acc, p) => acc + Number(p.so_tien), 0);
            
            await tx.bangThuong.update({
                where: { ma_bang_thuong: bangThuong!.ma_bang_thuong },
                data: {
                    so_tien_thuong: finalTotal
                }
            });

            return bangThuong;
        });

        return NextResponse.json({ success: true, bangThuong: result });
    } catch (error: any) {
        console.error("Lỗi lưu thưởng:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
