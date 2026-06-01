import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { lopHocService } from '@/services/DaoTao/lopHocService';

const prisma = new PrismaClient();

const resJson = (success: boolean, message: string, data?: any, error?: any, status = 200) => {
  return NextResponse.json({ success, message, data, error }, { status });
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const meta = searchParams.get('meta');
    const ma_buoi_hoc_nx = searchParams.get('ma_buoi_hoc_nx');
    if (ma_buoi_hoc_nx) {
      try {
        const data = await prisma.nhanXet.findMany({
          where: { ma_buoi_hoc: Number(ma_buoi_hoc_nx) }
        });
        return NextResponse.json({ success: true, data });
      } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
      }
    }
    const getKhgdMau = searchParams.get('khgd_mau');
    const ma_lop_hoc = searchParams.get('ma_lop_hoc');
    const ma_buoi_hoc = searchParams.get('ma_buoi_hoc');
    const ma_bai_kiem_tra = searchParams.get('ma_bai_kiem_tra');
    const getKhgd = searchParams.get('ke_hoach_giang_day');

    if (meta === 'true') {
      const data = await lopHocService.getMetadata();
      return resJson(true, 'Lấy metadata thành công', data);
    }
    
    // Lấy list điểm của một bài kiểm tra
    if (ma_bai_kiem_tra) {
      const data = await lopHocService.getKetQuaKiemTra(Number(ma_bai_kiem_tra));
      return resJson(true, 'Lấy kết quả kiểm tra thành công', data);
    }

    if (getKhgdMau === 'true') {
      const data = await lopHocService.getAllKeHoachGiangDayMau();
      return resJson(true, 'Lấy KHGD mẫu thành công', data);
    }

    if (getKhgd) {
      const data = await lopHocService.getKeHoachGiangDay(Number(getKhgd));
      return resJson(true, 'Lấy KHGD thành công', data);
    }

    if (ma_buoi_hoc && ma_lop_hoc) {
      const data = await lopHocService.getDanhSachDiemDanh(Number(ma_buoi_hoc), Number(ma_lop_hoc));
      return resJson(true, 'Lấy danh sách điểm danh thành công', data);
    }

    if (ma_lop_hoc) {
      const data = await lopHocService.getLopHocDetail(Number(ma_lop_hoc));
      if (!data) return resJson(false, 'Không tìm thấy lớp học', null, null, 404);
      return resJson(true, 'Lấy chi tiết lớp học thành công', data);
    }

    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || undefined;
    const data = await lopHocService.getAllLopHoc(page, 10, search);
    return resJson(true, 'Lấy danh sách thành công', data);

  } catch (error: any) {
    return resJson(false, 'Lỗi Server GET', null, error.message, 500);
  }
}

// (Lưu ý: Khối POST đã có sẵn case CREATE_BAI_KIEM_TRA và UPSERT_KET_QUA_KT)
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { action, payload } = body;
  
      switch (action) {
        case 'UPDATE_KHOA_HOC_LIEN_KET':
        const updatedLop = await prisma.lopHoc.update({
          where: { ma_lop_hoc: Number(payload.ma_lop_hoc) },
          data: { ma_khoa_hoc: Number(payload.ma_khoa_hoc) }
        });
        return NextResponse.json({ success: true, message: 'Liên kết khóa học thành công!', data: updatedLop });
        case 'CREATE_LOP_HOC':
          const newLop = await lopHocService.createLopHoc(payload);
          return resJson(true, 'Tạo lớp học thành công', newLop);
        case 'ASSIGN_GIAO_VIEN':
          await lopHocService.assignGiaoVien(payload.ma_lop_hoc, payload.ma_giao_vien);
          return resJson(true, 'Phân công thành công');
        case 'ADD_HOC_VIEN':
          await lopHocService.addHocVien(payload.ma_lop_hoc, payload.ma_hoc_vien);
          return resJson(true, 'Thêm học viên thành công');
        case 'CREATE_BUOI_HOC':
          const newBuoiHoc = await lopHocService.createBuoiHoc(payload);
          return resJson(true, 'Tạo buổi học thành công', newBuoiHoc);
        case 'UPSERT_DIEM_DANH':
          await lopHocService.upsertDiemDanh(payload.ma_buoi_hoc, payload.ma_hoc_vien, payload.trang_thai, payload.ghi_chu);
          return resJson(true, 'Cập nhật điểm danh thành công');
        case 'UPSERT_NHAN_XET':
          await lopHocService.upsertNhanXet(payload.ma_buoi_hoc, payload.ma_hoc_vien, payload.da_lam_bai_tap, payload.noi_dung_nhan_xet);
          return resJson(true, 'Lưu nhận xét thành công');
        case 'CREATE_BAI_KIEM_TRA':
          const newBkt = await lopHocService.createBaiKiemTra(payload);
          return resJson(true, 'Tạo bài kiểm tra thành công', newBkt);
        case 'UPSERT_KET_QUA_KT':
          await lopHocService.upsertKetQuaKiemTra(payload.ma_bai_kiem_tra, payload.ma_hoc_vien, Number(payload.diem_so), payload.nhan_xet);
          return resJson(true, 'Cập nhật kết quả bài test thành công');
        case 'CREATE_KE_HOACH':
          const newKh = await lopHocService.createKeHoach(payload);
          return resJson(true, 'Tạo kế hoạch giảng dạy thành công', newKh);
        default: return resJson(false, 'Action không hợp lệ', null, null, 400);
      }
    } catch (error: any) {
      if (error.code === 'P2002') return resJson(false, 'Dữ liệu trùng lặp', null, error.message, 400);
      return resJson(false, 'Lỗi Server POST', null, error.message, 500);
    }
}
  
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, payload } = body;
        if (action === 'UPDATE_LOP_HOC') {
            const updatedLop = await lopHocService.updateLopHoc(payload.ma_lop_hoc, payload);
            return resJson(true, 'Cập nhật lớp học thành công', updatedLop);
        }
        return resJson(false, 'Action không hợp lệ', null, null, 400);
    } catch (error: any) { return resJson(false, 'Lỗi Server PUT', null, error.message, 500); }
}

export async function DELETE(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const action = searchParams.get('action');
  
      if (action === 'DELETE_LOP_HOC') {
        await lopHocService.deleteLopHoc(Number(searchParams.get('ma_lop_hoc')));
        return resJson(true, 'Xoá lớp học thành công');
      }
      if (action === 'REMOVE_GIAO_VIEN') {
        await lopHocService.removeGiaoVien(Number(searchParams.get('ma_lop_hoc')), Number(searchParams.get('ma_giao_vien')));
        return resJson(true, 'Gỡ phân công giáo viên thành công');
      }
      if (action === 'REMOVE_HOC_VIEN') {
        await lopHocService.removeHocVien(Number(searchParams.get('ma_lop_hoc')), Number(searchParams.get('ma_hoc_vien')));
        return resJson(true, 'Đưa học viên ra khỏi lớp thành công');
      }
      if (action === 'DELETE_KE_HOACH') {
        await lopHocService.deleteKeHoach(Number(searchParams.get('ma_ke_hoach_giang_day')));
        return resJson(true, 'Xóa kế hoạch giảng dạy thành công');
      }
      return resJson(false, 'Action không hợp lệ', null, null, 400);
    } catch (error: any) {
      if (error.code === 'P2003') return resJson(false, 'Lỗi ràng buộc dữ liệu (Khoá ngoại)', null, error.message, 400);
      return resJson(false, 'Lỗi Server DELETE', null, error.message, 500);
    }
}