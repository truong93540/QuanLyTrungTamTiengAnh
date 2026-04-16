import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Tài khoản nội bộ',
            credentials: {
                username: { label: 'Tên đăng nhập', type: 'text' },
                password: { label: 'Mật khẩu', type: 'password' },
            },
            // Hàm authorize này sẽ chạy khi người dùng bấm nút Đăng nhập
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null

                // 1. Tìm tài khoản trong Database
                console.log('📍 BƯỚC 1: Tìm tài khoản với tên đăng nhập ->', credentials.username)
                
                    const user = await prisma.taiKhoan.findUnique({
                        where: { ten_dang_nhap: credentials.username },
                        include: { quyen: true, nhan_su: true },
                    })

                console.log('📍 BƯỚC 2: Tài khoản tìm được ->', user)

                if(user) {
                    console.log('📍 BƯỚC 3: Tài khoản có trạng thái hoạt động không? ->', user.trang_thai ? 'HOẠT ĐỘNG' : 'KHÔNG HOẠT ĐỘNG')
                }

                if (!user || user.trang_thai === false) {
                    console.log('❌ BƯỚC 2: Tài khoản không tồn tại hoặc đã bị khóa!')
                    return null
                }

                // 2. So sánh mật khẩu
                const isPasswordValid =
                    (await bcrypt.compare(credentials.password, user.mat_khau)) ||
                    credentials.password === user.mat_khau

                console.log(
                    '📍 BƯỚC 3: Mật khẩu hợp lệ không? ->',
                    isPasswordValid ? 'ĐÚNG' : 'SAI',
                )

                if (!isPasswordValid) {
                    return null
                }

                console.log('✅ BƯỚC 4: ĐĂNG NHẬP THÀNH CÔNG!')
                // 3. Trả về dữ liệu
                return {
                    id: user.ma_tai_khoan.toString(),
                    name: user.nhan_su.ho_ten,
                    email: user.email,
                    role: user.quyen.ten_quyen,
                    ma_nhan_su: user.ma_nhan_su,
                }
            },
        }),
    ],
    callbacks: {
        // Đẩy role (quyền) vào token để dùng trên giao diện
        async jwt({ token, user }) {
            if (user) {
                // Thay chữ 'any' bằng '{ role: string }'
                token.role = (user as unknown as { role: string }).role
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                // Thay chữ 'any' bằng '{ role: string }'
                ;(session.user as { role: string }).role = token.role as string
            }
            return session
        },
    },
    pages: {
        signIn: '/login', // Báo cho NextAuth biết trang UI tự thiết kế nằm ở đâu
    },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
