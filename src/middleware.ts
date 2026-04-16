import { withAuth } from 'next-auth/middleware'

// Bọc toàn bộ hệ thống bằng NextAuth Middleware
export default withAuth({
    pages: {
        signIn: '/login', // Nếu chưa đăng nhập, tự động đá về trang này
    },
})
export const config = {
    // matcher là danh sách các đường dẫn bị ông bảo vệ chặn lại
    matcher: [
        /*
         * Dòng code regex dưới đây có nghĩa là:
         * Khóa TẤT CẢ các trang (bao gồm cả trang chủ /),
         * NGOẠI TRỪ các đường dẫn sau thì được phép vào tự do:
         * - /login (Trang đăng nhập đương nhiên phải cho vào)
         * - /api/... (Các đường dẫn API ẩn)
         * - /_next/... (Các file hệ thống của Next.js)
         * - /favicon.ico (Icon của web)
         */
        '/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
}
