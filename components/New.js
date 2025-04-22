import { useState, useContext, useEffect } from "react";
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
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Typography,
    Chip,
} from "@mui/material";
import axios from "axios";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { AppContext } from "context/appContext";

export default function FormDialog() {
    const [name, setName] = useState("");
    const [hasErrors, setHasErrors] = useState({ error: false, errorText: "" });

    const [documents, setDocuments] = useState([]);
    const [players, setPlayers] = useState([]);

    const {
        showNew,
        setShowNew,
        currentGame,
        setCurrentGame,
        loadGame,
    } = useContext(AppContext);

    const handlePrevious = (event) => {
        loadGame(event.target.value);
    };

    useEffect(() => {
        const loadGames = async () => {
            const { data } = await axios.post("/api/db", {
                action: "get_unfinished",
            });
            setDocuments(data);
        };
        const loadPlayers = async () => {
            const {
                data: { players },
            } = await axios.post("/api/db", {
                action: "get_players",
            });
            setPlayers(players);
        };
        loadPlayers();
        loadGames();
    }, [showNew]);
    console.log("documents:", documents);
    const menuItems =
        documents.length > 0
            ? documents.map((d) => {
                  const playerNames = Object.entries(d.scores).map(([k, v]) => {
                      const words = k.trim().split(" ");
                      return words[0];
                  });
                  return (
                      <MenuItem
                          key={d.id}
                          value={d.id}
                          sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography sx={{ fontSize: 10 }}>
                              {d.date} (spelomgång: {d.round + 1})
                          </Typography>
                          <Typography>{playerNames.join(", ")}</Typography>
                      </MenuItem>
                  );
              })
            : null;

    const { scores } = currentGame;

    const handleName = (e) => {
        setName(e.target.value);
    };

    const handleClose = () => {
        //initGame();
        setShowNew(false);
    };

    const template = (
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
            {players.map((player) => {
                const playerNames = Object.entries(scores).map(([k, v]) => {
                    return k;
                });
                return (
                    !playerNames.includes(player) && (
                        <Chip
                            label={player}
                            key={player}
                            onClick={() => {
                                autoAddPlayer(player);
                            }}
                        />
                    )
                );
            })}
        </Box>
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
        newScores[name] = { score: Array(7).fill("") };
        setCurrentGame({ ...currentGame, scores: newScores });
        setName("");
    };

    const autoAddPlayer = (playerName) => {
        setHasErrors({ error: false, errorText: "" });
        if (playerName == "") {
            setHasErrors({ error: true, errorText: "Namn kan inte vara tomt" });
            return;
        }
        const playerNames = Object.entries(scores).map(([k, v]) => {
            return k;
        });

        if (playerNames.includes(playerName)) {
            setHasErrors({
                error: true,
                errorText: "Det finns redan en spelare med samma namn.",
            });
            return;
        }

        let newScores = { ...currentGame.scores };
        newScores[playerName] = { score: Array(7).fill("") };
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
                {documents.length > 0 && (
                    <Paper elevation={1} sx={{ p: 2, my: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel id="previous-games">
                                Påbörjade spel
                            </InputLabel>
                            <Select
                                labelId="previous-games"
                                id="started-games"
                                value=""
                                label="Välj spelomgång"
                                variant="filled"
                                onChange={handlePrevious}>
                                {menuItems}
                            </Select>
                        </FormControl>
                    </Paper>
                )}
                {template}
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
