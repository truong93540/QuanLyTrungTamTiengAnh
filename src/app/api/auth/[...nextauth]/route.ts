import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { JWT } from 'next-auth/jwt'


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

            async authorize(credentials): Promise<ExtendedUser | null> {
                if (!credentials || !credentials.username || !credentials.password) {
                    console.log('❌ Thiếu thông tin đăng nhập')
                    return null
                }

                const { username, password } = credentials

                console.log('📍 Đang check login cho:', username)

                const user = await prisma.taiKhoan.findUnique({
                    where: { ten_dang_nhap: username },
                    include: {
                        nhan_su: true,
                        phan_quyen: {
                            include: { quyen: true },
                        },
                    },
                })

                if (!user) {
                    console.log('❌ Không tìm thấy User trong DB!')
                    return null
                }

                if (!user || user.trang_thai === 'Bị khóa') return null

                const isPasswordValid =
                    (await bcrypt.compare(password, user.mat_khau)) || password === user.mat_khau

                if (!isPasswordValid) return null

                const userRoles = user.phan_quyen.map((pq) => pq.quyen.ten_quyen)
                const primaryRole = userRoles.length > 0 ? userRoles[0] : 'USER'

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