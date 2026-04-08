import { redirect } from 'next/navigation'

export default function HomePage() {
    redirect('/dashboard') // Tự động chuyển hướng đến dashboard khi truy cập trang chủ
}
