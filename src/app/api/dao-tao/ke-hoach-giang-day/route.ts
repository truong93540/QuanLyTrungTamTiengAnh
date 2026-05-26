import { NextResponse } from "next/server";
import { keHoachGiangDayService } from "@/services/DaoTao/keHoachGiangDayService";

export async function GET() {
  try {
    const list = await keHoachGiangDayService.getAll();
    const options = await keHoachGiangDayService.getFormDataOptions();
    return NextResponse.json({ success: true, data: list, options });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await keHoachGiangDayService.create(body);
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}