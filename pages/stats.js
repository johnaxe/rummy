import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import {
    Container,
    Grid,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { summarize } from "lib/config";
import Layout from "@/components/Layout";
ChartJS.register(ArcElement, Tooltip, Legend);

const Stats = () => {
    const [documents, setDocuments] = useState([]);
    const [groups, setGroups] = useState({});
    const [menuItems, setMenuItems] = useState(null);
    const [selected, setSelected] = useState("");
    useEffect(() => {
        const getAll = async () => {
            const { data } = await axios.post("/api/db", {
                action: "get_history",
            });
            setDocuments(data);

            const grouped = {};
            let firstKey;
            data.forEach((d, i) => {
                const playerNames = Object.entries(d.scores)
                    .map(([k, v]) => {
                        return k;
                    })
                    .sort();
                const gameKey = playerNames.join("-");
                const firstNamesSorted = Object.entries(d.scores)
                    .map(([k, v]) => {
                        const words = k.trim().split(" ");
                        return words[0];
                    })
                    .sort();
                const firstNames = firstNamesSorted.join(", ");
                if (!grouped.hasOwnProperty(gameKey)) {
                    grouped[gameKey] = { names: firstNames, games: [] };
                }
                grouped[gameKey].games.push(d);
                if (i == 0) {
                    firstKey = gameKey;
                }
            });
            console.log("stats grouped:", grouped);
            setGroups(grouped);
            setSelected(firstKey);
            setDocuments(grouped[firstKey] ? grouped[firstKey].games : []);
        };
        getAll();
    }, []);

    useEffect(() => {
        setMenuItems(
            Object.entries(groups).map(([key, value]) => {
                return (
                    <MenuItem
                        key={key}
                        value={key}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                        <Typography sx={{ fontSize: 12 }}>
                            {value.names}
                        </Typography>
                        <Typography sx={{ fontSize: 12 }}>
                            {value.games.length} spel
                        </Typography>
                    </MenuItem>
                );
            })
        );
    }, [groups]);

    const handleGroup = (event) => {
        setSelected(event.target.value);
        setDocuments(groups[event.target.value].games);
    };

    if (!documents) {
        return <></>;
    }

    const { games, rounds, lastrounds, lowHigh } = summarize(documents);
    console.log(lowHigh);
    const sortedGames = [],
        sortedRounds = [],
        sortedLastrounds = [];
    Object.entries(games).map(([player, score]) => {
        sortedGames.push({ name: player, score: score });
    });
    Object.entries(rounds).map(([player, score]) => {
        sortedRounds.push({ name: player, score: score });
    });
    Object.entries(lastrounds).map(([player, score]) => {
        sortedLastrounds.push({ name: player, score: score });
    });
    sortedGames.sort((a, b) => (a.score < b.score ? 1 : -1));
    sortedRounds.sort((a, b) => (a.score < b.score ? 1 : -1));
    sortedLastrounds.sort((a, b) => (a.score < b.score ? 1 : -1));

    const gamedata = {
        labels: Object.keys(games),
        datasets: [
            {
                label: "Vunna spel",
                data: Object.values(games),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };
    const roundsdata = {
        labels: Object.keys(rounds),
        datasets: [
            {
                label: "Vunna spelomgångar",
                data: Object.values(rounds),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
        <Container>
            {menuItems && (
                <Paper elevation={1} sx={{ p: 2, my: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="groups">Välj konstellation</InputLabel>
                        <Select
                            labelId="groups"
                            id="groups"
                            value={selected}
                            label="Välj konstellation"
                            variant="outlined"
                            onChange={handleGroup}>
                            {menuItems}
                        </Select>
                    </FormControl>
                </Paper>
            )}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={2} sx={{ my: 2 }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center">
                            <Typography variant="h6" textAlign="center">
                                Vunna spel
                            </Typography>
                            <Pie data={gamedata} />
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableBody>
                                        {sortedGames.map((player) => (
                                            <TableRow
                                                key={player.name}
                                                sx={{
                                                    "&:last-child td, &:last-child th": {
                                                        border: 0,
                                                    },
                                                }}>
                                                <TableCell
                                                    component="td"
                                                    scope="row">
                                                    {player.name}
                                                </TableCell>
                                                <TableCell
                                                    component="td"
                                                    scope="row">
                                                    {player.score}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={2} sx={{ my: 2 }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center">
                            <Typography variant="h6" textAlign="center">
                                Vunna spelomgångar
                            </Typography>
                            <Pie data={roundsdata} />
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableBody>
                                        {sortedRounds.map((player) => (
                                            <TableRow
                                                key={player.name}
                                                sx={{
                                                    "&:last-child td, &:last-child th": {
                                                        border: 0,
                                                    },
                                                }}>
                                                <TableCell
                                                    component="td"
                                                    scope="row">
                                                    {player.name}
                                                </TableCell>
                                                <TableCell
                                                    component="td"
                                                    scope="row">
                                                    {player.score}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>
                    <Paper elevation={2} sx={{ my: 4 }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            mt={2}>
                            <Typography variant="h6" textAlign="center">
                                Vinnare sista spelomgång (3 stegar)
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableBody>
                                        {sortedLastrounds.map((player) => (
                                            <TableRow
                                                key={player.name}
                                                sx={{
                                                    "&:last-child td, &:last-child th": {
                                                        border: 0,
                                                    },
                                                }}>
                                                <TableCell
                                                    component="td"
                                                    scope="row">
                                                    {player.name}
                                                </TableCell>
                                                <TableCell
                                                    component="td"
                                                    scope="row">
                                                    {player.score}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>
                    <Paper elevation={2} sx={{ my: 4 }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            mt={2}>
                            <Typography variant="h6" textAlign="center">
                                Lägst slutpoäng
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow
                                            sx={{
                                                "&:last-child td, &:last-child th": {
                                                    border: 0,
                                                },
                                            }}>
                                            <TableCell
                                                component="td"
                                                scope="row">
                                                {lowHigh.low.name}
                                            </TableCell>
                                            <TableCell
                                                component="td"
                                                scope="row">
                                                {lowHigh.low.value}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>
                    <Paper elevation={2} sx={{ my: 4 }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            mt={2}>
                            <Typography variant="h6" textAlign="center">
                                Högst slutpoäng
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow
                                            sx={{
                                                "&:last-child td, &:last-child th": {
                                                    border: 0,
                                                },
                                            }}>
                                            <TableCell
                                                component="td"
                                                scope="row">
                                                {lowHigh.high.name}
                                            </TableCell>
                                            <TableCell
                                                component="td"
                                                scope="row">
                                                {lowHigh.high.value}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

Stats.Layout = Layout;
export default Stats;
