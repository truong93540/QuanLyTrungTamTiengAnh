import { NextResponse } from "next/server";
import { keHoachGiangDayService } from "@/services/DaoTao/keHoachGiangDayService";

// Cấu hình Interface RouteParams với thuộc tính params là một Promise theo chuẩn Next.js 15
interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}
    
export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Giải nén params bằng await trước khi sử dụng
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Mã định danh không hợp lệ" }, { status: 400 });
    }
    const item = await keHoachGiangDayService.getById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    // Giải nén params bằng await trước khi sử dụng
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Mã định danh không hợp lệ" }, { status: 400 });
    }
    const body = await request.json();

    // Điều hướng hành động đặc thù đối với Quản lý các buổi học nội bộ kế hoạch
    if (body.action === "createBuoiHoc") {
      const buoiHoc = await keHoachGiangDayService.createBuoiHoc(body.data);
      return NextResponse.json({ success: true, data: buoiHoc });
    }
    if (body.action === "updateBuoiHoc") {
      const buoiHoc = await keHoachGiangDayService.updateBuoiHoc(Number(body.ma_buoi_hoc), body.data);
      return NextResponse.json({ success: true, data: buoiHoc });
    }
    if (body.action === "deleteBuoiHoc") {
      await keHoachGiangDayService.deleteBuoiHoc(Number(body.ma_buoi_hoc));
      return NextResponse.json({ success: true });
    }

    const updated = await keHoachGiangDayService.update(id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // Giải nén params bằng await trước khi sử dụng
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Mã định danh không hợp lệ" }, { status: 400 });
    }

    await keHoachGiangDayService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}