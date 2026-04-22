import React from 'react'
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'

interface ConfirmModalProps {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onClose: () => void
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning'
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onClose,
    confirmText = 'Xác nhận xóa',
    cancelText = 'Hủy bỏ',
    type = 'danger',
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={onClose}></div>

            {/* Modal Box */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div
                            className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'} `}>
                            <FaExclamationTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        </div>
                    </div>

                    <p className="mt-4 text-gray-600 leading-relaxed">{message}</p>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition cursor-pointer ${
                            type === 'danger'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-yellow-600 hover:bg-yellow-700'
                        }`}>
                        {confirmText}
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition  cursor-pointer">
                    <FaTimes size={18} />
                </button>
            </div>
        </div>
    )
}

export default ConfirmModal
