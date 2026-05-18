import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const danhSach = await prisma.bangLuong.findMany({
            include: {
                phieu_chi: true
            },
            orderBy: { ma_bang_luong: 'desc' }
        });
        return NextResponse.json(danhSach, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate'
            }
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách bảng lương:", error);
        return NextResponse.json(
            { error: "Lỗi cơ sở dữ liệu" },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, max-age=0, must-revalidate'
                }
            }
        );
    }
}
