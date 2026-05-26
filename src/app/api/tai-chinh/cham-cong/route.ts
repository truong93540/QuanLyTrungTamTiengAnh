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

            const isW = loai === 'GV' ? false : (ngay.getDay() === 0 || ngay.getDay() === 6)
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
        }

        // --- NẾU LÀ XEM TRƯỚC ---
        if (isPreview) {
            // Lấy tất cả nhân sự và giáo viên từ database
            const [allNhanSu, allGiaoVien] = await Promise.all([
                prisma.nhanSu.findMany({ orderBy: { ho_ten: 'asc' } }),
                prisma.giaoVien.findMany({
                    include: { phan_cong_giang_day: { include: { lop_hoc: true } } },
                    orderBy: { ho_ten: 'asc' }
                })
            ])

            // Những ai đã có trong previewMap
            const coPreviewNS = new Set<number>()
            const coPreviewGV = new Set<number>()
            previewMap.forEach((v) => {
                if (v.ma_nhan_su) coPreviewNS.add(v.ma_nhan_su)
                if (v.ma_giao_vien) coPreviewGV.add(v.ma_giao_vien)
            })

            const emptyPhieu = (ho_ten: string, ma_nhan_su: number | null, ma_giao_vien: number | null, giao_vien?: any) => ({
                ma_phieu_cham_cong: null,
                ho_ten,
                ma_nhan_su,
                ma_giao_vien,
                ma_bang_cham_cong: null,
                trang_thai: null,
                so_ngay_cong: 0,
                tong_so_gio_lam_viec: 0,
                so_lan_di_muon: 0,
                so_lan_ve_som: 0,
                so_gio_lam_viec_thuong: 0,
                so_gio_tang_ca_ngay_thuong: 0,
                so_gio_lam_viec_thuong_ngay_nghi: 0,
                so_gio_tang_ca_ngay_nghi: 0,
                bao_hiem_xa_hoi: 0,
                chi_tiet_phu_cap: null,
                tien_hoa_hong: 0,
                chi_tiet_cham_cong: [],
                giao_vien: giao_vien || null,
                ngay_1: 0, ngay_2: 0, ngay_3: 0, ngay_4: 0, ngay_5: 0, ngay_6: 0, ngay_7: 0,
                ngay_8: 0, ngay_9: 0, ngay_10: 0, ngay_11: 0, ngay_12: 0, ngay_13: 0, ngay_14: 0,
                ngay_15: 0, ngay_16: 0, ngay_17: 0, ngay_18: 0, ngay_19: 0, ngay_20: 0, ngay_21: 0,
                ngay_22: 0, ngay_23: 0, ngay_24: 0, ngay_25: 0, ngay_26: 0, ngay_27: 0, ngay_28: 0,
                ngay_29: 0, ngay_30: 0, ngay_31: 0,
                _chuaChamCong: true
            })

            const emptyNS = allNhanSu
                .filter(ns => !coPreviewNS.has(ns.ma_nhan_su))
                .map(ns => emptyPhieu(ns.ho_ten, ns.ma_nhan_su, null))

            const emptyGV = allGiaoVien
                .filter(gv => !coPreviewGV.has(gv.ma_giao_vien))
                .map(gv => emptyPhieu(gv.ho_ten, null, gv.ma_giao_vien, gv))

            // Gộp và sắp xếp y hệt như GET
            const data = [...Array.from(previewMap.values()), ...emptyNS, ...emptyGV]
                .sort((a, b) => {
                    const idA = a.ma_nhan_su ?? a.ma_giao_vien ?? 0
                    const idB = b.ma_nhan_su ?? b.ma_giao_vien ?? 0
                    const isNS_A = a.ma_nhan_su != null
                    const isNS_B = b.ma_nhan_su != null
                    if (isNS_A !== isNS_B) return isNS_A ? -1 : 1
                    return idA - idB
                })

            return NextResponse.json({ success: true, data })
        }

        // --- NẾU LƯU TRỰC TIẾP ---
        const listItems = Array.from(previewMap.values())
        if (listItems.length > 0) {
            await prisma.$transaction(async (tx) => {
                // 1. Đảm bảo có Bảng chấm công cho tháng này
                let bang = await tx.bangChamCong.findFirst({ where: { ky_cham_cong: apiMonth } })
                if (!bang) {
                    bang = await tx.bangChamCong.create({ 
                        data: { ky_cham_cong: apiMonth, trang_thai: 'Đang mở' } 
                    })
                } else {
                    // RESET TOÀN BỘ PHIẾU CHẤM CÔNG CỦA THÁNG VỀ 0 TRƯỚC ĐỂ XÓA RÁC VÀ PHÒNG TRỪ CÔNG CŨ
                    await tx.phieuChamCong.updateMany({
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

                // 2. Xử lý từng nhân sự
                for (const item of listItems) {
                    const person = item.ma_nhan_su 
                        ? await tx.nhanSu.findUnique({ where: { ma_nhan_su: item.ma_nhan_su } })
                        : await tx.giaoVien.findUnique({ where: { ma_giao_vien: item.ma_giao_vien } })

                    if (!person) {
                        console.log(`Skip Save: Không tìm thấy mã ${item.ma_nhan_su || item.ma_giao_vien}`)
                        continue
                    }

                    const ngayFields: Record<string, number> = {}
                    for (let i = 1; i <= 31; i++) {
                        ngayFields[`ngay_${i}`] = 0
                    }

                    Object.entries(item).forEach(([key, val]) => {
                        if (key.startsWith('ngay_') && val !== undefined && val !== null) {
                            ngayFields[key] = Number(val)
                        }
                    })

                    // Tìm hoặc tạo Phiếu chấm công
                    let phieu = await tx.phieuChamCong.findFirst({
                        where: { 
                            ma_bang_cham_cong: bang.ma_bang_cham_cong, 
                            ma_nhan_su: item.ma_nhan_su || null, 
                            ma_giao_vien: item.ma_giao_vien || null 
                        }
                    })

                    // Cập nhật hoặc tạo mới Phiếu chấm công
                    if (phieu) {
                        phieu = await tx.phieuChamCong.update({
                            where: { ma_phieu_cham_cong: phieu.ma_phieu_cham_cong },
                            data: {
                                ...ngayFields,
                                so_lan_di_muon: item.so_lan_di_muon || 0,
                                so_lan_ve_som: item.so_lan_ve_som || 0,
                                so_gio_lam_viec_thuong: item.so_gio_lam_viec_thuong || 0,
                                so_gio_tang_ca_ngay_thuong: item.so_gio_tang_ca_ngay_thuong || 0,
                                so_gio_lam_viec_thuong_ngay_nghi: item.so_gio_lam_viec_thuong_ngay_nghi || 0,
                                so_gio_tang_ca_ngay_nghi: item.so_gio_tang_ca_ngay_nghi || 0,
                                tong_so_gio_lam_viec: item.tong_so_gio_lam_viec || 0
                            }
                        })
                    } else {
                        phieu = await tx.phieuChamCong.create({
                            data: {
                                ma_bang_cham_cong: bang.ma_bang_cham_cong,
                                ma_nhan_su: item.ma_nhan_su || null,
                                ma_giao_vien: item.ma_giao_vien || null,
                                ho_ten: item.ho_ten || 'N/A',
                                ...ngayFields,
                                so_lan_di_muon: item.so_lan_di_muon || 0,
                                so_lan_ve_som: item.so_lan_ve_som || 0,
                                so_gio_lam_viec_thuong: item.so_gio_lam_viec_thuong || 0,
                                so_gio_tang_ca_ngay_thuong: item.so_gio_tang_ca_ngay_thuong || 0,
                                so_gio_lam_viec_thuong_ngay_nghi: item.so_gio_lam_viec_thuong_ngay_nghi || 0,
                                so_gio_tang_ca_ngay_nghi: item.so_gio_tang_ca_ngay_nghi || 0,
                                tong_so_gio_lam_viec: item.tong_so_gio_lam_viec || 0
                            }
                        })
                    }

                    // LƯU CHI TIẾT CHẤM CÔNG (Để Tooltip hiển thị)
                    if (item.chi_tiet_cham_cong && Array.isArray(item.chi_tiet_cham_cong)) {
                        await tx.chiTietChamCong.deleteMany({
                            where: { ma_phieu_cham_cong: phieu.ma_phieu_cham_cong }
                        })

                        await tx.chiTietChamCong.createMany({
                            data: item.chi_tiet_cham_cong.map((ct: any) => ({
                                ma_phieu_cham_cong: phieu.ma_phieu_cham_cong,
                                ma_nhan_su: item.ma_nhan_su || null,
                                ma_giao_vien: item.ma_giao_vien || null,
                                ngay: (() => {
                                    const d = new Date(ct.ngay)
                                    d.setHours(12, 0, 0, 0)
                                    return d
                                })(),
                                gio_vao_1: ct.gio_vao_1, gio_ra_1: ct.gio_ra_1,
                                gio_vao_2: ct.gio_vao_2, gio_ra_2: ct.gio_ra_2,
                                gio_vao_3: ct.gio_vao_3, gio_ra_3: ct.gio_ra_3,
                                gio_vao_4: ct.gio_vao_4, gio_ra_4: ct.gio_ra_4,
                                gio_vao_5: ct.gio_vao_5, gio_ra_5: ct.gio_ra_5,
                                gio_vao_6: ct.gio_vao_6, gio_ra_6: ct.gio_ra_6
                            }))
                        })
                    }
                }
            })
        }

        return NextResponse.json({ success: true })
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

        // 1. Lấy các phiếu chấm công đã có
        const phieuList = await prisma.phieuChamCong.findMany({
            where: { bang_cham_cong: { ky_cham_cong: month } },
            include: {
                chi_tiet_cham_cong: { orderBy: { ngay: 'asc' } },
                giao_vien: { include: { phan_cong_giang_day: { include: { lop_hoc: true } } } }
            },
            orderBy: { ho_ten: 'asc' }
        })

        // 2. Lấy tất cả nhân sự và giáo viên trong DB
        const [allNhanSu, allGiaoVien] = await Promise.all([
            prisma.nhanSu.findMany({ orderBy: { ho_ten: 'asc' } }),
            prisma.giaoVien.findMany({
                include: { phan_cong_giang_day: { include: { lop_hoc: true } } },
                orderBy: { ho_ten: 'asc' }
            })
        ])

        // 3. Tạo set mã những người đã có phiếu chấm công
        const coPhieuNS = new Set(phieuList.filter(p => p.ma_nhan_su).map(p => p.ma_nhan_su))
        const coPhieuGV = new Set(phieuList.filter(p => p.ma_giao_vien).map(p => p.ma_giao_vien))

        // 4. Tạo phiếu giả (rỗng) cho những người chưa có dữ liệu chấm công
        const emptyPhieu = (ho_ten: string, ma_nhan_su: number | null, ma_giao_vien: number | null, giao_vien?: any) => ({
            ma_phieu_cham_cong: null,
            ho_ten,
            ma_nhan_su,
            ma_giao_vien,
            ma_bang_cham_cong: null,
            trang_thai: null,
            so_ngay_cong: 0,
            tong_so_gio_lam_viec: 0,
            so_lan_di_muon: 0,
            so_lan_ve_som: 0,
            so_gio_lam_viec_thuong: 0,
            so_gio_tang_ca_ngay_thuong: 0,
            so_gio_lam_viec_thuong_ngay_nghi: 0,
            so_gio_tang_ca_ngay_nghi: 0,
            bao_hiem_xa_hoi: 0,
            chi_tiet_phu_cap: null,
            tien_hoa_hong: 0,
            chi_tiet_cham_cong: [],
            giao_vien: giao_vien || null,
            ngay_1: 0, ngay_2: 0, ngay_3: 0, ngay_4: 0, ngay_5: 0, ngay_6: 0, ngay_7: 0,
            ngay_8: 0, ngay_9: 0, ngay_10: 0, ngay_11: 0, ngay_12: 0, ngay_13: 0, ngay_14: 0,
            ngay_15: 0, ngay_16: 0, ngay_17: 0, ngay_18: 0, ngay_19: 0, ngay_20: 0, ngay_21: 0,
            ngay_22: 0, ngay_23: 0, ngay_24: 0, ngay_25: 0, ngay_26: 0, ngay_27: 0, ngay_28: 0,
            ngay_29: 0, ngay_30: 0, ngay_31: 0,
            _chuaChamCong: true // đánh dấu chưa có dữ liệu
        })

        const emptyNS = allNhanSu
            .filter(ns => !coPhieuNS.has(ns.ma_nhan_su))
            .map(ns => emptyPhieu(ns.ho_ten, ns.ma_nhan_su, null))

        const emptyGV = allGiaoVien
            .filter(gv => !coPhieuGV.has(gv.ma_giao_vien))
            .map(gv => emptyPhieu(gv.ho_ten, null, gv.ma_giao_vien, gv))

        // 5. Gộp: phiếu đã có + phiếu rỗng, sắp xếp theo mã ID tăng dần (NS trước, GV sau)
        const data = [...phieuList, ...emptyNS, ...emptyGV]
            .sort((a, b) => {
                const idA = a.ma_nhan_su ?? a.ma_giao_vien ?? 0
                const idB = b.ma_nhan_su ?? b.ma_giao_vien ?? 0
                const isNS_A = a.ma_nhan_su != null
                const isNS_B = b.ma_nhan_su != null
                // Nhân sự luôn xếp trước giáo viên, rồi mới sort theo mã tăng dần
                if (isNS_A !== isNS_B) return isNS_A ? -1 : 1
                return idA - idB
            })

        return NextResponse.json({ data })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
    }
}
