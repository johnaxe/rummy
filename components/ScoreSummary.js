import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Badge,
    Typography,
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

const ScoreSummary = ({ scores }) => {
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
                sx={{ textAlign: "right" }}>
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
    const loser = sorted.pop();

    const dataRows = rows.map((row) => (
        <TableRow
            key={row.short_name}
            sx={{
                "&:last-child td, &:last-child th": {
                    border: 0,
                },
            }}>
            <TableCell>{row.short_name}</TableCell>

            {players.map((col) => {
                const score = scores[col.name].score[row.id];
                return (
                    <TableCell
                        align="right"
                        key={`${row.short_name}_${col.name}`}>
                        {score == 0 ? (
                            <Badge
                                sx={{ top: 0, right: 5 }}
                                showZero={true}
                                badgeContent={0}
                                color="success"
                            />
                        ) : (
                            score
                        )}
                    </TableCell>
                );
            })}
        </TableRow>
    ));

    const summary = players.map((col) => (
        <TableCell
            align="right"
            key={`sa_${col.name}`}
            component="th"
            scope="row">
            {sums[col.name]}
        </TableCell>
    ));

    return (
        <>
            <Typography
                variant="h6"
                sx={{
                    alignItems: "center",
                    display: "flex",
                }}>
                <EmojiEventsIcon sx={{ color: "gold" }} /> {winner.name}
            </Typography>

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
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ScoreSummary;
