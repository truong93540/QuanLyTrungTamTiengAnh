import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // Đảm bảo đường dẫn này trỏ đúng tới file prisma của bạn

export async function GET(request: Request) {
    try {
        // 1. "Bắt" các tham số tìm kiếm từ URL mà Frontend gửi lên
        const { searchParams } = new URL(request.url)
        const ma_phieu_thu = searchParams.get('ma_phieu_thu')
        const so_tien = searchParams.get('so_tien')
        const ngay_thu = searchParams.get('ngay_thu')
        const ma_hoc_vien = searchParams.get('ma_hoc_vien')
        const ma_nhan_su = searchParams.get('ma_nhan_su')

        // 2. Xây dựng bộ lọc động (Chỉ lọc những ô mà người dùng có nhập chữ)
        const whereClause: {
            ma_phieu_thu?: number
            so_tien?: number
            ma_hoc_vien?: number
            ma_nhan_su?: number
            ngay_thu?: { gte: Date; lt: Date }
        } = {}

        if (ma_phieu_thu) whereClause.ma_phieu_thu = Number(ma_phieu_thu)
        if (so_tien) whereClause.so_tien = Number(so_tien)
        if (ma_hoc_vien) whereClause.ma_hoc_vien = Number(ma_hoc_vien)
        if (ma_nhan_su) whereClause.ma_nhan_su = Number(ma_nhan_su)

        // Xử lý riêng cho ngày tháng (Tìm kiếm tất cả phiếu trong ngày đó)
        if (ngay_thu) {
            const date = new Date(ngay_thu)
            const nextDay = new Date(date)
            nextDay.setDate(date.getDate() + 1)
            whereClause.ngay_thu = { gte: date, lt: nextDay }
        }

        // 3. Gọi Prisma để lấy dữ liệu đã được lọc
        const danhSachPhieuThu = await prisma.phieuThu.findMany({
            where: whereClause,
            include: {
                hoc_vien: { select: { ho_ten: true } },
                nhan_su: { select: { ho_ten: true } },
            },
            orderBy: { ngay_thu: 'desc' },
        })

        return NextResponse.json(danhSachPhieuThu)
    } catch (error) {
        console.error('Lỗi khi tìm kiếm phiếu thu:', error)
        return NextResponse.json({ error: 'Lỗi kết nối cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        // 1. Lấy dữ liệu từ Frontend gửi lên
        const body = await request.json()
        const { so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su } = body

        // 2. Dùng Prisma để tạo bản ghi mới vào CSDL
        const phieuThuMoi = await prisma.phieuThu.create({
            data: {
                so_tien: Number(so_tien),
                ngay_thu: new Date(ngay_thu),
                noi_dung: noi_dung,
                ma_hoc_vien: Number(ma_hoc_vien),
                ma_nhan_su: Number(ma_nhan_su),
            },
            // Lấy luôn tên học viên và nhân sự để trả về cho Frontend cập nhật bảng ngay lập tức
            include: {
                hoc_vien: { select: { ho_ten: true } },
                nhan_su: { select: { ho_ten: true } },
            },
        })

        // 3. Trả về kết quả thành công
        return NextResponse.json(phieuThuMoi, { status: 201 })
    } catch (error) {
        console.error('Lỗi khi thêm phiếu thu:', error)
        return NextResponse.json({ error: 'Lỗi khi thêm vào cơ sở dữ liệu' }, { status: 500 })
    }
}

// Thêm hàm PUT này vào cuối file route.ts để xử lý Cập nhật

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su } = body

        // Bắt buộc phải có mã phiếu thu thì mới biết cần sửa dòng nào
        if (!ma_phieu_thu) {
            return NextResponse.json({ error: 'Thiếu mã phiếu thu' }, { status: 400 })
        }

        const phieuThuCapNhat = await prisma.phieuThu.update({
            where: { ma_phieu_thu: Number(ma_phieu_thu) },
            data: {
                so_tien: Number(so_tien),
                ngay_thu: new Date(ngay_thu),
                noi_dung: noi_dung,
                ma_hoc_vien: Number(ma_hoc_vien),
                ma_nhan_su: Number(ma_nhan_su),
            },
            include: {
                hoc_vien: { select: { ho_ten: true } },
                nhan_su: { select: { ho_ten: true } },
            },
        })

        return NextResponse.json(phieuThuCapNhat, { status: 200 })
    } catch (error) {
        console.error('Lỗi khi cập nhật phiếu thu:', error)
        return NextResponse.json({ error: 'Lỗi khi cập nhật cơ sở dữ liệu' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        // Lấy ID (mã phiếu thu) từ trên đường dẫn URL
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Thiếu mã phiếu thu cần xóa' }, { status: 400 })
        }

        // Gọi Prisma để xóa dòng dữ liệu có ID tương ứng
        await prisma.phieuThu.delete({
            where: { ma_phieu_thu: Number(id) },
        })

        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 })
    } catch (error) {
        console.error('Lỗi khi xóa phiếu thu:', error)
        return NextResponse.json({ error: 'Lỗi khi xóa khỏi cơ sở dữ liệu' }, { status: 500 })
    }
}
