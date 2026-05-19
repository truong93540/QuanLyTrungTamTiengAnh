import { NextResponse } from "next/server";
import { hocVienService } from "@/services/DaoTao/hocVienService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");

    // Trường hợp 1: GET chi tiết học viên theo query param `?id=...`
    if (idStr) {
      const id = parseInt(idStr, 10);
      if (isNaN(id)) {
        return NextResponse.json({ success: false, message: "ID học viên không hợp lệ." }, { status: 400 });
      }
      const result = await hocVienService.getChiTietHocVien(id);
      if (!result.success) {
        return NextResponse.json(result, { status: 404 });
      }
      return NextResponse.json(result);
    }

    // Trường hợp 2: GET danh sách học viên có phân trang, tìm kiếm
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const result = await hocVienService.getDanhSachHocVien({ page, limit, search });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Lỗi máy chủ nội bộ." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.ho_ten) {
      return NextResponse.json({ success: false, message: "Họ tên học viên là bắt buộc." }, { status: 400 });
    }

    const result = await hocVienService.createHocVien(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Lỗi máy chủ nội bộ." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");
    const body = await request.json();

    const id = parseInt(idStr || body.ma_hoc_vien, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Mã học viên để cập nhật không hợp lệ." }, { status: 400 });
    }

    const result = await hocVienService.updateHocVien(id, body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Lỗi máy chủ nội bộ." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");

    if (!idStr) {
      return NextResponse.json({ success: false, message: "Yêu cầu cung cấp mã học viên để xóa." }, { status: 400 });
    }

    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Mã học viên không hợp lệ." }, { status: 400 });
    }

    const result = await hocVienService.softDeleteHocVien(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Lỗi máy chủ nội bộ." }, { status: 500 });
  }
}