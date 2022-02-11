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
    Box,
    Chip,
    Typography,
    TextField,
    Collapse,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { rows, getInitials } from "lib/config";

const ScoreSummary = ({
    ongoing,
    scores,
    round,
    setPlayerScore,
    date,
    id,
    visible,
    setVisible,
    finished,
}) => {
    const players = [],
        sums = [];

    const playerNames = Object.entries(scores).map(([k, v]) => {
        const initials = getInitials(k);
        players.push({ name: k, initials: initials, score: v.score });
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
                            title={`Omgång ${row.id + 1}: ${row.name}`}
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
                                sx={{ py: 2 }}
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
                                        label={col.initials}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            step: "5",
                                            type: "number",
                                            min: 0,
                                            pattern: "[0-9]*",
                                            style: {
                                                textAlign: "center",
                                            },
                                        }}
                                        //defaultValue={false}
                                        value={
                                            scores[col.name].score[row.id] != ""
                                                ? scores[col.name].score[row.id]
                                                : ""
                                        }
                                        //value={scores[col.name].score[row.id]}
                                        variant="outlined"
                                        size="medium"
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
            sx={{ p: 2 }}
            align="center"
            key={`sa_${col.name}`}
            component="th"
            scope="row">
            {sums[col.name]}
        </TableCell>
    ));

    return (
        playerNames.length > 0 && (
            <>
                {round == 7 && (
                    <Box
                        pb={1}
                        display="flex"
                        flexDirection="row"
                        sx={{
                            cursor: finished ? "pointer" : "default",
                        }}
                        onClick={() => {
                            finished && setVisible(id == visible ? 1 : id);
                        }}>
                        <Typography
                            variant="h6"
                            sx={{
                                alignItems: "center",
                                display: "flex",
                            }}>
                            <EmojiEventsIcon sx={{ color: "gold" }} />{" "}
                            {winner.name}
                        </Typography>
                        {finished && date && (
                            <Box sx={{ marginLeft: "auto" }}>
                                <Chip
                                    label={new Date(
                                        date.replace(/-/g, "/")
                                    ).toLocaleDateString("sv-SE")}
                                />
                            </Box>
                        )}
                    </Box>
                )}
                <Collapse in={id == visible}>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="scoreboard">
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
                </Collapse>
            </>
        )
    );
};

export default ScoreSummary;
