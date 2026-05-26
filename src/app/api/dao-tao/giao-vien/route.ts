import { NextRequest, NextResponse } from 'next/server';
import { giaoVienService } from '@/services/DaoTao/giaoVienService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const teacher = await giaoVienService.getById(Number(id));
      if (!teacher) {
        return NextResponse.json({ error: 'Không tìm thấy giáo viên này' }, { status: 404 });
      }
      return NextResponse.json(teacher);
    }

    // Nếu có tham số meta -> Lấy danh mục bổ trợ cho form điền
    const meta = searchParams.get('meta');
    if (meta === 'true') {
      const metadata = await giaoVienService.getMetadata();
      return NextResponse.json(metadata);
    }

    const search = searchParams.get('search') || undefined;
    const ma_chuc_vu = searchParams.get('ma_chuc_vu') ? Number(searchParams.get('ma_chuc_vu')) : undefined;
    const ma_phong_ban = searchParams.get('ma_phong_ban') ? Number(searchParams.get('ma_phong_ban')) : undefined;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;

    const data = await giaoVienService.getAll({ search, ma_chuc_vu, ma_phong_ban, page, limit });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server phát sinh' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.ho_ten || !body.ma_chuc_vu || !body.ma_phong_ban) {
      return NextResponse.json({ error: 'Các trường Họ tên, Chức vụ và Phòng ban bắt buộc điền' }, { status: 400 });
    }

    const newTeacher = await giaoVienService.create(body);
    return NextResponse.json({ message: 'Thêm giáo viên thành công', data: newTeacher }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi xử lý tạo mới giáo viên' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã định danh giáo viên (id)' }, { status: 400 });
    }

    const updated = await giaoVienService.update(Number(id), body);
    return NextResponse.json({ message: 'Cập nhật thông tin giáo viên thành công', data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi xử lý cập nhật giáo viên' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã định danh giáo viên (id)' }, { status: 400 });
    }

    await giaoVienService.delete(Number(id));
    return NextResponse.json({ message: 'Xoá giáo viên và các dữ liệu liên quan thành công' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi xử lý xoá giáo viên' }, { status: 500 });
  }
}