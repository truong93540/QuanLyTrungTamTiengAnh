import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'public/templates/MauChamCong.xlsx')
        const fileBuffer = readFileSync(filePath)

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="MauChamCong.xlsx"',
                'Cache-Control': 'public, max-age=3600',
            },
        })
    } catch (error) {
        console.error('Lỗi đọc file mẫu:', error)
        return NextResponse.json({ error: 'Không thể tải file mẫu.' }, { status: 500 })
    }
}
