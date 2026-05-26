import { NextResponse } from "next/server";
import { hocVienService } from "@/services/DaoTao/hocVienService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "metadata") {
      const result = await hocVienService.getMetadataForForm();
      return NextResponse.json(result);
    }

    const idStr = searchParams.get("id");
    if (idStr) {
      const id = parseInt(idStr, 10);
      if (isNaN(id)) return NextResponse.json({ success: false, message: "ID không hợp lệ." }, { status: 400 });
      const result = await hocVienService.getChiTietHocVien(id);
      if (!result.success) return NextResponse.json(result, { status: 404 });
      return NextResponse.json(result);
    }

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const result = await hocVienService.getDanhSachHocVien({ page, limit, search });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Lỗi máy chủ." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    switch (type) {
      case "lop-hoc": return NextResponse.json(await hocVienService.addThamGiaLop(body));
      case "cam-ket": return NextResponse.json(await hocVienService.addCamKet(body));
      case "phieu-thu": return NextResponse.json(await hocVienService.addPhieuThu(body));
      default: return NextResponse.json(await hocVienService.createHocVien(body));
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Lỗi máy chủ." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");
    const type = searchParams.get("type");
    const body = await request.json();

    const id = parseInt(idStr || body.id, 10);
    if (isNaN(id)) return NextResponse.json({ success: false, message: "Mã định danh không hợp lệ." }, { status: 400 });

    switch (type) {
      case "lop-hoc": return NextResponse.json(await hocVienService.updateThamGiaLop(id, body));
      case "cam-ket": return NextResponse.json(await hocVienService.updateCamKet(id, body));
      case "phieu-thu": return NextResponse.json(await hocVienService.updatePhieuThu(id, body));
      default: return NextResponse.json(await hocVienService.updateHocVien(id, body));
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Lỗi máy chủ." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");
    const type = searchParams.get("type");
    const studentIdStr = searchParams.get("studentId"); 

    if (!idStr) return NextResponse.json({ success: false, message: "Cung cấp mã để xóa." }, { status: 400 });
    const id = parseInt(idStr, 10);
    const studentId = parseInt(studentIdStr || "0", 10);

    if (isNaN(id)) return NextResponse.json({ success: false, message: "ID không hợp lệ." }, { status: 400 });

    switch (type) {
      // Đã cập nhật kết nối đến các hàm xóa cứng dữ liệu trong Service công khai
      case "lop-hoc": return NextResponse.json(await hocVienService.deleteThamGiaLop(id, studentId));
      case "cam-ket": return NextResponse.json(await hocVienService.deleteCamKet(id, studentId));
      case "phieu-thu": return NextResponse.json(await hocVienService.deletePhieuThu(id, studentId));
      default: return NextResponse.json(await hocVienService.softDeleteHocVien(id));
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Lỗi máy chủ." }, { status: 500 });
  }
}