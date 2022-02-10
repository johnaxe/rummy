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
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { summarize } from "lib/config";
import Layout from "@/components/Layout";
ChartJS.register(ArcElement, Tooltip, Legend);

const Stats = () => {
    const [documents, setDocuments] = useState([]);
    useEffect(() => {
        const getAll = async () => {
            const { data } = await axios.post("/api/db", {
                action: "get_history",
            });
            setDocuments(data);
        };
        getAll();
    }, []);

    if (!documents) {
        return <></>;
    }

    const { games, rounds } = summarize(documents);
    const sortedGames = [],
        sortedRounds = [];
    Object.entries(games).map(([player, score]) => {
        sortedGames.push({ name: player, score: score });
    });
    Object.entries(rounds).map(([player, score]) => {
        sortedRounds.push({ name: player, score: score });
    });
    sortedGames.sort((a, b) => (a.score < b.score ? 1 : -1));
    sortedRounds.sort((a, b) => (a.score < b.score ? 1 : -1));

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
                </Grid>
            </Grid>
        </Container>
    );
};

Stats.Layout = Layout;
export default Stats;
