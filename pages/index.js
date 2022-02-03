import {
    Container,
    Divider,
    Grid,
    TextField,
    Box,
    Button,
    Typography,
    Snackbar,
    IconButton,
} from "@mui/material";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import CloseIcon from "@mui/icons-material/Close";

import { useContext } from "react";
import Layout from "@/components/Layout";
import New from "@/components/New";
import { AppContext } from "context/appContext";

const Home = () => {
    const rows = [
        { id: 0, name: "1 triss / 1 stege" },
        { id: 1, name: "2 triss" },
        { id: 2, name: "2 stege" },
        { id: 3, name: "2 triss / 1 stege" },
        { id: 4, name: "2 stege / 1 triss" },
        { id: 5, name: "3 triss" },
        { id: 6, name: "3 stege" },
    ];
    const {
        scores,
        setPlayerScore,
        round,
        handleRound,
        resetGame,
        showSaved,
        setShowSaved,
    } = useContext(AppContext);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setShowSaved(false);
    };

    const players = [];
    const sums = [];
    const playerNames = Object.entries(scores).map(([k, v]) => {
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
    });

    if (players.length == 0) {
        return <></>;
    }
    return (
        <>
            <Snackbar
                open={showSaved}
                autoHideDuration={6000}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                onClose={handleClose}
                message="Spelet har sparats"
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
            <Container sx={{ p: 2 }}>
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
                        {rows.map((row) => {
                            if (round < 7) {
                                return row.id == round && round < 7 ? (
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
                                                        }}
                                                        hiddenLabel
                                                        type="number"
                                                        inputProps={{
                                                            step: "5",
                                                            style: {
                                                                textAlign:
                                                                    "center",
                                                            },
                                                        }}
                                                        value={
                                                            scores[col.name]
                                                                .score[row.id]
                                                        }
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
                                                </Grid>
                                            ))}
                                        </Grid>
                                        <Box mt={1}>
                                            <Divider />
                                        </Box>
                                    </Grid>
                                ) : null;
                            } else {
                                return (
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
                                                                .score[row.id]
                                                        }
                                                        variant="filled"
                                                        size="small"
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                        <Divider />
                                    </Grid>
                                );
                            }
                        })}
                    </Grid>
                </Box>

                {round == 7 && (
                    <>
                        <Box mt={1}>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <Typography variant="h6">TOTAL:</Typography>
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
                {round >= 0 && (
                    <Box display="flex" flexDirection="row">
                        {round > 0 && (
                            <Button
                                onClick={() => {
                                    handleRound(-1);
                                }}
                                variant="contained"
                                endIcon={<UndoIcon />}>
                                Bakåt
                            </Button>
                        )}

                        {round < 7 && (
                            <Button
                                sx={{ marginLeft: "auto" }}
                                onClick={() => {
                                    handleRound(1);
                                }}
                                variant="contained"
                                endIcon={<RedoIcon />}>
                                Framåt
                            </Button>
                        )}
                    </Box>
                )}
                <Box mt={1}>
                    <Divider />
                    <Button
                        sx={{ mt: 1, width: { xs: "100%", md: "auto" } }}
                        onClick={() => {
                            resetGame();
                        }}
                        variant="contained"
                        endIcon={<CancelOutlinedIcon />}>
                        Spara & Avsluta
                    </Button>
                </Box>
            </Container>
            <New open={true} />
        </>
    );
};

Home.Layout = Layout;

export default Home;
