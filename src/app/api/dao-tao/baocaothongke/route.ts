import { NextResponse } from "next/server";
import { BaoCaoThongKeService } from "@/services/DaoTao/BaoCaoThongKeService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const namParam = searchParams.get("nam");
    const nam = namParam ? parseInt(namParam, 10) : new Date().getFullYear();

    if (isNaN(nam)) {
      return NextResponse.json(
        { error: "Năm không hợp lệ" },
        { status: 400 }
      );
    }

    const data = await BaoCaoThongKeService.getThongKeDangKyVaCamKet(nam);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Lỗi API BaoCaoThongKe:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi lấy dữ liệu báo cáo" },
      { status: 500 }
    );
  }
}