import {
    Container,
    Divider,
    Box,
    Button,
    Snackbar,
    Collapse,
    Alert,
    IconButton,
    Paper,
} from "@mui/material";
import Image from "next/image";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useContext, useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { AppContext } from "context/appContext";
import ScoreSummary from "@/components/ScoreSummary";
import Confetti from "react-confetti";

const Home = () => {
    const [scoreError, setScoreError] = useState({ error: false, type: 1 });
    const [mounted, setMounted] = useState(false);
    const [scoresExist, setScoresExist] = useState(false);
    const {
        currentGame,
        setPlayerScore,
        setRound,
        saveGame,
        finishGame,
        showSaved,
        setShowSaved,
        deleteGame,
    } = useContext(AppContext);
    const { scores, round } = currentGame;

    useEffect(() => {
        setMounted(true);
        setScoresExist(Object.keys(scores).length > 0);
    });

    useEffect(() => {}, [currentGame.id]);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setShowSaved(false);
    };

    const checkValues = () => {
        //check scores in current round before advancing
        let roundValues = [];
        Object.entries(scores).map(([k, v]) => {
            roundValues.push({ name: k, score: v.score[round] });
        });
        const zeros = roundValues.filter((item) => item.score == 0);

        const empties = roundValues.filter((item) => item.score == "");
        if (empties.length > 0) {
            setScoreError({ error: true, type: 2 });
            return;
        }
        if (zeros.length != 1) {
            setScoreError({ error: true, type: 1 });
            return;
        }
        setRound(1);
    };

    return mounted && scoresExist ? (
        <Container sx={{ pt: 2 }}>
            <Collapse in={scoreError.error}>
                <Alert
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setScoreError({ error: false, type: 1 });
                            }}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}>
                    {scoreError.type == 1 ? (
                        <div>
                            Det måste alltid finnas <strong>en</strong> ensam
                            vinnare i varje spelomgång (0 poäng). Vg korrigera
                            poängräkningen i{" "}
                            <strong>spelomgång {round + 1}</strong>.
                        </div>
                    ) : (
                        <div>
                            Inget fält får vara tomt. Vg komplettera
                            poängräkningen i{" "}
                            <strong>spelomgång {round + 1}</strong>
                        </div>
                    )}
                </Alert>
            </Collapse>
            <ScoreSummary
                scores={scores}
                ongoing={true}
                round={round}
                setPlayerScore={setPlayerScore}
                finished={false}
            />
            <Snackbar
                open={showSaved}
                autoHideDuration={4000}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                onClose={handleClose}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    sx={{ width: "100%" }}>
                    Ditt spel har sparats!
                </Alert>
            </Snackbar>

            {round >= 0 && (
                <Box mt={2} display="flex" flexDirection="row">
                    {round > 0 && (
                        <Button
                            sx={{ width: 160 }}
                            onClick={() => {
                                setScoreError({ error: false, type: 1 });
                                setRound(-1);
                            }}
                            variant="contained"
                            startIcon={<UndoIcon />}>
                            Föregående
                        </Button>
                    )}

                    {round < 7 && (
                        <Button
                            sx={{ marginLeft: "auto", width: 160 }}
                            onClick={() => {
                                setScoreError({ error: false, type: 1 });
                                checkValues();
                            }}
                            variant="contained"
                            endIcon={<RedoIcon />}>
                            {round == 6 ? "Se resultat" : "Nästa"}
                        </Button>
                    )}
                </Box>
            )}
            <Box mt={1}>
                <Divider />
                {round < 7 ? (
                    <Button
                        sx={{ mt: 1, width: { xs: "100%", md: 160 } }}
                        onClick={() => {
                            saveGame();
                        }}
                        variant="contained"
                        endIcon={<SaveIcon />}>
                        Spara
                    </Button>
                ) : (
                    <Button
                        sx={{ mt: 1, width: { xs: "100%", md: 160 } }}
                        onClick={() => {
                            finishGame();
                        }}
                        variant="contained"
                        endIcon={<SaveIcon />}>
                        Avsluta spelomgången
                    </Button>
                )}
                {currentGame.id && !currentGame.finished && (
                    <Button
                        sx={{ mt: 1, width: { xs: "100%", md: 160 } }}
                        onClick={() => {
                            deleteGame();
                        }}
                        variant="contained"
                        endIcon={<DeleteForeverIcon />}>
                        Radera
                    </Button>
                )}
            </Box>
            {round == 7 && <Confetti recycle={false} />}
        </Container>
    ) : (
        <Box
            sx={{ minHeight: "100vh" }}
            display="flex"
            justifyContent="center"
            alignItems="center">
            <Paper elevation={3} sx={{ p: 1 }}>
                <Box
                    sx={{
                        borderRadius: "4px",
                        width: 256,
                        height: 256,
                    }}>
                    <Image width={512} height={512} src="/icon-512x512.png" />
                </Box>
            </Paper>
        </Box>
    );
};

Home.Layout = Layout;

export default Home;
