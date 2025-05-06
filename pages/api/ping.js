// pages/api/ping.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        const resss = await prisma.rummyResult.findMany({
            where: { finished: true },
            orderBy: { date: "desc" },
            take: 10,
        });
        res.status(200).json({ status: "pinged successfully" });
    } catch (error) {
        console.error("Error pinging Supabase:", error);
        res.status(500).json({ error: "Failed to ping" });
    } finally {
        await prisma.$disconnect();
    }
}
