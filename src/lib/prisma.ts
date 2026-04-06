import { PrismaClient } from '@prisma/client'

// Khai báo biến global để lưu trữ PrismaClient
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Nếu đã có sẵn thì dùng lại, nếu chưa có thì tạo mới
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Trong môi trường development, gán biến vào global để tránh tạo nhiều connection
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
