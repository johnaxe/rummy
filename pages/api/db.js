import prisma from "lib/prisma"; // or "../../lib/prisma" if not using aliases

export default async (req, res) => {
    const { action, currentGame, ts } = req.body;

    try {
        if (action === "get_history") {
            const results = await prisma.rummyResult.findMany({
                where: { finished: true },
                orderBy: {
                    date: "desc",
                },
                take: 1000,
            });

            return res.status(200).json(results);
        }

        if (action === "get_unfinished") {
            const results = await prisma.rummyResult.findMany({
                where: { finished: false },
                orderBy: {
                    date: "desc",
                },
            });

            return res.status(200).json(results);
        }

        if (action === "get_players") {
            const results = await prisma.rummyResult.findMany({
                where: { finished: true },
                orderBy: {
                    date: "desc",
                },
            });

            const players = new Set();
            results.forEach((game) => {
                const scores = game.scores || {};
                Object.keys(scores).forEach((player) => players.add(player));
            });

            return res.status(200).json({ players: [...players] });
        }

        if (action === "save") {
            delete currentGame.id;
            const result = await prisma.rummyResult.create({
                data: currentGame,
            });

            return res.status(200).json({ data: result.data, id: result.id });
        }

        if (action === "update") {
            const result = await prisma.rummyResult.update({
                where: { id: currentGame.id },
                data: currentGame,
            });

            return res.status(200).json(result);
        }

        if (action === "load") {
            const result = await prisma.rummyResult.findUnique({
                where: { id: ts },
            });

            return res.status(200).json(result);
        }

        if (action === "delete") {
            const result = await prisma.rummyResult.delete({
                where: { id: currentGame.id },
            });

            return res.status(200).json(result);
        }

        return res.status(503).json("Not available");
    } catch (error) {
        console.error("DB Error:", error);
        return res.status(500).json({ error: "Something went wrong." });
    }
};
