import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const id = searchParams.get('id')

        // 1. Tìm đích danh theo Mã ID (Dùng khi người dùng gõ/chọn Mã học viên VÀ xem Chi tiết hồ sơ)
        if (id) {
            const hocVien = await prisma.hocVien.findUnique({
                where: { ma_hoc_vien: Number(id) },
                // ĐÃ SỬA: Xóa block 'select' ở đây để Prisma trả về TOÀN BỘ thông tin (ngày sinh, giới tính, SĐT, trạng thái...)
            })
            return NextResponse.json(hocVien || null)
        }

        // 2. Tìm kiếm gợi ý theo Tên (Dùng khi gõ vào ô Tên học viên)
        if (search) {
            const danhSachHocVien = await prisma.hocVien.findMany({
                where: {
                    ho_ten: {
                        contains: search,
                        mode: 'insensitive' // Tìm kiếm không phân biệt chữ hoa, chữ thường
                    }
                },
                // Ở đây vẫn giữ select vì Dropdown gợi ý chỉ cần Mã và Tên cho nhẹ server
                select: { ma_hoc_vien: true, ho_ten: true },
                take: 6 // Cắt bớt, chỉ lấy tối đa 6 người để giao diện dropdown không bị quá dài
            })
            return NextResponse.json(danhSachHocVien)
        }

        return NextResponse.json([])
    } catch (error) {
        console.error('Lỗi GET Học Viên:', error)
        return NextResponse.json({ error: 'Lỗi truy xuất dữ liệu học viên' }, { status: 500 })
    }
}

// BỔ SUNG: Hàm POST để lưu hồ sơ học viên mới từ Modal Đăng ký
export async function POST(request: Request) {
    try {
        const data = await request.json()

        const newHocVien = await prisma.hocVien.create({
            data: {
                ho_ten: data.ho_ten,
                ngay_sinh: new Date(data.ngay_sinh),
                gioi_tinh: data.gioi_tinh,
                so_dien_thoai: data.so_dien_thoai || null,
                email: data.email || null,
                dia_chi: data.dia_chi || null,
                trang_thai: data.trang_thai || 'Đang học',
            }
        })

        // Trả về dữ liệu học viên vừa tạo (để giao diện Cam kết tự động điền Tên và Mã)
        return NextResponse.json(newHocVien)
    } catch (error) {
        console.error('Lỗi POST Học Viên:', error)
        return NextResponse.json({ error: 'Không thể thêm học viên mới' }, { status: 500 })
    }
}