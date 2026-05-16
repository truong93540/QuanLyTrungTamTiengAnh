import {prisma} from '@/lib/prisma'

interface PhanCongData {
    ma_nhan_su: number;
    vai_tro: string;
}

interface ChuongTrinhData {
    ten_chuong_trinh_marketing: string;
    noi_dung?: string | null;
    ngay_bat_dau: Date;
    ngay_ket_thuc: Date;
    ngan_sach?: number | null;
    ma_khoa_hoc?: number | null;
    danh_sach_nhan_su?: PhanCongData[];
}

export const layDanhSachChuongTrinh = async () => {
    return await prisma.chuongTrinhMarketing.findMany({
        include: {
            khoa_hoc: { 
                select: { 
                    ten_khoa_hoc: true, 
                    hoc_phi: true, 
                    thoi_luong: true, 
                    trinh_do: true,
                    trang_thai: true // BỔ SUNG: Trạng thái khóa học
                } 
            },
            phan_cong: {
                include: { 
                    nhan_su: { 
                        select: { 
                            ho_ten: true, 
                            so_dien_thoai: true, 
                            email: true,
                            // BỔ SUNG: Lấy tên phòng ban từ bảng liên kết PhongBan
                            phong_ban: { select: { ten_phong_ban: true } }
                        } 
                    } 
                }
            }
        },
        // BỔ SUNG: Chuyển logic sắp xếp từ Frontend xuống Database (Mã giảm dần)
        orderBy: { ma_chuong_trinh_marketing: 'asc' }
    });
}

export const layDanhSachNhanSuMarketing = async () => {
    return await prisma.nhanSu.findMany({
        where: { 
            phong_ban: { ten_phong_ban: { contains: 'Marketing', mode: 'insensitive' } } 
        },
        select: { ma_nhan_su: true, ho_ten: true, so_dien_thoai: true, email: true }
    });
}

export const taoChuongTrinhMoi = async (data: ChuongTrinhData) => {
    return await prisma.chuongTrinhMarketing.create({
        data: {
            ten_chuong_trinh_marketing: data.ten_chuong_trinh_marketing,
            noi_dung: data.noi_dung,
            ngay_bat_dau: data.ngay_bat_dau,
            ngay_ket_thuc: data.ngay_ket_thuc,
            ngan_sach: data.ngan_sach,
            ma_khoa_hoc: data.ma_khoa_hoc,
            phan_cong: {
                create: data.danh_sach_nhan_su?.map(item => ({
                    nhan_su: { connect: { ma_nhan_su: item.ma_nhan_su } },
                    vai_tro: item.vai_tro
                })) || []
            }
        },
        include: { khoa_hoc: true, phan_cong: { include: { nhan_su: { include: { phong_ban: true } } } } }
    });
}

export const capNhatChuongTrinh = async (id: number, data: ChuongTrinhData) => {
    await prisma.phanCongMarketing.deleteMany({
        where: { ma_chuong_trinh_marketing: id }
    });

    return await prisma.chuongTrinhMarketing.update({
        where: { ma_chuong_trinh_marketing: id },
        data: {
            ten_chuong_trinh_marketing: data.ten_chuong_trinh_marketing,
            noi_dung: data.noi_dung,
            ngay_bat_dau: data.ngay_bat_dau,
            ngay_ket_thuc: data.ngay_ket_thuc,
            ngan_sach: data.ngan_sach,
            ma_khoa_hoc: data.ma_khoa_hoc,
            phan_cong: {
                create: data.danh_sach_nhan_su?.map(item => ({
                    nhan_su: { connect: { ma_nhan_su: item.ma_nhan_su } },
                    vai_tro: item.vai_tro
                })) || []
            }
        },
        include: { khoa_hoc: true, phan_cong: { include: { nhan_su: { include: { phong_ban: true } } } } }
    });
}

export const xoaChuongTrinh = async (id: number) => {
    await prisma.phanCongMarketing.deleteMany({ where: { ma_chuong_trinh_marketing: id } });
    return await prisma.chuongTrinhMarketing.delete({ where: { ma_chuong_trinh_marketing: id } });
}