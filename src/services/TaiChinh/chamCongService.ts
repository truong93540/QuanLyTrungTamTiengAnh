import { prisma } from '@/lib/prisma'
import { CA_DAY_CONFIG } from '@/constants/caDay'

export interface RawChamCongData {
    ma_id: string
    loai: 'GV' | 'NS'
    ngay: string | Date
    intervals: { vao: string; ra: string }[]
}

const timeToMin = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
}

const minToTime = (min: number) => {
    const h = Math.floor(min / 60).toString().padStart(2, '0')
    const m = (min % 60).toString().padStart(2, '0')
    return `${h}:${m}`
}

const OFFICE_HOURS = {
    MORNING_START: timeToMin('08:00'),
    MORNING_END: timeToMin('12:00'),
    AFTERNOON_START: timeToMin('13:30'),
    AFTERNOON_END: timeToMin('17:30'),
    GRACE_PERIOD: 0 // Tính muộn ngay từ phút đầu tiên
}

export const calculateDayMetrics = (data: RawChamCongData, expectedShifts: number[]) => {
    const metrics: any = {
        phut_muon: 0,
        phut_som: 0,
        so_lan_muon: 0,
        so_lan_som: 0,
        gio_lam_thuong: 0,
        gio_tang_ca: 0,
        shiftSlots: {} as any
    }

    const vaoRas: {v: number | null, r: number | null}[] = []
    
    const parseToMin = (t: any) => {
        if (!t || typeof t !== 'string' || !t.includes(':')) return null
        const [h, m] = t.split(':').map(Number)
        return isNaN(h) || isNaN(m) ? null : h * 60 + m
    }

    // 1. Ưu tiên lấy từ intervals mảng
    if (data.intervals && data.intervals.length > 0) {
        data.intervals.forEach((inv: any) => {
            const v = parseToMin(inv.vao)
            const r = parseToMin(inv.ra)
            if (v !== null || r !== null) vaoRas.push({ v, r })
        })
    } 
    // 2. Dự phòng: Lấy từ các trường lẻ gio_vao_1...6
    else {
        for (let i = 1; i <= 6; i++) {
            const v = parseToMin((data as any)[`gio_vao_${i}`])
            const r = parseToMin((data as any)[`gio_ra_${i}`])
            if (v !== null || r !== null) vaoRas.push({ v, r })
        }
    }

    // Làm sạch và ghép cặp vaoRas
    // Các máy chấm công đôi khi trả về mảng các lần quét (v, v, v...) thay vì (v, r) rõ ràng
    const allTimes: number[] = [];
    vaoRas.forEach(vr => {
        if (vr.v !== null) allTimes.push(vr.v);
        if (vr.r !== null) allTimes.push(vr.r);
    });
    
    // Sắp xếp các mốc thời gian tăng dần
    allTimes.sort((a, b) => a - b);
    
    const pairedVaoRas: {v: number | null, r: number | null}[] = [];
    for (let i = 0; i < allTimes.length; i += 2) {
        pairedVaoRas.push({
            v: allTimes[i],
            r: i + 1 < allTimes.length ? allTimes[i + 1] : null
        });
    }

    // LUÔN ĐIỀN GIỜ QUÉT THẺ THÔ TRƯỚC CHO MỌI ĐỐI TƯỢNG (Để Tooltip luôn có dữ liệu)
    pairedVaoRas.forEach((vr, idx) => {
        if (idx < 6) {
            metrics.shiftSlots[`gio_vao_${idx+1}`] = vr.v !== null ? minToTime(vr.v) : null
            metrics.shiftSlots[`gio_ra_${idx+1}`] = vr.r !== null ? minToTime(vr.r) : null
        }
    })

    if (data.loai === 'GV') {
        if (expectedShifts.length > 0) {
            // Khởi tạo lại tất cả ca về null trước để tránh bị rác dữ liệu thô (raw) gán sai ca phía trên
            for (let i = 1; i <= 6; i++) {
                metrics.shiftSlots[`gio_vao_${i}`] = null
                metrics.shiftSlots[`gio_ra_${i}`] = null
            }

            const allTimes: number[] = []
            vaoRas.forEach(vr => {
                if (vr.v !== null) allTimes.push(vr.v)
                if (vr.r !== null) allTimes.push(vr.r)
            })
            allTimes.sort((a, b) => a - b)

            const minVao = allTimes.length > 0 ? allTimes[0] : null
            const maxRa = allTimes.length > 1 ? allTimes[allTimes.length - 1] : null

            expectedShifts.forEach(caNum => {
                const config = CA_DAY_CONFIG.find(c => c.ca === caNum)
                if (!config) return
                const caStart = timeToMin(config.vao)
                const caEnd = timeToMin(config.ra)

                // Kiểm tra sự giao thoa giữa thời gian có mặt tổng thể của giáo viên trong ngày [minVao, maxRa] và ca học [caStart, caEnd]
                if (minVao !== null && maxRa !== null && Math.max(minVao, caStart) < Math.min(maxRa, caEnd)) {
                    // Thiết lập khoảng chấm công cho ca học là khoảng bao phủ rộng nhất của ngày
                    metrics.shiftSlots[`gio_vao_${caNum}`] = minToTime(minVao)
                    metrics.shiftSlots[`gio_ra_${caNum}`] = minToTime(maxRa)
                    
                    if (minVao > caStart + OFFICE_HOURS.GRACE_PERIOD) {
                        metrics.phut_muon += (minVao - caStart)
                        metrics.so_lan_muon++
                    }
                    if (maxRa < caEnd - OFFICE_HOURS.GRACE_PERIOD) {
                        metrics.phut_som += (caEnd - maxRa)
                        metrics.so_lan_som++
                    }
                    metrics.gio_lam_thuong += 2
                }
            })
        }
    } else {
        // Lọc ra các cặp hoàn chỉnh để tính công cho nhân sự hành chính
        const fullVaoRas = pairedVaoRas.filter(vr => vr.v !== null && vr.r !== null) as {v: number, r: number}[]
        
        if (fullVaoRas.length > 0) {
            let officeMins = 0
            let outsideMins = 0

            fullVaoRas.forEach(vr => {
                // Block sáng: 8:00 - 12:00
                const startM = Math.max(vr.v, OFFICE_HOURS.MORNING_START)
                const endM = Math.min(vr.r, OFFICE_HOURS.MORNING_END)
                const morningOfficeMins = Math.max(0, endM - startM)

                // Block chiều: 13:30 - 17:30
                const startA = Math.max(vr.v, OFFICE_HOURS.AFTERNOON_START)
                const endA = Math.min(vr.r, OFFICE_HOURS.AFTERNOON_END)
                const afternoonOfficeMins = Math.max(0, endA - startA)

                // Tính tăng ca: chỉ tính thời gian trước 08:00 và sau 17:30 (loại bỏ hoàn toàn nghỉ trưa 12:00-13:30)
                const beforeOfficeMins = Math.max(0, OFFICE_HOURS.MORNING_START - vr.v)
                const afterOfficeMins = Math.max(0, vr.r - OFFICE_HOURS.AFTERNOON_END)

                officeMins += (morningOfficeMins + afternoonOfficeMins)
                outsideMins += (beforeOfficeMins + afterOfficeMins)
            })

            metrics.gio_lam_thuong = Math.round(officeMins / 60)
            metrics.gio_tang_ca = Math.round(outsideMins / 60)

            const sorted = fullVaoRas.sort((a, b) => a.v - b.v)
            const firstVao = sorted[0].v
            const lastRa = sorted[sorted.length - 1].r

            if (firstVao > OFFICE_HOURS.MORNING_START + OFFICE_HOURS.GRACE_PERIOD) {
                metrics.phut_muon = firstVao - OFFICE_HOURS.MORNING_START
                metrics.so_lan_muon = 1
            }
            if (lastRa < OFFICE_HOURS.AFTERNOON_END - OFFICE_HOURS.GRACE_PERIOD) {
                metrics.phut_som = OFFICE_HOURS.AFTERNOON_END - lastRa
                metrics.so_lan_som = 1
            }
        }
    }
    return metrics
}

export const getExpectedShifts = async (tx: any, loai: string, ma_id: number, ngay: Date) => {
    let expectedShifts: number[] = []
    if (loai === 'GV') {
        const thuValue = ngay.getDay() === 0 ? 8 : ngay.getDay() + 1
        const phanCong = await tx.phanCongGiangDay.findMany({
            where: { ma_giao_vien: ma_id },
            include: { lop_hoc: true }
        })
        phanCong.forEach((pc: any) => {
            const lich = typeof pc.lop_hoc.lich_hoc === 'string' ? JSON.parse(pc.lop_hoc.lich_hoc) : (pc.lop_hoc.lich_hoc || [])
            lich.forEach((l: any) => { if (Number(l.thu) === thuValue) expectedShifts.push(Number(l.ca)) })
        })
    }
    return expectedShifts
}

export const ghiNhanChamCongNgay = async (data: RawChamCongData) => {
    const ngay = new Date(data.ngay)
    ngay.setHours(12, 0, 0, 0)
    
    const dayOfMonth = ngay.getDate()
    const monthYear = `${(ngay.getMonth() + 1).toString().padStart(2, '0')}-${ngay.getFullYear()}`
    const kyChamCong = `T${monthYear}`

    return await prisma.$transaction(async (tx: any) => {
        const expectedShifts = await getExpectedShifts(tx, data.loai, Number(data.ma_id), ngay)
        const metrics = calculateDayMetrics({ ...data, ngay }, expectedShifts)

        let bang = await tx.bangChamCong.findFirst({ where: { ky_cham_cong: kyChamCong } })
        if (!bang) bang = await tx.bangChamCong.create({ data: { ky_cham_cong: kyChamCong, trang_thai: 'Đang mở' } })

        let phieu = await tx.phieuChamCong.findFirst({
            where: { ma_bang_cham_cong: bang.ma_bang_cham_cong, ma_nhan_su: data.loai === 'NS' ? Number(data.ma_id) : null, ma_giao_vien: data.loai === 'GV' ? Number(data.ma_id) : null }
        })

        if (!phieu) {
            const hoTen = data.loai === 'NS' 
                ? (await tx.nhanSu.findUnique({ where: { ma_nhan_su: Number(data.ma_id) } }))?.ho_ten 
                : (await tx.giaoVien.findUnique({ where: { ma_giao_vien: Number(data.ma_id) } }))?.ho_ten
            phieu = await tx.phieuChamCong.create({
                data: { ma_bang_cham_cong: bang.ma_bang_cham_cong, ma_nhan_su: data.loai === 'NS' ? Number(data.ma_id) : null, ma_giao_vien: data.loai === 'GV' ? Number(data.ma_id) : null, ho_ten: hoTen || 'N/A' }
            })
        }

        await tx.chiTietChamCong.deleteMany({ where: { ma_phieu_cham_cong: phieu.ma_phieu_cham_cong, ngay } })
        await tx.chiTietChamCong.create({
            data: {
                ma_phieu_cham_cong: phieu.ma_phieu_cham_cong,
                ngay,
                ma_nhan_su: data.loai === 'NS' ? Number(data.ma_id) : null,
                ma_giao_vien: data.loai === 'GV' ? Number(data.ma_id) : null,
                ...metrics.shiftSlots
            }
        })
        
        // VỚI GIÁO VIÊN: Không có tăng ca và không tách biệt ngày nghỉ (Tất cả tính là giờ thường)
        const isW = data.loai === 'GV' ? false : (ngay.getDay() === 0 || ngay.getDay() === 6)
        const finalGioThuong = data.loai === 'GV' ? (metrics.gio_lam_thuong + metrics.gio_tang_ca) : metrics.gio_lam_thuong
        const finalTangCa = data.loai === 'GV' ? 0 : metrics.gio_tang_ca
        
        await tx.phieuChamCong.update({
            where: { ma_phieu_cham_cong: phieu.ma_phieu_cham_cong },
            data: {
                [`ngay_${dayOfMonth}`]: metrics.gio_lam_thuong + metrics.gio_tang_ca,
                so_lan_di_muon: { increment: metrics.so_lan_muon },
                so_lan_ve_som: { increment: metrics.so_lan_som },
                so_gio_lam_viec_thuong: { increment: isW ? 0 : finalGioThuong },
                so_gio_tang_ca_ngay_thuong: { increment: isW ? 0 : finalTangCa },
                so_gio_lam_viec_thuong_ngay_nghi: { increment: isW ? finalGioThuong : 0 },
                so_gio_tang_ca_ngay_nghi: { increment: isW ? finalTangCa : 0 },
                tong_so_gio_lam_viec: { increment: metrics.gio_lam_thuong + metrics.gio_tang_ca }
            }
        })

        return { success: true }
    })
}
