import { NextResponse } from "next/server";
import { chuongTrinhHocService } from "@/services/DaoTao/chuongTrinhHocService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");

    // TRƯỜNG HỢP 1: Lấy chi tiết một chương trình học (?id=1)
    if (idStr) {
      const id = parseInt(idStr, 10);
      if (isNaN(id)) {
        return NextResponse.json({ success: false, message: "Mã chương trình không hợp lệ." }, { status: 400 });
      }
      const result = await chuongTrinhHocService.getChiTietChuongTrinhHoc(id);
      if (!result.success) {
        return NextResponse.json(result, { status: 404 });
      }
      return NextResponse.json(result);
    }

    // TRƯỜNG HỢP 2: Lấy danh sách chương trình học có phân trang, tìm kiếm
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const result = await chuongTrinhHocService.getDanhSachChuongTrinhHoc({ page, limit, search });
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ nội bộ.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.ten_chuong_trinh) {
      return NextResponse.json({ success: false, message: "Tên chương trình học là bắt buộc." }, { status: 400 });
    }
    const result = await chuongTrinhHocService.createChuongTrinhHoc(body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ nội bộ.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");
    const body = await request.json();

    const id = parseInt(idStr || body.ma_chuong_trinh, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Mã chương trình không hợp lệ." }, { status: 400 });
    }

    // ĐIỀU PHỐI HÀNH ĐỘNG LIÊN QUAN TỚI KHÓA HỌC CON (LỒNG TRONG TRANG CHI TIẾT)
    if (body.action === "createCourse") {
      const result = await chuongTrinhHocService.createKhoaHocLienKet(id, body);
      return NextResponse.json(result);
    }

    if (body.action === "updateCourse") {
      const courseId = parseInt(body.courseId, 10);
      if (isNaN(courseId)) {
        return NextResponse.json({ success: false, message: "Mã khóa học con không hợp lệ." }, { status: 400 });
      }
      const result = await chuongTrinhHocService.updateKhoaHocLienKet(courseId, body);
      return NextResponse.json(result);
    }

    if (body.action === "deleteCourse") {
      const courseId = parseInt(body.courseId, 10);
      if (isNaN(courseId)) {
        return NextResponse.json({ success: false, message: "Mã khóa học con không hợp lệ." }, { status: 400 });
      }
      const result = await chuongTrinhHocService.deleteKhoaHocLienKet(courseId);
      return NextResponse.json(result);
    }

    // MẶC ĐỊNH: Cập nhật thông tin gốc của Chương trình học
    if (!body.ten_chuong_trinh) {
      return NextResponse.json({ success: false, message: "Tên chương trình học là bắt buộc." }, { status: 400 });
    }

    const result = await chuongTrinhHocService.updateChuongTrinhHoc(id, body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ nội bộ.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");

    if (!idStr) {
      return NextResponse.json({ success: false, message: "Yêu cầu cung cấp mã chương trình học để xóa." }, { status: 400 });
    }

    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Mã chương trình học không hợp lệ." }, { status: 400 });
    }

    const result = await chuongTrinhHocService.deleteChuongTrinhHoc(id);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ nội bộ.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}