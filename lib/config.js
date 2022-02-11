export const rows = [
    { id: 0, name: "1 triss / 1 stege", short_name: "1tr / 1st" },
    { id: 1, name: "2 triss", short_name: "2tr" },
    { id: 2, name: "2 stege", short_name: "2st" },
    { id: 3, name: "2 triss / 1 stege", short_name: "2tr / 1st" },
    { id: 4, name: "2 stege / 1 triss", short_name: "2st / 1tr" },
    { id: 5, name: "3 triss", short_name: "3tr" },
    { id: 6, name: "3 stege", short_name: "3st" },
];

export const playerTemplate = [
    "Henrik Gille",
    "Johan Axelsson",
    "Emelie Axelsson",
    "Ida Wikström",
];

export const getInitials = (name) => {
    const fullName = name.split(" ");
    const initials =
        fullName.length == 2
            ? fullName.shift().charAt(0) + fullName.pop().charAt(0)
            : fullName[0].charAt(0);
    return initials.toUpperCase();
};

export const summarize = (documents) => {
    const gamewins = [];
    const roundwins = [];
    documents.map((game) => {
        const { data } = game;
        const sums = [];

        Object.entries(data.scores).map(([k, v]) => {
            if (!roundwins.hasOwnProperty(k)) {
                roundwins[k] = 0;
            }

            sums[k] = v.score.reduce(function (a, b) {
                if (parseInt(b) == 0) {
                    roundwins[k] += 1;
                }
                return parseInt(a) + parseInt(b);
            }, 0);
        });

        const sorted = Object.keys(sums)
            .sort((a, b) => {
                return sums[a] - sums[b];
            })
            .map((e) => {
                return { name: e, score: sums[e] };
            });
        const winner = sorted.shift();
        const { name } = winner;
        if (!gamewins.hasOwnProperty(name)) {
            gamewins[name] = 0;
        }
        gamewins[name] += 1;
    });
    return { games: gamewins, rounds: roundwins };
};
