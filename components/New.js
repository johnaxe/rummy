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
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { AppContext } from "context/appContext";

export default function FormDialog() {
    const [name, setName] = useState("");

    const { showNew, setShowNew, scores, setScores, initGame } = useContext(
        AppContext
    );

    const handleName = (e) => {
        setName(e.target.value);
    };

    const handleClose = () => {
        initGame();
        setShowNew(false);
    };

    const addPlayer = () => {
        setScores({ ...scores, [name]: { score: Array(7).fill(0) } });
        setName("");
    };

    const removePlayer = (name) => {
        const { [name]: tmp, ...rest } = scores;
        setScores(rest);
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
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Spelarnamn"
                    type="text"
                    fullWidth
                    value={name}
                    variant="standard"
                    onChange={handleName}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Spela</Button>
                <Button
                    onClick={() => {
                        addPlayer();
                    }}>
                    Lägg till
                </Button>
            </DialogActions>
        </Dialog>
    );
}
