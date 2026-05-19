import { NextResponse } from 'next/server';
import {
  layDanhSachLopHoc,
  layChiTietLopHoc,
  taoLopHoc,
  capNhatLopHoc,
  xoaLopHoc,
  layMetadataLopHoc,
} from '@/services/DaoTao/lopHocService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (type === 'metadata') {
      const metadata = await layMetadataLopHoc();
      return NextResponse.json(metadata);
    }

    if (id) {
      const chiTiet = await layChiTietLopHoc(Number(id));
      if (!chiTiet) {
        return NextResponse.json({ message: 'Không tìm thấy lớp học' }, { status: 404 });
      }
      return NextResponse.json(chiTiet);
    }

    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const result = await layDanhSachLopHoc({ search, page, limit });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Lỗi máy chủ hệ thống', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.ten_lop || !body.ma_khoa_hoc || !body.ma_phong_hoc) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      );
    }

    const dataNew = await taoLopHoc(body);
    return NextResponse.json(dataNew, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Không thể tạo lớp học mới', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ message: 'Thiếu định danh lớp học' }, { status: 400 });
    }

    const dataUpdated = await capNhatLopHoc(Number(id), data);
    return NextResponse.json(dataUpdated);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Không thể cập nhật lớp học', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Thiếu định danh lớp học cần xóa' }, { status: 400 });
    }

    await xoaLopHoc(Number(id));
    return NextResponse.json({ message: 'Xóa lớp học thành công' });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Không thể xóa lớp học hoặc dữ liệu đang bị ràng buộc liên kết', error: error.message },
      { status: 500 }
    );
  }
}