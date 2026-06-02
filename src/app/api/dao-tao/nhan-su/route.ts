import { NextResponse } from "next/server";
import { nhanSuService } from "@/services/DaoTao/nhanSuService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    if (idParam) {
      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        return NextResponse.json({ success: false, message: "Mã nhân sự không hợp lệ." }, { status: 400 });
      }
      const result = await nhanSuService.getChiTietNhanSu(id);
      return NextResponse.json(result);
    }

    const meta = searchParams.get("meta");
    if (meta === "true") {
      const metadata = await nhanSuService.getFormMetadata();
      return NextResponse.json(metadata);
    }

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const result = await nhanSuService.getDanhSachNhanSu({ page, limit, search });
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi máy chủ nội bộ.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // Phân biệt loại dữ liệu phụ
    const body = await request.json();

    if (type === "hop-dong") {
      if (!body.so_hop_dong || !body.ma_nhan_su) {
        return NextResponse.json({ success: false, message: "Thiếu thông tin số hợp đồng hoặc mã nhân sự." }, { status: 400 });
      }
      
      // Đảm bảo chi_tiet_phu_cap là chuỗi JSON hợp lệ thì parse ra trước khi đẩy vào db
      if (body.chi_tiet_phu_cap && typeof body.chi_tiet_phu_cap === "string") {
        try {
          body.chi_tiet_phu_cap = JSON.parse(body.chi_tiet_phu_cap);
        } catch {
          return NextResponse.json({ success: false, message: "Định dạng JSON cấu trúc phụ cấp không hợp lệ." }, { status: 400 });
        }
      }
      
      const result = await nhanSuService.createHopDong(body);
      return NextResponse.json(result);
    }

    if (type === "bang-cap") {
      if (!body.ten_bang_cap || !body.ma_nhan_su) {
        return NextResponse.json({ success: false, message: "Thiếu thông tin tên bằng cấp hoặc mã nhân sự." }, { status: 400 });
      }
      const result = await nhanSuService.createBangCap(body);
      return NextResponse.json(result);
    }

    // Mặc định: Tạo Nhân sự mới
    if (!body.ho_ten || !body.ma_chuc_vu || !body.ma_phong_ban) {
      return NextResponse.json({ success: false, message: "Vui lòng nhập đầy đủ các trường bắt buộc." }, { status: 400 });
    }
    const result = await nhanSuService.createNhanSu(body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Lỗi máy chủ nội bộ." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const idParam = searchParams.get("id");
    const id = parseInt(idParam || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Mã định danh không hợp lệ." }, { status: 400 });
    }

    const body = await request.json();

    if (type === "hop-dong") {
      if (body.chi_tiet_phu_cap && typeof body.chi_tiet_phu_cap === "string") {
        try {
          body.chi_tiet_phu_cap = JSON.parse(body.chi_tiet_phu_cap);
        } catch {
          return NextResponse.json({ success: false, message: "Định dạng JSON cấu trúc phụ cấp không hợp lệ." }, { status: 400 });
        }
      }
      const result = await nhanSuService.updateHopDong(id, body);
      return NextResponse.json(result);
    }

    if (type === "bang-cap") {
      const result = await nhanSuService.updateBangCap(id, body);
      return NextResponse.json(result);
    }

    // Mặc định: Sửa hồ sơ nhân sự
    const result = await nhanSuService.updateNhanSu(id, body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Lỗi máy chủ nội bộ." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const idParam = searchParams.get("id");
    const id = parseInt(idParam || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Mã định danh không hợp lệ." }, { status: 400 });
    }

    if (type === "hop-dong") {
      const result = await nhanSuService.deleteHopDong(id);
      return NextResponse.json(result);
    }

    if (type === "bang-cap") {
      const result = await nhanSuService.deleteBangCap(id);
      return NextResponse.json(result);
    }

    // Mặc định: Xóa nhân sự
    const result = await nhanSuService.deleteNhanSu(id);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Lỗi máy chủ nội bộ." }, { status: 500 });
  }
}