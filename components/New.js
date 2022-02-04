import { useState, useContext } from "react";
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    InputAdornment,
    Alert,
    Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { AppContext } from "context/appContext";
import { playerTemplate } from "lib/config";

export default function FormDialog() {
    const [name, setName] = useState("");
    const [hasErrors, setHasErrors] = useState({ error: false, errorText: "" });

    const {
        showNew,
        setShowNew,
        currentGame,
        setCurrentGame,
        useTemplate,
    } = useContext(AppContext);

    const { scores } = currentGame;

    const handleName = (e) => {
        setName(e.target.value);
    };

    const handleClose = () => {
        //initGame();
        setShowNew(false);
    };

    const template = (
        <Alert
            icon={false}
            severity="info"
            sx={{ justifyContent: "center", mb: 2 }}>
            <Button
                sx={{ mb: 2 }}
                variant="contained"
                onClick={() => {
                    useTemplate(playerTemplate);
                }}>
                Använd mall
            </Button>
            <TableContainer component={Paper}>
                <Table
                    sx={{ minWidth: 240 }}
                    size="small"
                    aria-label="template">
                    <TableBody>
                        {playerTemplate.map((player) => (
                            <TableRow
                                key={player}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}>
                                <TableCell component="td" scope="row">
                                    {player}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Alert>
    );

    const addPlayer = () => {
        setHasErrors({ error: false, errorText: "" });
        if (name == "") {
            setHasErrors({ error: true, errorText: "Namn kan inte vara tomt" });
            return;
        }
        const playerNames = Object.entries(scores).map(([k, v]) => {
            return k;
        });

        if (playerNames.includes(name)) {
            setHasErrors({
                error: true,
                errorText: "Det finns redan en spelare med samma namn.",
            });
            return;
        }

        let newScores = { ...currentGame.scores };
        newScores[name] = { score: Array(7).fill(0) };
        setCurrentGame({ ...currentGame, scores: newScores });
        setName("");
    };

    const removePlayer = (name) => {
        setHasErrors({ error: false, errorText: "" });
        const { [name]: tmp, ...rest } = scores;
        setCurrentGame({ ...currentGame, scores: rest });
    };

    const rows = [];
    for (const [a, b] of Object.entries(scores)) {
        rows.push({ name: a });
    }

    const participants =
        rows.length > 0 ? (
            <Box my={1}>
                <TableContainer component={Paper}>
                    <Table
                        sx={{ minWidth: 240 }}
                        size="small"
                        aria-label="added players">
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}>
                                    <TableCell component="td" scope="row">
                                        <Box display="flex" flexDirection="row">
                                            <div>{row.name}</div>
                                            <DeleteOutlineIcon
                                                onClick={() => {
                                                    removePlayer(row.name);
                                                }}
                                                fontSize="small"
                                                style={{
                                                    marginLeft: "auto",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        ) : (
            ""
        );
    const title =
        scores && Object.keys(scores).length > 0
            ? "Lägg till / Ta bort spelare"
            : "Ny spelomgång";

    return (
        <Dialog open={showNew} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {Object.keys(scores).length === 0 && template}
                Skriv spelarens namn och klicka på <strong>Lägg till</strong>
                {participants}
                <TextField
                    error={hasErrors.error}
                    helperText={hasErrors.errorText}
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    label="Spelarnamn"
                    type="text"
                    fullWidth
                    value={name}
                    variant="standard"
                    onChange={handleName}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                    Stäng
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        addPlayer();
                    }}>
                    Lägg till
                </Button>
            </DialogActions>
        </Dialog>
    );
}
