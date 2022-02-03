import axios from "axios";
import { useEffect, useState } from "react";
import {
    Button,
    Box,
    Grid,
    Typography,
    Divider,
    TextField,
    Container,
} from "@mui/material";
import Layout from "@/components/Layout";
const History = () => {
    const [documents, setDocuments] = useState([]);
    const [scores, setScores] = useState(null);
    useEffect(() => {
        const getAll = async () => {
            const { data } = await axios.post("/api/db", {
                action: "get_history",
            });
            setDocuments(data);
        };
        getAll();
    }, []);

    const rows = [
        { id: 0, name: "1 triss / 1 stege" },
        { id: 1, name: "2 triss" },
        { id: 2, name: "2 stege" },
        { id: 3, name: "2 triss / 1 stege" },
        { id: 4, name: "2 stege / 1 triss" },
        { id: 5, name: "3 triss" },
        { id: 6, name: "3 stege" },
    ];
    const players = [];
    const sums = [];
    const round = 7;
    const playerNames = scores
        ? Object.entries(scores).map(([k, v]) => {
              players.push({ name: k, score: v.score });
              if (round == 7) {
                  sums[k] = v.score.reduce(function (a, b) {
                      return parseInt(a) + parseInt(b);
                  }, 0);
              } else {
                  sums[k] = 0;
              }

              return (
                  <Grid key={`player_${k}`} item xs={2}>
                      <Box sx={{ textAlign: "center" }}>{k}</Box>
                  </Grid>
              );
          })
        : null;

    return (
        <>
            {documents &&
                documents.map((d) => {
                    const { data } = d;
                    return (
                        <Box m={2}>
                            <Button
                                variant="contained"
                                key={data.date}
                                onClick={() => {
                                    setScores(data.scores);
                                }}>
                                {data.date}
                            </Button>
                        </Box>
                    );
                })}
            <Container sx={{ p: 2 }}>
                {scores && (
                    <>
                        <Box mb={2}>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    Omgång
                                </Grid>
                                {playerNames}
                                <Grid item xs={2}></Grid>
                            </Grid>
                        </Box>
                        <Divider />
                        <Box my={1}>
                            <Grid container spacing={1}>
                                {rows &&
                                    rows.map((row) => (
                                        <Grid key={row.name} item xs={12}>
                                            <Grid
                                                container
                                                spacing={1}
                                                alignItems="center">
                                                <Grid item xs={4}>
                                                    <Typography variant="body1">
                                                        {row.name}
                                                    </Typography>
                                                </Grid>
                                                {players.map((col) => (
                                                    <Grid
                                                        key={`${row.name}_${col.name}`}
                                                        item
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                        xs={2}>
                                                        <TextField
                                                            sx={{
                                                                maxWidth: 80,
                                                                mb: 1,
                                                            }}
                                                            hiddenLabel
                                                            type="text"
                                                            disabled
                                                            inputProps={{
                                                                step: "5",
                                                                style: {
                                                                    textAlign:
                                                                        "center",
                                                                },
                                                            }}
                                                            value={
                                                                scores[col.name]
                                                                    .score[
                                                                    row.id
                                                                ]
                                                            }
                                                            variant="filled"
                                                            size="small"
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                            <Divider />
                                        </Grid>
                                    ))}
                            </Grid>
                        </Box>
                        {round == 7 && (
                            <>
                                <Box mt={1}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={4}>
                                            <Typography variant="h6">
                                                TOTAL:
                                            </Typography>
                                        </Grid>
                                        {players.map((col) => (
                                            <Grid
                                                key={`sa_${col.name}`}
                                                item
                                                xs={2}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}>
                                                <Typography variant="h6">
                                                    {sums[col.name]}
                                                </Typography>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                                <Box mb={1}>
                                    <Divider />
                                </Box>
                            </>
                        )}
                    </>
                )}
            </Container>
        </>
    );
};

History.Layout = Layout;

export default History;
