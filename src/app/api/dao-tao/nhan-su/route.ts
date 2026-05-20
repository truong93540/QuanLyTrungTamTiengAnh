import { NextResponse } from "next/server";
import { nhanSuService } from "@/services/DaoTao/nhanSuService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
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
    const body = await request.json();
    if (!body.ho_ten || !body.ma_chuc_vu || !body.ma_phong_ban) {
      return NextResponse.json({ success: false, message: "Vui lòng nhập đầy đủ các trường bắt buộc." }, { status: 400 });
    }
    const result = await nhanSuService.createNhanSu(body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi máy chủ nội bộ.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}