import { NextResponse } from 'next/server'
import * as xlsx from 'xlsx'
import { prisma } from '@/lib/prisma'
import { calculateDayMetrics, getExpectedShifts, ghiNhanChamCongNgay } from '@/services/TaiChinh/chamCongService'

const normalizeHeader = (s: any) => {
    if (!s) return ''
    return s.toString()
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .trim()
        .replace(/\s+/g, '_')
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        let apiMonth = formData.get('month') as string
        const isPreview = formData.get('isPreview') === 'true'

        if (apiMonth && !apiMonth.startsWith('T')) {
            apiMonth = `T${apiMonth.replace('/', '-')}`
        }

        if (!file) return NextResponse.json({ error: 'Vui lòng chọn file Excel' }, { status: 400 })
        if (!apiMonth) return NextResponse.json({ error: 'Vui lòng chọn tháng chấm công' }, { status: 400 })

        const buffer = Buffer.from(await file.arrayBuffer())
        const workbook = xlsx.read(buffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const rows: any[][] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
        
        let headerRowIndex = rows.findIndex(row => 
            row.some(cell => {
                const s = normalizeHeader(cell)
                return s.includes('ma_nhan_su') || s.includes('ho_ten') || s.includes('ma_id')
            })
        )
        if (headerRowIndex === -1) headerRowIndex = 0

        const headers = rows[headerRowIndex].map(h => normalizeHeader(h))
        const dataRows = rows.slice(headerRowIndex + 1)
        const jsonData = dataRows.map(row => {
            const obj: any = {}
            headers.forEach((h, i) => { if (h) obj[h] = row[i] })
            return obj
        })

        const parseDate = (v: any) => {
            if (!v) return null
            if (typeof v === 'number') {
                // Chuyển đổi số Serial Excel sang Date (25569 là mốc 1/1/1970)
                const date = new Date(Math.round((v - 25569) * 86400 * 1000))
                date.setHours(12, 0, 0, 0)
                return date
            }
            if (typeof v === 'string') {
                const parts = v.split(/[\/\-]/).map(p => p.trim())
                if (parts.length === 3) {
                    // MM/DD/YYYY
                    const m = parseInt(parts[0]) - 1
                    const d = parseInt(parts[1])
                    const y = parseInt(parts[2])
                    if (!isNaN(m) && !isNaN(d) && !isNaN(y)) {
                        const date = new Date(y, m, d)
                        date.setHours(12, 0, 0, 0)
                        return date
                    }
                }
            }
            const dObj = new Date(v)
            if (!isNaN(dObj.getTime())) {
                dObj.setHours(12, 0, 0, 0)
                return dObj
            }
            return null
        }

        const parseTime = (v: any) => {
            if (v === undefined || v === null || v === '') return null
            // Trường hợp Excel trả về đối tượng Date (thường gặp khi ô định dạng Time)
            if (v instanceof Date) {
                return { h: v.getHours(), m: v.getMinutes() }
            }
            if (typeof v === 'number') {
                const totalSeconds = Math.round(v * 24 * 3600)
                const h = Math.floor(totalSeconds / 3600)
                const m = Math.floor((totalSeconds % 3600) / 60)
                return { h, m }
            }
            if (typeof v === 'string') {
                const parts = v.trim().split(/[:h]/)
                if (parts.length >= 2) {
                    return { h: parseInt(parts[0]), m: parseInt(parts[1]) }
                }
            }
            return null
        }

        const previewMap = new Map<string, any>()

        if (!isPreview) {
            const bang = await prisma.bangChamCong.findFirst({ where: { ky_cham_cong: apiMonth } })
            if (bang) {
                // Xoá tất cả chi tiết chấm công cũ của tháng này trước khi ghi nhận mới
                await prisma.chiTietChamCong.deleteMany({
                    where: {
                        phieu_cham_cong: {
                            ma_bang_cham_cong: bang.ma_bang_cham_cong
                        }
                    }
                })
                // Reset toàn bộ công và chỉ số tích lũy về 0
                await prisma.phieuChamCong.updateMany({
                    where: { ma_bang_cham_cong: bang.ma_bang_cham_cong },
                    data: {
                        ngay_1: 0, ngay_2: 0, ngay_3: 0, ngay_4: 0, ngay_5: 0, ngay_6: 0, ngay_7: 0, ngay_8: 0, ngay_9: 0, ngay_10: 0,
                        ngay_11: 0, ngay_12: 0, ngay_13: 0, ngay_14: 0, ngay_15: 0, ngay_16: 0, ngay_17: 0, ngay_18: 0, ngay_19: 0, ngay_20: 0,
                        ngay_21: 0, ngay_22: 0, ngay_23: 0, ngay_24: 0, ngay_25: 0, ngay_26: 0, ngay_27: 0, ngay_28: 0, ngay_29: 0, ngay_30: 0, ngay_31: 0,
                        tong_so_gio_lam_viec: 0,
                        so_lan_di_muon: 0,
                        so_lan_ve_som: 0,
                        so_gio_lam_viec_thuong: 0,
                        so_gio_tang_ca_ngay_thuong: 0,
                        so_gio_lam_viec_thuong_ngay_nghi: 0,
                        so_gio_tang_ca_ngay_nghi: 0
                    }
                })
            }
        }

        for (const rowObj of jsonData) {
            const data: any = { intervals: [] }
            const tempVao: Record<number, any> = {}
            const tempRa: Record<number, any> = {}

            Object.entries(rowObj).forEach(([k, v]) => {
                const key = k.toLowerCase()
                if (key.includes('ngay')) data.ngay = v
                if (key.includes('ma_nhan_su') || key.includes('ma_id') || key.includes('ma_nv') || key.includes('ma_gv')) data.rawId = String(v)
                
                // Trích xuất số thứ tự cột (1-10)
                const matchNum = key.match(/\d+/)
                if (matchNum) {
                    const num = parseInt(matchNum[0])
                    if (num >= 1 && num <= 10) {
                        const isVao = key.includes('vao') || key.includes('in') || key.includes('den') || key.includes('check') || key.includes('time')
                        const isRa = key.includes('ra') || key.includes('out') || key.includes('ve')
                        if (isVao) tempVao[num] = v
                        if (isRa) tempRa[num] = v
                    }
                }
            })

            // Chuyển đổi sang intervals và gán trực tiếp vào data
            for (let i = 1; i <= 10; i++) {
                const tVao = parseTime(tempVao[i])
                const tRa = parseTime(tempRa[i])
                if (tVao || tRa) {
                    const vStr = tVao ? `${tVao.h.toString().padStart(2, '0')}:${tVao.m.toString().padStart(2, '0')}` : null
                    const rStr = tRa ? `${tRa.h.toString().padStart(2, '0')}:${tRa.m.toString().padStart(2, '0')}` : null
                    
                    data.intervals.push({ vao: vStr, ra: rStr })
                    // Gán thêm vào các trường lẻ để chắc chắn calculateDayMetrics đọc được
                    data[`gio_vao_${i}`] = vStr
                    data[`gio_ra_${i}`] = rStr
                }
            }

            if (!data.ngay || !data.rawId) continue
            const ngay = parseDate(data.ngay)
            if (!ngay || isNaN(ngay.getTime())) continue

            const targetMonth = `T${(ngay.getMonth() + 1).toString().padStart(2, '0')}-${ngay.getFullYear()}`
            if (targetMonth !== apiMonth) continue

            const ma_id = parseInt(data.rawId.replace(/[^0-9]/g, ''))
            const loai = data.rawId.startsWith('GV') ? 'GV' : 'NS'
            data.ma_id = ma_id
            data.loai = loai
            
            data.ngay = `${ngay.getFullYear()}-${(ngay.getMonth() + 1).toString().padStart(2, '0')}-${ngay.getDate().toString().padStart(2, '0')}`

            if (isPreview) {
                const info = loai === 'NS' 
                    ? await prisma.nhanSu.findUnique({ where: { ma_nhan_su: ma_id } }) 
                    : await prisma.giaoVien.findUnique({ 
                        where: { ma_giao_vien: ma_id },
                        include: { phan_cong_giang_day: { include: { lop_hoc: true } } }
                    })
                
                if (!info) continue

                const key = `${loai}-${ma_id}`
                if (!previewMap.has(key)) {
                    previewMap.set(key, { 
                        ma_nhan_su: loai === 'NS' ? ma_id : null, 
                        ma_giao_vien: loai === 'GV' ? ma_id : null, 
                        giao_vien: loai === 'GV' ? info : null,
                        ho_ten: info.ho_ten || 'N/A', 
                        chi_tiet_cham_cong: [],
                        so_lan_di_muon: 0, so_lan_ve_som: 0, so_gio_lam_viec_thuong: 0, so_gio_tang_ca_ngay_thuong: 0,
                        so_gio_lam_viec_thuong_ngay_nghi: 0, so_gio_tang_ca_ngay_nghi: 0, 
                        tong_so_gio_lam_viec: 0, tong_so_ngay_cong: 0
                    })
                }
                const phieu = previewMap.get(key)
                const expectedShifts = await getExpectedShifts(prisma, loai, ma_id, ngay)
                const metrics = calculateDayMetrics(data, expectedShifts)
                const day = ngay.getDate()
                
                const totalDayWork = metrics.gio_lam_thuong + metrics.gio_tang_ca
                phieu[`ngay_${day}`] = (phieu[`ngay_${day}`] || 0) + totalDayWork
                
                // Tính ngày công cho nhân sự văn phòng
                if (loai === 'NS' && totalDayWork > 0) {
                    phieu.tong_so_ngay_cong += 1
                }
                
                let ct = phieu.chi_tiet_cham_cong.find((c: any) => c.day === day)
                if (!ct) {
                    ct = { day, ngay: data.ngay, ...metrics.shiftSlots }
                    phieu.chi_tiet_cham_cong.push(ct)
                } else {
                    Object.assign(ct, metrics.shiftSlots)
                }

                const isW = loai === 'GV' ? false : (ngay.getDay() === 0)
                const finalGioThuong = loai === 'GV' ? (metrics.gio_lam_thuong + metrics.gio_tang_ca) : metrics.gio_lam_thuong
                const finalTangCa = loai === 'GV' ? 0 : metrics.gio_tang_ca

                if (isW) {
                    phieu.so_gio_lam_viec_thuong_ngay_nghi += finalGioThuong
                    phieu.so_gio_tang_ca_ngay_nghi += finalTangCa
                } else {
                    phieu.so_gio_lam_viec_thuong += finalGioThuong
                    phieu.so_gio_tang_ca_ngay_thuong += finalTangCa
                }
                phieu.so_lan_di_muon += metrics.so_lan_muon
                phieu.so_lan_ve_som += metrics.so_lan_som
                phieu.tong_so_gio_lam_viec += (metrics.gio_lam_thuong + metrics.gio_tang_ca)
            } else {
                await ghiNhanChamCongNgay(data)
            }
        }

        return NextResponse.json({ success: true, data: isPreview ? Array.from(previewMap.values()) : undefined })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const month = searchParams.get('month')
        if (!month) return NextResponse.json({ error: 'Thiếu tháng' }, { status: 400 })
        const data = await prisma.phieuChamCong.findMany({
            where: { bang_cham_cong: { ky_cham_cong: month } },
            include: { 
                chi_tiet_cham_cong: { orderBy: { ngay: 'asc' } },
                giao_vien: { include: { phan_cong_giang_day: { include: { lop_hoc: true } } } }
            },
            orderBy: { ho_ten: 'asc' }
        })
        return NextResponse.json({ data })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
    }
}
