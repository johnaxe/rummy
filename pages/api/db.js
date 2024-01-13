import faunadb, { query as q } from "faunadb";
const faunaClient = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
});
export default async (req, res) => {
    const { action, currentGame, ts } = req.body;
    if (action == "get_history") {
        const { data } = await faunaClient.query(
            q.Map(
                q.Paginate(q.Match(q.Index("games_sort_by_date_desc"), true)),
                q.Lambda(["date", "ref"], q.Get(q.Var("ref")))
            )
        );

        return res.status(200).json(data);
    }
    if (action == "get_unfinished") {
        const { data } = await faunaClient.query(
            q.Map(
                q.Paginate(q.Match(q.Index("games_sort_by_date_desc"), false)),
                q.Lambda(["date", "ref"], q.Get(q.Var("ref")))
            )
        );

        const results = data.map((d) => {
            return { id: d.ref.id, data: d.data };
        });

        return res.status(200).json(results);
    }
    if (action == "get_players") {
        const { data } = await faunaClient.query(
            q.Map(
                q.Paginate(q.Match(q.Index("games_sort_by_date_desc"), true)),
                q.Lambda(["date", "ref"], q.Get(q.Var("ref")))
            )
        );
        const players = [];
        data.forEach((game) => {
            const objKeys = Object.keys(game.data.scores);
            objKeys.forEach((k) => {
                if (!players.includes(k)) {
                    players.push(k);
                }
            });
        });

        return res.status(200).json({ players: players });
    }
    if (action == "save") {
        const {
            data,
            ref: { id },
        } = await faunaClient.query(
            q.Create(q.Collection("rummy_results"), {
                data: currentGame,
            })
        );
        return res.status(200).json({ data: data, id: id });
    }

    if (action == "update") {
        const { data } = await faunaClient.query(
            q.Update(q.Ref(q.Collection("rummy_results"), currentGame.id), {
                data: currentGame,
            })
        );
        return res.status(200).json(data);
    }
    if (action == "load") {
        const { data } = await faunaClient.query(
            q.Get(q.Ref(q.Collection("rummy_results"), ts))
        );
        return res.status(200).json(data);
    }
    if (action == "delete") {
        const { data } = await faunaClient.query(
            q.Delete(q.Ref(q.Collection("rummy_results"), currentGame.id))
        );
        return res.status(200).json(data);
    }
    return res.status(503).json("not available");
};
