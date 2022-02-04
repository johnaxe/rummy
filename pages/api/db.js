import faunadb, { query as q } from "faunadb";
const faunaClient = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
});
export default async (req, res) => {
    const { action, scores } = req.body;
    if (action == "get_history") {
        const { data } = await faunaClient.query(
            q.Map(
                q.Paginate(q.Documents(q.Collection("rummy_results"))),
                q.Lambda((show) => q.Get(show))
            )
        );
        return res.status(200).json(data);
    }
    if (action == "save") {
        const d = new Date();
        const { data } = await faunaClient.query(
            q.Create(q.Collection("rummy_results"), {
                data: {
                    date: `${d.toLocaleDateString(
                        "sv-SE"
                    )} ${d.toLocaleTimeString("sv-SE")}`,
                    scores: scores,
                },
            })
        );
        return res.status(200).json(data);
    }

    return res.status(503).json("not available");
};
