import {
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Badge,
    Typography,
    TextField,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { rows } from "lib/config";

const getInitials = (name) => {
    const fullName = name.split(" ");
    const initials =
        fullName.length == 2
            ? fullName.shift().charAt(0) + fullName.pop().charAt(0)
            : fullName[0].charAt(0);
    return initials.toUpperCase();
};

const ScoreSummary = ({ ongoing, scores, round, setPlayerScore }) => {
    const players = [],
        sums = [];

    const playerNames = Object.entries(scores).map(([k, v]) => {
        const initials = getInitials(k);
        players.push({ name: k, score: v.score });
        sums[k] = v.score.reduce(function (a, b) {
            return parseInt(a) + parseInt(b);
        }, 0);

        return (
            <TableCell
                title={k}
                key={`player_${k}`}
                sx={{ textAlign: "center" }}>
                {initials}
            </TableCell>
        );
    });

    const sorted = Object.keys(sums)
        .sort((a, b) => {
            return sums[a] - sums[b];
        })
        .map((e) => {
            return { name: e, score: sums[e] };
        });

    const winner = sorted.shift();

    const dataRows = rows.map((row) => {
        return (
            row.id <= round && (
                <TableRow
                    key={row.short_name}
                    sx={{
                        "&:last-child td, &:last-child th": {
                            border: 0,
                        },
                    }}>
                    <TableCell>
                        <Alert
                            sx={{
                                padding: 0,
                                justifyContent: "center",
                            }}
                            icon={false}
                            severity="info">
                            {row.short_name}
                        </Alert>
                    </TableCell>

                    {players.map((col) => {
                        const score = scores[col.name].score[row.id];
                        return (
                            <TableCell
                                align="center"
                                key={`${row.short_name}_${col.name}`}>
                                {score == 0 && row.id < round ? (
                                    <Badge
                                        sx={{ top: 0, right: 5 }}
                                        showZero={true}
                                        badgeContent={0}
                                        color="success"
                                    />
                                ) : row.id == round ? (
                                    <TextField
                                        sx={{
                                            maxWidth: 80,
                                        }}
                                        hiddenLabel
                                        type="number"
                                        inputProps={{
                                            step: "5",
                                            style: {
                                                textAlign: "center",
                                            },
                                        }}
                                        value={scores[col.name].score[row.id]}
                                        variant="filled"
                                        size="small"
                                        onChange={(e) => {
                                            setPlayerScore(
                                                col.name,
                                                row.id,
                                                e.target.value
                                            );
                                        }}
                                    />
                                ) : (
                                    <>{score}</>
                                )}
                            </TableCell>
                        );
                    })}
                </TableRow>
            )
        );
    });

    const summary = players.map((col) => (
        <TableCell
            align="center"
            key={`sa_${col.name}`}
            component="th"
            scope="row">
            {sums[col.name]}
        </TableCell>
    ));

    return (
        <>
            {!ongoing && (
                <Typography
                    variant="h6"
                    sx={{
                        alignItems: "center",
                        display: "flex",
                    }}>
                    <EmojiEventsIcon sx={{ color: "gold" }} /> {winner.name}
                </Typography>
            )}

            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                    fontWeight: 700,
                                },
                            }}>
                            <TableCell>Omgång</TableCell>
                            {playerNames}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataRows}
                        {round == 7 && (
                            <TableRow
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                        fontWeight: 700,
                                    },
                                }}>
                                <TableCell>S:A</TableCell>
                                {summary}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ScoreSummary;
