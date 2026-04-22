import React, { useEffect } from 'react'
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTimes,
} from 'react-icons/fa'

type AlertType = 'success' | 'error' | 'info'

interface AlertProps {
    type: AlertType
    message: string
    onClose: () => void
    autoClose?: number
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose, autoClose = 5000 }) => {
    // Tự động đóng sau X giây
    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                onClose()
            }, autoClose)
            return () => clearTimeout(timer)
        }
    }, [autoClose, onClose])
    // Cấu hình màu sắc và icon theo type
    const config = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-400',
            text: 'text-green-800',
            icon: <FaCheckCircle className="text-green-400" />,
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-400',
            text: 'text-red-800',
            icon: <FaExclamationCircle className="text-red-400" />,
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-400',
            text: 'text-yellow-800',
            icon: <FaExclamationTriangle className="text-yellow-400" />,
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-400',
            text: 'text-blue-800',
            icon: <FaInfoCircle className="text-blue-400" />,
        },
    }

    const { bg, border, text, icon } = config[type]
    return (
        <div className={`fixed top-5 right-5 z-100 animate-fade-in-left`}>
            <div
                className={`flex items-center p-4 mb-4 border-l-4 shadow-lg rounded-md ${bg} ${border} ${text}`}
                role="alert">
                <div className="shrink-0 text-xl">{icon}</div>
                <div className="ml-3 text-sm font-medium mr-8">{message}</div>
                <button
                    onClick={onClose}
                    className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-opacity-20 hover:bg-black transition-colors`}>
                    <FaTimes size={16} />
                </button>
            </div>
        </div>
    )
}

export default Alert
