import { redirect } from 'next/navigation'

export default function HomePage() {
    // Chỉ cần 1 dòng này, bất cứ ai vào '/' đều bị đẩy sang '/dashboard'
    redirect('/dashboard')
}
