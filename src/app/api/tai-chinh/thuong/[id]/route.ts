import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const phieuId = parseInt(id);
    try {
        const phieu = await prisma.phieuThuong.delete({
            where: { ma_phieu_thuong: phieuId }
        });

        // Cập nhật lại tổng tiền bảng thưởng
        if (phieu.ma_bang_thuong) {
            const allPhieu = await prisma.phieuThuong.findMany({ 
                where: { ma_bang_thuong: phieu.ma_bang_thuong } 
            });
            const total = allPhieu.reduce((acc, p) => acc + Number(p.so_tien), 0);
            await prisma.bangThuong.update({
                where: { ma_bang_thuong: phieu.ma_bang_thuong },
                data: { so_tien_thuong: total }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Lỗi xóa phiếu thưởng:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const phieuId = parseInt(id);
    const body = await request.json();
    const { so_tien, noi_dung } = body;

    try {
        const phieu = await prisma.phieuThuong.update({
            where: { ma_phieu_thuong: phieuId },
            data: {
                so_tien: so_tien !== undefined ? parseFloat(so_tien) : undefined,
                noi_dung: noi_dung
            }
        });

        // Cập nhật lại tổng tiền bảng thưởng
        if (phieu.ma_bang_thuong) {
            const allPhieu = await prisma.phieuThuong.findMany({ 
                where: { ma_bang_thuong: phieu.ma_bang_thuong } 
            });
            const total = allPhieu.reduce((acc, p) => acc + Number(p.so_tien), 0);
            await prisma.bangThuong.update({
                where: { ma_bang_thuong: phieu.ma_bang_thuong },
                data: { so_tien_thuong: total }
            });
        }

        return NextResponse.json({ success: true, phieu });
    } catch (error: any) {
        console.error("Lỗi sửa phiếu thưởng:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
