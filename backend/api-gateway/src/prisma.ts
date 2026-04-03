import { PrismaClient } from '@prisma/client';

// Global Prisma Singleton
const prisma = new PrismaClient();

export default prisma;
