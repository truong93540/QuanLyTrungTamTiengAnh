'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { FaTimes, FaSave } from 'react-icons/fa'

interface Quyen {
    ma_quyen: number
    ten_quyen: string
}

interface Account {
    ma_tai_khoan?: number
    ma_nhan_su?: number
    ma_giao_vien?: number
    ten_dang_nhap: string
    trang_thai: string
    quyen_ids?: number[]
    ho_ten: string
}

interface AccountModalProps {
    account?: Account | null
    onClose: (shouldRefresh?: boolean) => void
}

type RoleType = 'ke-toan' | 'dao-tao' | 'sale-marketing' | 'giao-vien' | 'tro-giang' | 'admin'

type RolePermissionsType = Record<RoleType, string[]>

export default function AccountModal({ account, onClose }: AccountModalProps) {
    const isEditMode = !!account

    const [formData, setFormData] = useState({
        ma_id: '',
        ten_dang_nhap: '',
        mat_khau: '',
        trang_thai: 'Hoạt động',
    })

    // Thay đổi từ loai thành role
    const [role, setRole] = useState<RoleType>('ke-toan')
    const [nhanSuName, setNhanSuName] = useState('')
    const [nhanSuError, setNhanSuError] = useState('')
    const [isFetchingNhanSu, setIsFetchingNhanSu] = useState(false)

    const [quyenList, setQuyenList] = useState<Quyen[]>([])
    const [selectedQuyenIds, setSelectedQuyenIds] = useState<number[]>([])
    const [defaultQuyenIds, setDefaultQuyenIds] = useState<number[]>([])
    const [additionalQuyenIds, setAdditionalQuyenIds] = useState<number[]>([])

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // Định nghĩa quyền mặc định cho từng role
    const rolePermissions: RolePermissionsType = useMemo(
        () => ({
            'ke-toan': [
                'Quản lý phiếu thu học phí',
                'Quản lý bảng lương',
                'Quản lý phiếu chi',
                'Quản lý thưởng',
                'Quản lý công nợ',
                'Quản lý chấm công',
            ],
            'dao-tao': [
                'Kế hoạch giảng dạy',
                'Quản lý chương trình học',
                'Quản lý nhân sự',
                'Hồ sơ học viên',
                'Quản lý lớp học',
                'Quản lý phiếu thu học phí',
            ],
            'sale-marketing': [
                'Chương trình Marketing',
                'Thông tin khóa học',
                'Hoạt động ngoại khóa',
                'Chương trình khuyến mãi',
                'Quản lý cam kết',
            ],
            'giao-vien': [
                'Kế hoạch giảng dạy',
                'Quản lý chương trình học',
                'Hồ sơ học viên',
                'Quản lý lớp học',
            ],
            'tro-giang': [
                'Hồ sơ học viên',
                'Quản lý lớp học',
            ],
            admin: [], // Admin có tất cả quyền
        }),
        [],
    )

    // Hàm xác định role từ danh sách quyền
    const determineRoleFromPermissions = useCallback(
        (quyenIds: number[]): RoleType => {
            if (quyenList.length === 0) return 'ke-toan' // Default nếu chưa load được danh sách quyền

            const quyenNames = quyenList
                .filter((q) => quyenIds.includes(q.ma_quyen))
                .map((q) => q.ten_quyen)

            // Kiểm tra từng role
            if (rolePermissions['admin'].every((p) => quyenNames.includes(p))) {
                return 'admin'
            }
            if (rolePermissions['ke-toan'].every((p) => quyenNames.includes(p))) {
                return 'ke-toan'
            }
            if (rolePermissions['dao-tao'].every((p) => quyenNames.includes(p))) {
                return 'dao-tao'
            }
            if (rolePermissions['sale-marketing'].every((p) => quyenNames.includes(p))) {
                return 'sale-marketing'
            }
            if (rolePermissions['giao-vien'].every((p) => quyenNames.includes(p))) {
                return 'giao-vien'
            }
            if (rolePermissions['tro-giang'].every((p) => quyenNames.includes(p))) {
                return 'tro-giang'
            }

            return 'ke-toan' // Default
        },
        [quyenList, rolePermissions],
    )

    // Hàm cập nhật quyền mặc định và thêm
    const updateDefaultAndAdditionalPermissions = useCallback(
        (selectedIds: number[]) => {
            if (quyenList.length === 0) return // Chưa load được danh sách quyền

            if (role === 'admin') {
                const allQuyenIds = quyenList.map((q) => q.ma_quyen)
                setDefaultQuyenIds(allQuyenIds)
                setAdditionalQuyenIds([])
                setSelectedQuyenIds(allQuyenIds) // Cập nhật selectedQuyenIds
                return
            }

            const defaultPermissions = rolePermissions[role] as string[]
            const defaultIds = quyenList
                .filter((q) => defaultPermissions.includes(q.ten_quyen))
                .map((q) => q.ma_quyen)

            const additionalIds = selectedIds.filter((id) => !defaultIds.includes(id))

            setDefaultQuyenIds(defaultIds)
            setAdditionalQuyenIds(additionalIds)
            setSelectedQuyenIds([...defaultIds, ...additionalIds]) // Cập nhật selectedQuyenIds
        },
        [quyenList, role, rolePermissions],
    )

    // Cập nhật quyền khi thay đổi role (chỉ khi user thay đổi role trong form)
    useEffect(() => {
        if (!isEditMode && quyenList.length > 0) {
            // Reset về quyền mặc định khi thay đổi role
            updateDefaultAndAdditionalPermissions([])
        }
    }, [role, quyenList, isEditMode, updateDefaultAndAdditionalPermissions])

    const fetchQuyenList = async () => {
        try {
            const res = await fetch('/api/admin/quyen')
            if (res.ok) {
                const data = await res.json()
                setQuyenList(data)
            }
        } catch {
            console.error('Lỗi khi lấy danh sách quyền')
        }
    }

    const checkMaNhanSu = async () => {
        if (!formData.ma_id) return
        if (isEditMode) return

        setIsFetchingNhanSu(true)
        setNhanSuName('')
        setNhanSuError('')

        try {
            // Xác định loại nhân sự dựa trên role
            let loai: string
            if (role === 'giao-vien') {
                loai = 'giao-vien'
            } else if (role === 'tro-giang') {
                loai = 'nhan-su'
            } else {
                loai = 'nhan-su'
            }
            const res = await fetch(`/api/admin/nhan-su?ma_id=${formData.ma_id}&loai=${loai}`)
            const data = await res.json()

            if (!res.ok) {
                setNhanSuError(data.message || 'Mã không hợp lệ')
            } else if (data.hasAccount) {
                setNhanSuName(data.data.ho_ten)
                setNhanSuError('Người này đã có tài khoản')
            } else {
                setNhanSuName(data.data.ho_ten)
            }
        } catch {
            setNhanSuError('Lỗi kết nối')
        } finally {
            setIsFetchingNhanSu(false)
        }
    }

    const handleQuyenToggle = (ma_quyen: number) => {
        setSelectedQuyenIds((prev) => {
            const isCurrentlySelected = prev.includes(ma_quyen)
            let newSelected

            if (isCurrentlySelected) {
                // Bỏ chọn - chỉ cho phép bỏ nếu không phải quyền mặc định
                if (defaultQuyenIds.includes(ma_quyen)) {
                    return prev // Không cho bỏ quyền mặc định
                }
                newSelected = prev.filter((id) => id !== ma_quyen)
                setAdditionalQuyenIds((prev) => prev.filter((id) => id !== ma_quyen))
            } else {
                // Chọn thêm
                newSelected = [...prev, ma_quyen]
                if (!defaultQuyenIds.includes(ma_quyen)) {
                    setAdditionalQuyenIds((prev) => [...prev, ma_quyen])
                }
            }

            return newSelected
        })
    }

    // Fetch danh sách quyền khi component mount
    useEffect(() => {
        fetchQuyenList()
    }, []) // Chỉ chạy một lần khi component mount

    // Xử lý dữ liệu khi edit mode và có account + quyenList, hoặc create mode với quyenList
    useEffect(() => {
        if (isEditMode && account && quyenList.length > 0) {
            setFormData({
                ma_id: (account.ma_nhan_su || account.ma_giao_vien || '').toString(),
                ten_dang_nhap: account.ten_dang_nhap,
                mat_khau: '',
                trang_thai: account.trang_thai || 'Hoạt động',
            })
            // Xác định role dựa trên quyền hiện tại
            const currentRoles = account.quyen_ids || []
            setRole(determineRoleFromPermissions(currentRoles))
            setNhanSuName(account.ho_ten)
            setSelectedQuyenIds(currentRoles)
            updateDefaultAndAdditionalPermissions(currentRoles)
        } else if (!isEditMode && quyenList.length > 0) {
            // Khởi tạo quyền mặc định cho create mode
            updateDefaultAndAdditionalPermissions([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, account, quyenList]) // Thêm quyenList để đảm bảo logic chạy khi có data

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')

        if (
            !isEditMode &&
            (!formData.ten_dang_nhap || !formData.mat_khau || !formData.ma_id)
        ) {
            setErrorMsg('Vui lòng điền đầy đủ các trường bắt buộc')
            return
        }

        if (!isEditMode && nhanSuError) {
            setErrorMsg('Vui lòng chọn mã nhân sự hợp lệ')
            return
        }

        setIsSubmitting(true)

        try {
            const url = isEditMode
                ? `/api/admin/tai-khoan/${account.ma_tai_khoan}`
                : '/api/admin/tai-khoan'

            const method = isEditMode ? 'PUT' : 'POST'

            const payload = {
                ...formData,
                role,
                quyen_ids: selectedQuyenIds.length > 0 ? selectedQuyenIds : defaultQuyenIds,
            }

            console.log('Submitting payload:', payload) // Debug log

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const data = await res.json()

            if (!res.ok) {
                setErrorMsg(data.message || 'Có lỗi xảy ra')
            } else {
                onClose(true) // Refresh lại danh sách
            }
        } catch {
            setErrorMsg('Lỗi kết nối server')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">
                        {isEditMode ? 'Sửa thông tin & Phân quyền' : 'Tạo tài khoản mới'}
                    </h2>
                    <button
                        onClick={() => onClose()}
                        className="text-gray-400 hover:text-red-500 transition cursor-pointer">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Body - Có scroll */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                            {errorMsg}
                        </div>
                    )}

                    <form id="accountForm" onSubmit={handleSubmit} className="space-y-6">
                        {/* Khu vực thông tin cơ bản */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                Thông tin tài khoản
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phân quyền <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={role}
                                            onChange={(e) => {
                                                const newRole = e.target.value as RoleType
                                                setRole(newRole)
                                                setNhanSuName('')
                                                setNhanSuError('')
                                                setFormData({ ...formData, ma_id: '' })
                                            }}
                                            disabled={isEditMode}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500">
                                            <option value="ke-toan">Nhân viên phòng kế toán</option>
                                            <option value="dao-tao">Nhân viên phòng đào tạo</option>
                                            <option value="sale-marketing">
                                                Nhân viên phòng sale/marketing
                                            </option>
                                            <option value="giao-vien">Giáo viên</option>
                                            <option value="tro-giang">Trợ giảng</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mã {role === 'giao-vien' ? 'giáo viên' : role === 'tro-giang' ? 'nhân sự (trợ giảng)' : 'nhân sự'}{' '}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.ma_id}
                                            onChange={(e) =>
                                                setFormData({ ...formData, ma_id: e.target.value })
                                            }
                                            onBlur={checkMaNhanSu}
                                            disabled={isEditMode}
                                            placeholder={`Nhập mã ${role === 'giao-vien' ? 'giáo viên' : role === 'tro-giang' ? 'nhân sự (trợ giảng)' : 'nhân sự'}...`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 text-gray-900 bg-white"
                                        />
                                        <div className="mt-1 min-h-[20px]">
                                            {isFetchingNhanSu ? (
                                                <p className="text-xs text-blue-500">Đang kiểm tra...</p>
                                            ) : nhanSuError ? (
                                                <p className="text-xs text-red-500">{nhanSuError}</p>
                                            ) : nhanSuName ? (
                                                <p className="text-sm text-green-600 font-medium">
                                                    Họ tên: {nhanSuName}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên đăng nhập <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ten_dang_nhap}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                ten_dang_nhap: e.target.value,
                                            })
                                        }
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                                    />
                                </div>


                                {!isEditMode && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mật khẩu <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.mat_khau}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    mat_khau: e.target.value,
                                                })
                                            }
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                                        />
                                    </div>
                                )}

                                {isEditMode && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Trạng thái
                                        </label>
                                        <select
                                            value={formData.trang_thai}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    trang_thai: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900">
                                            <option value="Hoạt động">Hoạt động</option>
                                            <option value="Bị khóa">Bị khóa</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Khu vực phân quyền */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">
                                Phân quyền chức năng
                            </h3>

                            {/* Quyền mặc định */}
                            {defaultQuyenIds.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                                        Quyền mặc định:
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {quyenList
                                            .filter((q) => defaultQuyenIds.includes(q.ma_quyen))
                                            .map((q) => (
                                                <div
                                                    key={`default-${q.ma_quyen}`}
                                                    className="flex items-center p-2 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <input
                                                        type="checkbox"
                                                        checked={true}
                                                        disabled={true}
                                                        className="w-4 h-4 text-blue-600 bg-blue-100 border-blue-300 rounded cursor-not-allowed"
                                                    />
                                                    <div className="ml-3">
                                                        <span className="text-sm font-medium text-blue-800 block">
                                                            {q.ten_quyen}
                                                        </span>
                                                        <span className="text-xs text-blue-600">
                                                            Mặc định
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Phân thêm quyền */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-2">
                                    Phân thêm quyền {role !== 'admin' && '(nếu có)'}:
                                </h4>
                                {quyenList.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">
                                        Đang tải danh sách quyền...
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {quyenList
                                            .filter((q) => !defaultQuyenIds.includes(q.ma_quyen))
                                            .map((q) => (
                                                <label
                                                    key={q.ma_quyen}
                                                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition">
                                                    <input
                                                        type="checkbox"
                                                        checked={additionalQuyenIds.includes(
                                                            q.ma_quyen,
                                                        )}
                                                        onChange={() =>
                                                            handleQuyenToggle(q.ma_quyen)
                                                        }
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                                    />
                                                    <div className="ml-3">
                                                        <span className="text-sm font-medium text-gray-800 block">
                                                            {q.ten_quyen}
                                                        </span>
                                                    </div>
                                                </label>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={() => onClose()}
                        className="px-5 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer font-medium">
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        form="accountForm"
                        disabled={isSubmitting || (!!nhanSuError && !isEditMode)}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 cursor-pointer font-medium shadow-sm">
                        {isSubmitting ? (
                            'Đang lưu...'
                        ) : (
                            <>
                                <FaSave /> Lưu thông tin
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
