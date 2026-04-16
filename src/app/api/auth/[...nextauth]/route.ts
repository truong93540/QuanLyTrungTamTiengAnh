import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { JWT } from 'next-auth/jwt'

// 1. Định nghĩa Interface cho User trả về từ authorize
interface ExtendedUser extends User {
    role: string
    ma_nhan_su: number
    allRoles: string[]
}

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
                    role: primaryRole,
                    allRoles: userRoles,
                    ma_nhan_su: user.ma_nhan_su,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const u = user as ExtendedUser
                token.role = u.role
                token.ma_nhan_su = u.ma_nhan_su
                token.allRoles = u.allRoles
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string
                session.user.ma_nhan_su = token.ma_nhan_su as number
                session.user.allRoles = token.allRoles as string[]
            }
            return session
        },
    },
    pages: { signIn: '/login' },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
