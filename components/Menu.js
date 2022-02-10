import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import HistoryIcon from "@mui/icons-material/History";
import IconButton from "@mui/material/IconButton";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { AppContext } from "context/appContext";
import Link from "next/link";
import { useRouter } from "next/router";
export default function TemporaryDrawer() {
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const { setShowNew, initGame, currentGame, confirmNewGame } = useContext(
        AppContext
    );
    const { scores } = currentGame;

    const router = useRouter();

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{
                width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
            }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}>
            <List>
                {scores && Object.keys(scores).length > 0 && (
                    <ListItem
                        button
                        onClick={() => {
                            router.push("/", undefined, { shallow: true });
                            setShowNew(true);
                        }}>
                        <PersonAddIcon sx={{ mr: 2 }} />
                        <ListItemText primary="Lägg till / Ta bort spelare" />
                    </ListItem>
                )}
                <ListItem
                    button
                    onClick={() => {
                        router.push("/", undefined, { shallow: true });
                        confirmNewGame();
                    }}>
                    <AddIcon sx={{ mr: 2 }} />
                    <ListItemText primary="Ny spelomgång" />
                </ListItem>
                <ListItem button>
                    <HistoryIcon sx={{ mr: 2 }} />
                    <Link href="/history">
                        <ListItemText primary="Historik" />
                    </Link>
                </ListItem>
                <ListItem button>
                    <LeaderboardIcon sx={{ mr: 2 }} />
                    <Link href="/stats">
                        <ListItemText primary="Statistik" />
                    </Link>
                </ListItem>
            </List>
        </Box>
    );
    const anchor = "left";
    return (
        <div>
            <IconButton
                onClick={toggleDrawer(anchor, true)}
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}>
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}>
                {list(anchor)}
            </Drawer>
        </div>
    );
}
