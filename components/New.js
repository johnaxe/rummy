import { useState, useContext } from "react";
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    InputAdornment,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { AppContext } from "context/appContext";

export default function FormDialog() {
    const [name, setName] = useState("");
    const [hasErrors, setHasErrors] = useState(false);

    const {
        showNew,
        setShowNew,
        currentGame,
        setCurrentGame,
        initGame,
    } = useContext(AppContext);

    const { scores } = currentGame;

    const handleName = (e) => {
        setName(e.target.value);
    };

    const handleClose = () => {
        //initGame();
        setShowNew(false);
    };

    const addPlayer = () => {
        let newScores = { ...currentGame.scores };
        newScores[name] = { score: Array(7).fill(0) };
        setCurrentGame({ ...currentGame, scores: newScores });
        setName("");
    };

    const removePlayer = (name) => {
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
            : "Nytt spel";

    return (
        <Dialog open={showNew} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Skriv spelarens namn och klicka på{" "}
                    <strong>Lägg till</strong>
                </DialogContentText>
                {participants}
                <TextField
                    error={hasErrors}
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
