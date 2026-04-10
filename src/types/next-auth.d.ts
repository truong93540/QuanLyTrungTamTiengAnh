import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            role: string
            ma_nhan_su: number
            allRoles: string[]
        } & DefaultSession['user']
    }

    interface User {
        role: string
        ma_nhan_su: number
        allRoles: string[]
    }
}
