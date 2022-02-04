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

import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import CloseIcon from "@mui/icons-material/Close";

import { useContext } from "react";
import Layout from "@/components/Layout";
import { AppContext } from "context/appContext";
import ScoreSummary from "@/components/ScoreSummary";

const Home = () => {
    const {
        currentGame,
        setPlayerScore,
        setRound,
        saveGame,
        showSaved,
        setShowSaved,
    } = useContext(AppContext);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setShowSaved(false);
    };

    const { scores, round } = currentGame;

    const checkValues = () => {
        //TODO: check scores in current round before advancing
        let roundValues = [];
        Object.entries(scores).map(([k, v]) => {
            roundValues.push({ name: k, score: v.score[round] });
        });
        const zeros = roundValues.filter((item) => item.score == 0);
        if (zeros.length == 1) {
            setRound(1);
        }
    };

    return (
        <Container sx={{ pt: 2 }}>
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
                    vertical: "bottom",
                    horizontal: "center",
                }}
                onClose={handleClose}
                message="Spelet sparat"
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

            {round >= 0 && (
                <Box mt={2} display="flex" flexDirection="row">
                    {round > 0 && (
                        <Button
                            sx={{ width: 160 }}
                            onClick={() => {
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
                    sx={{ mt: 1, width: { xs: "100%", md: "auto" } }}
                    onClick={() => {
                        saveGame();
                    }}
                    variant="contained"
                    endIcon={<SaveIcon />}>
                    Spara
                </Button>
            </Box>
        </Container>
    );
};

Home.Layout = Layout;

export default Home;
