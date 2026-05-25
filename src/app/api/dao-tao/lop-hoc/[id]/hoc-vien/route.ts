import { NextRequest, NextResponse } from 'next/server';
import { lopHocHocVienService } from '@/services/DaoTao/lopHocHocVienService';

// GET: Lấy danh sách học viên trong lớp hoặc lấy danh sách học viên khả dụng để thêm vào lớp
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const maLopHoc = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'available' hoặc rỗng (mặc định trong lớp)
    const q = searchParams.get('q') || '';

    if (isNaN(maLopHoc)) {
      return NextResponse.json({ error: 'Mã lớp học không hợp lệ' }, { status: 400 });
    }

    if (type === 'available') {
      const result = await lopHocHocVienService.getHocVienKhaDung(maLopHoc, q);
      return NextResponse.json({ success: true, data: result });
    }

    const result = await lopHocHocVienService.getHocVienByLopHoc(maLopHoc);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Thêm học viên vào lớp học
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const maLopHoc = parseInt(params.id);
    const body = await request.json();
    const maHocVien = parseInt(body.ma_hoc_vien);

    if (isNaN(maLopHoc) || isNaN(maHocVien)) {
      return NextResponse.json({ error: 'Dữ liệu đầu vào không hợp lệ' }, { status: 400 });
    }

    const result = await lopHocHocVienService.addHocVienToLop({
      ma_lop_hoc: maLopHoc,
      ma_hoc_vien: maHocVien,
      trang_thai: body.trang_thai,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Xóa học viên khỏi lớp học
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const maLopHoc = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const maHocVien = parseInt(searchParams.get('maHocVien') || '');

    if (isNaN(maLopHoc) || isNaN(maHocVien)) {
      return NextResponse.json({ error: 'Dữ liệu đầu vào không hợp lệ' }, { status: 400 });
    }

    await lopHocHocVienService.removeHocVienFromLop(maLopHoc, maHocVien);
    return NextResponse.json({ success: true, message: 'Đã xóa học viên khỏi lớp' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}