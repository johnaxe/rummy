import {
    Container,
    Divider,
    Box,
    Button,
    Snackbar,
    Collapse,
    Alert,
    IconButton,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import CloseIcon from "@mui/icons-material/Close";

import { useContext, useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { AppContext } from "context/appContext";
import ScoreSummary from "@/components/ScoreSummary";

const Home = () => {
    const [scoreError, setScoreError] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [scoresExist, setScoresExist] = useState(false);
    const {
        currentGame,
        setPlayerScore,
        setRound,
        saveGame,
        showSaved,
        setShowSaved,
        setShowNew,
    } = useContext(AppContext);
    const { scores, round } = currentGame;

    useEffect(() => {
        setMounted(true);
        setScoresExist(Object.keys(scores).length > 0);
        //setShowNew(!Object.keys(scores).length > 0);
    });

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
        if (zeros.length != 1) {
            setScoreError(true);
            return;
        }
        setRound(1);
    };

    return (
        mounted &&
        scoresExist && (
            <Container sx={{ pt: 2 }}>
                <Collapse in={scoreError}>
                    <Alert
                        severity="error"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setScoreError(false);
                                }}>
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}>
                        Det måste alltid finnas <strong>en</strong> ensam
                        vinnare i varje spelomgång (0 poäng). Vg korrigera
                        poängräkningen i <strong>spelomgång {round + 1}</strong>
                        .
                    </Alert>
                </Collapse>
                <ScoreSummary
                    scores={scores}
                    ongoing={true}
                    round={round}
                    setPlayerScore={setPlayerScore}
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
                                    setScoreError(false);
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
                                    setScoreError(false);
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
                    <Button
                        sx={{ mt: 1, width: { xs: "100%", md: 160 } }}
                        onClick={() => {
                            saveGame();
                        }}
                        variant="contained"
                        endIcon={<SaveIcon />}>
                        Spara
                    </Button>
                </Box>
            </Container>
        )
    );
};

Home.Layout = Layout;

export default Home;
