import { NextResponse } from 'next/server'
import { getDanhSachChuongTrinh, createChuongTrinh, updateChuongTrinh, deleteChuongTrinh } from '@/services/DanhMuc/chuongTrinhHocservice'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || undefined

        const data = await getDanhSachChuongTrinh(search)
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi lấy dữ liệu chương trình học' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const newChuongTrinh = await createChuongTrinh(body)
        return NextResponse.json(newChuongTrinh, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi tạo mới chương trình học' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { ma_chuong_trinh, ...updateData } = body
        
        if (!ma_chuong_trinh) {
            return NextResponse.json({ error: 'Thiếu ID chương trình' }, { status: 400 })
        }

        const updatedChuongTrinh = await updateChuongTrinh(ma_chuong_trinh, updateData)
        return NextResponse.json(updatedChuongTrinh)
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi cập nhật chương trình học' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        
        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID chương trình' }, { status: 400 })
        }

        await deleteChuongTrinh(parseInt(id))
        return NextResponse.json({ message: 'Xóa thành công' })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi xóa chương trình học' }, { status: 500 })
    }
}