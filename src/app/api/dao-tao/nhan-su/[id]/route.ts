import { NextResponse } from "next/server";
import { nhanSuService } from "@/services/DaoTao/nhanSuService";

// Định nghĩa đúng cấu trúc Promise cho Next.js 15+
interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Giải nén params vì nó là một Promise
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Mã nhân sự không hợp lệ." }, { status: 400 });
    }
    
    const result = await nhanSuService.getChiTietNhanSu(id);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi máy chủ nội bộ.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    // Giải nén params vì nó là một Promise
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Mã nhân sự không hợp lệ." }, { status: 400 });
    }
    
    const body = await request.json();
    const result = await nhanSuService.updateNhanSu(id, body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi máy chủ nội bộ.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // Giải nén params vì nó là một Promise
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Mã nhân sự không hợp lệ." }, { status: 400 });
    }
    
    const result = await nhanSuService.deleteNhanSu(id);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi máy chủ nội bộ.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}