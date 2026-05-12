import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

// 1. Mở rộng type Session của NextAuth để không bị lỗi Typescript
declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
            role: string
            ma_nhan_vien?: number | null
            ma_giao_vien?: number | null
            allRoles: string[]
        }
    }
}

// 2. Mở rộng type User nội bộ
interface ExtendedUser extends User {
    role: string
    ma_nhan_vien?: number | null
    ma_giao_vien?: number | null
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

                // 3. SỬA ĐỔI QUAN TRỌNG: Include cả nhan_vien và giao_vien
                const user = await prisma.taiKhoan.findUnique({
                    where: { ten_dang_nhap: username },
                    include: {
                        nhan_vien: {
                            include: { chuc_vu: true },
                        },
                        giao_vien: {
                            include: { chuc_vu: true },
                        },
                        phan_quyen: {
                            include: { quyen: true },
                        },
                    },
                })

                if (!user) {
                    console.log('❌ Không tìm thấy User trong DB!')
                    return null
                }

                if (user.trang_thai === 'Bị khóa') {
                    console.log('❌ Tài khoản đang bị khóa!')
                    return null
                }

                const isPasswordValid =
                    (await bcrypt.compare(password, user.mat_khau)) || password === user.mat_khau

                if (!isPasswordValid) {
                    console.log('❌ Sai mật khẩu!')
                    return null
                }

                // 4. KIỂM TRA TÀI KHOẢN LÀ CỦA NHÂN VIÊN HAY GIÁO VIÊN
                const person = user.nhan_vien || user.giao_vien

                if (!person) {
                    console.log('❌ Tài khoản chưa được liên kết với Nhân viên hoặc Giáo viên nào!')
                    return null
                }

                const userRoles = user.phan_quyen.map((pq) => pq.quyen.ten_quyen)
                const positionName = person.chuc_vu?.ten_chuc_vu || 'Nhân viên'

                return {
                    id: user.ma_tai_khoan.toString(),
                    name: person.ho_ten,
                    email: user.email,
                    role: positionName,
                    allRoles: userRoles,
                    ma_nhan_vien: user.ma_nhan_vien, // Sẽ có giá trị hoặc null
                    ma_giao_vien: user.ma_giao_vien, // Sẽ có giá trị hoặc null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const u = user as ExtendedUser
                token.role = u.role
                token.ma_nhan_vien = u.ma_nhan_vien
                token.ma_giao_vien = u.ma_giao_vien
                token.allRoles = u.allRoles
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string
                session.user.ma_nhan_vien = token.ma_nhan_vien as number | null
                session.user.ma_giao_vien = token.ma_giao_vien as number | null
                session.user.allRoles = token.allRoles as string[]
            }
            return session
        },
    },
    pages: { signIn: '/login' },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
