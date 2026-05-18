import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { month, data } = await request.json() 

        if (!month || !data || !Array.isArray(data)) {
            return NextResponse.json({ error: 'Dữ liệu gửi lên không hợp lệ' }, { status: 400 })
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Đảm bảo có Bảng chấm công cho tháng này
            let bang = await tx.bangChamCong.findFirst({ where: { ky_cham_cong: month } })
            if (!bang) {
                bang = await tx.bangChamCong.create({ 
                    data: { ky_cham_cong: month, trang_thai: 'Đang mở' } 
                })
            } else {
                // RESET TOÀN BỘ PHIẾU CHẤM CÔNG CỦA THÁNG VỀ 0 TRƯỚC ĐỂ XÓA RÁC VÀ PHÒNG TRỪ CÔNG CŨ
                await tx.phieuChamCong.updateMany({
                    where: { ma_bang_cham_cong: bang.ma_bang_cham_cong },
                    data: {
                        ngay_1: 0, ngay_2: 0, ngay_3: 0, ngay_4: 0, ngay_5: 0, ngay_6: 0, ngay_7: 0, ngay_8: 0, ngay_9: 0, ngay_10: 0,
                        ngay_11: 0, ngay_12: 0, ngay_13: 0, ngay_14: 0, ngay_15: 0, ngay_16: 0, ngay_17: 0, ngay_18: 0, ngay_19: 0, ngay_20: 0,
                        ngay_21: 0, ngay_22: 0, ngay_23: 0, ngay_24: 0, ngay_25: 0, ngay_26: 0, ngay_27: 0, ngay_28: 0, ngay_29: 0, ngay_30: 0, ngay_31: 0,
                        tong_so_gio_lam_viec: 0,
                        so_lan_di_muon: 0,
                        so_lan_ve_som: 0,
                        so_gio_lam_viec_thuong: 0,
                        so_gio_tang_ca_ngay_thuong: 0,
                        so_gio_lam_viec_thuong_ngay_nghi: 0,
                        so_gio_tang_ca_ngay_nghi: 0
                    }
                })
            }

            // 2. Xử lý từng nhân sự
            for (const item of data) {
                // KIỂM TRA TỒN TẠI TRƯỚC KHI TẠO (Tránh lỗi Foreign Key)
                const person = item.ma_nhan_su 
                    ? await tx.nhanSu.findUnique({ where: { ma_nhan_su: item.ma_nhan_su } })
                    : await tx.giaoVien.findUnique({ where: { ma_giao_vien: item.ma_giao_vien } })

                if (!person) {
                    console.log(`Skip Save: Không tìm thấy mã ${item.ma_nhan_su || item.ma_giao_vien}`)
                    continue
                }

                // KHỞI TẠO TẤT CẢ 31 NGÀY VỀ 0 đẻ đảm bảo những ngày trống trong file Excel vẫn được cập nhật về 0
                const ngayFields: Record<string, number> = {}
                for (let i = 1; i <= 31; i++) {
                    ngayFields[`ngay_${i}`] = 0
                }

                Object.entries(item).forEach(([key, val]) => {
                    if (key.startsWith('ngay_') && val !== undefined && val !== null) {
                        ngayFields[key] = Number(val)
                    }
                })

                // Tìm hoặc tạo Phiếu chấm công
                let phieu = await tx.phieuChamCong.findFirst({
                    where: { 
                        ma_bang_cham_cong: bang.ma_bang_cham_cong, 
                        ma_nhan_su: item.ma_nhan_su || null, 
                        ma_giao_vien: item.ma_giao_vien || null 
                    }
                })

                // Cập nhật hoặc tạo mới Phiếu chấm công
                if (phieu) {
                    phieu = await tx.phieuChamCong.update({
                        where: { ma_phieu_cham_cong: phieu.ma_phieu_cham_cong },
                        data: {
                            ...ngayFields,
                            so_lan_di_muon: item.so_lan_di_muon || 0,
                            so_lan_ve_som: item.so_lan_ve_som || 0,
                            so_gio_lam_viec_thuong: item.so_gio_lam_viec_thuong || 0,
                            so_gio_tang_ca_ngay_thuong: item.so_gio_tang_ca_ngay_thuong || 0,
                            so_gio_lam_viec_thuong_ngay_nghi: item.so_gio_lam_viec_thuong_ngay_nghi || 0,
                            so_gio_tang_ca_ngay_nghi: item.so_gio_tang_ca_ngay_nghi || 0,
                            tong_so_gio_lam_viec: item.tong_so_gio_lam_viec || 0
                        }
                    })
                } else {
                    phieu = await tx.phieuChamCong.create({
                        data: {
                            ma_bang_cham_cong: bang.ma_bang_cham_cong,
                            ma_nhan_su: item.ma_nhan_su || null,
                            ma_giao_vien: item.ma_giao_vien || null,
                            ho_ten: item.ho_ten || 'N/A',
                            ...ngayFields,
                            so_lan_di_muon: item.so_lan_di_muon || 0,
                            so_lan_ve_som: item.so_lan_ve_som || 0,
                            so_gio_lam_viec_thuong: item.so_gio_lam_viec_thuong || 0,
                            so_gio_tang_ca_ngay_thuong: item.so_gio_tang_ca_ngay_thuong || 0,
                            so_gio_lam_viec_thuong_ngay_nghi: item.so_gio_lam_viec_thuong_ngay_nghi || 0,
                            so_gio_tang_ca_ngay_nghi: item.so_gio_tang_ca_ngay_nghi || 0,
                            tong_so_gio_lam_viec: item.tong_so_gio_lam_viec || 0
                        }
                    })
                }

                // LƯU CHI TIẾT CHẤM CÔNG (Để Tooltip hiển thị sau khi F5)
                if (item.chi_tiet_cham_cong && Array.isArray(item.chi_tiet_cham_cong)) {
                    await tx.chiTietChamCong.deleteMany({
                        where: { ma_phieu_cham_cong: phieu.ma_phieu_cham_cong }
                    })

                    // Insert hàng loạt chi tiết
                    await tx.chiTietChamCong.createMany({
                        data: item.chi_tiet_cham_cong.map((ct: any) => ({
                            ma_phieu_cham_cong: phieu.ma_phieu_cham_cong,
                            ma_nhan_su: item.ma_nhan_su || null,
                            ma_giao_vien: item.ma_giao_vien || null,
                            ngay: (() => {
                                const d = new Date(ct.ngay)
                                d.setHours(12, 0, 0, 0)
                                return d
                            })(),
                            gio_vao_1: ct.gio_vao_1, gio_ra_1: ct.gio_ra_1,
                            gio_vao_2: ct.gio_vao_2, gio_ra_2: ct.gio_ra_2,
                            gio_vao_3: ct.gio_vao_3, gio_ra_3: ct.gio_ra_3,
                            gio_vao_4: ct.gio_vao_4, gio_ra_4: ct.gio_ra_4,
                            gio_vao_5: ct.gio_vao_5, gio_ra_5: ct.gio_ra_5,
                            gio_vao_6: ct.gio_vao_6, gio_ra_6: ct.gio_ra_6
                        }))
                    })
                }
            }
            return { success: true }
        })

        return NextResponse.json(result)
    } catch (error: any) {
        console.error('Lỗi API Confirm:', error)
        return NextResponse.json({ error: error.message || 'Lỗi server khi lưu' }, { status: 500 })
    }
}
