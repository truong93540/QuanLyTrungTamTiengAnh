import { NextRequest, NextResponse } from 'next/server';
import { buoiHocService } from '@/services/DaoTao/buoiHocService';

// GET: Lấy danh sách buổi học theo maLopHoc hoặc lấy danh sách giáo viên phụ trợ
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maLopHocStr = searchParams.get('maLopHoc');
    const action = searchParams.get('action');

    if (action === 'getGiaoVien') {
      const giaoVienList = await buoiHocService.getAllGiaoVienIdAndName();
      return NextResponse.json({ success: true, data: giaoVienList });
    }

    if (!maLopHocStr) {
      return NextResponse.json({ error: 'Thiếu mã lớp học' }, { status: 400 });
    }

    const maLopHoc = parseInt(maLopHocStr);
    const listBuoiHoc = await buoiHocService.getBuoiHocByLop(maLopHoc);
    return NextResponse.json({ success: true, data: listBuoiHoc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Tạo buổi học mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ngay_hoc, noi_dung_hoc, ma_giao_vien, ma_lop_hoc } = body;

    if (!ngay_hoc || !ma_giao_vien || !ma_lop_hoc) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    const newBuoiHoc = await buoiHocService.createBuoiHoc({
      ngay_hoc: new Date(ngay_hoc),
      noi_dung_hoc,
      ma_giao_vien: parseInt(ma_giao_vien),
      ma_lop_hoc: parseInt(ma_lop_hoc),
    });

    return NextResponse.json({ success: true, data: newBuoiHoc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Cập nhật thông tin buổi học
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ma_buoi_hoc, ngay_hoc, noi_dung_hoc, ma_giao_vien } = body;

    if (!ma_buoi_hoc) {
      return NextResponse.json({ error: 'Thiếu mã buổi học cần cập nhật' }, { status: 400 });
    }

    const updated = await buoiHocService.updateBuoiHoc({
      ma_buoi_hoc: parseInt(ma_buoi_hoc),
      ngay_hoc: ngay_hoc ? new Date(ngay_hoc) : undefined,
      noi_dung_hoc,
      ma_giao_vien: ma_giao_vien ? parseInt(ma_giao_vien) : undefined,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Xóa một buổi học
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maBuoiHocStr = searchParams.get('maBuoiHoc');

    if (!maBuoiHocStr) {
      return NextResponse.json({ error: 'Thiếu mã buổi học cần xóa' }, { status: 400 });
    }

    await buoiHocService.deleteBuoiHoc(parseInt(maBuoiHocStr));
    return NextResponse.json({ success: true, message: 'Xóa buổi học thành công' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}