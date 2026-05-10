import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            role: string
            ma_nhan_vien?: number | null
            ma_giao_vien?: number | null
            allRoles: string[]
        } & DefaultSession['user']
    }

    interface User {
        role: string
        ma_nhan_vien?: number | null
        ma_giao_vien?: number | null
        allRoles: string[]
    }
}

declare module 'next-auth/jwt' {
    // Mở rộng kiểu JWT Token
    interface JWT {
        role: string
        ma_nhan_vien?: number | null
        ma_giao_vien?: number | null
        allRoles: string[]
    }
}
